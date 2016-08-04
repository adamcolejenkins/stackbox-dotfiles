(function() {
  var $, BufferedProcess, CompositeDisposable, GitRevisionView, SplitDiff, fs, path, _, _ref;

  _ = require('underscore-plus');

  path = require('path');

  fs = require('fs');

  _ref = require("atom"), CompositeDisposable = _ref.CompositeDisposable, BufferedProcess = _ref.BufferedProcess;

  $ = require("atom-space-pen-views").$;

  SplitDiff = require('split-diff');

  module.exports = GitRevisionView = (function() {
    function GitRevisionView() {}

    GitRevisionView.FILE_PREFIX = "TimeMachine - ";


    /*
      This code and technique was originally from git-history package,
      see https://github.com/jakesankey/git-history/blob/master/lib/git-history-view.coffee
    
      Changes to permit click and drag in the time plot to travel in time:
      - don't write revision to disk for faster access and to give the user feedback when git'ing
        a rev to show is slow
      - reuse tabs more - don't open a new tab for every rev of the same file
    
      Changes to permit scrolling to same lines in view in the editor the history is for
    
      thank you, @jakesankey!
     */

    GitRevisionView.showRevision = function(editor, revHash, options) {
      var exit, file, fileContents, stdout;
      if (options == null) {
        options = {};
      }
      options = _.defaults(options, {
        diff: false
      });
      SplitDiff.disable(false);
      file = editor.getPath();
      fileContents = "";
      stdout = (function(_this) {
        return function(output) {
          return fileContents += output;
        };
      })(this);
      exit = (function(_this) {
        return function(code) {
          if (code === 0) {
            return _this._showRevision(file, editor, revHash, fileContents, options);
          } else {
            return atom.notifications.addError("Could not retrieve revision for " + (path.basename(file)) + " (" + code + ")");
          }
        };
      })(this);
      return this._loadRevision(file, revHash, stdout, exit);
    };

    GitRevisionView._loadRevision = function(file, hash, stdout, exit) {
      var showArgs;
      showArgs = ["show", "" + hash + ":./" + (path.basename(file))];
      return new BufferedProcess({
        command: "git",
        args: showArgs,
        options: {
          cwd: path.dirname(file)
        },
        stdout: stdout,
        exit: exit
      });
    };

    GitRevisionView._getInitialLineNumber = function(editor) {
      var editorEle, lineNumber;
      editorEle = atom.views.getView(editor);
      lineNumber = 0;
      if ((editor != null) && editor !== '') {
        lineNumber = editorEle.getLastVisibleScreenRow();
        return lineNumber - 5;
      }
    };

    GitRevisionView._showRevision = function(file, editor, revHash, fileContents, options) {
      var outputDir, outputFilePath, tempContent, _ref1;
      if (options == null) {
        options = {};
      }
      outputDir = "" + (atom.getConfigDirPath()) + "/git-time-machine";
      if (!fs.existsSync(outputDir)) {
        fs.mkdir(outputDir);
      }
      outputFilePath = "" + outputDir + "/" + this.FILE_PREFIX + (path.basename(file));
      if (options.diff) {
        outputFilePath += ".diff";
      }
      tempContent = "Loading..." + ((_ref1 = editor.buffer) != null ? _ref1.lineEndingForRow(0) : void 0);
      return fs.writeFile(outputFilePath, tempContent, (function(_this) {
        return function(error) {
          var promise;
          if (!error) {
            promise = atom.workspace.open(file, {
              split: "left",
              activatePane: false,
              activateItem: true,
              searchAllPanes: false
            });
            return promise.then(function(editor) {
              promise = atom.workspace.open(outputFilePath, {
                split: "right",
                activatePane: false,
                activateItem: true,
                searchAllPanes: false
              });
              return promise.then(function(newTextEditor) {
                return _this._updateNewTextEditor(newTextEditor, editor, revHash, fileContents);
              });
            });
          }
        };
      })(this));
    };

    GitRevisionView._updateNewTextEditor = function(newTextEditor, editor, revHash, fileContents) {
      return _.delay((function(_this) {
        return function() {
          var lineEnding, _ref1;
          lineEnding = ((_ref1 = editor.buffer) != null ? _ref1.lineEndingForRow(0) : void 0) || "\n";
          fileContents = fileContents.replace(/(\r\n|\n)/g, lineEnding);
          newTextEditor.buffer.setPreferredLineEnding(lineEnding);
          newTextEditor.setText(fileContents);
          newTextEditor.buffer.cachedDiskContents = fileContents;
          _this._splitDiff(editor, newTextEditor);
          _this._syncScroll(editor, newTextEditor);
          return _this._affixTabTitle(newTextEditor, revHash);
        };
      })(this), 300);
    };

    GitRevisionView._affixTabTitle = function(newTextEditor, revHash) {
      var $el, $tabTitle, titleText;
      $el = $(atom.views.getView(newTextEditor));
      $tabTitle = $el.parents('atom-pane').find('li.tab.active .title');
      titleText = $tabTitle.text();
      if (titleText.indexOf('@') >= 0) {
        titleText = titleText.replace(/\@.*/, "@" + revHash);
      } else {
        titleText += " @" + revHash;
      }
      return $tabTitle.text(titleText);
    };

    GitRevisionView._splitDiff = function(editor, newTextEditor) {
      var editors;
      editors = {
        editor1: newTextEditor,
        editor2: editor
      };
      SplitDiff._setConfig('rightEditorColor', 'green');
      SplitDiff._setConfig('leftEditorColor', 'red');
      SplitDiff._setConfig('diffWords', true);
      SplitDiff._setConfig('ignoreWhitespace', true);
      SplitDiff._setConfig('syncHorizontalScroll', true);
      SplitDiff.editorSubscriptions = new CompositeDisposable();
      SplitDiff.editorSubscriptions.add(editors.editor1.onDidStopChanging((function(_this) {
        return function() {
          if (editors != null) {
            return SplitDiff.updateDiff(editors);
          }
        };
      })(this)));
      SplitDiff.editorSubscriptions.add(editors.editor2.onDidStopChanging((function(_this) {
        return function() {
          if (editors != null) {
            return SplitDiff.updateDiff(editors);
          }
        };
      })(this)));
      SplitDiff.editorSubscriptions.add(editors.editor1.onDidDestroy((function(_this) {
        return function() {
          editors = null;
          return SplitDiff.disable(false);
        };
      })(this)));
      SplitDiff.editorSubscriptions.add(editors.editor2.onDidDestroy((function(_this) {
        return function() {
          editors = null;
          return SplitDiff.disable(false);
        };
      })(this)));
      return SplitDiff.updateDiff(editors);
    };

    GitRevisionView._syncScroll = function(editor, newTextEditor) {
      return _.delay((function(_this) {
        return function() {
          if (newTextEditor.isDestroyed()) {
            return;
          }
          return newTextEditor.scrollToBufferPosition({
            row: _this._getInitialLineNumber(editor),
            column: 0
          });
        };
      })(this), 50);
    };

    return GitRevisionView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2dpdC10aW1lLW1hY2hpbmUvbGliL2dpdC1yZXZpc2lvbi12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzRkFBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFJQSxPQUF5QyxPQUFBLENBQVEsTUFBUixDQUF6QyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLHVCQUFBLGVBSnRCLENBQUE7O0FBQUEsRUFLQyxJQUFLLE9BQUEsQ0FBUSxzQkFBUixFQUFMLENBTEQsQ0FBQTs7QUFBQSxFQU9BLFNBQUEsR0FBWSxPQUFBLENBQVEsWUFBUixDQVBaLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUNNO2lDQUVKOztBQUFBLElBQUEsZUFBQyxDQUFBLFdBQUQsR0FBZSxnQkFBZixDQUFBOztBQUNBO0FBQUE7Ozs7Ozs7Ozs7OztPQURBOztBQUFBLElBZUEsZUFBQyxDQUFBLFlBQUQsR0FBZSxTQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCLE9BQWxCLEdBQUE7QUFDYixVQUFBLGdDQUFBOztRQUQrQixVQUFRO09BQ3ZDO0FBQUEsTUFBQSxPQUFBLEdBQVUsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxPQUFYLEVBQ1I7QUFBQSxRQUFBLElBQUEsRUFBTSxLQUFOO09BRFEsQ0FBVixDQUFBO0FBQUEsTUFHQSxTQUFTLENBQUMsT0FBVixDQUFrQixLQUFsQixDQUhBLENBQUE7QUFBQSxNQUtBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFB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

//# sourceURL=/Users/ajenkins/.atom/packages/git-time-machine/lib/git-revision-view.coffee

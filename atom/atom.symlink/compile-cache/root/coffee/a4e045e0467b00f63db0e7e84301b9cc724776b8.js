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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvZ2l0LXRpbWUtbWFjaGluZS9saWIvZ2l0LXJldmlzaW9uLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNGQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUlBLE9BQXlDLE9BQUEsQ0FBUSxNQUFSLENBQXpDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsdUJBQUEsZUFKdEIsQ0FBQTs7QUFBQSxFQUtDLElBQUssT0FBQSxDQUFRLHNCQUFSLEVBQUwsQ0FMRCxDQUFBOztBQUFBLEVBT0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxZQUFSLENBUFosQ0FBQTs7QUFBQSxFQVVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007aUNBRUo7O0FBQUEsSUFBQSxlQUFDLENBQUEsV0FBRCxHQUFlLGdCQUFmLENBQUE7O0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7O09BREE7O0FBQUEsSUFlQSxlQUFDLENBQUEsWUFBRCxHQUFlLFNBQUMsTUFBRCxFQUFTLE9BQVQsRUFBa0IsT0FBbEIsR0FBQTtBQUNiLFVBQUEsZ0NBQUE7O1FBRCtCLFVBQVE7T0FDdkM7QUFBQSxNQUFBLE9BQUEsR0FBVSxDQUFDLENBQUMsUUFBRixDQUFXLE9BQVgsRUFDUjtBQUFBLFFBQUEsSUFBQSxFQUFNLEtBQU47T0FEUSxDQUFWLENBQUE7QUFBQSxNQUdBLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEtBQWxCLENBSEEsQ0FBQTtBQUFBLE1BS0EsSUFBQSxHQUFPLE1B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

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/git-time-machine/lib/git-revision-view.coffee

(function() {
  var CompositeDisposable, DiffViewEditor, Directory, File, LoadingView, SplitDiff, SyncScroll, configSchema, path, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Directory = _ref.Directory, File = _ref.File;

  DiffViewEditor = require('./build-lines');

  LoadingView = require('./loading-view');

  SyncScroll = require('./sync-scroll');

  configSchema = require("./config-schema");

  path = require('path');

  module.exports = SplitDiff = {
    config: configSchema,
    subscriptions: null,
    diffViewEditor1: null,
    diffViewEditor2: null,
    editorSubscriptions: null,
    isWhitespaceIgnored: false,
    isWordDiffEnabled: true,
    linkedDiffChunks: null,
    diffChunkPointer: 0,
    isFirstChunkSelect: true,
    wasEditor1SoftWrapped: false,
    wasEditor2SoftWrapped: false,
    isEnabled: false,
    wasEditor1Created: false,
    wasEditor2Created: false,
    hasGitRepo: false,
    process: null,
    loadingView: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable();
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'split-diff:enable': (function(_this) {
          return function() {
            return _this.diffPanes();
          };
        })(this),
        'split-diff:next-diff': (function(_this) {
          return function() {
            return _this.nextDiff();
          };
        })(this),
        'split-diff:prev-diff': (function(_this) {
          return function() {
            return _this.prevDiff();
          };
        })(this),
        'split-diff:copy-to-right': (function(_this) {
          return function() {
            return _this.copyChunkToRight();
          };
        })(this),
        'split-diff:copy-to-left': (function(_this) {
          return function() {
            return _this.copyChunkToLeft();
          };
        })(this),
        'split-diff:disable': (function(_this) {
          return function() {
            return _this.disable();
          };
        })(this),
        'split-diff:ignore-whitespace': (function(_this) {
          return function() {
            return _this.toggleIgnoreWhitespace();
          };
        })(this),
        'split-diff:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.disable(false);
      return this.subscriptions.dispose();
    },
    toggle: function() {
      if (this.isEnabled) {
        return this.disable(true);
      } else {
        return this.diffPanes();
      }
    },
    disable: function(displayMsg) {
      this.isEnabled = false;
      if (this.editorSubscriptions != null) {
        this.editorSubscriptions.dispose();
        this.editorSubscriptions = null;
      }
      if (this.diffViewEditor1 != null) {
        if (this.wasEditor1SoftWrapped) {
          this.diffViewEditor1.enableSoftWrap();
        }
        if (this.wasEditor1Created) {
          this.diffViewEditor1.cleanUp();
        }
      }
      if (this.diffViewEditor2 != null) {
        if (this.wasEditor2SoftWrapped) {
          this.diffViewEditor2.enableSoftWrap();
        }
        if (this.wasEditor2Created) {
          this.diffViewEditor2.cleanUp();
        }
      }
      this._clearDiff();
      this.diffChunkPointer = 0;
      this.isFirstChunkSelect = true;
      this.wasEditor1SoftWrapped = false;
      this.wasEditor1Created = false;
      this.wasEditor2SoftWrapped = false;
      this.wasEditor2Created = false;
      this.hasGitRepo = false;
      if (displayMsg) {
        return atom.notifications.addInfo('Split Diff Disabled', {
          dismissable: false
        });
      }
    },
    toggleIgnoreWhitespace: function() {
      this._setConfig('ignoreWhitespace', !this.isWhitespaceIgnored);
      return this.isWhitespaceIgnored = this._getConfig('ignoreWhitespace');
    },
    nextDiff: function() {
      if (!this.isFirstChunkSelect) {
        this.diffChunkPointer++;
        if (this.diffChunkPointer >= this.linkedDiffChunks.length) {
          this.diffChunkPointer = 0;
        }
      } else {
        this.isFirstChunkSelect = false;
      }
      return this._selectDiffs(this.linkedDiffChunks[this.diffChunkPointer]);
    },
    prevDiff: function() {
      if (!this.isFirstChunkSelect) {
        this.diffChunkPointer--;
        if (this.diffChunkPointer < 0) {
          this.diffChunkPointer = this.linkedDiffChunks.length - 1;
        }
      } else {
        this.isFirstChunkSelect = false;
      }
      return this._selectDiffs(this.linkedDiffChunks[this.diffChunkPointer]);
    },
    copyChunkToRight: function() {
      var diffChunk, lineRange, linesToMove, moveText, offset, _i, _len, _results;
      linesToMove = this.diffViewEditor1.getCursorDiffLines();
      offset = 0;
      _results = [];
      for (_i = 0, _len = linesToMove.length; _i < _len; _i++) {
        lineRange = linesToMove[_i];
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = this.linkedDiffChunks;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            diffChunk = _ref1[_j];
            if (lineRange.start.row === diffChunk.oldLineStart) {
              moveText = this.diffViewEditor1.getEditor().getTextInBufferRange([[diffChunk.oldLineStart, 0], [diffChunk.oldLineEnd, 0]]);
              this.diffViewEditor2.getEditor().setTextInBufferRange([[diffChunk.newLineStart + offset, 0], [diffChunk.newLineEnd + offset, 0]], moveText);
              _results1.push(offset += (diffChunk.oldLineEnd - diffChunk.oldLineStart) - (diffChunk.newLineEnd - diffChunk.newLineStart));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    },
    copyChunkToLeft: function() {
      var diffChunk, lineRange, linesToMove, moveText, offset, _i, _len, _results;
      linesToMove = this.diffViewEditor2.getCursorDiffLines();
      offset = 0;
      _results = [];
      for (_i = 0, _len = linesToMove.length; _i < _len; _i++) {
        lineRange = linesToMove[_i];
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = this.linkedDiffChunks;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            diffChunk = _ref1[_j];
            if (lineRange.start.row === diffChunk.newLineStart) {
              moveText = this.diffViewEditor2.getEditor().getTextInBufferRange([[diffChunk.newLineStart, 0], [diffChunk.newLineEnd, 0]]);
              this.diffViewEditor1.getEditor().setTextInBufferRange([[diffChunk.oldLineStart + offset, 0], [diffChunk.oldLineEnd + offset, 0]], moveText);
              _results1.push(offset += (diffChunk.newLineEnd - diffChunk.newLineStart) - (diffChunk.oldLineEnd - diffChunk.oldLineStart));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    },
    diffPanes: function() {
      var detailMsg, editors;
      this.disable(false);
      editors = this._getVisibleEditors();
      this.editorSubscriptions = new CompositeDisposable();
      this.editorSubscriptions.add(editors.editor1.onDidStopChanging((function(_this) {
        return function() {
          return _this.updateDiff(editors);
        };
      })(this)));
      this.editorSubscriptions.add(editors.editor2.onDidStopChanging((function(_this) {
        return function() {
          return _this.updateDiff(editors);
        };
      })(this)));
      this.editorSubscriptions.add(editors.editor1.onDidDestroy((function(_this) {
        return function() {
          return _this.disable(true);
        };
      })(this)));
      this.editorSubscriptions.add(editors.editor2.onDidDestroy((function(_this) {
        return function() {
          return _this.disable(true);
        };
      })(this)));
      this.editorSubscriptions.add(atom.config.onDidChange('split-diff', (function(_this) {
        return function() {
          return _this.updateDiff(editors);
        };
      })(this)));
      if (!this.hasGitRepo) {
        this.updateDiff(editors);
      }
      this.editorSubscriptions.add(atom.menu.add([
        {
          'label': 'Packages',
          'submenu': [
            {
              'label': 'Split Diff',
              'submenu': [
                {
                  'label': 'Ignore Whitespace',
                  'command': 'split-diff:ignore-whitespace'
                }, {
                  'label': 'Move to Next Diff',
                  'command': 'split-diff:next-diff'
                }, {
                  'label': 'Move to Previous Diff',
                  'command': 'split-diff:prev-diff'
                }, {
                  'label': 'Copy to Right',
                  'command': 'split-diff:copy-to-right'
                }, {
                  'label': 'Copy to Left',
                  'command': 'split-diff:copy-to-left'
                }
              ]
            }
          ]
        }
      ]));
      this.editorSubscriptions.add(atom.contextMenu.add({
        'atom-text-editor': [
          {
            'label': 'Split Diff',
            'submenu': [
              {
                'label': 'Ignore Whitespace',
                'command': 'split-diff:ignore-whitespace'
              }, {
                'label': 'Move to Next Diff',
                'command': 'split-diff:next-diff'
              }, {
                'label': 'Move to Previous Diff',
                'command': 'split-diff:prev-diff'
              }, {
                'label': 'Copy to Right',
                'command': 'split-diff:copy-to-right'
              }, {
                'label': 'Copy to Left',
                'command': 'split-diff:copy-to-left'
              }
            ]
          }
        ]
      }));
      detailMsg = 'Ignore Whitespace: ' + this.isWhitespaceIgnored;
      detailMsg += '\nShow Word Diff: ' + this.isWordDiffEnabled;
      detailMsg += '\nSync Horizontal Scroll: ' + this._getConfig('syncHorizontalScroll');
      return atom.notifications.addInfo('Split Diff Enabled', {
        detail: detailMsg,
        dismissable: false
      });
    },
    updateDiff: function(editors) {
      var BufferedNodeProcess, args, command, computedDiff, editorPaths, exit, stderr, stdout, theOutput;
      this.isEnabled = true;
      if (this.process != null) {
        this.process.kill();
        this.process = null;
      }
      this.isWhitespaceIgnored = this._getConfig('ignoreWhitespace');
      editorPaths = this._createTempFiles(editors);
      if (this.loadingView == null) {
        this.loadingView = new LoadingView();
        this.loadingView.createModal();
      }
      this.loadingView.show();
      BufferedNodeProcess = require('atom').BufferedNodeProcess;
      command = path.resolve(__dirname, "./compute-diff.js");
      args = [editorPaths.editor1Path, editorPaths.editor2Path, this.isWhitespaceIgnored];
      computedDiff = '';
      theOutput = '';
      stdout = (function(_this) {
        return function(output) {
          theOutput = output;
          return computedDiff = JSON.parse(output);
        };
      })(this);
      stderr = (function(_this) {
        return function(err) {
          return theOutput = err;
        };
      })(this);
      exit = (function(_this) {
        return function(code) {
          _this.loadingView.hide();
          if (code === 0) {
            return _this._resumeUpdateDiff(editors, computedDiff);
          } else {
            console.log('BufferedNodeProcess code was ' + code);
            return console.log(theOutput);
          }
        };
      })(this);
      return this.process = new BufferedNodeProcess({
        command: command,
        args: args,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    },
    _resumeUpdateDiff: function(editors, computedDiff) {
      var syncHorizontalScroll;
      this.linkedDiffChunks = this._evaluateDiffOrder(computedDiff.chunks);
      this._clearDiff();
      this._displayDiff(editors, computedDiff);
      this.isWordDiffEnabled = this._getConfig('diffWords');
      if (this.isWordDiffEnabled) {
        this._highlightWordDiff(this.linkedDiffChunks);
      }
      syncHorizontalScroll = this._getConfig('syncHorizontalScroll');
      this.syncScroll = new SyncScroll(editors.editor1, editors.editor2, syncHorizontalScroll);
      return this.syncScroll.syncPositions();
    },
    _getVisibleEditors: function() {
      var activeItem, editor1, editor2, editors, leftPane, p, panes, rightPane, _i, _len;
      editor1 = null;
      editor2 = null;
      panes = atom.workspace.getPanes();
      for (_i = 0, _len = panes.length; _i < _len; _i++) {
        p = panes[_i];
        activeItem = p.getActiveItem();
        if (atom.workspace.isTextEditor(activeItem)) {
          if (editor1 === null) {
            editor1 = activeItem;
          } else if (editor2 === null) {
            editor2 = activeItem;
            break;
          }
        }
      }
      if (editor1 === null) {
        editor1 = atom.workspace.buildTextEditor();
        this.wasEditor1Created = true;
        leftPane = atom.workspace.getActivePane();
        leftPane.addItem(editor1);
      }
      if (editor2 === null) {
        editor2 = atom.workspace.buildTextEditor();
        this.wasEditor2Created = true;
        editor2.setGrammar(editor1.getGrammar());
        rightPane = atom.workspace.getActivePane().splitRight();
        rightPane.addItem(editor2);
      }
      this._setupGitRepo(editor1, editor2);
      editor1.unfoldAll();
      editor2.unfoldAll();
      if (editor1.isSoftWrapped()) {
        this.wasEditor1SoftWrapped = true;
        editor1.setSoftWrapped(false);
      }
      if (editor2.isSoftWrapped()) {
        this.wasEditor2SoftWrapped = true;
        editor2.setSoftWrapped(false);
      }
      if (this.wasEditor2Created) {
        atom.views.getView(editor1).focus();
      }
      editors = {
        editor1: editor1,
        editor2: editor2
      };
      return editors;
    },
    _setupGitRepo: function(editor1, editor2) {
      var directory, editor1Path, gitHeadText, i, projectRepo, relativeEditor1Path, _i, _len, _ref1, _results;
      editor1Path = editor1.getPath();
      if ((editor1Path != null) && (editor2.getLineCount() === 1 && editor2.lineTextForBufferRow(0) === '')) {
        _ref1 = atom.project.getDirectories();
        _results = [];
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          directory = _ref1[i];
          if (editor1Path === directory.getPath() || directory.contains(editor1Path)) {
            projectRepo = atom.project.getRepositories()[i];
            if ((projectRepo != null) && (projectRepo.repo != null)) {
              relativeEditor1Path = projectRepo.relativize(editor1Path);
              gitHeadText = projectRepo.repo.getHeadBlob(relativeEditor1Path);
              if (gitHeadText != null) {
                editor2.setText(gitHeadText);
                this.hasGitRepo = true;
                break;
              } else {
                _results.push(void 0);
              }
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    _createTempFiles: function(editors) {
      var editor1Path, editor1TempFile, editor2Path, editor2TempFile, editorPaths, tempFolderPath;
      editor1Path = '';
      editor2Path = '';
      tempFolderPath = atom.getConfigDirPath() + '/split-diff';
      editor1Path = tempFolderPath + '/split-diff 1';
      editor1TempFile = new File(editor1Path);
      editor1TempFile.writeSync(editors.editor1.getText());
      editor2Path = tempFolderPath + '/split-diff 2';
      editor2TempFile = new File(editor2Path);
      editor2TempFile.writeSync(editors.editor2.getText());
      editorPaths = {
        editor1Path: editor1Path,
        editor2Path: editor2Path
      };
      return editorPaths;
    },
    _selectDiffs: function(diffChunk) {
      if ((diffChunk != null) && (this.diffViewEditor1 != null) && (this.diffViewEditor2 != null)) {
        this.diffViewEditor1.deselectAllLines();
        this.diffViewEditor2.deselectAllLines();
        if (diffChunk.oldLineStart != null) {
          this.diffViewEditor1.selectLines(diffChunk.oldLineStart, diffChunk.oldLineEnd);
          this.diffViewEditor2.getEditor().scrollToBufferPosition([diffChunk.oldLineStart, 0]);
        }
        if (diffChunk.newLineStart != null) {
          this.diffViewEditor2.selectLines(diffChunk.newLineStart, diffChunk.newLineEnd);
          return this.diffViewEditor2.getEditor().scrollToBufferPosition([diffChunk.newLineStart, 0]);
        }
      }
    },
    _clearDiff: function() {
      if (this.loadingView != null) {
        this.loadingView.hide();
      }
      if (this.diffViewEditor1 != null) {
        this.diffViewEditor1.destroyMarkers();
        this.diffViewEditor1 = null;
      }
      if (this.diffViewEditor2 != null) {
        this.diffViewEditor2.destroyMarkers();
        this.diffViewEditor2 = null;
      }
      if (this.syncScroll != null) {
        this.syncScroll.dispose();
        return this.syncScroll = null;
      }
    },
    _displayDiff: function(editors, computedDiff) {
      var leftColor, rightColor;
      this.diffViewEditor1 = new DiffViewEditor(editors.editor1);
      this.diffViewEditor2 = new DiffViewEditor(editors.editor2);
      leftColor = this._getConfig('leftEditorColor');
      rightColor = this._getConfig('rightEditorColor');
      if (leftColor === 'green') {
        this.diffViewEditor1.setLineHighlights(computedDiff.removedLines, 'added');
      } else {
        this.diffViewEditor1.setLineHighlights(computedDiff.removedLines, 'removed');
      }
      if (rightColor === 'green') {
        this.diffViewEditor2.setLineHighlights(computedDiff.addedLines, 'added');
      } else {
        this.diffViewEditor2.setLineHighlights(computedDiff.addedLines, 'removed');
      }
      this.diffViewEditor1.setLineOffsets(computedDiff.oldLineOffsets);
      return this.diffViewEditor2.setLineOffsets(computedDiff.newLineOffsets);
    },
    _evaluateDiffOrder: function(chunks) {
      var c, diffChunk, diffChunks, newLineNumber, oldLineNumber, prevChunk, _i, _len;
      oldLineNumber = 0;
      newLineNumber = 0;
      prevChunk = null;
      diffChunks = [];
      for (_i = 0, _len = chunks.length; _i < _len; _i++) {
        c = chunks[_i];
        if (c.added != null) {
          if ((prevChunk != null) && (prevChunk.removed != null)) {
            diffChunk = {
              newLineStart: newLineNumber,
              newLineEnd: newLineNumber + c.count,
              oldLineStart: oldLineNumber - prevChunk.count,
              oldLineEnd: oldLineNumber
            };
            diffChunks.push(diffChunk);
            prevChunk = null;
          } else {
            prevChunk = c;
          }
          newLineNumber += c.count;
        } else if (c.removed != null) {
          if ((prevChunk != null) && (prevChunk.added != null)) {
            diffChunk = {
              newLineStart: newLineNumber - prevChunk.count,
              newLineEnd: newLineNumber,
              oldLineStart: oldLineNumber,
              oldLineEnd: oldLineNumber + c.count
            };
            diffChunks.push(diffChunk);
            prevChunk = null;
          } else {
            prevChunk = c;
          }
          oldLineNumber += c.count;
        } else {
          if ((prevChunk != null) && (prevChunk.added != null)) {
            diffChunk = {
              newLineStart: newLineNumber - prevChunk.count,
              newLineEnd: newLineNumber,
              oldLineStart: oldLineNumber,
              oldLineEnd: oldLineNumber
            };
            diffChunks.push(diffChunk);
          } else if ((prevChunk != null) && (prevChunk.removed != null)) {
            diffChunk = {
              newLineStart: newLineNumber,
              newLineEnd: newLineNumber,
              oldLineStart: oldLineNumber - prevChunk.count,
              oldLineEnd: oldLineNumber
            };
            diffChunks.push(diffChunk);
          }
          prevChunk = null;
          oldLineNumber += c.count;
          newLineNumber += c.count;
        }
      }
      if ((prevChunk != null) && (prevChunk.added != null)) {
        diffChunk = {
          newLineStart: newLineNumber - prevChunk.count,
          newLineEnd: newLineNumber
        };
        diffChunks.push(diffChunk);
      } else if ((prevChunk != null) && (prevChunk.removed != null)) {
        diffChunk = {
          oldLineStart: oldLineNumber - prevChunk.count,
          oldLineEnd: oldLineNumber
        };
        diffChunks.push(diffChunk);
      }
      return diffChunks;
    },
    _highlightWordDiff: function(chunks) {
      var ComputeWordDiff, c, excessLines, i, j, leftColor, lineRange, rightColor, wordDiff, _i, _j, _len, _results;
      ComputeWordDiff = require('./compute-word-diff');
      leftColor = this._getConfig('leftEditorColor');
      rightColor = this._getConfig('rightEditorColor');
      _results = [];
      for (_i = 0, _len = chunks.length; _i < _len; _i++) {
        c = chunks[_i];
        if ((c.newLineStart != null) && (c.oldLineStart != null)) {
          lineRange = 0;
          excessLines = 0;
          if ((c.newLineEnd - c.newLineStart) < (c.oldLineEnd - c.oldLineStart)) {
            lineRange = c.newLineEnd - c.newLineStart;
            excessLines = (c.oldLineEnd - c.oldLineStart) - lineRange;
          } else {
            lineRange = c.oldLineEnd - c.oldLineStart;
            excessLines = (c.newLineEnd - c.newLineStart) - lineRange;
          }
          for (i = _j = 0; _j < lineRange; i = _j += 1) {
            wordDiff = ComputeWordDiff.computeWordDiff(this.diffViewEditor1.getEditor().lineTextForBufferRow(c.oldLineStart + i), this.diffViewEditor2.getEditor().lineTextForBufferRow(c.newLineStart + i), this.isWhitespaceIgnored);
            if (leftColor === 'green') {
              this.diffViewEditor1.setWordHighlights(c.oldLineStart + i, wordDiff.removedWords, 'added', this.isWhitespaceIgnored);
            } else {
              this.diffViewEditor1.setWordHighlights(c.oldLineStart + i, wordDiff.removedWords, 'removed', this.isWhitespaceIgnored);
            }
            if (rightColor === 'green') {
              this.diffViewEditor2.setWordHighlights(c.newLineStart + i, wordDiff.addedWords, 'added', this.isWhitespaceIgnored);
            } else {
              this.diffViewEditor2.setWordHighlights(c.newLineStart + i, wordDiff.addedWords, 'removed', this.isWhitespaceIgnored);
            }
          }
          _results.push((function() {
            var _k, _results1;
            _results1 = [];
            for (j = _k = 0; _k < excessLines; j = _k += 1) {
              if ((c.newLineEnd - c.newLineStart) < (c.oldLineEnd - c.oldLineStart)) {
                if (leftColor === 'green') {
                  _results1.push(this.diffViewEditor1.setWordHighlights(c.oldLineStart + lineRange + j, [
                    {
                      changed: true,
                      value: this.diffViewEditor1.getEditor().lineTextForBufferRow(c.oldLineStart + lineRange + j)
                    }
                  ], 'added', this.isWhitespaceIgnored));
                } else {
                  _results1.push(this.diffViewEditor1.setWordHighlights(c.oldLineStart + lineRange + j, [
                    {
                      changed: true,
                      value: this.diffViewEditor1.getEditor().lineTextForBufferRow(c.oldLineStart + lineRange + j)
                    }
                  ], 'removed', this.isWhitespaceIgnored));
                }
              } else if ((c.newLineEnd - c.newLineStart) > (c.oldLineEnd - c.oldLineStart)) {
                if (rightColor === 'green') {
                  _results1.push(this.diffViewEditor2.setWordHighlights(c.newLineStart + lineRange + j, [
                    {
                      changed: true,
                      value: this.diffViewEditor2.getEditor().lineTextForBufferRow(c.newLineStart + lineRange + j)
                    }
                  ], 'added', this.isWhitespaceIgnored));
                } else {
                  _results1.push(this.diffViewEditor2.setWordHighlights(c.newLineStart + lineRange + j, [
                    {
                      changed: true,
                      value: this.diffViewEditor2.getEditor().lineTextForBufferRow(c.newLineStart + lineRange + j)
                    }
                  ], 'removed', this.isWhitespaceIgnored));
                }
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          }).call(this));
        } else if (c.newLineStart != null) {
          lineRange = c.newLineEnd - c.newLineStart;
          _results.push((function() {
            var _k, _results1;
            _results1 = [];
            for (i = _k = 0; _k < lineRange; i = _k += 1) {
              if (rightColor === 'green') {
                _results1.push(this.diffViewEditor2.setWordHighlights(c.newLineStart + i, [
                  {
                    changed: true,
                    value: this.diffViewEditor2.getEditor().lineTextForBufferRow(c.newLineStart + i)
                  }
                ], 'added', this.isWhitespaceIgnored));
              } else {
                _results1.push(this.diffViewEditor2.setWordHighlights(c.newLineStart + i, [
                  {
                    changed: true,
                    value: this.diffViewEditor2.getEditor().lineTextForBufferRow(c.newLineStart + i)
                  }
                ], 'removed', this.isWhitespaceIgnored));
              }
            }
            return _results1;
          }).call(this));
        } else if (c.oldLineStart != null) {
          lineRange = c.oldLineEnd - c.oldLineStart;
          _results.push((function() {
            var _k, _results1;
            _results1 = [];
            for (i = _k = 0; _k < lineRange; i = _k += 1) {
              if (leftColor === 'green') {
                _results1.push(this.diffViewEditor1.setWordHighlights(c.oldLineStart + i, [
                  {
                    changed: true,
                    value: this.diffViewEditor1.getEditor().lineTextForBufferRow(c.oldLineStart + i)
                  }
                ], 'added', this.isWhitespaceIgnored));
              } else {
                _results1.push(this.diffViewEditor1.setWordHighlights(c.oldLineStart + i, [
                  {
                    changed: true,
                    value: this.diffViewEditor1.getEditor().lineTextForBufferRow(c.oldLineStart + i)
                  }
                ], 'removed', this.isWhitespaceIgnored));
              }
            }
            return _results1;
          }).call(this));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    _getConfig: function(config) {
      return atom.config.get("split-diff." + config);
    },
    _setConfig: function(config, value) {
      return atom.config.set("split-diff." + config, value);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvZ2l0LXRpbWUtbWFjaGluZS9ub2RlX21vZHVsZXMvc3BsaXQtZGlmZi9saWIvc3BsaXQtZGlmZi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0hBQUE7O0FBQUEsRUFBQSxPQUF5QyxPQUFBLENBQVEsTUFBUixDQUF6QyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGlCQUFBLFNBQXRCLEVBQWlDLFlBQUEsSUFBakMsQ0FBQTs7QUFBQSxFQUNBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLGVBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FGZCxDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSGIsQ0FBQTs7QUFBQSxFQUlBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FKZixDQUFBOztBQUFBLEVBS0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTFAsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUEsR0FDZjtBQUFBLElBQUEsTUFBQSxFQUFRLFlBQVI7QUFBQSxJQUNBLGFBQUEsRUFBZSxJQURmO0FBQUEsSUFFQSxlQUFBLEVBQWlCLElBRmpCO0FBQUEsSUFHQSxlQUFBLEVBQWlCLElBSGpCO0FBQUEsSUFJQSxtQkFBQSxFQUFxQixJQUpyQjtBQUFBLElBS0EsbUJBQUEsRUFBcUIsS0FMckI7QUFBQSxJQU1BLGlCQUFBLEVBQW1CLElBTm5CO0FBQUEsSUFPQSxnQkFBQSxFQUFrQixJQVBsQjtBQUFBLElBUUEsZ0JBQUEsRUFBa0IsQ0FSbEI7QUFBQSxJQVNBLGtCQUFBLEVBQW9CLElBVHBCO0FBQUEsSUFVQSxxQkFBQSxF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

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/git-time-machine/node_modules/split-diff/lib/split-diff.coffee

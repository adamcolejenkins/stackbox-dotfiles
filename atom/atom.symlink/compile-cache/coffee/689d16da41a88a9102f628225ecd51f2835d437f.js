(function() {
  var Cursor, Delegator, DisplayBuffer, Editor, LanguageMode, Model, Point, Range, Selection, Serializable, TextMateScopeSelector, deprecate, path, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('underscore-plus');

  path = require('path');

  Serializable = require('serializable');

  Delegator = require('delegato');

  deprecate = require('grim').deprecate;

  Model = require('theorist').Model;

  _ref = require('text-buffer'), Point = _ref.Point, Range = _ref.Range;

  LanguageMode = require('./language-mode');

  DisplayBuffer = require('./display-buffer');

  Cursor = require('./cursor');

  Selection = require('./selection');

  TextMateScopeSelector = require('first-mate').ScopeSelector;

  module.exports = Editor = (function(_super) {
    __extends(Editor, _super);

    Serializable.includeInto(Editor);

    atom.deserializers.add(Editor);

    Delegator.includeInto(Editor);

    Editor.prototype.deserializing = false;

    Editor.prototype.callDisplayBufferCreatedHook = false;

    Editor.prototype.registerEditor = false;

    Editor.prototype.buffer = null;

    Editor.prototype.languageMode = null;

    Editor.prototype.cursors = null;

    Editor.prototype.selections = null;

    Editor.prototype.suppressSelectionMerging = false;

    Editor.delegatesMethods('suggestedIndentForBufferRow', 'autoIndentBufferRow', 'autoIndentBufferRows', 'autoDecreaseIndentForBufferRow', 'toggleLineCommentForBufferRow', 'toggleLineCommentsForBufferRows', {
      toProperty: 'languageMode'
    });

    Editor.delegatesProperties('$lineHeight', '$defaultCharWidth', '$height', '$width', '$scrollTop', '$scrollLeft', 'manageScrollPosition', {
      toProperty: 'displayBuffer'
    });

    function Editor(_arg) {
      var buffer, initialColumn, initialLine, marker, registerEditor, softWrap, suppressCursorCreation, tabLength, _i, _len, _ref1, _ref2, _ref3, _ref4, _ref5;
      this.softTabs = _arg.softTabs, initialLine = _arg.initialLine, initialColumn = _arg.initialColumn, tabLength = _arg.tabLength, softWrap = _arg.softWrap, this.displayBuffer = _arg.displayBuffer, buffer = _arg.buffer, registerEditor = _arg.registerEditor, suppressCursorCreation = _arg.suppressCursorCreation;
      this.handleMarkerCreated = __bind(this.handleMarkerCreated, this);
      Editor.__super__.constructor.apply(this, arguments);
      this.cursors = [];
      this.selections = [];
      if (this.displayBuffer == null) {
        this.displayBuffer = new DisplayBuffer({
          buffer: buffer,
          tabLength: tabLength,
          softWrap: softWrap
        });
      }
      this.buffer = this.displayBuffer.buffer;
      this.softTabs = (_ref1 = (_ref2 = (_ref3 = this.buffer.usesSoftTabs()) != null ? _ref3 : this.softTabs) != null ? _ref2 : atom.config.get('editor.softTabs')) != null ? _ref1 : true;
      _ref4 = this.findMarkers(this.getSelectionMarkerAttributes());
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        marker = _ref4[_i];
        marker.setAttributes({
          preserveFolds: true
        });
        this.addSelection(marker);
      }
      this.subscribeToBuffer();
      this.subscribeToDisplayBuffer();
      if (this.getCursors().length === 0 && !suppressCursorCreation) {
        initialLine = Math.max(parseInt(initialLine) || 0, 0);
        initialColumn = Math.max(parseInt(initialColumn) || 0, 0);
        this.addCursorAtBufferPosition([initialLine, initialColumn]);
      }
      this.languageMode = new LanguageMode(this);
      this.subscribe(this.$scrollTop, (function(_this) {
        return function(scrollTop) {
          return _this.emit('scroll-top-changed', scrollTop);
        };
      })(this));
      this.subscribe(this.$scrollLeft, (function(_this) {
        return function(scrollLeft) {
          return _this.emit('scroll-left-changed', scrollLeft);
        };
      })(this));
      if (registerEditor) {
        if ((_ref5 = atom.workspace) != null) {
          _ref5.editorAdded(this);
        }
      }
    }

    Editor.prototype.serializeParams = function() {
      return {
        id: this.id,
        softTabs: this.softTabs,
        scrollTop: this.scrollTop,
        scrollLeft: this.scrollLeft,
        displayBuffer: this.displayBuffer.serialize()
      };
    };

    Editor.prototype.deserializeParams = function(params) {
      params.displayBuffer = DisplayBuffer.deserialize(params.displayBuffer);
      params.registerEditor = true;
      return params;
    };

    Editor.prototype.subscribeToBuffer = function() {
      this.buffer.retain();
      this.subscribe(this.buffer, "path-changed", (function(_this) {
        return function() {
          if (atom.project.getPath() == null) {
            atom.project.setPath(path.dirname(_this.getPath()));
          }
          _this.emit("title-changed");
          return _this.emit("path-changed");
        };
      })(this));
      this.subscribe(this.buffer, "contents-modified", (function(_this) {
        return function() {
          return _this.emit("contents-modified");
        };
      })(this));
      this.subscribe(this.buffer, "contents-conflicted", (function(_this) {
        return function() {
          return _this.emit("contents-conflicted");
        };
      })(this));
      this.subscribe(this.buffer, "modified-status-changed", (function(_this) {
        return function() {
          return _this.emit("modified-status-changed");
        };
      })(this));
      this.subscribe(this.buffer, "destroyed", (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this));
      return this.preserveCursorPositionOnBufferReload();
    };

    Editor.prototype.subscribeToDisplayBuffer = function() {
      this.subscribe(this.displayBuffer, 'marker-created', this.handleMarkerCreated);
      this.subscribe(this.displayBuffer, "changed", (function(_this) {
        return function(e) {
          return _this.emit('screen-lines-changed', e);
        };
      })(this));
      this.subscribe(this.displayBuffer, "markers-updated", (function(_this) {
        return function() {
          return _this.mergeIntersectingSelections();
        };
      })(this));
      this.subscribe(this.displayBuffer, 'grammar-changed', (function(_this) {
        return function() {
          return _this.handleGrammarChange();
        };
      })(this));
      return this.subscribe(this.displayBuffer, 'soft-wrap-changed', (function(_this) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return _this.emit.apply(_this, ['soft-wrap-changed'].concat(__slice.call(args)));
        };
      })(this));
    };

    Editor.prototype.getViewClass = function() {
      if (atom.config.get('core.useReactEditor')) {
        return require('./react-editor-view');
      } else {
        return require('./editor-view');
      }
    };

    Editor.prototype.destroyed = function() {
      var selection, _i, _len, _ref1;
      this.unsubscribe();
      _ref1 = this.getSelections();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        selection.destroy();
      }
      this.buffer.release();
      this.displayBuffer.destroy();
      return this.languageMode.destroy();
    };

    Editor.prototype.copy = function() {
      var displayBuffer, marker, newEditor, softTabs, tabLength, _i, _len, _ref1;
      tabLength = this.getTabLength();
      displayBuffer = this.displayBuffer.copy();
      softTabs = this.getSoftTabs();
      newEditor = new Editor({
        buffer: this.buffer,
        displayBuffer: displayBuffer,
        tabLength: tabLength,
        softTabs: softTabs,
        suppressCursorCreation: true,
        registerEditor: true
      });
      _ref1 = this.findMarkers({
        editorId: this.id
      });
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        marker = _ref1[_i];
        marker.copy({
          editorId: newEditor.id,
          preserveFolds: true
        });
      }
      return newEditor;
    };

    Editor.prototype.getTitle = function() {
      var sessionPath;
      if (sessionPath = this.getPath()) {
        return path.basename(sessionPath);
      } else {
        return 'untitled';
      }
    };

    Editor.prototype.getLongTitle = function() {
      var directory, fileName, sessionPath;
      if (sessionPath = this.getPath()) {
        fileName = path.basename(sessionPath);
        directory = path.basename(path.dirname(sessionPath));
        return "" + fileName + " - " + directory;
      } else {
        return 'untitled';
      }
    };

    Editor.prototype.setVisible = function(visible) {
      return this.displayBuffer.setVisible(visible);
    };

    Editor.prototype.setEditorWidthInChars = function(editorWidthInChars) {
      return this.displayBuffer.setEditorWidthInChars(editorWidthInChars);
    };

    Editor.prototype.getSoftWrapColumn = function() {
      return this.displayBuffer.getSoftWrapColumn();
    };

    Editor.prototype.getSoftTabs = function() {
      return this.softTabs;
    };

    Editor.prototype.setSoftTabs = function(softTabs) {
      this.softTabs = softTabs;
      return this.softTabs;
    };

    Editor.prototype.toggleSoftTabs = function() {
      return this.setSoftTabs(!this.getSoftTabs());
    };

    Editor.prototype.getSoftWrap = function() {
      return this.displayBuffer.getSoftWrap();
    };

    Editor.prototype.setSoftWrap = function(softWrap) {
      return this.displayBuffer.setSoftWrap(softWrap);
    };

    Editor.prototype.toggleSoftWrap = function() {
      return this.setSoftWrap(!this.getSoftWrap());
    };

    Editor.prototype.getTabText = function() {
      return this.buildIndentString(1);
    };

    Editor.prototype.getTabLength = function() {
      return this.displayBuffer.getTabLength();
    };

    Editor.prototype.setTabLength = function(tabLength) {
      return this.displayBuffer.setTabLength(tabLength);
    };

    Editor.prototype.clipBufferPosition = function(bufferPosition) {
      return this.buffer.clipPosition(bufferPosition);
    };

    Editor.prototype.clipBufferRange = function(range) {
      return this.buffer.clipRange(range);
    };

    Editor.prototype.indentationForBufferRow = function(bufferRow) {
      return this.indentLevelForLine(this.lineForBufferRow(bufferRow));
    };

    Editor.prototype.setIndentationForBufferRow = function(bufferRow, newLevel, _arg) {
      var endColumn, newIndentString, preserveLeadingWhitespace;
      preserveLeadingWhitespace = (_arg != null ? _arg : {}).preserveLeadingWhitespace;
      if (preserveLeadingWhitespace) {
        endColumn = 0;
      } else {
        endColumn = this.lineForBufferRow(bufferRow).match(/^\s*/)[0].length;
      }
      newIndentString = this.buildIndentString(newLevel);
      return this.buffer.setTextInRange([[bufferRow, 0], [bufferRow, endColumn]], newIndentString);
    };

    Editor.prototype.indentLevelForLine = function(line) {
      return this.displayBuffer.indentLevelForLine(line);
    };

    Editor.prototype.buildIndentString = function(number) {
      if (this.getSoftTabs()) {
        return _.multiplyString(" ", Math.floor(number * this.getTabLength()));
      } else {
        return _.multiplyString("\t", Math.floor(number));
      }
    };

    Editor.prototype.save = function() {
      return this.buffer.save();
    };

    Editor.prototype.saveAs = function(filePath) {
      return this.buffer.saveAs(filePath);
    };

    Editor.prototype.checkoutHead = function() {
      var filePath, _ref1;
      if (filePath = this.getPath()) {
        return (_ref1 = atom.project.getRepo()) != null ? _ref1.checkoutHead(filePath) : void 0;
      }
    };

    Editor.prototype.copyPathToClipboard = function() {
      var filePath;
      if (filePath = this.getPath()) {
        return atom.clipboard.write(filePath);
      }
    };

    Editor.prototype.getPath = function() {
      return this.buffer.getPath();
    };

    Editor.prototype.getText = function() {
      return this.buffer.getText();
    };

    Editor.prototype.setText = function(text) {
      return this.buffer.setText(text);
    };

    Editor.prototype.getTextInRange = function(range) {
      return this.buffer.getTextInRange(range);
    };

    Editor.prototype.getLineCount = function() {
      return this.buffer.getLineCount();
    };

    Editor.prototype.getBuffer = function() {
      return this.buffer;
    };

    Editor.prototype.getUri = function() {
      return this.buffer.getUri();
    };

    Editor.prototype.isBufferRowBlank = function(bufferRow) {
      return this.buffer.isRowBlank(bufferRow);
    };

    Editor.prototype.isBufferRowCommented = function(bufferRow) {
      var match, scopes;
      if (match = this.lineForBufferRow(bufferRow).match(/\S/)) {
        scopes = this.tokenForBufferPosition([bufferRow, match.index]).scopes;
        return new TextMateScopeSelector('comment.*').matches(scopes);
      }
    };

    Editor.prototype.nextNonBlankBufferRow = function(bufferRow) {
      return this.buffer.nextNonBlankRow(bufferRow);
    };

    Editor.prototype.getEofBufferPosition = function() {
      return this.buffer.getEndPosition();
    };

    Editor.prototype.getLastBufferRow = function() {
      return this.buffer.getLastRow();
    };

    Editor.prototype.bufferRangeForBufferRow = function(row, _arg) {
      var includeNewline;
      includeNewline = (_arg != null ? _arg : {}).includeNewline;
      return this.buffer.rangeForRow(row, includeNewline);
    };

    Editor.prototype.lineForBufferRow = function(row) {
      return this.buffer.lineForRow(row);
    };

    Editor.prototype.lineLengthForBufferRow = function(row) {
      return this.buffer.lineLengthForRow(row);
    };

    Editor.prototype.scan = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.buffer).scan.apply(_ref1, args);
    };

    Editor.prototype.scanInBufferRange = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.buffer).scanInRange.apply(_ref1, args);
    };

    Editor.prototype.backwardsScanInBufferRange = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.buffer).backwardsScanInRange.apply(_ref1, args);
    };

    Editor.prototype.isModified = function() {
      return this.buffer.isModified();
    };

    Editor.prototype.shouldPromptToSave = function() {
      return this.isModified() && !this.buffer.hasMultipleEditors();
    };

    Editor.prototype.screenPositionForBufferPosition = function(bufferPosition, options) {
      return this.displayBuffer.screenPositionForBufferPosition(bufferPosition, options);
    };

    Editor.prototype.bufferPositionForScreenPosition = function(screenPosition, options) {
      return this.displayBuffer.bufferPositionForScreenPosition(screenPosition, options);
    };

    Editor.prototype.screenRangeForBufferRange = function(bufferRange) {
      return this.displayBuffer.screenRangeForBufferRange(bufferRange);
    };

    Editor.prototype.bufferRangeForScreenRange = function(screenRange) {
      return this.displayBuffer.bufferRangeForScreenRange(screenRange);
    };

    Editor.prototype.clipScreenPosition = function(screenPosition, options) {
      return this.displayBuffer.clipScreenPosition(screenPosition, options);
    };

    Editor.prototype.lineForScreenRow = function(row) {
      return this.displayBuffer.lineForRow(row);
    };

    Editor.prototype.linesForScreenRows = function(start, end) {
      return this.displayBuffer.linesForRows(start, end);
    };

    Editor.prototype.getScreenLineCount = function() {
      return this.displayBuffer.getLineCount();
    };

    Editor.prototype.getMaxScreenLineLength = function() {
      return this.displayBuffer.getMaxLineLength();
    };

    Editor.prototype.getLastScreenRow = function() {
      return this.displayBuffer.getLastRow();
    };

    Editor.prototype.bufferRowsForScreenRows = function(startRow, endRow) {
      return this.displayBuffer.bufferRowsForScreenRows(startRow, endRow);
    };

    Editor.prototype.bufferRowForScreenRow = function(row) {
      return this.displayBuffer.bufferRowForScreenRow(row);
    };

    Editor.prototype.scopesForBufferPosition = function(bufferPosition) {
      return this.displayBuffer.scopesForBufferPosition(bufferPosition);
    };

    Editor.prototype.bufferRangeForScopeAtCursor = function(selector) {
      return this.displayBuffer.bufferRangeForScopeAtPosition(selector, this.getCursorBufferPosition());
    };

    Editor.prototype.tokenForBufferPosition = function(bufferPosition) {
      return this.displayBuffer.tokenForBufferPosition(bufferPosition);
    };

    Editor.prototype.getCursorScopes = function() {
      return this.getCursor().getScopes();
    };

    Editor.prototype.logCursorScope = function() {
      return console.log(this.getCursorScopes());
    };

    Editor.prototype.insertText = function(text, options) {
      if (options == null) {
        options = {};
      }
      if (options.autoIndentNewline == null) {
        options.autoIndentNewline = this.shouldAutoIndent();
      }
      if (options.autoDecreaseIndent == null) {
        options.autoDecreaseIndent = this.shouldAutoIndent();
      }
      return this.mutateSelectedText(function(selection) {
        return selection.insertText(text, options);
      });
    };

    Editor.prototype.insertNewline = function() {
      return this.insertText('\n');
    };

    Editor.prototype.insertNewlineBelow = function() {
      return this.transact((function(_this) {
        return function() {
          _this.moveCursorToEndOfLine();
          return _this.insertNewline();
        };
      })(this));
    };

    Editor.prototype.insertNewlineAbove = function() {
      return this.transact((function(_this) {
        return function() {
          var bufferRow, indentLevel, onFirstLine;
          bufferRow = _this.getCursorBufferPosition().row;
          indentLevel = _this.indentationForBufferRow(bufferRow);
          onFirstLine = bufferRow === 0;
          _this.moveCursorToBeginningOfLine();
          _this.moveCursorLeft();
          _this.insertNewline();
          if (_this.shouldAutoIndent() && _this.indentationForBufferRow(bufferRow) < indentLevel) {
            _this.setIndentationForBufferRow(bufferRow, indentLevel);
          }
          if (onFirstLine) {
            _this.moveCursorUp();
            return _this.moveCursorToEndOfLine();
          }
        };
      })(this));
    };

    Editor.prototype.indent = function(options) {
      if (options == null) {
        options = {};
      }
      if (options.autoIndent == null) {
        options.autoIndent = this.shouldAutoIndent();
      }
      return this.mutateSelectedText(function(selection) {
        return selection.indent(options);
      });
    };

    Editor.prototype.backspace = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.backspace();
      });
    };

    Editor.prototype.backspaceToBeginningOfWord = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.backspaceToBeginningOfWord();
      });
    };

    Editor.prototype.backspaceToBeginningOfLine = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.backspaceToBeginningOfLine();
      });
    };

    Editor.prototype["delete"] = function() {
      return this.mutateSelectedText(function(selection) {
        return selection["delete"]();
      });
    };

    Editor.prototype.deleteToEndOfWord = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.deleteToEndOfWord();
      });
    };

    Editor.prototype.deleteLine = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.deleteLine();
      });
    };

    Editor.prototype.indentSelectedRows = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.indentSelectedRows();
      });
    };

    Editor.prototype.outdentSelectedRows = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.outdentSelectedRows();
      });
    };

    Editor.prototype.toggleLineCommentsInSelection = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.toggleLineComments();
      });
    };

    Editor.prototype.autoIndentSelectedRows = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.autoIndentSelectedRows();
      });
    };

    Editor.prototype.normalizeTabsInBufferRange = function(bufferRange) {
      if (!this.getSoftTabs()) {
        return;
      }
      return this.scanInBufferRange(/\t/g, bufferRange, (function(_this) {
        return function(_arg) {
          var replace;
          replace = _arg.replace;
          return replace(_this.getTabText());
        };
      })(this));
    };

    Editor.prototype.cutToEndOfLine = function() {
      var maintainClipboard;
      maintainClipboard = false;
      return this.mutateSelectedText(function(selection) {
        selection.cutToEndOfLine(maintainClipboard);
        return maintainClipboard = true;
      });
    };

    Editor.prototype.cutSelectedText = function() {
      var maintainClipboard;
      maintainClipboard = false;
      return this.mutateSelectedText(function(selection) {
        selection.cut(maintainClipboard);
        return maintainClipboard = true;
      });
    };

    Editor.prototype.copySelectedText = function() {
      var maintainClipboard, selection, _i, _len, _ref1, _results;
      maintainClipboard = false;
      _ref1 = this.getSelections();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        selection.copy(maintainClipboard);
        _results.push(maintainClipboard = true);
      }
      return _results;
    };

    Editor.prototype.pasteText = function(options) {
      var containsNewlines, metadata, text, _ref1;
      if (options == null) {
        options = {};
      }
      _ref1 = atom.clipboard.readWithMetadata(), text = _ref1.text, metadata = _ref1.metadata;
      containsNewlines = text.indexOf('\n') !== -1;
      if (((metadata != null ? metadata.selections : void 0) != null) && metadata.selections.length === this.getSelections().length) {
        this.mutateSelectedText((function(_this) {
          return function(selection, index) {
            text = metadata.selections[index];
            return selection.insertText(text, options);
          };
        })(this));
        return;
      } else if (atom.config.get("editor.normalizeIndentOnPaste") && ((metadata != null ? metadata.indentBasis : void 0) != null)) {
        if (!this.getCursor().hasPrecedingCharactersOnLine() || containsNewlines) {
          if (options.indentBasis == null) {
            options.indentBasis = metadata.indentBasis;
          }
        }
      }
      return this.insertText(text, options);
    };

    Editor.prototype.undo = function() {
      this.getCursor().needsAutoscroll = true;
      return this.buffer.undo(this);
    };

    Editor.prototype.redo = function() {
      this.getCursor().needsAutoscroll = true;
      return this.buffer.redo(this);
    };

    Editor.prototype.foldCurrentRow = function() {
      var bufferRow;
      bufferRow = this.bufferPositionForScreenPosition(this.getCursorScreenPosition()).row;
      return this.foldBufferRow(bufferRow);
    };

    Editor.prototype.unfoldCurrentRow = function() {
      var bufferRow;
      bufferRow = this.bufferPositionForScreenPosition(this.getCursorScreenPosition()).row;
      return this.unfoldBufferRow(bufferRow);
    };

    Editor.prototype.foldSelectedLines = function() {
      var selection, _i, _len, _ref1, _results;
      _ref1 = this.getSelections();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        _results.push(selection.fold());
      }
      return _results;
    };

    Editor.prototype.foldAll = function() {
      return this.languageMode.foldAll();
    };

    Editor.prototype.unfoldAll = function() {
      return this.languageMode.unfoldAll();
    };

    Editor.prototype.foldAllAtIndentLevel = function(level) {
      return this.languageMode.foldAllAtIndentLevel(level);
    };

    Editor.prototype.foldBufferRow = function(bufferRow) {
      return this.languageMode.foldBufferRow(bufferRow);
    };

    Editor.prototype.unfoldBufferRow = function(bufferRow) {
      return this.displayBuffer.unfoldBufferRow(bufferRow);
    };

    Editor.prototype.isFoldableAtBufferRow = function(bufferRow) {
      return this.languageMode.isFoldableAtBufferRow(bufferRow);
    };

    Editor.prototype.createFold = function(startRow, endRow) {
      return this.displayBuffer.createFold(startRow, endRow);
    };

    Editor.prototype.destroyFoldWithId = function(id) {
      return this.displayBuffer.destroyFoldWithId(id);
    };

    Editor.prototype.destroyFoldsIntersectingBufferRange = function(bufferRange) {
      var row, _i, _ref1, _ref2, _results;
      _results = [];
      for (row = _i = _ref1 = bufferRange.start.row, _ref2 = bufferRange.end.row; _ref1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; row = _ref1 <= _ref2 ? ++_i : --_i) {
        _results.push(this.unfoldBufferRow(row));
      }
      return _results;
    };

    Editor.prototype.toggleFoldAtBufferRow = function(bufferRow) {
      if (this.isFoldedAtBufferRow(bufferRow)) {
        return this.unfoldBufferRow(bufferRow);
      } else {
        return this.foldBufferRow(bufferRow);
      }
    };

    Editor.prototype.isFoldedAtCursorRow = function() {
      return this.isFoldedAtScreenRow(this.getCursorScreenRow());
    };

    Editor.prototype.isFoldedAtBufferRow = function(bufferRow) {
      return this.displayBuffer.isFoldedAtBufferRow(bufferRow);
    };

    Editor.prototype.isFoldedAtScreenRow = function(screenRow) {
      return this.displayBuffer.isFoldedAtScreenRow(screenRow);
    };

    Editor.prototype.largestFoldContainingBufferRow = function(bufferRow) {
      return this.displayBuffer.largestFoldContainingBufferRow(bufferRow);
    };

    Editor.prototype.largestFoldStartingAtScreenRow = function(screenRow) {
      return this.displayBuffer.largestFoldStartingAtScreenRow(screenRow);
    };

    Editor.prototype.outermostFoldsInBufferRowRange = function(startRow, endRow) {
      return this.displayBuffer.outermostFoldsInBufferRowRange(startRow, endRow);
    };

    Editor.prototype.moveLineUp = function() {
      var lastRow, selection;
      selection = this.getSelectedBufferRange();
      if (selection.start.row === 0) {
        return;
      }
      lastRow = this.buffer.getLastRow();
      if (selection.isEmpty() && selection.start.row === lastRow && this.buffer.getLastLine() === '') {
        return;
      }
      return this.transact((function(_this) {
        return function() {
          var bufferRange, endPosition, endRow, fold, foldedRow, foldedRows, insertDelta, insertPosition, lines, precedingBufferRow, precedingScreenRow, row, rows, startRow, _i, _j, _k, _len, _len1, _ref1, _ref2, _results;
          foldedRows = [];
          rows = (function() {
            _results = [];
            for (var _i = _ref1 = selection.start.row, _ref2 = selection.end.row; _ref1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; _ref1 <= _ref2 ? _i++ : _i--){ _results.push(_i); }
            return _results;
          }).apply(this);
          if (selection.start.row !== selection.end.row && selection.end.column === 0) {
            if (!_this.isFoldedAtBufferRow(selection.end.row)) {
              rows.pop();
            }
          }
          precedingScreenRow = _this.screenPositionForBufferPosition([selection.start.row]).translate([-1]);
          precedingBufferRow = _this.bufferPositionForScreenPosition(precedingScreenRow).row;
          if (fold = _this.largestFoldContainingBufferRow(precedingBufferRow)) {
            insertDelta = fold.getBufferRange().getRowCount();
          } else {
            insertDelta = 1;
          }
          for (_j = 0, _len = rows.length; _j < _len; _j++) {
            row = rows[_j];
            if (fold = _this.displayBuffer.largestFoldStartingAtBufferRow(row)) {
              bufferRange = fold.getBufferRange();
              startRow = bufferRange.start.row;
              endRow = bufferRange.end.row;
              foldedRows.push(startRow - insertDelta);
            } else {
              startRow = row;
              endRow = row;
            }
            insertPosition = Point.fromObject([startRow - insertDelta]);
            endPosition = Point.min([endRow + 1], _this.buffer.getEndPosition());
            lines = _this.buffer.getTextInRange([[startRow], endPosition]);
            if (endPosition.row === lastRow && endPosition.column > 0 && !_this.buffer.lineEndingForRow(endPosition.row)) {
              lines = "" + lines + "\n";
            }
            _this.buffer.deleteRows(startRow, endRow);
            if (fold = _this.displayBuffer.largestFoldStartingAtBufferRow(insertPosition.row)) {
              _this.unfoldBufferRow(insertPosition.row);
              foldedRows.push(insertPosition.row + endRow - startRow + fold.getBufferRange().getRowCount());
            }
            _this.buffer.insert(insertPosition, lines);
          }
          for (_k = 0, _len1 = foldedRows.length; _k < _len1; _k++) {
            foldedRow = foldedRows[_k];
            if ((0 <= foldedRow && foldedRow <= _this.getLastBufferRow())) {
              _this.foldBufferRow(foldedRow);
            }
          }
          return _this.setSelectedBufferRange(selection.translate([-insertDelta]), {
            preserveFolds: true,
            autoscroll: true
          });
        };
      })(this));
    };

    Editor.prototype.moveLineDown = function() {
      var lastRow, selection;
      selection = this.getSelectedBufferRange();
      lastRow = this.buffer.getLastRow();
      if (selection.end.row === lastRow) {
        return;
      }
      if (selection.end.row === lastRow - 1 && this.buffer.getLastLine() === '') {
        return;
      }
      return this.transact((function(_this) {
        return function() {
          var bufferRange, endPosition, endRow, fold, foldedRow, foldedRows, followingBufferRow, followingScreenRow, insertDelta, insertPosition, lines, row, rows, startRow, _i, _j, _k, _len, _len1, _ref1, _ref2, _results;
          foldedRows = [];
          rows = (function() {
            _results = [];
            for (var _i = _ref1 = selection.end.row, _ref2 = selection.start.row; _ref1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; _ref1 <= _ref2 ? _i++ : _i--){ _results.push(_i); }
            return _results;
          }).apply(this);
          if (selection.start.row !== selection.end.row && selection.end.column === 0) {
            if (!_this.isFoldedAtBufferRow(selection.end.row)) {
              rows.shift();
            }
          }
          followingScreenRow = _this.screenPositionForBufferPosition([selection.end.row]).translate([1]);
          followingBufferRow = _this.bufferPositionForScreenPosition(followingScreenRow).row;
          if (fold = _this.largestFoldContainingBufferRow(followingBufferRow)) {
            insertDelta = fold.getBufferRange().getRowCount();
          } else {
            insertDelta = 1;
          }
          for (_j = 0, _len = rows.length; _j < _len; _j++) {
            row = rows[_j];
            if (fold = _this.displayBuffer.largestFoldStartingAtBufferRow(row)) {
              bufferRange = fold.getBufferRange();
              startRow = bufferRange.start.row;
              endRow = bufferRange.end.row;
              foldedRows.push(endRow + insertDelta);
            } else {
              startRow = row;
              endRow = row;
            }
            if (endRow + 1 === lastRow) {
              endPosition = [endRow, _this.buffer.lineLengthForRow(endRow)];
            } else {
              endPosition = [endRow + 1];
            }
            lines = _this.buffer.getTextInRange([[startRow], endPosition]);
            _this.buffer.deleteRows(startRow, endRow);
            insertPosition = Point.min([startRow + insertDelta], _this.buffer.getEndPosition());
            if (insertPosition.row === _this.buffer.getLastRow() && insertPosition.column > 0) {
              lines = "\n" + lines;
            }
            if (fold = _this.displayBuffer.largestFoldStartingAtBufferRow(insertPosition.row)) {
              _this.unfoldBufferRow(insertPosition.row);
              foldedRows.push(insertPosition.row + fold.getBufferRange().getRowCount());
            }
            _this.buffer.insert(insertPosition, lines);
          }
          for (_k = 0, _len1 = foldedRows.length; _k < _len1; _k++) {
            foldedRow = foldedRows[_k];
            if ((0 <= foldedRow && foldedRow <= _this.getLastBufferRow())) {
              _this.foldBufferRow(foldedRow);
            }
          }
          return _this.setSelectedBufferRange(selection.translate([insertDelta]), {
            preserveFolds: true,
            autoscroll: true
          });
        };
      })(this));
    };

    Editor.prototype.duplicateLines = function() {
      return this.transact((function(_this) {
        return function() {
          var delta, endRow, foldEndRow, foldStartRow, foldedRowRanges, rangeToDuplicate, selectedBufferRange, selection, start, startRow, textToDuplicate, _i, _len, _ref1, _ref2, _results;
          _ref1 = _this.getSelectionsOrderedByBufferPosition().reverse();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            selection = _ref1[_i];
            selectedBufferRange = selection.getBufferRange();
            if (selection.isEmpty()) {
              start = selection.getScreenRange().start;
              selection.selectToScreenPosition([start.row + 1, 0]);
            }
            _ref2 = selection.getBufferRowRange(), startRow = _ref2[0], endRow = _ref2[1];
            endRow++;
            foldedRowRanges = _this.outermostFoldsInBufferRowRange(startRow, endRow).map(function(fold) {
              return fold.getBufferRowRange();
            });
            rangeToDuplicate = [[startRow, 0], [endRow, 0]];
            textToDuplicate = _this.getTextInBufferRange(rangeToDuplicate);
            if (endRow > _this.getLastBufferRow()) {
              textToDuplicate = '\n' + textToDuplicate;
            }
            _this.buffer.insert([endRow, 0], textToDuplicate);
            delta = endRow - startRow;
            selection.setBufferRange(selectedBufferRange.translate([delta, 0]));
            _results.push((function() {
              var _j, _len1, _ref3, _results1;
              _results1 = [];
              for (_j = 0, _len1 = foldedRowRanges.length; _j < _len1; _j++) {
                _ref3 = foldedRowRanges[_j], foldStartRow = _ref3[0], foldEndRow = _ref3[1];
                _results1.push(this.createFold(foldStartRow + delta, foldEndRow + delta));
              }
              return _results1;
            }).call(_this));
          }
          return _results;
        };
      })(this));
    };

    Editor.prototype.duplicateLine = function() {
      deprecate("Use Editor::duplicateLines() instead");
      return this.duplicateLines();
    };

    Editor.prototype.mutateSelectedText = function(fn) {
      return this.transact((function(_this) {
        return function() {
          var index, selection, _i, _len, _ref1, _results;
          _ref1 = _this.getSelections();
          _results = [];
          for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
            selection = _ref1[index];
            _results.push(fn(selection, index));
          }
          return _results;
        };
      })(this));
    };

    Editor.prototype.replaceSelectedText = function(options, fn) {
      var selectWordIfEmpty;
      if (options == null) {
        options = {};
      }
      selectWordIfEmpty = options.selectWordIfEmpty;
      return this.mutateSelectedText(function(selection) {
        var range, text;
        range = selection.getBufferRange();
        if (selectWordIfEmpty && selection.isEmpty()) {
          selection.selectWord();
        }
        text = selection.getText();
        selection.deleteSelectedText();
        selection.insertText(fn(text));
        return selection.setBufferRange(range);
      });
    };

    Editor.prototype.getMarker = function(id) {
      return this.displayBuffer.getMarker(id);
    };

    Editor.prototype.getMarkers = function() {
      return this.displayBuffer.getMarkers();
    };

    Editor.prototype.findMarkers = function(properties) {
      return this.displayBuffer.findMarkers(properties);
    };

    Editor.prototype.markScreenRange = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.displayBuffer).markScreenRange.apply(_ref1, args);
    };

    Editor.prototype.markBufferRange = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.displayBuffer).markBufferRange.apply(_ref1, args);
    };

    Editor.prototype.markScreenPosition = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.displayBuffer).markScreenPosition.apply(_ref1, args);
    };

    Editor.prototype.markBufferPosition = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.displayBuffer).markBufferPosition.apply(_ref1, args);
    };

    Editor.prototype.destroyMarker = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.displayBuffer).destroyMarker.apply(_ref1, args);
    };

    Editor.prototype.getMarkerCount = function() {
      return this.buffer.getMarkerCount();
    };

    Editor.prototype.hasMultipleCursors = function() {
      return this.getCursors().length > 1;
    };

    Editor.prototype.getCursors = function() {
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Array, this.cursors, function(){});
    };

    Editor.prototype.getCursor = function() {
      return _.last(this.cursors);
    };

    Editor.prototype.addCursorAtScreenPosition = function(screenPosition) {
      this.markScreenPosition(screenPosition, this.getSelectionMarkerAttributes());
      return this.getLastSelection().cursor;
    };

    Editor.prototype.addCursorAtBufferPosition = function(bufferPosition) {
      this.markBufferPosition(bufferPosition, this.getSelectionMarkerAttributes());
      return this.getLastSelection().cursor;
    };

    Editor.prototype.addCursor = function(marker) {
      var cursor;
      cursor = new Cursor({
        editor: this,
        marker: marker
      });
      this.cursors.push(cursor);
      this.emit('cursor-added', cursor);
      return cursor;
    };

    Editor.prototype.removeCursor = function(cursor) {
      return _.remove(this.cursors, cursor);
    };

    Editor.prototype.addSelection = function(marker, options) {
      var cursor, selection, selectionBufferRange, _i, _len, _ref1;
      if (options == null) {
        options = {};
      }
      if (!marker.getAttributes().preserveFolds) {
        this.destroyFoldsIntersectingBufferRange(marker.getBufferRange());
      }
      cursor = this.addCursor(marker);
      selection = new Selection(_.extend({
        editor: this,
        marker: marker,
        cursor: cursor
      }, options));
      this.selections.push(selection);
      selectionBufferRange = selection.getBufferRange();
      this.mergeIntersectingSelections();
      if (selection.destroyed) {
        _ref1 = this.getSelections();
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          selection = _ref1[_i];
          if (selection.intersectsBufferRange(selectionBufferRange)) {
            return selection;
          }
        }
      } else {
        this.emit('selection-added', selection);
        return selection;
      }
    };

    Editor.prototype.addSelectionForBufferRange = function(bufferRange, options) {
      if (options == null) {
        options = {};
      }
      this.markBufferRange(bufferRange, _.defaults(this.getSelectionMarkerAttributes(), options));
      return this.getLastSelection();
    };

    Editor.prototype.setSelectedBufferRange = function(bufferRange, options) {
      return this.setSelectedBufferRanges([bufferRange], options);
    };

    Editor.prototype.setSelectedScreenRange = function(screenRange, options) {
      return this.setSelectedBufferRange(this.bufferRangeForScreenRange(screenRange, options), options);
    };

    Editor.prototype.setSelectedBufferRanges = function(bufferRanges, options) {
      var selection, selections, _i, _len, _ref1;
      if (options == null) {
        options = {};
      }
      if (!bufferRanges.length) {
        throw new Error("Passed an empty array to setSelectedBufferRanges");
      }
      selections = this.getSelections();
      _ref1 = selections.slice(bufferRanges.length);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        selection.destroy();
      }
      return this.mergeIntersectingSelections(options, (function(_this) {
        return function() {
          var bufferRange, i, _j, _len1, _results;
          _results = [];
          for (i = _j = 0, _len1 = bufferRanges.length; _j < _len1; i = ++_j) {
            bufferRange = bufferRanges[i];
            bufferRange = Range.fromObject(bufferRange);
            if (selections[i]) {
              _results.push(selections[i].setBufferRange(bufferRange, options));
            } else {
              _results.push(_this.addSelectionForBufferRange(bufferRange, options));
            }
          }
          return _results;
        };
      })(this));
    };

    Editor.prototype.removeSelection = function(selection) {
      _.remove(this.selections, selection);
      return this.emit('selection-removed', selection);
    };

    Editor.prototype.clearSelections = function() {
      this.consolidateSelections();
      return this.getSelection().clear();
    };

    Editor.prototype.consolidateSelections = function() {
      var selection, selections, _i, _len, _ref1;
      selections = this.getSelections();
      if (selections.length > 1) {
        _ref1 = selections.slice(0, -1);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          selection = _ref1[_i];
          selection.destroy();
        }
        return true;
      } else {
        return false;
      }
    };

    Editor.prototype.selectionScreenRangeChanged = function(selection) {
      return this.emit('selection-screen-range-changed', selection);
    };

    Editor.prototype.getSelections = function() {
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Array, this.selections, function(){});
    };

    Editor.prototype.getSelection = function(index) {
      if (index == null) {
        index = this.selections.length - 1;
      }
      return this.selections[index];
    };

    Editor.prototype.getLastSelection = function() {
      return _.last(this.selections);
    };

    Editor.prototype.getSelectionsOrderedByBufferPosition = function() {
      return this.getSelections().sort(function(a, b) {
        return a.compare(b);
      });
    };

    Editor.prototype.getLastSelectionInBuffer = function() {
      return _.last(this.getSelectionsOrderedByBufferPosition());
    };

    Editor.prototype.selectionIntersectsBufferRange = function(bufferRange) {
      return _.any(this.getSelections(), function(selection) {
        return selection.intersectsBufferRange(bufferRange);
      });
    };

    Editor.prototype.setCursorScreenPosition = function(position, options) {
      return this.moveCursors(function(cursor) {
        return cursor.setScreenPosition(position, options);
      });
    };

    Editor.prototype.getCursorScreenPosition = function() {
      return this.getCursor().getScreenPosition();
    };

    Editor.prototype.getCursorScreenRow = function() {
      return this.getCursor().getScreenRow();
    };

    Editor.prototype.setCursorBufferPosition = function(position, options) {
      return this.moveCursors(function(cursor) {
        return cursor.setBufferPosition(position, options);
      });
    };

    Editor.prototype.getCursorBufferPosition = function() {
      return this.getCursor().getBufferPosition();
    };

    Editor.prototype.getSelectedScreenRange = function() {
      return this.getLastSelection().getScreenRange();
    };

    Editor.prototype.getSelectedBufferRange = function() {
      return this.getLastSelection().getBufferRange();
    };

    Editor.prototype.getSelectedBufferRanges = function() {
      var selection, _i, _len, _ref1, _results;
      _ref1 = this.getSelectionsOrderedByBufferPosition();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        _results.push(selection.getBufferRange());
      }
      return _results;
    };

    Editor.prototype.getSelectedScreenRanges = function() {
      var selection, _i, _len, _ref1, _results;
      _ref1 = this.getSelectionsOrderedByBufferPosition();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        _results.push(selection.getScreenRange());
      }
      return _results;
    };

    Editor.prototype.getSelectedText = function() {
      return this.getLastSelection().getText();
    };

    Editor.prototype.getTextInBufferRange = function(range) {
      return this.buffer.getTextInRange(range);
    };

    Editor.prototype.setTextInBufferRange = function(range, text) {
      return this.getBuffer().setTextInRange(range, text);
    };

    Editor.prototype.getCurrentParagraphBufferRange = function() {
      return this.getCursor().getCurrentParagraphBufferRange();
    };

    Editor.prototype.getWordUnderCursor = function(options) {
      return this.getTextInBufferRange(this.getCursor().getCurrentWordBufferRange(options));
    };

    Editor.prototype.moveCursorUp = function(lineCount) {
      return this.moveCursors(function(cursor) {
        return cursor.moveUp(lineCount, {
          moveToEndOfSelection: true
        });
      });
    };

    Editor.prototype.moveCursorDown = function(lineCount) {
      return this.moveCursors(function(cursor) {
        return cursor.moveDown(lineCount, {
          moveToEndOfSelection: true
        });
      });
    };

    Editor.prototype.moveCursorLeft = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveLeft({
          moveToEndOfSelection: true
        });
      });
    };

    Editor.prototype.moveCursorRight = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveRight({
          moveToEndOfSelection: true
        });
      });
    };

    Editor.prototype.moveCursorToTop = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToTop();
      });
    };

    Editor.prototype.moveCursorToBottom = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToBottom();
      });
    };

    Editor.prototype.moveCursorToBeginningOfScreenLine = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToBeginningOfScreenLine();
      });
    };

    Editor.prototype.moveCursorToBeginningOfLine = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToBeginningOfLine();
      });
    };

    Editor.prototype.moveCursorToFirstCharacterOfLine = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToFirstCharacterOfLine();
      });
    };

    Editor.prototype.moveCursorToEndOfScreenLine = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToEndOfScreenLine();
      });
    };

    Editor.prototype.moveCursorToEndOfLine = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToEndOfLine();
      });
    };

    Editor.prototype.moveCursorToBeginningOfWord = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToBeginningOfWord();
      });
    };

    Editor.prototype.moveCursorToEndOfWord = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToEndOfWord();
      });
    };

    Editor.prototype.moveCursorToBeginningOfNextWord = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToBeginningOfNextWord();
      });
    };

    Editor.prototype.moveCursorToPreviousWordBoundary = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToPreviousWordBoundary();
      });
    };

    Editor.prototype.moveCursorToNextWordBoundary = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToNextWordBoundary();
      });
    };

    Editor.prototype.scrollToCursorPosition = function() {
      return this.getCursor().autoscroll();
    };

    Editor.prototype.pageUp = function() {
      return this.setScrollTop(this.getScrollTop() - this.getHeight());
    };

    Editor.prototype.pageDown = function() {
      return this.setScrollTop(this.getScrollTop() + this.getHeight());
    };

    Editor.prototype.moveCursors = function(fn) {
      this.movingCursors = true;
      return this.batchUpdates((function(_this) {
        return function() {
          var cursor, _i, _len, _ref1;
          _ref1 = _this.getCursors();
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            cursor = _ref1[_i];
            fn(cursor);
          }
          _this.mergeCursors();
          _this.movingCursors = false;
          return _this.emit('cursors-moved');
        };
      })(this));
    };

    Editor.prototype.cursorMoved = function(event) {
      this.emit('cursor-moved', event);
      if (!this.movingCursors) {
        return this.emit('cursors-moved');
      }
    };

    Editor.prototype.selectToScreenPosition = function(position) {
      var lastSelection;
      lastSelection = this.getLastSelection();
      lastSelection.selectToScreenPosition(position);
      return this.mergeIntersectingSelections({
        reversed: lastSelection.isReversed()
      });
    };

    Editor.prototype.selectRight = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectRight();
        };
      })(this));
    };

    Editor.prototype.selectLeft = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectLeft();
        };
      })(this));
    };

    Editor.prototype.selectUp = function(rowCount) {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectUp(rowCount);
        };
      })(this));
    };

    Editor.prototype.selectDown = function(rowCount) {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectDown(rowCount);
        };
      })(this));
    };

    Editor.prototype.selectToTop = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectToTop();
        };
      })(this));
    };

    Editor.prototype.selectAll = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectAll();
        };
      })(this));
    };

    Editor.prototype.selectToBottom = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectToBottom();
        };
      })(this));
    };

    Editor.prototype.selectToBeginningOfLine = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectToBeginningOfLine();
        };
      })(this));
    };

    Editor.prototype.selectToFirstCharacterOfLine = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectToFirstCharacterOfLine();
        };
      })(this));
    };

    Editor.prototype.selectToEndOfLine = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectToEndOfLine();
        };
      })(this));
    };

    Editor.prototype.selectToPreviousWordBoundary = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectToPreviousWordBoundary();
        };
      })(this));
    };

    Editor.prototype.selectToNextWordBoundary = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectToNextWordBoundary();
        };
      })(this));
    };

    Editor.prototype.selectLine = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectLine();
        };
      })(this));
    };

    Editor.prototype.addSelectionBelow = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.addSelectionBelow();
        };
      })(this));
    };

    Editor.prototype.addSelectionAbove = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.addSelectionAbove();
        };
      })(this));
    };

    Editor.prototype.splitSelectionsIntoLines = function() {
      var end, range, row, selection, start, _i, _len, _ref1, _results;
      _ref1 = this.getSelections();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        range = selection.getBufferRange();
        if (range.isSingleLine()) {
          continue;
        }
        selection.destroy();
        start = range.start, end = range.end;
        this.addSelectionForBufferRange([start, [start.row, Infinity]]);
        row = start.row;
        while (++row < end.row) {
          this.addSelectionForBufferRange([[row, 0], [row, Infinity]]);
        }
        _results.push(this.addSelectionForBufferRange([[end.row, 0], [end.row, end.column]]));
      }
      return _results;
    };

    Editor.prototype.transpose = function() {
      return this.mutateSelectedText((function(_this) {
        return function(selection) {
          var text;
          if (selection.isEmpty()) {
            selection.selectRight();
            text = selection.getText();
            selection["delete"]();
            selection.cursor.moveLeft();
            return selection.insertText(text);
          } else {
            return selection.insertText(selection.getText().split('').reverse().join(''));
          }
        };
      })(this));
    };

    Editor.prototype.upperCase = function() {
      return this.replaceSelectedText({
        selectWordIfEmpty: true
      }, (function(_this) {
        return function(text) {
          return text.toUpperCase();
        };
      })(this));
    };

    Editor.prototype.lowerCase = function() {
      return this.replaceSelectedText({
        selectWordIfEmpty: true
      }, (function(_this) {
        return function(text) {
          return text.toLowerCase();
        };
      })(this));
    };

    Editor.prototype.joinLines = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.joinLines();
      });
    };

    Editor.prototype.selectToBeginningOfWord = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectToBeginningOfWord();
        };
      })(this));
    };

    Editor.prototype.selectToEndOfWord = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectToEndOfWord();
        };
      })(this));
    };

    Editor.prototype.selectToBeginningOfNextWord = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectToBeginningOfNextWord();
        };
      })(this));
    };

    Editor.prototype.selectWord = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectWord();
        };
      })(this));
    };

    Editor.prototype.selectMarker = function(marker) {
      var range;
      if (marker.isValid()) {
        range = marker.getBufferRange();
        this.setSelectedBufferRange(range);
        return range;
      }
    };

    Editor.prototype.mergeCursors = function() {
      var cursor, position, positions, _i, _len, _ref1, _results;
      positions = [];
      _ref1 = this.getCursors();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        cursor = _ref1[_i];
        position = cursor.getBufferPosition().toString();
        if (__indexOf.call(positions, position) >= 0) {
          _results.push(cursor.destroy());
        } else {
          _results.push(positions.push(position));
        }
      }
      return _results;
    };

    Editor.prototype.expandSelectionsForward = function(fn) {
      return this.mergeIntersectingSelections((function(_this) {
        return function() {
          var selection, _i, _len, _ref1, _results;
          _ref1 = _this.getSelections();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            selection = _ref1[_i];
            _results.push(fn(selection));
          }
          return _results;
        };
      })(this));
    };

    Editor.prototype.expandSelectionsBackward = function(fn) {
      return this.mergeIntersectingSelections({
        reversed: true
      }, (function(_this) {
        return function() {
          var selection, _i, _len, _ref1, _results;
          _ref1 = _this.getSelections();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            selection = _ref1[_i];
            _results.push(fn(selection));
          }
          return _results;
        };
      })(this));
    };

    Editor.prototype.finalizeSelections = function() {
      var selection, _i, _len, _ref1, _results;
      _ref1 = this.getSelections();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        _results.push(selection.finalize());
      }
      return _results;
    };

    Editor.prototype.mergeIntersectingSelections = function() {
      var args, fn, options, reducer, result, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (_.isFunction(_.last(args))) {
        fn = args.pop();
      }
      options = (_ref1 = args.pop()) != null ? _ref1 : {};
      if (this.suppressSelectionMerging) {
        return typeof fn === "function" ? fn() : void 0;
      }
      if (fn != null) {
        this.suppressSelectionMerging = true;
        result = fn();
        this.suppressSelectionMerging = false;
      }
      reducer = function(disjointSelections, selection) {
        var intersectingSelection;
        intersectingSelection = _.find(disjointSelections, function(s) {
          return s.intersectsWith(selection);
        });
        if (intersectingSelection != null) {
          intersectingSelection.merge(selection, options);
          return disjointSelections;
        } else {
          return disjointSelections.concat([selection]);
        }
      };
      return _.reduce(this.getSelections(), reducer, []);
    };

    Editor.prototype.preserveCursorPositionOnBufferReload = function() {
      var cursorPosition;
      cursorPosition = null;
      this.subscribe(this.buffer, "will-reload", (function(_this) {
        return function() {
          return cursorPosition = _this.getCursorBufferPosition();
        };
      })(this));
      return this.subscribe(this.buffer, "reloaded", (function(_this) {
        return function() {
          if (cursorPosition) {
            _this.setCursorBufferPosition(cursorPosition);
          }
          return cursorPosition = null;
        };
      })(this));
    };

    Editor.prototype.getGrammar = function() {
      return this.displayBuffer.getGrammar();
    };

    Editor.prototype.setGrammar = function(grammar) {
      return this.displayBuffer.setGrammar(grammar);
    };

    Editor.prototype.reloadGrammar = function() {
      return this.displayBuffer.reloadGrammar();
    };

    Editor.prototype.shouldAutoIndent = function() {
      return atom.config.get("editor.autoIndent");
    };

    Editor.prototype.transact = function(fn) {
      return this.batchUpdates((function(_this) {
        return function() {
          return _this.buffer.transact(fn);
        };
      })(this));
    };

    Editor.prototype.beginTransaction = function() {
      return this.buffer.beginTransaction();
    };

    Editor.prototype.commitTransaction = function() {
      return this.buffer.commitTransaction();
    };

    Editor.prototype.abortTransaction = function() {
      return this.buffer.abortTransaction();
    };

    Editor.prototype.batchUpdates = function(fn) {
      var result;
      this.emit('batched-updates-started');
      result = fn();
      this.emit('batched-updates-ended');
      return result;
    };

    Editor.prototype.inspect = function() {
      return "<Editor " + this.id + ">";
    };

    Editor.prototype.logScreenLines = function(start, end) {
      return this.displayBuffer.logLines(start, end);
    };

    Editor.prototype.handleGrammarChange = function() {
      this.unfoldAll();
      return this.emit('grammar-changed');
    };

    Editor.prototype.handleMarkerCreated = function(marker) {
      if (marker.matchesAttributes(this.getSelectionMarkerAttributes())) {
        return this.addSelection(marker);
      }
    };

    Editor.prototype.getSelectionMarkerAttributes = function() {
      return {
        type: 'selection',
        editorId: this.id,
        invalidate: 'never'
      };
    };

    Editor.prototype.getVerticalScrollMargin = function() {
      return this.displayBuffer.getVerticalScrollMargin();
    };

    Editor.prototype.setVerticalScrollMargin = function(verticalScrollMargin) {
      return this.displayBuffer.setVerticalScrollMargin(verticalScrollMargin);
    };

    Editor.prototype.getHorizontalScrollMargin = function() {
      return this.displayBuffer.getHorizontalScrollMargin();
    };

    Editor.prototype.setHorizontalScrollMargin = function(horizontalScrollMargin) {
      return this.displayBuffer.setHorizontalScrollMargin(horizontalScrollMargin);
    };

    Editor.prototype.getLineHeight = function() {
      return this.displayBuffer.getLineHeight();
    };

    Editor.prototype.setLineHeight = function(lineHeight) {
      return this.displayBuffer.setLineHeight(lineHeight);
    };

    Editor.prototype.getScopedCharWidth = function(scopeNames, char) {
      return this.displayBuffer.getScopedCharWidth(scopeNames, char);
    };

    Editor.prototype.setScopedCharWidth = function(scopeNames, char, width) {
      return this.displayBuffer.setScopedCharWidth(scopeNames, char, width);
    };

    Editor.prototype.getScopedCharWidths = function(scopeNames) {
      return this.displayBuffer.getScopedCharWidths(scopeNames);
    };

    Editor.prototype.clearScopedCharWidths = function() {
      return this.displayBuffer.clearScopedCharWidths();
    };

    Editor.prototype.getDefaultCharWidth = function() {
      return this.displayBuffer.getDefaultCharWidth();
    };

    Editor.prototype.setDefaultCharWidth = function(defaultCharWidth) {
      return this.displayBuffer.setDefaultCharWidth(defaultCharWidth);
    };

    Editor.prototype.setHeight = function(height) {
      return this.displayBuffer.setHeight(height);
    };

    Editor.prototype.getHeight = function() {
      return this.displayBuffer.getHeight();
    };

    Editor.prototype.setWidth = function(width) {
      return this.displayBuffer.setWidth(width);
    };

    Editor.prototype.getWidth = function() {
      return this.displayBuffer.getWidth();
    };

    Editor.prototype.getScrollTop = function() {
      return this.displayBuffer.getScrollTop();
    };

    Editor.prototype.setScrollTop = function(scrollTop) {
      return this.displayBuffer.setScrollTop(scrollTop);
    };

    Editor.prototype.getScrollBottom = function() {
      return this.displayBuffer.getScrollBottom();
    };

    Editor.prototype.setScrollBottom = function(scrollBottom) {
      return this.displayBuffer.setScrollBottom(scrollBottom);
    };

    Editor.prototype.getScrollLeft = function() {
      return this.displayBuffer.getScrollLeft();
    };

    Editor.prototype.setScrollLeft = function(scrollLeft) {
      return this.displayBuffer.setScrollLeft(scrollLeft);
    };

    Editor.prototype.getScrollRight = function() {
      return this.displayBuffer.getScrollRight();
    };

    Editor.prototype.setScrollRight = function(scrollRight) {
      return this.displayBuffer.setScrollRight(scrollRight);
    };

    Editor.prototype.getScrollHeight = function() {
      return this.displayBuffer.getScrollHeight();
    };

    Editor.prototype.getScrollWidth = function(scrollWidth) {
      return this.displayBuffer.getScrollWidth(scrollWidth);
    };

    Editor.prototype.getVisibleRowRange = function() {
      return this.displayBuffer.getVisibleRowRange();
    };

    Editor.prototype.intersectsVisibleRowRange = function(startRow, endRow) {
      return this.displayBuffer.intersectsVisibleRowRange(startRow, endRow);
    };

    Editor.prototype.selectionIntersectsVisibleRowRange = function(selection) {
      return this.displayBuffer.selectionIntersectsVisibleRowRange(selection);
    };

    Editor.prototype.pixelPositionForScreenPosition = function(screenPosition) {
      return this.displayBuffer.pixelPositionForScreenPosition(screenPosition);
    };

    Editor.prototype.pixelPositionForBufferPosition = function(bufferPosition) {
      return this.displayBuffer.pixelPositionForBufferPosition(bufferPosition);
    };

    Editor.prototype.screenPositionForPixelPosition = function(pixelPosition) {
      return this.displayBuffer.screenPositionForPixelPosition(pixelPosition);
    };

    Editor.prototype.pixelRectForScreenRange = function(screenRange) {
      return this.displayBuffer.pixelRectForScreenRange(screenRange);
    };

    Editor.prototype.scrollToScreenRange = function(screenRange) {
      return this.displayBuffer.scrollToScreenRange(screenRange);
    };

    Editor.prototype.scrollToScreenPosition = function(screenPosition) {
      return this.displayBuffer.scrollToScreenPosition(screenPosition);
    };

    Editor.prototype.scrollToBufferPosition = function(bufferPosition) {
      return this.displayBuffer.scrollToBufferPosition(bufferPosition);
    };

    Editor.prototype.joinLine = function() {
      deprecate("Use Editor::joinLines() instead");
      return this.joinLines();
    };

    return Editor;

  })(Model);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvc3BlYy9maXh0dXJlcy9sYXJnZS1maWxlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxSkFBQTtJQUFBOzs7O3lKQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxjQUFSLENBRmYsQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FBWSxPQUFBLENBQVEsVUFBUixDQUhaLENBQUE7O0FBQUEsRUFJQyxZQUFhLE9BQUEsQ0FBUSxNQUFSLEVBQWIsU0FKRCxDQUFBOztBQUFBLEVBS0MsUUFBUyxPQUFBLENBQVEsVUFBUixFQUFULEtBTEQsQ0FBQTs7QUFBQSxFQU1BLE9BQWlCLE9BQUEsQ0FBUSxhQUFSLENBQWpCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQU5SLENBQUE7O0FBQUEsRUFPQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBUGYsQ0FBQTs7QUFBQSxFQVFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBUmhCLENBQUE7O0FBQUEsRUFTQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FUVCxDQUFBOztBQUFBLEVBV0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxhQUFSLENBWFosQ0FBQTs7QUFBQSxFQVlBLHFCQUFBLEdBQXdCLE9BQUEsQ0FBUSxZQUFSLENBQXFCLENBQUMsYUFaOUMsQ0FBQTs7QUFBQSxFQXFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNkJBQUEsQ0FBQTs7QUFBQSxJQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLE1BQXpCLENB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

//# sourceURL=/Users/ajenkins/.atom/packages/minimap/spec/fixtures/large-file.coffee

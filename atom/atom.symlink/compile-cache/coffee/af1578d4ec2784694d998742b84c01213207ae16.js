
/*
  lib/simple-drag-drop-text.coffee
 */

(function() {
  var $, SimpleDragDropText, SubAtom;

  $ = require('jquery');

  SubAtom = require('sub-atom');

  SimpleDragDropText = (function() {
    function SimpleDragDropText() {}

    SimpleDragDropText.prototype.config = {
      copyKey: {
        type: 'string',
        "default": 'alt',
        description: 'Select key for copy action',
        "enum": ['alt', 'ctrl', 'meta']
      }
    };

    SimpleDragDropText.prototype.activate = function() {
      this.subs = new SubAtom;
      this.subs.add('body', 'mouseup', (function(_this) {
        return function(e) {
          if (_this.mouseIsDown) {
            return _this.clear(e[atom.config.get('simple-drag-drop-text.copyKey') + 'Key']);
          }
        };
      })(this));
      this.subs.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.setEditor();
        };
      })(this)));
      return this.subs.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(editor) {
          return _this.setEditor();
        };
      })(this)));
    };

    SimpleDragDropText.prototype.setEditor = function() {
      return process.nextTick((function(_this) {
        return function() {
          var _ref;
          if (!(_this.editor = atom.workspace.getActiveTextEditor())) {
            _this.clear();
            return;
          }
          if ((_ref = _this.linesSubs) != null) {
            _ref.dispose();
          }
          _this.lines = atom.views.getView(_this.editor);
          if (_this.lines.shadowRoot) {
            _this.lines = _this.lines.shadowRoot.querySelector('.lines');
          } else {
            _this.lines = _this.lines.querySelector('.lines');
          }
          _this.linesSubs = new SubAtom;
          _this.linesSubs.add(_this.lines, 'mousedown', function(e) {
            return _this.mousedown(e);
          });
          return _this.linesSubs.add(_this.lines, 'mousemove', function(e) {
            if (_this.mouseIsDown && e.which > 0) {
              return _this.drag();
            } else {
              return _this.clear();
            }
          });
        };
      })(this));
    };

    SimpleDragDropText.prototype.mousedown = function(e) {
      var inSelection;
      if (!this.editor) {
        this.clear();
        return;
      }
      this.selMarker = this.editor.getLastSelection().marker;
      this.selBufferRange = this.selMarker.getBufferRange();
      if (this.selBufferRange.isEmpty()) {
        return;
      }
      inSelection = false;
      $(this.lines).find('.highlights .highlight.selection .region').each((function(_this) {
        return function(__, ele) {
          var bottom, left, right, top, _ref, _ref1, _ref2;
          _ref = ele.getBoundingClientRect(), left = _ref.left, top = _ref.top, right = _ref.right, bottom = _ref.bottom;
          if ((left <= (_ref1 = e.pageX) && _ref1 < right) && (top <= (_ref2 = e.pageY) && _ref2 < bottom)) {
            inSelection = true;
            return false;
          }
        };
      })(this));
      if (!inSelection) {
        return;
      }
      this.text = this.editor.getTextInBufferRange(this.selBufferRange);
      this.marker = this.editor.markBufferRange(this.selBufferRange, this.selMarker.getProperties());
      this.editor.decorateMarker(this.marker, {
        type: 'highlight',
        "class": 'selection'
      });
      return this.mouseIsDown = true;
    };

    SimpleDragDropText.prototype.drag = function() {
      var selection;
      this.isDragging = true;
      selection = this.editor.getLastSelection();
      return process.nextTick(function() {
        return selection.clear();
      });
    };

    SimpleDragDropText.prototype.drop = function(altKey) {
      var checkpointBefore, cursorPos;
      checkpointBefore = this.editor.createCheckpoint();
      if (!altKey) {
        this.editor.setTextInBufferRange(this.selBufferRange, '');
      }
      cursorPos = this.editor.getLastSelection().marker.getBufferRange().start;
      this.editor.setTextInBufferRange([cursorPos, cursorPos], this.text);
      return this.editor.groupChangesSinceCheckpoint(checkpointBefore);
    };

    SimpleDragDropText.prototype.clear = function(altKey) {
      var _ref;
      if ((altKey != null) && this.isDragging) {
        this.drop(altKey);
      }
      this.mouseIsDown = this.isDragging = false;
      return (_ref = this.marker) != null ? _ref.destroy() : void 0;
    };

    SimpleDragDropText.prototype.deactivate = function() {
      var _ref;
      this.clear();
      if ((_ref = this.linesSubs) != null) {
        _ref.dispose();
      }
      return this.subs.dispose();
    };

    return SimpleDragDropText;

  })();

  module.exports = new SimpleDragDropText;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL3NpbXBsZS1kcmFnLWRyb3AtdGV4dC9saWIvc2ltcGxlLWRyYWctZHJvcC10ZXh0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUE7O0dBQUE7QUFBQTtBQUFBO0FBQUEsTUFBQSw4QkFBQTs7QUFBQSxFQUlBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUpKLENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVIsQ0FMVixDQUFBOztBQUFBLEVBT007b0NBQ0o7O0FBQUEsaUNBQUEsTUFBQSxHQUNFO0FBQUEsTUFBQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDRCQUZiO0FBQUEsUUFHQSxNQUFBLEVBQU0sQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixNQUFoQixDQUhOO09BREY7S0FERixDQUFBOztBQUFBLGlDQU9BLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsR0FBQSxDQUFBLE9BQVIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsTUFBVixFQUFrQixTQUFsQixFQUE2QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7QUFBTyxVQUFBLElBQUcsS0FBQyxDQUFBLFdBQUo7bUJBQXFCLEtBQUMsQ0FBQSxLQUFELENBQU8sQ0FBRSxDQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwrQkFBaEIsQ0FBQSxHQUFpRCxLQUFqRCxDQUFULEVBQXJCO1dBQVA7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QixD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

//# sourceURL=/Users/ajenkins/.atom/packages/simple-drag-drop-text/lib/simple-drag-drop-text.coffee

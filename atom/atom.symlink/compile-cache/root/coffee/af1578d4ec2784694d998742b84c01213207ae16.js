
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvc2ltcGxlLWRyYWctZHJvcC10ZXh0L2xpYi9zaW1wbGUtZHJhZy1kcm9wLXRleHQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxNQUFBLDhCQUFBOztBQUFBLEVBSUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBSkosQ0FBQTs7QUFBQSxFQUtBLE9BQUEsR0FBVSxPQUFBLENBQVEsVUFBUixDQUxWLENBQUE7O0FBQUEsRUFPTTtvQ0FDSjs7QUFBQSxpQ0FBQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLE9BQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsNEJBRmI7QUFBQSxRQUdBLE1BQUEsRUFBTSxDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLE1BQWhCLENBSE47T0FERjtLQURGLENBQUE7O0FBQUEsaUNBT0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxHQUFBLENBQUEsT0FBUixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsSUFBSSxDQUFDLEdBQU4sQ0FBVSxNQUFWLEVBQWtCLFNBQWxCLEVBQTZCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtBQUFPLFVBQUEsSUFBRyxLQUFDLENBQUEsV0FBSjttQkFBcUIsS0FBQyxDQUFBLEtBQUQsQ0FBTyxDQUFFLENBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLCtCQUFoQixDQUFBLEdBQWlELEtBQWpELENBQVQsRUFBckI7V0FBUDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdCLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7aUJBQVksS0FBQyxDQUFBLFNBQUQsQ0FBQSxFQUFaO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekMsQ0FBVixDQUhBLENBQUE7YUFJQSxJQUFDLENBQUEsSUFBSSxDQUFDLEdBQU4sQ0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtpQkFBWSxLQUFDLENBQUEsU0FBRCxDQUFBLEVBQVo7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QyxDQUFWLEVBTFE7SUFBQSxDQVBWLENBQUE7O0FBQUEsaUNBY0EsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUNULE9BQU8sQ0FBQyxRQUFSLENBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDZixjQUFBLElBQUE7QUFBQSxVQUFBLElBQUcsQ0FBQSxDQUFLLEtBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVgsQ0FBUDtBQUNFLFlBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBQSxDQUFBLENBQUE7QUFDQSxrQkFBQSxDQUZGO1dBQUE7O2dCQUlVLENBQUUsT0FBWixDQUFBO1dBSkE7QUFBQSxVQUtBLEtBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLEtBQUMsQ0FBQSxNQUFwQixDQUxULENBQUE7QUFNQSxVQUFBLElBQUcsS0FBQyxDQUFBLEtBQUssQ0FBQyxVQUFWO0FBQ0UsWUFBQSxLQUFDLENBQUEsS0FBRCxHQUFTLEtBQUMsQ0FBQSxLQUFLLENBQUMsVUFBVSxDQUFDLGFBQWxCLENBQWdDLFFBQWhDLENBQVQsQ0FERjtXQUFBLE1BQUE7QUFHRSxZQUFBLEtBQUMsQ0FBQSxLQUFELEdBQVMsS0FBQyxDQUFBLEtBQUssQ0FBQyxhQUFQLENBQXFCLFFBQXJCLENBQVQsQ0FIRjtXQU5BO0FBQUEsVUFVQSxLQUFDLENBQUEsU0FBRCxHQUFhLEdBQUEsQ0FBQSxPQVZiLENBQUE7QUFBQSxVQVdBLEtBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLEtBQUMsQ0FBQSxLQUFoQixFQUF1QixXQUF2QixFQUFvQyxTQUFDLENBQUQsR0FBQTttQkFBTyxLQUFDLENBQUEsU0FBRCxDQUFXLENBQVgsRUFBUDtVQUFBLENBQXBDLENBWEEsQ0FBQTtpQkFZQSxLQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxLQUFDLENBQUEsS0FBaEIsRUFBdUIsV0FBdkIsRUFBb0MsU0FBQyxDQUFELEdBQUE7QUFDbEMsWUFBQSxJQUFHLEtBQUMsQ0FBQSxXQUFELElBQWlCLENBQUMsQ0FBQyxLQUFGLEdBQVUsQ0FBOUI7cUJBQXFDLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFBckM7YUFBQSxNQUFBO3FCQUFrRCxLQUFDLENBQUEsS0FBRCxDQUFBLEVBQWxEO2FBRGtDO1VBQUEsQ0FBcEMsRUFiZTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpCLEVBRFM7SUFBQSxDQWRYLENBQUE7O0FBQUEsaUNBK0JBLFNBQUEsR0FBVyxTQUFDLENBQUQsR0FBQTtBQUNULFVBQUEsV0FBQTtBQUFBLE1BQUEsSUFBRyxDQUFBLElBQUssQ0FBQSxNQUFSO0FBQW9CLFFBQUEsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFBLENBQUE7QUFBVSxjQUFBLENBQTlCO09BQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBUixDQUFBLENBQTBCLENBQUMsTUFGeEMsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFBQyxDQUFBLFNBQVMsQ0FBQyxjQUFYLENBQUEsQ0FIbEIsQ0FBQTtBQUlBLE1BQUEsSUFBRyxJQUFDLENBQUEsY0FBYyxDQUFDLE9BQWhCLENBQUEsQ0FBSDtBQUFrQyxjQUFBLENBQWxDO09BSkE7QUFBQSxNQU1BLFdBQUEsR0FBYyxLQU5kLENBQUE7QUFBQSxNQU9BLENBQUEsQ0FBRSxJQUFDLENBQUEsS0FBSCxDQUFTLENBQUMsSUFBVixDQUFlLDBDQUFmLENBQTBELENBQUMsSUFBM0QsQ0FBZ0UsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsRUFBRCxFQUFLLEdBQUwsR0FBQTtBQUM5RCxjQUFBLDRDQUFBO0FBQUEsVUFBQSxPQUE2QixHQUFHLENBQUMscUJBQUosQ0FBQSxDQUE3QixFQUFDLFlBQUEsSUFBRCxFQUFPLFdBQUEsR0FBUCxFQUFZLGFBQUEsS0FBWixFQUFtQixjQUFBLE1BQW5CLENBQUE7QUFDQSxVQUFBLElBQUcsQ0FBQSxJQUFBLGFBQVEsQ0FBQyxDQUFDLE1BQVYsU0FBQSxHQUFrQixLQUFsQixDQUFBLElBQ0MsQ0FBQSxHQUFBLGFBQU8sQ0FBQyxDQUFDLE1BQVQsU0FBQSxHQUFpQixNQUFqQixDQURKO0FBRUUsWUFBQSxXQUFBLEdBQWMsSUFBZCxDQUFBO0FBQ0EsbUJBQU8sS0FBUCxDQUhGO1dBRjhEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEUsQ0FQQSxDQUFBO0FBYUEsTUFBQSxJQUFHLENBQUEsV0FBSDtBQUF3QixjQUFBLENBQXhCO09BYkE7QUFBQSxNQWVBLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixJQUFDLENBQUEsY0FBOUIsQ0FmUixDQUFBO0FBQUEsTUFnQkEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLGVBQVIsQ0FBd0IsSUFBQyxDQUFBLGNBQXpCLEVBQXlDLElBQUMsQ0FBQSxTQUFTLENBQUMsYUFBWCxDQUFBLENBQXpDLENBaEJWLENBQUE7QUFBQSxNQWlCQSxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBdUIsSUFBQyxDQUFBLE1BQXhCLEVBQWdDO0FBQUEsUUFBQSxJQUFBLEVBQU0sV0FBTjtBQUFBLFFBQW1CLE9BQUEsRUFBTyxXQUExQjtPQUFoQyxDQWpCQSxDQUFBO2FBbUJBLElBQUMsQ0FBQSxXQUFELEdBQWUsS0FwQk47SUFBQSxDQS9CWCxDQUFBOztBQUFBLGlDQXFEQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osVUFBQSxTQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQWQsQ0FBQTtBQUFBLE1BQ0EsU0FBQSxHQUFZLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBQSxDQURaLENBQUE7YUFFQSxPQUFPLENBQUMsUUFBUixDQUFpQixTQUFBLEdBQUE7ZUFBRyxTQUFTLENBQUMsS0FBVixDQUFBLEVBQUg7TUFBQSxDQUFqQixFQUhJO0lBQUEsQ0FyRE4sQ0FBQTs7QUFBQSxpQ0EwREEsSUFBQSxHQUFNLFNBQUMsTUFBRCxHQUFBO0FBQ0osVUFBQSwyQkFBQTtBQUFBLE1BQUEsZ0JBQUEsR0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBUixDQUFBLENBQW5CLENBQUE7QUFDQSxNQUFBLElBQUcsQ0FBQSxNQUFIO0FBQW1CLFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixJQUFDLENBQUEsY0FBOUIsRUFBOEMsRUFBOUMsQ0FBQSxDQUFuQjtPQURBO0FBQUEsTUFFQSxTQUFBLEdBQVksSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBUixDQUFBLENBQTBCLENBQUMsTUFBTSxDQUFDLGNBQWxDLENBQUEsQ0FBa0QsQ0FBQyxLQUYvRCxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLENBQUMsU0FBRCxFQUFZLFNBQVosQ0FBN0IsRUFBcUQsSUFBQyxDQUFBLElBQXRELENBSEEsQ0FBQTthQUlBLElBQUMsQ0FBQSxNQUFNLENBQUMsMkJBQVIsQ0FBb0MsZ0JBQXBDLEVBTEk7SUFBQSxDQTFETixDQUFBOztBQUFBLGlDQWlFQSxLQUFBLEdBQU8sU0FBQyxNQUFELEdBQUE7QUFDTCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUcsZ0JBQUEsSUFBWSxJQUFDLENBQUEsVUFBaEI7QUFBZ0MsUUFBQSxJQUFDLENBQUEsSUFBRCxDQUFNLE1BQU4sQ0FBQSxDQUFoQztPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxVQUFELEdBQWMsS0FEN0IsQ0FBQTtnREFFTyxDQUFFLE9BQVQsQ0FBQSxXQUhLO0lBQUEsQ0FqRVAsQ0FBQTs7QUFBQSxpQ0FzRUEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFBLENBQUE7O1lBQ1UsQ0FBRSxPQUFaLENBQUE7T0FEQTthQUVBLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBLEVBSFU7SUFBQSxDQXRFWixDQUFBOzs4QkFBQTs7TUFSRixDQUFBOztBQUFBLEVBbUZBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEdBQUEsQ0FBQSxrQkFuRmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/simple-drag-drop-text/lib/simple-drag-drop-text.coffee

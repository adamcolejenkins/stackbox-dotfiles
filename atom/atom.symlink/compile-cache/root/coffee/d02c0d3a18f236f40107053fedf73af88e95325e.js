(function() {
  var CompositeDisposable, HighlightLineView, Point, lines,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('atom').CompositeDisposable;

  Point = require('atom').Point;

  lines = [];

  module.exports = HighlightLineView = (function() {
    function HighlightLineView() {
      this.observeSettings = __bind(this.observeSettings, this);
      this.createDecoration = __bind(this.createDecoration, this);
      this.handleMultiLine = __bind(this.handleMultiLine, this);
      this.handleSingleLine = __bind(this.handleSingleLine, this);
      this.showHighlight = __bind(this.showHighlight, this);
      this.updateSelectedLine = __bind(this.updateSelectedLine, this);
      this.destroy = __bind(this.destroy, this);
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(activeEditor) {
          activeEditor.onDidAddSelection(_this.updateSelectedLine);
          return activeEditor.onDidChangeSelectionRange(_this.updateSelectedLine);
        };
      })(this)));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(this.updateSelectedLine));
      this.markers = [];
      this.observeSettings();
      this.updateSelectedLine();
    }

    HighlightLineView.prototype.getEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    HighlightLineView.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    HighlightLineView.prototype.updateSelectedLine = function() {
      this.resetBackground();
      return this.showHighlight();
    };

    HighlightLineView.prototype.resetBackground = function() {
      var decoration, _i, _len, _ref;
      _ref = this.markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        decoration = _ref[_i];
        decoration.destroy();
        decoration = null;
      }
      return this.markers = [];
    };

    HighlightLineView.prototype.showHighlight = function() {
      if (!this.getEditor()) {
        return;
      }
      this.handleMultiLine();
      return this.handleSingleLine();
    };

    HighlightLineView.prototype.handleSingleLine = function() {
      var selection, selectionRange, style, _i, _len, _ref, _results;
      _ref = this.getEditor().getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        if (selection.isSingleScreenLine()) {
          selectionRange = selection.getBufferRange();
          if (!(selection.getText() !== '' && atom.config.get("highlight-line.hideHighlightOnSelect"))) {
            if (atom.config.get('highlight-line.enableBackgroundColor')) {
              this.createDecoration(selectionRange);
            }
          }
          if (atom.config.get('highlight-line.enableUnderline')) {
            style = atom.config.get("highlight-line.underline");
            _results.push(this.createDecoration(selectionRange, "-multi-line-" + style + "-bottom"));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    HighlightLineView.prototype.handleMultiLine = function() {
      var bottomLine, selection, selectionRange, selections, style, topLine, _i, _len, _results;
      if (!atom.config.get('highlight-line.enableSelectionBorder')) {
        return;
      }
      selections = this.getEditor().getSelections();
      _results = [];
      for (_i = 0, _len = selections.length; _i < _len; _i++) {
        selection = selections[_i];
        if (!selection.isSingleScreenLine()) {
          selectionRange = selection.getBufferRange().copy();
          topLine = selectionRange;
          bottomLine = selectionRange.copy();
          topLine.end = topLine.start;
          bottomLine.start = new Point(bottomLine.end.row - 1, bottomLine.end.column);
          style = atom.config.get("highlight-line.underline");
          this.createDecoration(topLine, "-multi-line-" + style + "-top");
          _results.push(this.createDecoration(bottomLine, "-multi-line-" + style + "-bottom"));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    HighlightLineView.prototype.createDecoration = function(range, klassToAdd) {
      var decoration, klass, marker;
      if (klassToAdd == null) {
        klassToAdd = '';
      }
      klass = 'highlight-line';
      klass += klassToAdd;
      marker = this.getEditor().markBufferRange(range);
      decoration = this.getEditor().decorateMarker(marker, {
        type: 'line',
        "class": klass
      });
      return this.markers.push(marker);
    };

    HighlightLineView.prototype.observeSettings = function() {
      this.subscriptions.add(atom.config.onDidChange("highlight-line.enableBackgroundColor", this.updateSelectedLine));
      this.subscriptions.add(atom.config.onDidChange("highlight-line.hideHighlightOnSelect", this.updateSelectedLine));
      this.subscriptions.add(atom.config.onDidChange("highlight-line.enableUnderline", this.updateSelectedLine));
      return this.subscriptions.add(atom.config.onDidChange("highlight-line.enableSelectionBorder", this.updateSelectedLine));
    };

    return HighlightLineView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvaGlnaGxpZ2h0LWxpbmUvbGliL2hpZ2hsaWdodC1saW5lLW1vZGVsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvREFBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FERCxDQUFBOztBQUFBLEVBR0EsS0FBQSxHQUFRLEVBSFIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFUyxJQUFBLDJCQUFBLEdBQUE7QUFDWCwrREFBQSxDQUFBO0FBQUEsaUVBQUEsQ0FBQTtBQUFBLCtEQUFBLENBQUE7QUFBQSxpRUFBQSxDQUFBO0FBQUEsMkRBQUEsQ0FBQTtBQUFBLHFFQUFBLENBQUE7QUFBQSwrQ0FBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLFlBQUQsR0FBQTtBQUNuRCxVQUFBLFlBQVksQ0FBQyxpQkFBYixDQUErQixLQUFDLENBQUEsa0JBQWhDLENBQUEsQ0FBQTtpQkFDQSxZQUFZLENBQUMseUJBQWIsQ0FBdUMsS0FBQyxDQUFBLGtCQUF4QyxFQUZtRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQW5CLENBRkEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQ0Us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

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/highlight-line/lib/highlight-line-model.coffee

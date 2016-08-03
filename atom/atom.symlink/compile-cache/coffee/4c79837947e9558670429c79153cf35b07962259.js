(function() {
  var BufferView, FuzzyFinderView, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  FuzzyFinderView = require('./fuzzy-finder-view');

  module.exports = BufferView = (function(_super) {
    __extends(BufferView, _super);

    function BufferView() {
      return BufferView.__super__.constructor.apply(this, arguments);
    }

    BufferView.prototype.toggle = function() {
      var _ref, _ref1;
      if ((_ref = this.panel) != null ? _ref.isVisible() : void 0) {
        return this.cancel();
      } else {
        this.populate();
        if (((_ref1 = this.paths) != null ? _ref1.length : void 0) > 0) {
          return this.show();
        }
      }
    };

    BufferView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No open editors';
      } else {
        return BufferView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    BufferView.prototype.populate = function() {
      var activeEditor, editors;
      editors = atom.workspace.getTextEditors().filter(function(editor) {
        return editor.getPath() != null;
      });
      activeEditor = atom.workspace.getActiveTextEditor();
      editors = _.sortBy(editors, function(editor) {
        if (editor === activeEditor) {
          return 0;
        } else {
          return -(editor.lastOpened || 1);
        }
      });
      this.paths = editors.map(function(editor) {
        return editor.getPath();
      });
      return this.setItems(_.uniq(this.paths));
    };

    return BufferView;

  })(FuzzyFinderView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9saWIvYnVmZmVyLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBRGxCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLFdBQUE7QUFBQSxNQUFBLHNDQUFTLENBQUUsU0FBUixDQUFBLFVBQUg7ZUFDRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFDLENBQUEsUUFBRCxDQUFBLENBQUEsQ0FBQTtBQUNBLFFBQUEseUNBQWlCLENBQUUsZ0JBQVIsR0FBaUIsQ0FBNUI7aUJBQUEsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQUFBO1NBSkY7T0FETTtJQUFBLENBQVIsQ0FBQTs7QUFBQSx5QkFPQSxlQUFBLEdBQWlCLFNBQUMsU0FBRCxHQUFBO0FBQ2YsTUFBQSxJQUFHLFNBQUEsS0FBYSxDQUFoQjtlQUNFLGtCQURGO09BQUEsTUFBQTtlQUdFLGlEQUFBLFNBQUEsRUFIRjtPQURlO0lBQUEsQ0FQakIsQ0FBQTs7QUFBQSx5QkFhQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSxxQkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBZixDQUFBLENBQStCLENBQUMsTUFBaEMsQ0FBdUMsU0FBQyxNQUFELEdBQUE7ZUFBWSx5QkFBWjtNQUFBLENBQXZDLENBQVYsQ0FBQTtBQUFBLE1BQ0EsWUFBQSxHQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURmLENBQUE7QUFBQSxNQUVBLE9BQUEsR0FBVSxDQUFDLENBQUMsTUFBRixDQUFTLE9BQVQsRUFBa0IsU0FBQyxNQUFELEdBQUE7QUFDMUIsUUFBQSxJQUFHLE1BQUEsS0FBVSxZQUFiO2lCQUNFLEVBREY7U0FBQSxNQUFBO2lCQUdFLENBQUEsQ0FBRSxNQUFNLENBQUMsVUFBUCxJQUFxQixDQUF0QixFQUhIO1NBRDBCO01BQUEsQ0FBbEIsQ0FGVixDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsS0FBRCxHQUFTLE9BQU8sQ0FBQyxHQUFSLENBQVksU0FBQyxNQUFELEdBQUE7ZUFBWSxNQUFNLENBQUMsT0FBUCxDQUFBLEVBQVo7TUFBQSxDQUFaLENBUlQsQ0FBQTthQVNBLElBQUMsQ0FBQSxRQUFELENBQVUsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsS0FBUixDQUFWLEVBVlE7SUFBQSxDQWJWLENBQUE7O3NCQUFBOztLQUR1QixnQkFKekIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.atom/packages/fuzzy-finder/lib/buffer-view.coffee

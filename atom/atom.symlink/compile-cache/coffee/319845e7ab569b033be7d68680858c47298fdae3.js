(function() {
  var CompositeDisposable, TabNumbersView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = TabNumbersView = (function(_super) {
    __extends(TabNumbersView, _super);

    function TabNumbersView() {
      this.update = __bind(this.update, this);
      return TabNumbersView.__super__.constructor.apply(this, arguments);
    }

    TabNumbersView.prototype.nTodos = 0;

    TabNumbersView.content = function() {
      return this.div({
        "class": 'todo-status-bar-indicator inline-block',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.a({
            "class": 'inline-block'
          }, function() {
            _this.span({
              "class": 'icon icon-checklist'
            });
            return _this.span({
              outlet: 'todoCount'
            });
          });
        };
      })(this));
    };

    TabNumbersView.prototype.initialize = function(collection) {
      this.collection = collection;
      this.disposables = new CompositeDisposable;
      this.on('click', this.element, this.activateTodoPackage);
      this.update();
      return this.disposables.add(this.collection.onDidFinishSearch(this.update));
    };

    TabNumbersView.prototype.destroy = function() {
      this.disposables.dispose();
      return this.detach();
    };

    TabNumbersView.prototype.update = function() {
      var _ref;
      this.nTodos = this.collection.getTodosCount();
      this.todoCount.text(this.nTodos);
      if ((_ref = this.toolTipDisposable) != null) {
        _ref.dispose();
      }
      return this.toolTipDisposable = atom.tooltips.add(this.element, {
        title: "" + this.nTodos + " TODOs"
      });
    };

    TabNumbersView.prototype.activateTodoPackage = function() {
      return atom.commands.dispatch(this, 'todo-show:find-in-workspace');
    };

    return TabNumbersView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLWluZGljYXRvci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5Q0FBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0oscUNBQUEsQ0FBQTs7Ozs7S0FBQTs7QUFBQSw2QkFBQSxNQUFBLEdBQVEsQ0FBUixDQUFBOztBQUFBLElBRUEsY0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sd0NBQVA7QUFBQSxRQUFpRCxRQUFBLEVBQVUsQ0FBQSxDQUEzRDtPQUFMLEVBQW9FLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2xFLEtBQUMsQ0FBQSxDQUFELENBQUc7QUFBQSxZQUFBLE9BQUEsRUFBTyxjQUFQO1dBQUgsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLFlBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGNBQUEsT0FBQSxFQUFPLHFCQUFQO2FBQU4sQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxjQUFBLE1BQUEsRUFBUSxXQUFSO2FBQU4sRUFGd0I7VUFBQSxDQUExQixFQURrRTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBFLEVBRFE7SUFBQSxDQUZWLENBQUE7O0FBQUEsNkJBUUEsVUFBQSxHQUFZLFNBQUUsVUFBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsYUFBQSxVQUNaLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsR0FBQSxDQUFBLG1CQUFmLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxFQUFELENBQUksT0FBSixFQUFhLElBQUksQ0FBQyxPQUFsQixFQUEyQixJQUFDLENBQUEsbUJBQTVCLENBREEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUhBLENBQUE7YUFJQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxpQkFBWixDQUE4QixJQUFDLENBQUEsTUFBL0IsQ0FBakIsRUFMVTtJQUFBLENBUlosQ0FBQTs7QUFBQSw2QkFlQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBRk87SUFBQSxDQWZULENBQUE7O0FBQUEsNkJBbUJBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLElBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLFVBQVUsQ0FBQyxhQUFaLENBQUEsQ0FBVixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsSUFBQyxDQUFBLE1BQWpCLENBREEsQ0FBQTs7WUFHa0IsQ0FBRSxPQUFwQixDQUFBO09BSEE7YUFJQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxPQUFuQixFQUE0QjtBQUFBLFFBQUEsS0FBQSxFQUFPLEVBQUEsR0FBRyxJQUFDLENBQUEsTUFBSixHQUFXLFFBQWxCO09BQTVCLEVBTGY7SUFBQSxDQW5CUixDQUFBOztBQUFBLDZCQTBCQSxtQkFBQSxHQUFxQixTQUFBLEdBQUE7YUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLElBQXZCLEVBQTZCLDZCQUE3QixFQURtQjtJQUFBLENBMUJyQixDQUFBOzswQkFBQTs7S0FEMkIsS0FKN0IsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/todo-show/lib/todo-indicator-view.coffee

(function() {
  var CompositeDisposable, GitTimeMachine, GitTimeMachineView;

  GitTimeMachineView = require('./git-time-machine-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = GitTimeMachine = {
    gitTimeMachineView: null,
    timelinePanel: null,
    subscriptions: null,
    activate: function(state) {
      this.gitTimeMachineView = new GitTimeMachineView(state.gitTimeMachineViewState);
      this.timelinePanel = atom.workspace.addBottomPanel({
        item: this.gitTimeMachineView.getElement(),
        visible: false
      });
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'git-time-machine:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
      return atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(editor) {
          return _this._onDidChangeActivePaneItem();
        };
      })(this));
    },
    deactivate: function() {
      this.timelinePanel.destroy();
      this.subscriptions.dispose();
      return this.gitTimeMachineView.destroy();
    },
    serialize: function() {
      return {
        gitTimeMachineViewState: this.gitTimeMachineView.serialize()
      };
    },
    toggle: function() {
      if (this.timelinePanel.isVisible()) {
        this.gitTimeMachineView.hide();
        return this.timelinePanel.hide();
      } else {
        this.timelinePanel.show();
        this.gitTimeMachineView.show();
        return this.gitTimeMachineView.setEditor(atom.workspace.getActiveTextEditor());
      }
    },
    _onDidChangeActivePaneItem: function(editor) {
      editor = atom.workspace.getActiveTextEditor();
      if (this.timelinePanel.isVisible()) {
        this.gitTimeMachineView.setEditor(editor);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvZ2l0LXRpbWUtbWFjaGluZS9saWIvZ2l0LXRpbWUtbWFjaGluZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdURBQUE7O0FBQUEsRUFBQSxrQkFBQSxHQUFxQixPQUFBLENBQVEseUJBQVIsQ0FBckIsQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsY0FBQSxHQUNmO0FBQUEsSUFBQSxrQkFBQSxFQUFvQixJQUFwQjtBQUFBLElBQ0EsYUFBQSxFQUFlLElBRGY7QUFBQSxJQUVBLGFBQUEsRUFBZSxJQUZmO0FBQUEsSUFJQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxrQkFBRCxHQUEwQixJQUFBLGtCQUFBLENBQW1CLEtBQUssQ0FBQyx1QkFBekIsQ0FBMUIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQThCO0FBQUEsUUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLGtCQUFrQixDQUFDLFVBQXBCLENBQUEsQ0FBTjtBQUFBLFFBQXdDLE9BQUEsRUFBUyxLQUFqRDtPQUE5QixDQURqQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBSmpCLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO0FBQUEsUUFBQSx5QkFBQSxFQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQjtPQUFwQyxDQUFuQixDQVBBLENBQUE7YUFRQSxJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtpQkFBWSxLQUFDLENBQUEsMEJBQUQsQ0FBQSxFQUFaO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekMsRUFUUTtJQUFBLENBSlY7QUFBQSxJQWdCQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxPQUFwQixDQUFBLEVBSFU7SUFBQSxDQWhCWjtBQUFBLElBc0JBLFNBQUEsRUFBVyxTQUFBLEdBQUE7YUFDVDtBQUFBLFFBQUEsdUJBQUEsRUFBeUIsSUFBQyxDQUFBLGtCQUFrQixDQUFDLFNBQXBCLENBQUEsQ0FBekI7UUFEUztJQUFBLENBdEJYO0FBQUEsSUEwQkEsTUFBQSxFQUFRLFNBQUEsR0FBQTtBQUVOLE1BQUEsSUFBRyxJQUFDLENBQUEsYUFBYSxDQUFDLFNBQWYsQ0FBQSxDQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsa0JBQWtCLENBQUMsSUFBcEIsQ0FBQSxDQUFBLENBQUE7ZUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLElBQWYsQ0FBQSxFQUZGO09BQUEsTUFBQTtBQUlFLFFBQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQUFmLENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsa0JBQWtCLENBQUMsSUFBcEIsQ0FBQSxDQURBLENBQUE7ZUFFQSxJQUFDLENBQUEsa0JBQWtCLENBQUMsU0FBcEIsQ0FBOEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQTlCLEVBTkY7T0FGTTtJQUFBLENBMUJSO0FBQUEsSUFxQ0EsMEJBQUEsRUFBNEIsU0FBQyxNQUFELEdBQUE7QUFDMUIsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUNBLE1BQUEsSUFBRyxJQUFDLENBQUEsYUFBYSxDQUFDLFNBQWYsQ0FBQSxDQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsa0JBQWtCLENBQUMsU0FBcEIsQ0FBOEIsTUFBOUIsQ0FBQSxDQURGO09BRjBCO0lBQUEsQ0FyQzVCO0dBSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/git-time-machine/lib/git-time-machine.coffee

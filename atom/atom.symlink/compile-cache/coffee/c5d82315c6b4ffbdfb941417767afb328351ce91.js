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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2dpdC10aW1lLW1hY2hpbmUvbGliL2dpdC10aW1lLW1hY2hpbmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVEQUFBOztBQUFBLEVBQUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHlCQUFSLENBQXJCLENBQUE7O0FBQUEsRUFDQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBREQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGNBQUEsR0FDZjtBQUFBLElBQUEsa0JBQUEsRUFBb0IsSUFBcEI7QUFBQSxJQUNBLGFBQUEsRUFBZSxJQURmO0FBQUEsSUFFQSxhQUFBLEVBQWUsSUFGZjtBQUFBLElBSUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsa0JBQUQsR0FBMEIsSUFBQSxrQkFBQSxDQUFtQixLQUFLLENBQUMsdUJBQXpCLENBQTFCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBZixDQUE4QjtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxVQUFwQixDQUFBLENBQU47QUFBQSxRQUF3QyxPQUFBLEVBQVMsS0FBakQ7T0FBOUIsQ0FEakIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUpqQixDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztBQUFBLFFBQUEseUJBQUEsRUFBMkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0I7T0FBcEMsQ0FBbkIsQ0FQQSxDQUFBO2FBUUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyx5QkFBZixDQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7aUJBQVksS0FBQyxDQUFBLDBCQUFELENBQUEsRUFBWjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpDLEVBVFE7SUFBQSxDQUpWO0FBQUEsSUFnQkEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsa0JBQWtCLENBQUMsT0FBcEIsQ0FBQSxFQUhVO0lBQUEsQ0FoQlo7QUFBQSxJQXNCQSxTQUFBLEVBQVcsU0FBQSxHQUFBO2FBQ1Q7QUFBQSxRQUFBLHVCQUFBLEVBQXlCLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxTQUFwQixDQUFBLENBQXpCO1FBRFM7SUFBQSxDQXRCWDtBQUFBLElBMEJBLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFFTixNQUFBLElBQUcsSUFBQyxDQUFBLGFBQWEsQ0FBQyxTQUFmLENBQUEsQ0FBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLGtCQUFrQixDQUFDLElBQXBCLENBQUEsQ0FBQSxDQUFBO2VBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQUFmLENBQUEsRUFGRjtPQUFBLE1BQUE7QUFJRSxRQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLGtCQUFrQixDQUFDLElBQXBCLENBQUEsQ0FEQSxDQUFBO2VBRUEsSUFBQyxDQUFBLGtCQUFrQixDQUFDLFNBQXBCLENBQThCLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUE5QixFQU5GO09BRk07SUFBQSxDQTFCUjtBQUFBLElBcUNBLDBCQUFBLEVBQTRCLFNBQUMsTUFBRCxHQUFBO0FBQzFCLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFDQSxNQUFBLElBQUcsSUFBQyxDQUFBLGFBQWEsQ0FBQyxTQUFmLENBQUEsQ0FBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLGtCQUFrQixDQUFDLFNBQXBCLENBQThCLE1BQTlCLENBQUEsQ0FERjtPQUYwQjtJQUFBLENBckM1QjtHQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ajenkins/.atom/packages/git-time-machine/lib/git-time-machine.coffee

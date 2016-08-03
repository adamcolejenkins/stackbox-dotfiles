(function() {
  var GitTimeMachine;

  GitTimeMachine = require('../lib/git-time-machine');

  describe("GitTimeMachine", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('git-time-machine');
    });
    return describe("when the git-time-machine:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.git-time-machine')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'git-time-machine:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var gitTimeMachineElement, gitTimeMachinePanel;
          expect(workspaceElement.querySelector('.git-time-machine')).toExist();
          gitTimeMachineElement = workspaceElement.querySelector('.git-time-machine');
          expect(gitTimeMachineElement).toExist();
          gitTimeMachinePanel = atom.workspace.panelForItem(gitTimeMachineElement);
          expect(gitTimeMachinePanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'git-time-machine:toggle');
          return expect(gitTimeMachinePanel.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.git-time-machine')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'git-time-machine:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var gitTimeMachineElement;
          gitTimeMachineElement = workspaceElement.querySelector('.git-time-machine');
          expect(gitTimeMachineElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'git-time-machine:toggle');
          return expect(gitTimeMachineElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2dpdC10aW1lLW1hY2hpbmUvc3BlYy9naXQtdGltZS1tYWNoaW5lLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx5QkFBUixDQUFqQixDQUFBOztBQUFBLEVBT0EsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtBQUN6QixRQUFBLHlDQUFBO0FBQUEsSUFBQSxPQUF3QyxFQUF4QyxFQUFDLDBCQUFELEVBQW1CLDJCQUFuQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7YUFDQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsa0JBQTlCLEVBRlg7SUFBQSxDQUFYLENBRkEsQ0FBQTtXQU1BLFFBQUEsQ0FBUyxxREFBVCxFQUFnRSxTQUFBLEdBQUE7QUFDOUQsTUFBQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO0FBR3BDLFFBQUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLG1CQUEvQixDQUFQLENBQTJELENBQUMsR0FBRyxDQUFDLE9BQWhFLENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFJQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHlCQUF6QyxDQUpBLENBQUE7QUFBQSxRQU1BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FOQSxDQUFBO2VBU0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEsMENBQUE7QUFBQSxVQUFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixtQkFBL0IsQ0FBUCxDQUEyRCxDQUFDLE9BQTVELENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFFQSxxQkFBQSxHQUF3QixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixtQkFBL0IsQ0FGeEIsQ0FBQTtBQUFBLFVBR0EsTUFBQSxDQUFPLHFCQUFQLENBQTZCLENBQUMsT0FBOUIsQ0FBQSxDQUhBLENBQUE7QUFBQSxVQUtBLG1CQUFBLEdBQXNCLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUE0QixxQkFBNUIsQ0FMdEIsQ0FBQTtBQUFBLFVBTUEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLFNBQXBCLENBQUEsQ0FBUCxDQUF1QyxDQUFDLElBQXhDLENBQTZDLElBQTdDLENBTkEsQ0FBQTtBQUFBLFVBT0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyx5QkFBekMsQ0FQQSxDQUFBO2lCQVFBLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBQyxTQUFwQixDQUFBLENBQVAsQ0FBdUMsQ0FBQyxJQUF4QyxDQUE2QyxLQUE3QyxFQVRHO1FBQUEsQ0FBTCxFQVpvQztNQUFBLENBQXRDLENBQUEsQ0FBQTthQXVCQSxFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQSxHQUFBO0FBTzdCLFFBQUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCLENBQUEsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLG1CQUEvQixDQUFQLENBQTJELENBQUMsR0FBRyxDQUFDLE9BQWhFLENBQUEsQ0FGQSxDQUFBO0FBQUEsUUFNQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHlCQUF6QyxDQU5BLENBQUE7QUFBQSxRQVFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FSQSxDQUFBO2VBV0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUVILGNBQUEscUJBQUE7QUFBQSxVQUFBLHFCQUFBLEdBQXdCLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLG1CQUEvQixDQUF4QixDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8scUJBQVAsQ0FBNkIsQ0FBQyxXQUE5QixDQUFBLENBREEsQ0FBQTtBQUFBLFVBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyx5QkFBekMsQ0FGQSxDQUFBO2lCQUdBLE1BQUEsQ0FBTyxxQkFBUCxDQUE2QixDQUFDLEdBQUcsQ0FBQyxXQUFsQyxDQUFBLEVBTEc7UUFBQSxDQUFMLEVBbEI2QjtNQUFBLENBQS9CLEVBeEI4RDtJQUFBLENBQWhFLEVBUHlCO0VBQUEsQ0FBM0IsQ0FQQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ajenkins/.atom/packages/git-time-machine/spec/git-time-machine-spec.coffee

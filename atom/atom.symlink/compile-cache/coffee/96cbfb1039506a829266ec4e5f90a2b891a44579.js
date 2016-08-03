(function() {
  var $, GitTimeMachineView, Path, View, _ref;

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View;

  Path = require('path');

  GitTimeMachineView = require('../lib/git-time-machine-view');

  describe("GitTimeMachineView", function() {
    return describe("when open", function() {
      var activationPromise, timeMachineElement, workspaceElement, _ref1;
      _ref1 = [], workspaceElement = _ref1[0], activationPromise = _ref1[1], timeMachineElement = _ref1[2];
      beforeEach(function() {
        activationPromise = atom.packages.activatePackage('git-time-machine');
        workspaceElement = atom.views.getView(atom.workspace);
        atom.commands.dispatch(workspaceElement, 'git-time-machine:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return timeMachineElement = workspaceElement.querySelector('.git-time-machine');
        });
      });
      it("should not show timeplot if no file loaded", function() {
        return expect(timeMachineElement.innerHTML).toEqual("");
      });
      return describe("after opening a known file", function() {
        beforeEach(function() {
          var openPromise;
          openPromise = atom.workspace.open("" + __dirname + "/test-data/fiveCommits.txt");
          waitsForPromise(function() {
            return openPromise;
          });
          return runs(function() {
            timeMachineElement = workspaceElement.querySelector('.git-time-machine');
          });
        });
        it("should not be showing placeholder", function() {
          return expect(timeMachineElement.querySelector('.placeholder')).not.toExist();
        });
        it("should be showing timeline", function() {
          return expect(timeMachineElement.querySelector('.timeplot')).toExist();
        });
        return it("total-commits should be five", function() {
          var totalCommits;
          totalCommits = $(timeMachineElement).find('.total-commits').text();
          return expect(totalCommits).toEqual("5");
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2dpdC10aW1lLW1hY2hpbmUvc3BlYy9naXQtdGltZS1tYWNoaW5lLXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsdUNBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0Esa0JBQUEsR0FBcUIsT0FBQSxDQUFRLDhCQUFSLENBSHJCLENBQUE7O0FBQUEsRUFNQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQSxHQUFBO1dBRTdCLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTtBQUNwQixVQUFBLDhEQUFBO0FBQUEsTUFBQSxRQUE0RCxFQUE1RCxFQUFDLDJCQUFELEVBQW1CLDRCQUFuQixFQUFzQyw2QkFBdEMsQ0FBQTtBQUFBLE1BRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGtCQUE5QixDQUFwQixDQUFBO0FBQUEsUUFDQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBRG5CLENBQUE7QUFBQSxRQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMseUJBQXpDLENBRkEsQ0FBQTtBQUFBLFFBR0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2Qsa0JBRGM7UUFBQSxDQUFoQixDQUhBLENBQUE7ZUFLQSxJQUFBLENBQUssU0FBQSxHQUFBO2lCQUNILGtCQUFBLEdBQXFCLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLG1CQUEvQixFQURsQjtRQUFBLENBQUwsRUFOUztNQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsTUFpQkEsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUEsR0FBQTtlQUMvQyxNQUFBLENBQU8sa0JBQWtCLENBQUMsU0FBMUIsQ0FBb0MsQ0FBQyxPQUFyQyxDQUE2QyxFQUE3QyxFQUQrQztNQUFBLENBQWpELENBakJBLENBQUE7YUFvQkEsUUFBQSxDQUFTLDRCQUFULEVBQXVDLFNBQUEsR0FBQTtBQUNyQyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFHVCxjQUFBLFdBQUE7QUFBQSxVQUFBLFdBQUEsR0FBYyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsRUFBQSxHQUFHLFNBQUgsR0FBYSw0QkFBakMsQ0FBZCxDQUFBO0FBQUEsVUFDQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtBQUNkLG1CQUFPLFdBQVAsQ0FEYztVQUFBLENBQWhCLENBREEsQ0FBQTtpQkFHQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsWUFBQSxrQkFBQSxHQUFxQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixtQkFBL0IsQ0FBckIsQ0FERztVQUFBLENBQUwsRUFOUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFVQSxFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQSxHQUFBO2lCQUN0QyxNQUFBLENBQU8sa0JBQWtCLENBQUMsYUFBbkIsQ0FBaUMsY0FBakMsQ0FBUCxDQUF3RCxDQUFDLEdBQUcsQ0FBQyxPQUE3RCxDQUFBLEVBRHNDO1FBQUEsQ0FBeEMsQ0FWQSxDQUFBO0FBQUEsUUFhQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO2lCQUMvQixNQUFBLENBQU8sa0JBQWtCLENBQUMsYUFBbkIsQ0FBaUMsV0FBakMsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQUEsRUFEK0I7UUFBQSxDQUFqQyxDQWJBLENBQUE7ZUFnQkEsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUEsR0FBQTtBQUNqQyxjQUFBLFlBQUE7QUFBQSxVQUFBLFlBQUEsR0FBZSxDQUFBLENBQUUsa0JBQUYsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixnQkFBM0IsQ0FBNEMsQ0FBQyxJQUE3QyxDQUFBLENBQWYsQ0FBQTtpQkFDQSxNQUFBLENBQU8sWUFBUCxDQUFvQixDQUFDLE9BQXJCLENBQTZCLEdBQTdCLEVBRmlDO1FBQUEsQ0FBbkMsRUFqQnFDO01BQUEsQ0FBdkMsRUFyQm9CO0lBQUEsQ0FBdEIsRUFGNkI7RUFBQSxDQUEvQixDQU5BLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ajenkins/.atom/packages/git-time-machine/spec/git-time-machine-view-spec.coffee

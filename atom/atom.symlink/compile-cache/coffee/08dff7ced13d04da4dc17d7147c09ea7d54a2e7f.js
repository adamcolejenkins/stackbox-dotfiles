(function() {
  var GitLog, expectedCommits, fs, path;

  GitLog = require('git-log-utils');

  fs = require('fs');

  path = require('path');

  expectedCommits = require('./test-data/fiveCommitsExpected');

  describe("GitLogUtils", function() {
    return describe("when loading file history for known file in git", function() {
      beforeEach(function() {
        var projectRoot, testFileName;
        this.addMatchers({
          toHaveKnownValues: function(expected) {
            var key, matches, messages, pass, value;
            pass = true;
            messages = "";
            for (key in expected) {
              value = expected[key];
              matches = this.actual[key] === value;
              if (!matches) {
                if (pass) {
                  messages += "Commit " + this.actual.hash + ": ";
                } else {
                  messages += "; ";
                }
                messages += "" + key + " expected: " + value + " actual: " + this.actual[key];
                pass = false;
              }
            }
            if (pass) {
              this.message = function() {
                return "Expected commit " + this.actual.hash + " to not equal " + (JSON.stringify(this.expected));
              };
            } else {
              this.message = function() {
                return messages;
              };
            }
            return pass;
          }
        });
        projectRoot = __dirname;
        testFileName = path.join(projectRoot, 'test-data', 'fiveCommits.txt');
        return this.testdata = GitLog.getCommitHistory(testFileName);
      });
      it("should have 5 commits", function() {
        return expect(this.testdata.length).toEqual(5);
      });
      return it("first 5 commits should match last known good", function() {
        var actualCommit, expectedCommit, index, _i, _len, _results;
        _results = [];
        for (index = _i = 0, _len = expectedCommits.length; _i < _len; index = ++_i) {
          expectedCommit = expectedCommits[index];
          actualCommit = this.testdata[index];
          _results.push(expect(actualCommit).toHaveKnownValues(expectedCommit));
        }
        return _results;
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2dpdC10aW1lLW1hY2hpbmUvc3BlYy9naXQtdXRpbHMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsaUNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxpQ0FBUixDQUpsQixDQUFBOztBQUFBLEVBTUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO1dBQ3RCLFFBQUEsQ0FBUyxpREFBVCxFQUE0RCxTQUFBLEdBQUE7QUFDMUQsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsWUFBQSx5QkFBQTtBQUFBLFFBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYTtBQUFBLFVBQUEsaUJBQUEsRUFBbUIsU0FBQyxRQUFELEdBQUE7QUFDOUIsZ0JBQUEsbUNBQUE7QUFBQSxZQUFBLElBQUEsR0FBTyxJQUFQLENBQUE7QUFBQSxZQUNBLFFBQUEsR0FBVyxFQURYLENBQUE7QUFFQSxpQkFBQSxlQUFBO29DQUFBO0FBQ0UsY0FBQSxPQUFBLEdBQVUsSUFBQyxDQUFBLE1BQU8sQ0FBQSxHQUFBLENBQVIsS0FBZ0IsS0FBMUIsQ0FBQTtBQUNBLGNBQUEsSUFBQSxDQUFBLE9BQUE7QUFDRSxnQkFBQSxJQUFHLElBQUg7QUFDRSxrQkFBQSxRQUFBLElBQWEsU0FBQSxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBakIsR0FBc0IsSUFBbkMsQ0FERjtpQkFBQSxNQUFBO0FBR0Usa0JBQUEsUUFBQSxJQUFZLElBQVosQ0FIRjtpQkFBQTtBQUFBLGdCQUlBLFFBQUEsSUFBWSxFQUFBLEdBQUcsR0FBSCxHQUFPLGFBQVAsR0FBb0IsS0FBcEIsR0FBMEIsV0FBMUIsR0FBcUMsSUFBQyxDQUFBLE1BQU8sQ0FBQSxHQUFBLENBSnpELENBQUE7QUFBQSxnQkFLQSxJQUFBLEdBQU8sS0FMUCxDQURGO2VBRkY7QUFBQSxhQUZBO0FBV0EsWUFBQSxJQUFHLElBQUg7QUFDRSxjQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsU0FBQSxHQUFBO3VCQUFJLGtCQUFBLEdBQWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBMUIsR0FBK0IsZ0JBQS9CLEdBQThDLENBQUMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFDLENBQUEsUUFBaEIsQ0FBRCxFQUFsRDtjQUFBLENBQVgsQ0FERjthQUFBLE1BQUE7QUFHRSxjQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsU0FBQSxHQUFBO3VCQUFHLFNBQUg7Y0FBQSxDQUFYLENBSEY7YUFYQTtBQWVBLG1CQUFPLElBQVAsQ0FoQjhCO1VBQUEsQ0FBbkI7U0FBYixDQUFBLENBQUE7QUFBQSxRQWtCQSxXQUFBLEdBQWMsU0FsQmQsQ0FBQTtBQUFBLFFBbUJBLFlBQUEsR0FBZSxJQUFJLENBQUMsSUFBTCxDQUFVLFdBQVYsRUFBdUIsV0FBdkIsRUFBb0MsaUJBQXBDLENBbkJmLENBQUE7ZUFvQkEsSUFBQyxDQUFBLFFBQUQsR0FBWSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsWUFBeEIsRUFyQkg7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1Bd0JBLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7ZUFDMUIsTUFBQSxDQUFPLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBakIsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQyxDQUFqQyxFQUQwQjtNQUFBLENBQTVCLENBeEJBLENBQUE7YUE0QkEsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUEsR0FBQTtBQUNqRCxZQUFBLHVEQUFBO0FBQUE7YUFBQSxzRUFBQTtrREFBQTtBQUNFLFVBQUEsWUFBQSxHQUFlLElBQUMsQ0FBQSxRQUFTLENBQUEsS0FBQSxDQUF6QixDQUFBO0FBQUEsd0JBQ0EsTUFBQSxDQUFPLFlBQVAsQ0FBb0IsQ0FBQyxpQkFBckIsQ0FBdUMsY0FBdkMsRUFEQSxDQURGO0FBQUE7d0JBRGlEO01BQUEsQ0FBbkQsRUE3QjBEO0lBQUEsQ0FBNUQsRUFEc0I7RUFBQSxDQUF4QixDQU5BLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ajenkins/.atom/packages/git-time-machine/spec/git-utils-spec.coffee

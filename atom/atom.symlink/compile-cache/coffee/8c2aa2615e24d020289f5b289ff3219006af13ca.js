(function() {
  var FuzzyFinderView, GitStatusView, fs, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  fs = require('fs-plus');

  FuzzyFinderView = require('./fuzzy-finder-view');

  module.exports = GitStatusView = (function(_super) {
    __extends(GitStatusView, _super);

    function GitStatusView() {
      return GitStatusView.__super__.constructor.apply(this, arguments);
    }

    GitStatusView.prototype.toggle = function() {
      var _ref;
      if ((_ref = this.panel) != null ? _ref.isVisible() : void 0) {
        return this.cancel();
      } else if (atom.project.getRepositories().some(function(repo) {
        return repo != null;
      })) {
        this.populate();
        return this.show();
      }
    };

    GitStatusView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'Nothing to commit, working directory clean';
      } else {
        return GitStatusView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    GitStatusView.prototype.populate = function() {
      var filePath, paths, repo, workingDirectory, _i, _len, _ref;
      paths = [];
      _ref = atom.project.getRepositories();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        repo = _ref[_i];
        if (!(repo != null)) {
          continue;
        }
        workingDirectory = repo.getWorkingDirectory();
        for (filePath in repo.statuses) {
          filePath = path.join(workingDirectory, filePath);
          if (fs.isFileSync(filePath)) {
            paths.push(filePath);
          }
        }
      }
      return this.setItems(paths);
    };

    return GitStatusView;

  })(FuzzyFinderView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9saWIvZ2l0LXN0YXR1cy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUixDQUZsQixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLG9DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSw0QkFBQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sVUFBQSxJQUFBO0FBQUEsTUFBQSxzQ0FBUyxDQUFFLFNBQVIsQ0FBQSxVQUFIO2VBQ0UsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURGO09BQUEsTUFFSyxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBYixDQUFBLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsU0FBQyxJQUFELEdBQUE7ZUFBVSxhQUFWO01BQUEsQ0FBcEMsQ0FBSDtBQUNILFFBQUEsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFBLENBQUE7ZUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBRkc7T0FIQztJQUFBLENBQVIsQ0FBQTs7QUFBQSw0QkFPQSxlQUFBLEdBQWlCLFNBQUMsU0FBRCxHQUFBO0FBQ2YsTUFBQSxJQUFHLFNBQUEsS0FBYSxDQUFoQjtlQUNFLDZDQURGO09BQUEsTUFBQTtlQUdFLG9EQUFBLFNBQUEsRUFIRjtPQURlO0lBQUEsQ0FQakIsQ0FBQTs7QUFBQSw0QkFhQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSx1REFBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEVBQVIsQ0FBQTtBQUNBO0FBQUEsV0FBQSwyQ0FBQTt3QkFBQTtjQUFnRDs7U0FDOUM7QUFBQSxRQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQW5CLENBQUE7QUFDQSxhQUFBLHlCQUFBLEdBQUE7QUFDRSxVQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLGdCQUFWLEVBQTRCLFFBQTVCLENBQVgsQ0FBQTtBQUNBLFVBQUEsSUFBd0IsRUFBRSxDQUFDLFVBQUgsQ0FBYyxRQUFkLENBQXhCO0FBQUEsWUFBQSxLQUFLLENBQUMsSUFBTixDQUFXLFFBQVgsQ0FBQSxDQUFBO1dBRkY7QUFBQSxTQUZGO0FBQUEsT0FEQTthQU1BLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVixFQVBRO0lBQUEsQ0FiVixDQUFBOzt5QkFBQTs7S0FEMEIsZ0JBTDVCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ajenkins/.atom/packages/fuzzy-finder/lib/git-status-view.coffee
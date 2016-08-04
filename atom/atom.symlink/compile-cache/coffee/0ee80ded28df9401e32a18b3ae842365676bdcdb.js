(function() {
  var path;

  path = require("path");

  module.exports = {
    repositoryForPath: function(filePath) {
      var i, projectPath, _i, _len, _ref;
      _ref = atom.project.getPaths();
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        projectPath = _ref[i];
        if (filePath === projectPath || filePath.startsWith(projectPath + path.sep)) {
          return atom.project.getRepositories()[i];
        }
      }
      return null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9saWIvaGVscGVycy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsSUFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxpQkFBQSxFQUFtQixTQUFDLFFBQUQsR0FBQTtBQUNqQixVQUFBLDhCQUFBO0FBQUE7QUFBQSxXQUFBLG1EQUFBOzhCQUFBO0FBQ0UsUUFBQSxJQUFHLFFBQUEsS0FBWSxXQUFaLElBQTJCLFFBQVEsQ0FBQyxVQUFULENBQW9CLFdBQUEsR0FBYyxJQUFJLENBQUMsR0FBdkMsQ0FBOUI7QUFDRSxpQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWIsQ0FBQSxDQUErQixDQUFBLENBQUEsQ0FBdEMsQ0FERjtTQURGO0FBQUEsT0FBQTtBQUdBLGFBQU8sSUFBUCxDQUppQjtJQUFBLENBQW5CO0dBSEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.atom/packages/fuzzy-finder/lib/helpers.coffee

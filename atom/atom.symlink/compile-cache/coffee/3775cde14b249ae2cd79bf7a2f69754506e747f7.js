(function() {
  var path;

  path = require('path');

  module.exports = {
    config: {},
    activate: function() {
      return require("atom-package-deps").install("linter-coffeelint");
    },
    provideLinter: function() {
      return require('./plus-linter.coffee');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1jb2ZmZWVsaW50L2xpYi9pbml0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxJQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBT0U7QUFBQSxJQUFBLE1BQUEsRUFBUSxFQUFSO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsT0FBQSxDQUFRLG1CQUFSLENBQTRCLENBQUMsT0FBN0IsQ0FBcUMsbUJBQXJDLEVBRFE7SUFBQSxDQUZWO0FBQUEsSUFLQSxhQUFBLEVBQWUsU0FBQSxHQUFBO0FBQ2IsYUFBTyxPQUFBLENBQVEsc0JBQVIsQ0FBUCxDQURhO0lBQUEsQ0FMZjtHQVRGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ajenkins/.atom/packages/linter-coffeelint/lib/init.coffee

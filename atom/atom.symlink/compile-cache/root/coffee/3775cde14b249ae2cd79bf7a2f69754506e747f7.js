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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvbGludGVyLWNvZmZlZWxpbnQvbGliL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FPRTtBQUFBLElBQUEsTUFBQSxFQUFRLEVBQVI7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDUixPQUFBLENBQVEsbUJBQVIsQ0FBNEIsQ0FBQyxPQUE3QixDQUFxQyxtQkFBckMsRUFEUTtJQUFBLENBRlY7QUFBQSxJQUtBLGFBQUEsRUFBZSxTQUFBLEdBQUE7QUFDYixhQUFPLE9BQUEsQ0FBUSxzQkFBUixDQUFQLENBRGE7SUFBQSxDQUxmO0dBVEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/linter-coffeelint/lib/init.coffee

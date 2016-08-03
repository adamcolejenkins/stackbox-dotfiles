(function() {
  var TodoRegex;

  module.exports = TodoRegex = (function() {
    function TodoRegex(regex, todoList) {
      this.regex = regex;
      this.error = false;
      this.regexp = this.createRegexp(this.regex, todoList);
    }

    TodoRegex.prototype.makeRegexObj = function(regexStr) {
      var flags, pattern, _ref, _ref1;
      if (regexStr == null) {
        regexStr = '';
      }
      pattern = (_ref = regexStr.match(/\/(.+)\//)) != null ? _ref[1] : void 0;
      flags = (_ref1 = regexStr.match(/\/(\w+$)/)) != null ? _ref1[1] : void 0;
      if (!pattern) {
        this.error = true;
        return false;
      }
      return new RegExp(pattern, flags);
    };

    TodoRegex.prototype.createRegexp = function(regexStr, todoList) {
      if (!(Object.prototype.toString.call(todoList) === '[object Array]' && todoList.length > 0 && regexStr)) {
        this.error = true;
        return false;
      }
      return this.makeRegexObj(regexStr.replace('${TODOS}', todoList.join('|')));
    };

    return TodoRegex;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLXJlZ2V4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxTQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsbUJBQUUsS0FBRixFQUFTLFFBQVQsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFFBQUEsS0FDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLEtBQVQsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxLQUFmLEVBQXNCLFFBQXRCLENBRFYsQ0FEVztJQUFBLENBQWI7O0FBQUEsd0JBSUEsWUFBQSxHQUFjLFNBQUMsUUFBRCxHQUFBO0FBRVosVUFBQSwyQkFBQTs7UUFGYSxXQUFXO09BRXhCO0FBQUEsTUFBQSxPQUFBLHFEQUFzQyxDQUFBLENBQUEsVUFBdEMsQ0FBQTtBQUFBLE1BRUEsS0FBQSx1REFBb0MsQ0FBQSxDQUFBLFVBRnBDLENBQUE7QUFJQSxNQUFBLElBQUEsQ0FBQSxPQUFBO0FBQ0UsUUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQVQsQ0FBQTtBQUNBLGVBQU8sS0FBUCxDQUZGO09BSkE7YUFPSSxJQUFBLE1BQUEsQ0FBTyxPQUFQLEVBQWdCLEtBQWhCLEVBVFE7SUFBQSxDQUpkLENBQUE7O0FBQUEsd0JBZUEsWUFBQSxHQUFjLFNBQUMsUUFBRCxFQUFXLFFBQVgsR0FBQTtBQUNaLE1BQUEsSUFBQSxDQUFBLENBQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBMUIsQ0FBK0IsUUFBL0IsQ0FBQSxLQUE0QyxnQkFBNUMsSUFDUCxRQUFRLENBQUMsTUFBVCxHQUFrQixDQURYLElBRVAsUUFGQSxDQUFBO0FBR0UsUUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQVQsQ0FBQTtBQUNBLGVBQU8sS0FBUCxDQUpGO09BQUE7YUFLQSxJQUFDLENBQUEsWUFBRCxDQUFjLFFBQVEsQ0FBQyxPQUFULENBQWlCLFVBQWpCLEVBQTZCLFFBQVEsQ0FBQyxJQUFULENBQWMsR0FBZCxDQUE3QixDQUFkLEVBTlk7SUFBQSxDQWZkLENBQUE7O3FCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/todo-show/lib/todo-regex.coffee

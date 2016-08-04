(function() {
  var Core, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Core = require('./core.coffee');

  path = require('path');

  module.exports = new ((function() {
    function _Class() {
      this.lint = __bind(this.lint, this);
    }

    _Class.prototype.name = 'CoffeeLint';

    _Class.prototype.grammarScopes = Core.scopes;

    _Class.prototype.scope = "file";

    _Class.prototype.lintOnFly = true;

    _Class.prototype.lint = function(TextEditor) {
      var TextBuffer, filePath, scopeName, source, transform;
      TextBuffer = TextEditor.getBuffer();
      filePath = TextEditor.getPath();
      if (filePath) {
        source = TextEditor.getText();
        scopeName = TextEditor.getGrammar().scopeName;
        transform = function(_arg) {
          var column, context, endCol, indentLevel, level, lineNumber, message, range, rule, startCol;
          level = _arg.level, message = _arg.message, rule = _arg.rule, lineNumber = _arg.lineNumber, context = _arg.context, column = _arg.column;
          if (context) {
            message = "" + message + ". " + context;
          }
          message = "" + message + ". (" + rule + ")";
          indentLevel = TextEditor.indentationForBufferRow(lineNumber - 1);
          startCol = TextEditor.getTabLength() * indentLevel;
          endCol = TextBuffer.lineLengthForRow(lineNumber - 1);
          range = [[lineNumber - 1, startCol], [lineNumber - 1, endCol]];
          return {
            type: level === 'error' ? 'Error' : 'Warning',
            text: message,
            filePath: filePath,
            range: range
          };
        };
        return Core.lint(filePath, source, scopeName).map(transform);
      }
    };

    return _Class;

  })());

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1jb2ZmZWVsaW50L2xpYi9wbHVzLWxpbnRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsVUFBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUFpQixHQUFBLENBQUE7OztLQUVmOztBQUFBLHFCQUFBLElBQUEsR0FBTSxZQUFOLENBQUE7O0FBQUEscUJBQ0EsYUFBQSxHQUFlLElBQUksQ0FBQyxNQURwQixDQUFBOztBQUFBLHFCQUVBLEtBQUEsR0FBTyxNQUZQLENBQUE7O0FBQUEscUJBR0EsU0FBQSxHQUFXLElBSFgsQ0FBQTs7QUFBQSxxQkFPQSxJQUFBLEdBQU0sU0FBQyxVQUFELEdBQUE7QUFDSixVQUFBLGtEQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsVUFBVSxDQUFDLFNBQVgsQ0FBQSxDQUFiLENBQUE7QUFBQSxNQUVBLFFBQUEsR0FBVyxVQUFVLENBQUMsT0FBWCxDQUFBLENBRlgsQ0FBQTtBQUdBLE1BQUEsSUFBRyxRQUFIO0FBQ0UsUUFBQSxNQUFBLEdBQVMsVUFBVSxDQUFDLE9BQVgsQ0FBQSxDQUFULENBQUE7QUFBQSxRQUVBLFNBQUEsR0FBWSxVQUFVLENBQUMsVUFBWCxDQUFBLENBQXVCLENBQUMsU0FGcEMsQ0FBQTtBQUFBLFFBS0EsU0FBQSxHQUFZLFNBQUMsSUFBRCxHQUFBO0FBQ1YsY0FBQSx1RkFBQTtBQUFBLFVBRFksYUFBQSxPQUFPLGVBQUEsU0FBUyxZQUFBLE1BQU0sa0JBQUEsWUFBWSxlQUFBLFNBQVMsY0FBQSxNQUN2RCxDQUFBO0FBQUEsVUFBQSxJQUFzQyxPQUF0QztBQUFBLFlBQUEsT0FBQSxHQUFVLEVBQUEsR0FBRyxPQUFILEdBQVcsSUFBWCxHQUFlLE9BQXpCLENBQUE7V0FBQTtBQUFBLFVBQ0EsT0FBQSxHQUFVLEVBQUEsR0FBRyxPQUFILEdBQVcsS0FBWCxHQUFnQixJQUFoQixHQUFxQixHQUQvQixDQUFBO0FBQUEsVUFLQSxXQUFBLEdBQWMsVUFBVSxDQUFDLHVCQUFYLENBQW1DLFVBQUEsR0FBYSxDQUFoRCxDQUxkLENBQUE7QUFBQSxVQU9BLFFBQUEsR0FBWSxVQUFVLENBQUMsWUFBWCxDQUFBLENBQUEsR0FBNEIsV0FQeEMsQ0FBQTtBQUFBLFVBUUEsTUFBQSxHQUFTLFVBQVUsQ0FBQyxnQkFBWCxDQUE0QixVQUFBLEdBQWEsQ0FBekMsQ0FSVCxDQUFBO0FBQUEsVUFVQSxLQUFBLEdBQVEsQ0FBQyxDQUFDLFVBQUEsR0FBYSxDQUFkLEVBQWlCLFFBQWpCLENBQUQsRUFBNkIsQ0FBQyxVQUFBLEdBQWEsQ0FBZCxFQUFpQixNQUFqQixDQUE3QixDQVZSLENBQUE7QUFZQSxpQkFBTztBQUFBLFlBQ0wsSUFBQSxFQUFTLEtBQUEsS0FBUyxPQUFaLEdBQXlCLE9BQXpCLEdBQXNDLFNBRHZDO0FBQUEsWUFFTCxJQUFBLEVBQU0sT0FGRDtBQUFBLFlBR0wsUUFBQSxFQUFVLFFBSEw7QUFBQSxZQUlMLEtBQUEsRUFBTyxLQUpGO1dBQVAsQ0FiVTtRQUFBLENBTFosQ0FBQTtBQXlCQSxlQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsUUFBVixFQUFvQixNQUFwQixFQUE0QixTQUE1QixDQUFzQyxDQUFDLEdBQXZDLENBQTJDLFNBQTNDLENBQVAsQ0ExQkY7T0FKSTtJQUFBLENBUE4sQ0FBQTs7a0JBQUE7O09BTEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.atom/packages/linter-coffeelint/lib/plus-linter.coffee

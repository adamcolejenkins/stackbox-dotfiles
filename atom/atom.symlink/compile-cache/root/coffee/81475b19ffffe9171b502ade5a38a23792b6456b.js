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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvbGludGVyLWNvZmZlZWxpbnQvbGliL3BsdXMtbGludGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxVQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEdBQUEsQ0FBQTs7O0tBRWY7O0FBQUEscUJBQUEsSUFBQSxHQUFNLFlBQU4sQ0FBQTs7QUFBQSxxQkFDQSxhQUFBLEdBQWUsSUFBSSxDQUFDLE1BRHBCLENBQUE7O0FBQUEscUJBRUEsS0FBQSxHQUFPLE1BRlAsQ0FBQTs7QUFBQSxxQkFHQSxTQUFBLEdBQVcsSUFIWCxDQUFBOztBQUFBLHFCQU9BLElBQUEsR0FBTSxTQUFDLFVBQUQsR0FBQTtBQUNKLFVBQUEsa0RBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxVQUFVLENBQUMsU0FBWCxDQUFBLENBQWIsQ0FBQTtBQUFBLE1BRUEsUUFBQSxHQUFXLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FGWCxDQUFBO0FBR0EsTUFBQSxJQUFHLFFBQUg7QUFDRSxRQUFBLE1BQUEsR0FBUyxVQUFVLENBQUMsT0FBWCxDQUFBLENBQVQsQ0FBQTtBQUFBLFFBRUEsU0FBQSxHQUFZLFVBQVUsQ0FBQyxVQUFYLENBQUEsQ0FBdUIsQ0FBQyxTQUZwQyxDQUFBO0FBQUEsUUFLQSxTQUFBLEdBQVksU0FBQyxJQUFELEdBQUE7QUFDVixjQUFBLHVGQUFBO0FBQUEsVUFEWSxhQUFBLE9BQU8sZUFBQSxTQUFTLFlBQUEsTUFBTSxrQkFBQSxZQUFZLGVBQUEsU0FBUyxjQUFBLE1BQ3ZELENBQUE7QUFBQSxVQUFBLElBQXNDLE9BQXRDO0FBQUEsWUFBQSxPQUFBLEdBQVUsRUFBQSxHQUFHLE9BQUgsR0FBVyxJQUFYLEdBQWUsT0FBekIsQ0FBQTtXQUFBO0FBQUEsVUFDQSxPQUFBLEdBQVUsRUFBQSxHQUFHLE9BQUgsR0FBVyxLQUFYLEdBQWdCLElBQWhCLEdBQXFCLEdBRC9CLENBQUE7QUFBQSxVQUtBLFdBQUEsR0FBYyxVQUFVLENBQUMsdUJBQVgsQ0FBbUMsVUFBQSxHQUFhLENBQWhELENBTGQsQ0FBQTtBQUFBLFVBT0EsUUFBQSxHQUFZLFVBQVUsQ0FBQyxZQUFYLENBQUEsQ0FBQSxHQUE0QixXQVB4QyxDQUFBO0FBQUEsVUFRQSxNQUFBLEdBQVMsVUFBVSxDQUFDLGdCQUFYLENBQTRCLFVBQUEsR0FBYSxDQUF6QyxDQVJULENBQUE7QUFBQSxVQVVBLEtBQUEsR0FBUSxDQUFDLENBQUMsVUFBQSxHQUFhLENBQWQsRUFBaUIsUUFBakIsQ0FBRCxFQUE2QixDQUFDLFVBQUEsR0FBYSxDQUFkLEVBQWlCLE1BQWpCLENBQTdCLENBVlIsQ0FBQTtBQVlBLGlCQUFPO0FBQUEsWUFDTCxJQUFBLEVBQVMsS0FBQSxLQUFTLE9BQVosR0FBeUIsT0FBekIsR0FBc0MsU0FEdkM7QUFBQSxZQUVMLElBQUEsRUFBTSxPQUZEO0FBQUEsWUFHTCxRQUFBLEVBQVUsUUFITDtBQUFBLFlBSUwsS0FBQSxFQUFPLEtBSkY7V0FBUCxDQWJVO1FBQUEsQ0FMWixDQUFBO0FBeUJBLGVBQU8sSUFBSSxDQUFDLElBQUwsQ0FBVSxRQUFWLEVBQW9CLE1BQXBCLEVBQTRCLFNBQTVCLENBQXNDLENBQUMsR0FBdkMsQ0FBMkMsU0FBM0MsQ0FBUCxDQTFCRjtPQUpJO0lBQUEsQ0FQTixDQUFBOztrQkFBQTs7T0FMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/linter-coffeelint/lib/plus-linter.coffee

(function() {
  "use strict";
  var Beautifier, TypeScriptFormatter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = TypeScriptFormatter = (function(_super) {
    __extends(TypeScriptFormatter, _super);

    function TypeScriptFormatter() {
      return TypeScriptFormatter.__super__.constructor.apply(this, arguments);
    }

    TypeScriptFormatter.prototype.name = "TypeScript Formatter";

    TypeScriptFormatter.prototype.options = {
      TypeScript: true
    };

    TypeScriptFormatter.prototype.beautify = function(text, language, options) {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var e, format, formatterUtils, opts, result;
          try {
            format = require("typescript-formatter/lib/formatter")["default"];
            formatterUtils = require("typescript-formatter/lib/utils");
            opts = formatterUtils.createDefaultFormatCodeOptions();
            opts.TabSize = options.tab_width || options.indent_size;
            opts.IndentSize = options.indent_size;
            opts.IndentStyle = 'space';
            opts.convertTabsToSpaces = true;
            _this.verbose('typescript', text, opts);
            result = format('', text, opts);
            _this.verbose(result);
            return resolve(result);
          } catch (_error) {
            e = _error;
            return reject(e);
          }
        };
      })(this));
    };

    return TypeScriptFormatter;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3R5cGVzY3JpcHQtZm9ybWF0dGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLCtCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsMENBQUEsQ0FBQTs7OztLQUFBOztBQUFBLGtDQUFBLElBQUEsR0FBTSxzQkFBTixDQUFBOztBQUFBLGtDQUNBLE9BQUEsR0FBUztBQUFBLE1BQ1AsVUFBQSxFQUFZLElBREw7S0FEVCxDQUFBOztBQUFBLGtDQUtBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFDUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBRWxCLGNBQUEsdUNBQUE7QUFBQTtBQUNFLFlBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxvQ0FBUixDQUE2QyxDQUFDLFNBQUQsQ0FBdEQsQ0FBQTtBQUFBLFlBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsZ0NBQVIsQ0FEakIsQ0FBQTtBQUFBLFlBSUEsSUFBQSxHQUFPLGNBQWMsQ0FBQyw4QkFBZixDQUFBLENBSlAsQ0FBQTtBQUFBLFlBS0EsSUFBSSxDQUFDLE9BQUwsR0FBZSxPQUFPLENBQUMsU0FBUixJQUFxQixPQUFPLENBQUMsV0FMNUMsQ0FBQTtBQUFBLFlBTUEsSUFBSSxDQUFDLFVBQUwsR0FBa0IsT0FBTyxDQUFDLFdBTjFCLENBQUE7QUFBQSxZQU9BLElBQUksQ0FBQyxXQUFMLEdBQW1CLE9BUG5CLENBQUE7QUFBQSxZQVFBLElBQUksQ0FBQyxtQkFBTCxHQUEyQixJQVIzQixDQUFBO0FBQUEsWUFTQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBdUIsSUFBdkIsRUFBNkIsSUFBN0IsQ0FUQSxDQUFBO0FBQUEsWUFVQSxNQUFBLEdBQVMsTUFBQSxDQUFPLEVBQVAsRUFBVyxJQUFYLEVBQWlCLElBQWpCLENBVlQsQ0FBQTtBQUFBLFlBV0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxNQUFULENBWEEsQ0FBQTttQkFZQSxPQUFBLENBQVEsTUFBUixFQWJGO1dBQUEsY0FBQTtBQWVFLFlBREksVUFDSixDQUFBO0FBQUEsbUJBQU8sTUFBQSxDQUFPLENBQVAsQ0FBUCxDQWZGO1dBRmtCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVCxDQUFYLENBRFE7SUFBQSxDQUxWLENBQUE7OytCQUFBOztLQURpRCxXQUhuRCxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/typescript-formatter.coffee

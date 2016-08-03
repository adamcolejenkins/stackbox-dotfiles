
/*
Requires https://github.com/andialbrecht/sqlparse
 */

(function() {
  "use strict";
  var Beautifier, Sqlformat,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = Sqlformat = (function(_super) {
    __extends(Sqlformat, _super);

    function Sqlformat() {
      return Sqlformat.__super__.constructor.apply(this, arguments);
    }

    Sqlformat.prototype.name = "sqlformat";

    Sqlformat.prototype.options = {
      SQL: true
    };

    Sqlformat.prototype.beautify = function(text, language, options) {
      return this.run("sqlformat", [this.tempFile("input", text), "--reindent", options.indent_size != null ? "--indent_width=" + options.indent_size : void 0, (options.keywords != null) && options.keywords !== 'unchanged' ? "--keywords=" + options.keywords : void 0, (options.identifiers != null) && options.identifiers !== 'unchanged' ? "--identifiers=" + options.identifiers : void 0], {
        help: {
          link: "https://github.com/andialbrecht/sqlparse"
        }
      });
    };

    return Sqlformat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3NxbGZvcm1hdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBSUEsWUFKQSxDQUFBO0FBQUEsTUFBQSxxQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBTGIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLGdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx3QkFBQSxJQUFBLEdBQU0sV0FBTixDQUFBOztBQUFBLHdCQUVBLE9BQUEsR0FBUztBQUFBLE1BQ1AsR0FBQSxFQUFLLElBREU7S0FGVCxDQUFBOztBQUFBLHdCQU1BLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLLFdBQUwsRUFBa0IsQ0FDaEIsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBRGdCLEVBRWhCLFlBRmdCLEVBRzJCLDJCQUEzQyxHQUFDLGlCQUFBLEdBQWlCLE9BQU8sQ0FBQyxXQUExQixHQUFBLE1BSGdCLEVBSXFCLDBCQUFBLElBQXFCLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLFdBQTlFLEdBQUMsYUFBQSxHQUFhLE9BQU8sQ0FBQyxRQUF0QixHQUFBLE1BSmdCLEVBSzJCLDZCQUFBLElBQXdCLE9BQU8sQ0FBQyxXQUFSLEtBQXVCLFdBQTFGLEdBQUMsZ0JBQUEsR0FBZ0IsT0FBTyxDQUFDLFdBQXpCLEdBQUEsTUFMZ0IsQ0FBbEIsRUFNSztBQUFBLFFBQUEsSUFBQSxFQUFNO0FBQUEsVUFDUCxJQUFBLEVBQU0sMENBREM7U0FBTjtPQU5MLEVBRFE7SUFBQSxDQU5WLENBQUE7O3FCQUFBOztLQUR1QyxXQVB6QyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/sqlformat.coffee

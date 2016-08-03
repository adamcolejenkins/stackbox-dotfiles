
/*
Requires https://github.com/hhatto/autopep8
 */

(function() {
  "use strict";
  var Autopep8, Beautifier,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = Autopep8 = (function(_super) {
    __extends(Autopep8, _super);

    function Autopep8() {
      return Autopep8.__super__.constructor.apply(this, arguments);
    }

    Autopep8.prototype.name = "autopep8";

    Autopep8.prototype.options = {
      Python: true
    };

    Autopep8.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.run("autopep8", [tempFile = this.tempFile("input", text), "-i", options.max_line_length != null ? ["--max-line-length", "" + options.max_line_length] : void 0, options.indent_size != null ? ["--indent-size", "" + options.indent_size] : void 0, options.ignore != null ? ["--ignore", "" + (options.ignore.join(','))] : void 0], {
        help: {
          link: "https://github.com/hhatto/autopep8"
        }
      }).then((function(_this) {
        return function() {
          if (options.sort_imports) {
            return _this.run("isort", [tempFile], {
              help: {
                link: "https://github.com/timothycrosley/isort"
              }
            }).then(function() {
              return _this.readFile(tempFile);
            });
          } else {
            return _this.readFile(tempFile);
          }
        };
      })(this));
    };

    return Autopep8;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL2F1dG9wZXA4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7O0dBQUE7QUFBQTtBQUFBO0FBQUEsRUFJQSxZQUpBLENBQUE7QUFBQSxNQUFBLG9CQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FMYixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFFckIsK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHVCQUFBLElBQUEsR0FBTSxVQUFOLENBQUE7O0FBQUEsdUJBRUEsT0FBQSxHQUFTO0FBQUEsTUFDUCxNQUFBLEVBQVEsSUFERDtLQUZULENBQUE7O0FBQUEsdUJBTUEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNSLFVBQUEsUUFBQTthQUFBLElBQUMsQ0FBQSxHQUFELENBQUssVUFBTCxFQUFpQixDQUNmLFFBQUEsR0FBVyxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FESSxFQUVmLElBRmUsRUFHd0MsK0JBQXZELEdBQUEsQ0FBQyxtQkFBRCxFQUFzQixFQUFBLEdBQUcsT0FBTyxDQUFDLGVBQWpDLENBQUEsR0FBQSxNQUhlLEVBSStCLDJCQUE5QyxHQUFBLENBQUMsZUFBRCxFQUFpQixFQUFBLEdBQUcsT0FBTyxDQUFDLFdBQTVCLENBQUEsR0FBQSxNQUplLEVBSytCLHNCQUE5QyxHQUFBLENBQUMsVUFBRCxFQUFZLEVBQUEsR0FBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBZixDQUFvQixHQUFwQixDQUFELENBQWQsQ0FBQSxHQUFBLE1BTGUsQ0FBakIsRUFNSztBQUFBLFFBQUEsSUFBQSxFQUFNO0FBQUEsVUFDUCxJQUFBLEVBQU0sb0NBREM7U0FBTjtPQU5MLENBU0UsQ0FBQyxJQVRILENBU1EsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNKLFVBQUEsSUFBRyxPQUFPLENBQUMsWUFBWDttQkFDRSxLQUFDLENBQUEsR0FBRCxDQUFLLE9BQUwsRUFDRSxDQUFDLFFBQUQsQ0FERixFQUVFO0FBQUEsY0FBQSxJQUFBLEVBQU07QUFBQSxnQkFDSixJQUFBLEVBQU0seUNBREY7ZUFBTjthQUZGLENBS0EsQ0FBQyxJQUxELENBS00sU0FBQSxHQUFBO3FCQUNKLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVixFQURJO1lBQUEsQ0FMTixFQURGO1dBQUEsTUFBQTttQkFVRSxLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVYsRUFWRjtXQURJO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FUUixFQURRO0lBQUEsQ0FOVixDQUFBOztvQkFBQTs7S0FGc0MsV0FQeEMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/autopep8.coffee

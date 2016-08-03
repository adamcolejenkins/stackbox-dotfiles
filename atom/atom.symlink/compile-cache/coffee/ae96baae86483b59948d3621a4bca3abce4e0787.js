
/*
Requires https://www.gnu.org/software/emacs/
 */

(function() {
  "use strict";
  var Beautifier, FortranBeautifier, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('../beautifier');

  path = require("path");

  module.exports = FortranBeautifier = (function(_super) {
    __extends(FortranBeautifier, _super);

    function FortranBeautifier() {
      return FortranBeautifier.__super__.constructor.apply(this, arguments);
    }

    FortranBeautifier.prototype.name = "Fortran Beautifier";

    FortranBeautifier.prototype.options = {
      Fortran: true
    };

    FortranBeautifier.prototype.beautify = function(text, language, options) {
      var args, emacs_path, emacs_script_path, tempFile;
      this.debug('fortran-beautifier', options);
      emacs_path = options.emacs_path;
      emacs_script_path = options.emacs_script_path;
      if (!emacs_script_path) {
        emacs_script_path = path.resolve(__dirname, "emacs-fortran-formating-script.lisp");
      }
      this.debug('fortran-beautifier', 'emacs script path: ' + emacs_script_path);
      args = ['--batch', '-l', emacs_script_path, '-f', 'f90-batch-indent-region', tempFile = this.tempFile("temp", text)];
      if (emacs_path) {
        return this.run(emacs_path, args, {
          ignoreReturnCode: false
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      } else {
        return this.run("emacs", args, {
          ignoreReturnCode: false
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      }
    };

    return FortranBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL2ZvcnRyYW4tYmVhdXRpZmllci9pbmRleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBSUEsWUFKQSxDQUFBO0FBQUEsTUFBQSxtQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBTGIsQ0FBQTs7QUFBQSxFQU1BLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQU5QLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQix3Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsZ0NBQUEsSUFBQSxHQUFNLG9CQUFOLENBQUE7O0FBQUEsZ0NBRUEsT0FBQSxHQUFTO0FBQUEsTUFDUCxPQUFBLEVBQVMsSUFERjtLQUZULENBQUE7O0FBQUEsZ0NBTUEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNSLFVBQUEsNkNBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxLQUFELENBQU8sb0JBQVAsRUFBNkIsT0FBN0IsQ0FBQSxDQUFBO0FBQUEsTUFFQSxVQUFBLEdBQWEsT0FBTyxDQUFDLFVBRnJCLENBQUE7QUFBQSxNQUdBLGlCQUFBLEdBQW9CLE9BQU8sQ0FBQyxpQkFINUIsQ0FBQTtBQUtBLE1BQUEsSUFBRyxDQUFBLGlCQUFIO0FBQ0UsUUFBQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IscUNBQXhCLENBQXBCLENBREY7T0FMQTtBQUFBLE1BUUEsSUFBQyxDQUFBLEtBQUQsQ0FBTyxvQkFBUCxFQUE2QixxQkFBQSxHQUF3QixpQkFBckQsQ0FSQSxDQUFBO0FBQUEsTUFVQSxJQUFBLEdBQU8sQ0FDTCxTQURLLEVBRUwsSUFGSyxFQUdMLGlCQUhLLEVBSUwsSUFKSyxFQUtMLHlCQUxLLEVBTUwsUUFBQSxHQUFXLElBQUMsQ0FBQSxRQUFELENBQVUsTUFBVixFQUFrQixJQUFsQixDQU5OLENBVlAsQ0FBQTtBQW1CQSxNQUFBLElBQUcsVUFBSDtlQUNFLElBQUMsQ0FBQSxHQUFELENBQUssVUFBTCxFQUFpQixJQUFqQixFQUF1QjtBQUFBLFVBQUMsZ0JBQUEsRUFBa0IsS0FBbkI7U0FBdkIsQ0FDRSxDQUFDLElBREgsQ0FDUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVYsRUFESTtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFIsRUFERjtPQUFBLE1BQUE7ZUFNRSxJQUFDLENBQUEsR0FBRCxDQUFLLE9BQUwsRUFBYyxJQUFkLEVBQW9CO0FBQUEsVUFBQyxnQkFBQSxFQUFrQixLQUFuQjtTQUFwQixDQUNFLENBQUMsSUFESCxDQUNRLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUNKLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVixFQURJO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEUixFQU5GO09BcEJRO0lBQUEsQ0FOVixDQUFBOzs2QkFBQTs7S0FEK0MsV0FSakQsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/fortran-beautifier/index.coffee

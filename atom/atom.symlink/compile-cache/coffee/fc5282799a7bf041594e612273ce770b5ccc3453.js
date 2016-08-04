
/*
Requires https://github.com/nrc/rustfmt
 */

(function() {
  "use strict";
  var Beautifier, Rustfmt,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = Rustfmt = (function(_super) {
    __extends(Rustfmt, _super);

    function Rustfmt() {
      return Rustfmt.__super__.constructor.apply(this, arguments);
    }

    Rustfmt.prototype.name = "rustfmt";

    Rustfmt.prototype.options = {
      Rust: true
    };

    Rustfmt.prototype.beautify = function(text, language, options) {
      var editor, file, filePath, program, tmpFile;
      editor = atom.workspace.getActivePaneItem();
      file = editor != null ? editor.buffer.file : void 0;
      filePath = file != null ? file.path : void 0;
      program = options.rustfmt_path || "rustfmt";
      return this.run(program, [tmpFile = this.tempFile("tmp", text), ["--write-mode", "overwrite"], ["--config-path", filePath]], {
        help: {
          link: "https://github.com/nrc/rustfmt",
          program: "rustfmt",
          pathOption: "Rust - Rustfmt Path"
        }
      }).then((function(_this) {
        return function() {
          return _this.readFile(tmpFile);
        };
      })(this));
    };

    return Rustfmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3J1c3RmbXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUlBLFlBSkEsQ0FBQTtBQUFBLE1BQUEsbUJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUxiLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUVyQiw4QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsc0JBQUEsSUFBQSxHQUFNLFNBQU4sQ0FBQTs7QUFBQSxzQkFFQSxPQUFBLEdBQVM7QUFBQSxNQUNQLElBQUEsRUFBTSxJQURDO0tBRlQsQ0FBQTs7QUFBQSxzQkFNQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBTVIsVUFBQSx3Q0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUNBLElBQUEsb0JBQU8sTUFBTSxDQUFFLE1BQU0sQ0FBQyxhQUR0QixDQUFBO0FBQUEsTUFFQSxRQUFBLGtCQUFXLElBQUksQ0FBRSxhQUZqQixDQUFBO0FBQUEsTUFHQSxPQUFBLEdBQVUsT0FBTyxDQUFDLFlBQVIsSUFBd0IsU0FIbEMsQ0FBQTthQUlBLElBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxFQUFjLENBQ1osT0FBQSxHQUFVLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVixFQUFpQixJQUFqQixDQURFLEVBRVosQ0FBQyxjQUFELEVBQWlCLFdBQWpCLENBRlksRUFHWixDQUFDLGVBQUQsRUFBa0IsUUFBbEIsQ0FIWSxDQUFkLEVBSUs7QUFBQSxRQUFBLElBQUEsRUFBTTtBQUFBLFVBQ1AsSUFBQSxFQUFNLGdDQURDO0FBQUEsVUFFUCxPQUFBLEVBQVMsU0FGRjtBQUFBLFVBR1AsVUFBQSxFQUFZLHFCQUhMO1NBQU47T0FKTCxDQVNFLENBQUMsSUFUSCxDQVNRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBREk7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVRSLEVBVlE7SUFBQSxDQU5WLENBQUE7O21CQUFBOztLQUZxQyxXQVB2QyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/rustfmt.coffee

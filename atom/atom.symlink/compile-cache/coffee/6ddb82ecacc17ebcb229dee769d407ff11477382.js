(function() {
  "use strict";
  var Beautifier, Checker, JSCSFixer, checker, cliConfig,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  Checker = null;

  cliConfig = null;

  checker = null;

  module.exports = JSCSFixer = (function(_super) {
    __extends(JSCSFixer, _super);

    function JSCSFixer() {
      return JSCSFixer.__super__.constructor.apply(this, arguments);
    }

    JSCSFixer.prototype.name = "JSCS Fixer";

    JSCSFixer.prototype.options = {
      JavaScript: false
    };

    JSCSFixer.prototype.beautify = function(text, language, options) {
      this.verbose("JSCS Fixer language " + language);
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var config, editor, err, path, result;
          try {
            if (checker == null) {
              cliConfig = require('jscs/lib/cli-config');
              Checker = require('jscs');
              checker = new Checker();
              checker.registerDefaultRules();
            }
            editor = atom.workspace.getActiveTextEditor();
            path = editor != null ? editor.getPath() : void 0;
            config = path != null ? cliConfig.load(void 0, atom.project.relativizePath(path)[0]) : void 0;
            if (config == null) {
              throw new Error("No JSCS config found.");
            }
            checker.configure(config);
            result = checker.fixString(text, path);
            if (result.errors.getErrorCount() > 0) {
              _this.error(result.errors.getErrorList().reduce(function(res, err) {
                return "" + res + "<br> Line " + err.line + ": " + err.message;
              }, "JSCS Fixer error:"));
            }
            return resolve(result.output);
          } catch (_error) {
            err = _error;
            _this.error("JSCS Fixer error: " + err);
            return reject(err);
          }
        };
      })(this));
    };

    return JSCSFixer;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL2pzY3MuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEsa0RBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsSUFIVixDQUFBOztBQUFBLEVBSUEsU0FBQSxHQUFZLElBSlosQ0FBQTs7QUFBQSxFQUtBLE9BQUEsR0FBVSxJQUxWLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixnQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsd0JBQUEsSUFBQSxHQUFNLFlBQU4sQ0FBQTs7QUFBQSx3QkFFQSxPQUFBLEdBQVM7QUFBQSxNQUNQLFVBQUEsRUFBWSxLQURMO0tBRlQsQ0FBQTs7QUFBQSx3QkFNQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsT0FBRCxDQUFVLHNCQUFBLEdBQXNCLFFBQWhDLENBQUEsQ0FBQTtBQUNBLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDbEIsY0FBQSxpQ0FBQTtBQUFBO0FBQ0UsWUFBQSxJQUFJLGVBQUo7QUFDRSxjQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEscUJBQVIsQ0FBWixDQUFBO0FBQUEsY0FDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLE1BQVIsQ0FEVixDQUFBO0FBQUEsY0FFQSxPQUFBLEdBQWMsSUFBQSxPQUFBLENBQUEsQ0FGZCxDQUFBO0FBQUEsY0FHQSxPQUFPLENBQUMsb0JBQVIsQ0FBQSxDQUhBLENBREY7YUFBQTtBQUFBLFlBS0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUxULENBQUE7QUFBQSxZQU1BLElBQUEsR0FBVSxjQUFILEdBQWdCLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBaEIsR0FBc0MsTUFON0MsQ0FBQTtBQUFBLFlBT0EsTUFBQSxHQUFZLFlBQUgsR0FBYyxTQUFTLENBQUMsSUFBVixDQUFlLE1BQWYsRUFBMEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLElBQTVCLENBQWtDLENBQUEsQ0FBQSxDQUE1RCxDQUFkLEdBQW1GLE1BUDVGLENBQUE7QUFRQSxZQUFBLElBQUksY0FBSjtBQUNFLG9CQUFVLElBQUEsS0FBQSxDQUFNLHVCQUFOLENBQVYsQ0FERjthQVJBO0FBQUEsWUFVQSxPQUFPLENBQUMsU0FBUixDQUFrQixNQUFsQixDQVZBLENBQUE7QUFBQSxZQVdBLE1BQUEsR0FBUyxPQUFPLENBQUMsU0FBUixDQUFrQixJQUFsQixFQUF3QixJQUF4QixDQVhULENBQUE7QUFZQSxZQUFBLElBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFkLENBQUEsQ0FBQSxHQUFnQyxDQUFuQztBQUNFLGNBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQWQsQ0FBQSxDQUE0QixDQUFDLE1BQTdCLENBQW9DLFNBQUMsR0FBRCxFQUFNLEdBQU4sR0FBQTt1QkFDekMsRUFBQSxHQUFHLEdBQUgsR0FBTyxZQUFQLEdBQW1CLEdBQUcsQ0FBQyxJQUF2QixHQUE0QixJQUE1QixHQUFnQyxHQUFHLENBQUMsUUFESztjQUFBLENBQXBDLEVBRUwsbUJBRkssQ0FBUCxDQUFBLENBREY7YUFaQTttQkFpQkEsT0FBQSxDQUFRLE1BQU0sQ0FBQyxNQUFmLEVBbEJGO1dBQUEsY0FBQTtBQXFCRSxZQURJLFlBQ0osQ0FBQTtBQUFBLFlBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBUSxvQkFBQSxHQUFvQixHQUE1QixDQUFBLENBQUE7bUJBQ0EsTUFBQSxDQUFPLEdBQVAsRUF0QkY7V0FEa0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFULENBQVgsQ0FGUTtJQUFBLENBTlYsQ0FBQTs7cUJBQUE7O0tBRHVDLFdBUHpDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/jscs.coffee

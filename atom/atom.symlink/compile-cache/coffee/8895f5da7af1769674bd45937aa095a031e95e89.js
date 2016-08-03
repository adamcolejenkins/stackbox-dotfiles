
/*
Requires https://github.com/bbatsov/rubocop
 */

(function() {
  "use strict";
  var Beautifier, Rubocop,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = Rubocop = (function(_super) {
    __extends(Rubocop, _super);

    function Rubocop() {
      return Rubocop.__super__.constructor.apply(this, arguments);
    }

    Rubocop.prototype.name = "Rubocop";

    Rubocop.prototype.options = {
      Ruby: {
        indent_size: true,
        rubocop_path: true
      }
    };

    Rubocop.prototype.beautify = function(text, language, options) {
      return this.Promise.all([options.rubocop_path ? this.which(options.rubocop_path) : void 0, this.which('rubocop')]).then((function(_this) {
        return function(paths) {
          var config, configFile, fs, path, rubocopPath, tempFile, yaml, _;
          _this.debug('rubocop paths', paths);
          _ = require('lodash');
          path = require('path');
          rubocopPath = _.find(paths, function(p) {
            return p && path.isAbsolute(p);
          });
          _this.verbose('rubocopPath', rubocopPath);
          _this.debug('rubocopPath', rubocopPath, paths);
          configFile = path.join(atom.project.getPaths()[0], ".rubocop.yml");
          fs = require('fs');
          if (fs.existsSync(configFile)) {
            _this.debug("rubocop", config, fs.readFileSync(configFile, 'utf8'));
          } else {
            yaml = require("yaml-front-matter");
            config = {
              "Style/IndentationWidth": {
                "Width": options.indent_size
              }
            };
            configFile = _this.tempFile("rubocop-config", yaml.safeDump(config));
            _this.debug("rubocop", config, configFile);
          }
          if (rubocopPath != null) {
            return _this.run(rubocopPath, ["--auto-correct", "--config", configFile, tempFile = _this.tempFile("temp", text)], {
              ignoreReturnCode: true
            }).then(function() {
              return _this.readFile(tempFile);
            });
          } else {
            return _this.run("rubocop", ["--auto-correct", "--config", configFile, tempFile = _this.tempFile("temp", text)], {
              ignoreReturnCode: true
            }).then(function() {
              return _this.readFile(tempFile);
            });
          }
        };
      })(this));
    };

    return Rubocop;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3J1Ym9jb3AuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUlBLFlBSkEsQ0FBQTtBQUFBLE1BQUEsbUJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUxiLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQiw4QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsc0JBQUEsSUFBQSxHQUFNLFNBQU4sQ0FBQTs7QUFBQSxzQkFFQSxPQUFBLEdBQVM7QUFBQSxNQUNQLElBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLElBQWI7QUFBQSxRQUNBLFlBQUEsRUFBYyxJQURkO09BRks7S0FGVCxDQUFBOztBQUFBLHNCQVFBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7YUFDUixJQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsQ0FBYSxDQUNxQixPQUFPLENBQUMsWUFBeEMsR0FBQSxJQUFDLENBQUEsS0FBRCxDQUFPLE9BQU8sQ0FBQyxZQUFmLENBQUEsR0FBQSxNQURXLEVBRVgsSUFBQyxDQUFBLEtBQUQsQ0FBTyxTQUFQLENBRlcsQ0FBYixDQUdFLENBQUMsSUFISCxDQUdRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtBQUNOLGNBQUEsNERBQUE7QUFBQSxVQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sZUFBUCxFQUF3QixLQUF4QixDQUFBLENBQUE7QUFBQSxVQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQURKLENBQUE7QUFBQSxVQUVBLElB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

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/rubocop.coffee

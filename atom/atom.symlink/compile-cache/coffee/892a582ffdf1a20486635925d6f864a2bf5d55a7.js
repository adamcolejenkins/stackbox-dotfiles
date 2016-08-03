(function() {
  "use strict";
  var Beautifier, LatexBeautify, fs, path, temp,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  path = require('path');

  fs = require("fs");

  temp = require("temp").track();

  module.exports = LatexBeautify = (function(_super) {
    __extends(LatexBeautify, _super);

    function LatexBeautify() {
      return LatexBeautify.__super__.constructor.apply(this, arguments);
    }

    LatexBeautify.prototype.name = "Latex Beautify";

    LatexBeautify.prototype.options = {
      LaTeX: true
    };

    LatexBeautify.prototype.buildConfigFile = function(options) {
      var config, delim, indentChar, _i, _len, _ref;
      indentChar = options.indent_char;
      if (options.indent_with_tabs) {
        indentChar = "\\t";
      }
      config = "defaultIndent: \"" + indentChar + "\"\nalwaysLookforSplitBraces: " + (+options.always_look_for_split_braces) + "\nalwaysLookforSplitBrackets: " + (+options.always_look_for_split_brackets) + "\nindentPreamble: " + (+options.indent_preamble) + "\nremoveTrailingWhitespace: " + (+options.remove_trailing_whitespace) + "\nlookForAlignDelims:\n";
      _ref = options.align_columns_in_environments;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        delim = _ref[_i];
        config += "\t" + delim + ": 1\n";
      }
      return config;
    };

    LatexBeautify.prototype.setUpDir = function(dirPath, text, config) {
      this.texFile = path.join(dirPath, "latex.tex");
      fs.writeFile(this.texFile, text, function(err) {
        if (err) {
          return reject(err);
        }
      });
      this.configFile = path.join(dirPath, "localSettings.yaml");
      fs.writeFile(this.configFile, config, function(err) {
        if (err) {
          return reject(err);
        }
      });
      this.logFile = path.join(dirPath, "indent.log");
      return fs.writeFile(this.logFile, "", function(err) {
        if (err) {
          return reject(err);
        }
      });
    };

    LatexBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        return temp.mkdir("latex", function(err, dirPath) {
          if (err) {
            return reject(err);
          }
          return resolve(dirPath);
        });
      }).then((function(_this) {
        return function(dirPath) {
          var run;
          _this.setUpDir(dirPath, text, _this.buildConfigFile(options));
          return run = _this.run("latexindent", ["-o", "-s", "-l", "-c=" + dirPath, _this.texFile, _this.texFile], {
            help: {
              link: "https://github.com/cmhughes/latexindent.pl"
            }
          });
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.readFile(_this.texFile);
        };
      })(this));
    };

    return LatexBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL2xhdGV4LWJlYXV0aWZ5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLHlDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FEYixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUhMLENBQUE7O0FBQUEsRUFJQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLEtBQWhCLENBQUEsQ0FKUCxDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsb0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDRCQUFBLElBQUEsR0FBTSxnQkFBTixDQUFBOztBQUFBLDRCQUVBLE9BQUEsR0FBUztBQUFBLE1BQ1AsS0FBQSxFQUFPLElBREE7S0FGVCxDQUFBOztBQUFBLDRCQVFBLGVBQUEsR0FBaUIsU0FBQyxPQUFELEdBQUE7QUFDZixVQUFBLHlDQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsT0FBTyxDQUFDLFdBQXJCLENBQUE7QUFDQSxNQUFBLElBQUcsT0FBTyxDQUFDLGdCQUFYO0FBQ0UsUUFBQSxVQUFBLEdBQWEsS0FBYixDQURGO09BREE7QUFBQSxNQUlBLE1BQUEsR0FDSixtQkFBQSxHQUFtQixVQUFuQixHQUE4QixnQ0FBOUIsR0FDYyxDQUFDLENBQUEsT0FBUSxDQUFDLDRCQUFWLENBRGQsR0FDcUQsZ0NBRHJELEdBRUcsQ0FBQyxDQUFBLE9BQVEsQ0FBQyw4QkFBVixDQUZILEdBRTRDLG9C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

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/latex-beautify.coffee

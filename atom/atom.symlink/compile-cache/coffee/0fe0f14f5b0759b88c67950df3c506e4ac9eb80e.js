
/*
Requires https://github.com/FriendsOfPHP/PHP-CS-Fixer
 */

(function() {
  "use strict";
  var Beautifier, PHPCSFixer, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  path = require('path');

  module.exports = PHPCSFixer = (function(_super) {
    __extends(PHPCSFixer, _super);

    function PHPCSFixer() {
      return PHPCSFixer.__super__.constructor.apply(this, arguments);
    }

    PHPCSFixer.prototype.name = 'PHP-CS-Fixer';

    PHPCSFixer.prototype.options = {
      PHP: true
    };

    PHPCSFixer.prototype.beautify = function(text, language, options, context) {
      var configFile, tempFile;
      this.debug('php-cs-fixer', options);
      configFile = (context != null) && (context.filePath != null) ? this.findFile(path.dirname(context.filePath), '.php_cs') : void 0;
      if (this.isWindows) {
        return this.Promise.all([options.cs_fixer_path ? this.which(options.cs_fixer_path) : void 0, this.which('php-cs-fixer')]).then((function(_this) {
          return function(paths) {
            var phpCSFixerPath, tempFile, _;
            _this.debug('php-cs-fixer paths', paths);
            _ = require('lodash');
            phpCSFixerPath = _.find(paths, function(p) {
              return p && path.isAbsolute(p);
            });
            _this.verbose('phpCSFixerPath', phpCSFixerPath);
            _this.debug('phpCSFixerPath', phpCSFixerPath, paths);
            if (phpCSFixerPath != null) {
              return _this.run("php", [phpCSFixerPath, "fix", options.level ? "--level=" + options.level : void 0, options.fixers ? "--fixers=" + options.fixers : void 0, configFile ? "--config-file=" + configFile : void 0, tempFile = _this.tempFile("temp", text)], {
                ignoreReturnCode: true,
                help: {
                  link: "http://php.net/manual/en/install.php"
                }
              }).then(function() {
                return _this.readFile(tempFile);
              });
            } else {
              _this.verbose('php-cs-fixer not found!');
              return _this.Promise.reject(_this.commandNotFoundError('php-cs-fixer', {
                link: "https://github.com/FriendsOfPHP/PHP-CS-Fixer",
                program: "php-cs-fixer.phar",
                pathOption: "PHP - CS Fixer Path"
              }));
            }
          };
        })(this));
      } else {
        return this.run("php-cs-fixer", ["fix", options.level ? "--level=" + options.level : void 0, options.fixers ? "--fixers=" + options.fixers : void 0, configFile ? "--config-file=" + configFile : void 0, tempFile = this.tempFile("temp", text)], {
          ignoreReturnCode: true,
          help: {
            link: "https://github.com/FriendsOfPHP/PHP-CS-Fixer"
          }
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      }
    };

    return PHPCSFixer;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3BocC1jcy1maXhlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBSUEsWUFKQSxDQUFBO0FBQUEsTUFBQSw0QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBTGIsQ0FBQTs7QUFBQSxFQU1BLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQU5QLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUVyQixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEseUJBQUEsSUFBQSxHQUFNLGNBQU4sQ0FBQTs7QUFBQSx5QkFFQSxPQUFBLEdBQ0U7QUFBQSxNQUFBLEdBQUEsRUFBSyxJQUFMO0tBSEYsQ0FBQTs7QUFBQSx5QkFLQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixFQUEwQixPQUExQixHQUFBO0FBQ1IsVUFBQSxvQkFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLEtBQUQsQ0FBTyxjQUFQLEVBQXVCLE9BQXZCLENBQUEsQ0FBQTtBQUFBLE1BRUEsVUFBQSxHQUFnQixpQkFBQSxJQUFhLDBCQUFoQixHQUF1QyxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsT0FBTyxDQUFDLFFBQXJCLENBQVYsRUFBMEMsU0FBMUMsQ0FBdkMsR0FBQSxNQUZiLENBQUE7QUFJQSxNQUFBLElBQUcsSUFBQyxDQUFBLFNBQUo7ZUFFRSxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsQ0FBYSxDQUNzQixPQUFPLENBQUMsYUFBekMsR0FBQSxJQUFDLENBQUEsS0FBRCxDQUFPLE9BQU8s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

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/php-cs-fixer.coffee

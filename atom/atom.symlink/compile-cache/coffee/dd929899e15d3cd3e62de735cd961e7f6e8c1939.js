(function() {
  var path, resolve, toInt;

  toInt = function(str) {
    return parseInt(str, 10);
  };

  resolve = require('resolve');

  path = require('path');

  module.exports = {
    scopes: ['source.coffee', 'source.litcoffee', 'source.coffee.jsx', 'source.coffee.angular'],
    _resolveCoffeeLint: function(filePath) {
      var e, expected;
      try {
        return path.dirname(resolve.sync('coffeelint/package.json', {
          basedir: path.dirname(filePath)
        }));
      } catch (_error) {
        e = _error;
        expected = "Cannot find module 'coffeelint/package.json'";
        if (e.message.slice(0, expected.length) === expected) {
          return 'coffeelint';
        }
        throw e;
      }
    },
    configImportsModules: function(config) {
      var rconfig, ruleName, _ref;
      for (ruleName in config) {
        rconfig = config[ruleName];
        if (rconfig.module != null) {
          return true;
        }
      }
      return (typeof userConfig !== "undefined" && userConfig !== null ? (_ref = userConfig.coffeelint) != null ? _ref.transforms : void 0 : void 0) != null;
    },
    canImportModules: function(coffeelint) {
      var major, minor, patch, _ref;
      _ref = coffeelint.VERSION.split('.').map(toInt), major = _ref[0], minor = _ref[1], patch = _ref[2];
      if (major > 1) {
        return true;
      }
      if (major === 1 && minor > 9) {
        return true;
      }
      if (major === 1 && minor === 9 && patch >= 5) {
        return true;
      }
      return false;
    },
    isCompatibleWithAtom: function(coffeelint) {
      var major, minor, patch, _ref;
      _ref = coffeelint.VERSION.split('.').map(toInt), major = _ref[0], minor = _ref[1], patch = _ref[2];
      if (major > 1) {
        return true;
      }
      if (major === 1 && minor > 9) {
        return true;
      }
      if (major === 1 && minor === 9 && patch >= 1) {
        return true;
      }
      return false;
    },
    lint: function(filePath, source, scopeName) {
      var coffeeLintPath, coffeelint, config, configFinder, e, isLiterate, major, minor, patch, result, showUpgradeError, _ref;
      isLiterate = scopeName === 'source.litcoffee';
      showUpgradeError = false;
      coffeeLintPath = this._resolveCoffeeLint(filePath);
      coffeelint = require(coffeeLintPath);
      _ref = coffeelint.VERSION.split('.').map(toInt), major = _ref[0], minor = _ref[1], patch = _ref[2];
      if (!this.isCompatibleWithAtom(coffeelint)) {
        coffeeLintPath = 'coffeelint';
        coffeelint = require(coffeeLintPath);
        showUpgradeError = true;
      }
      configFinder = require("" + coffeeLintPath + "/lib/configfinder");
      result = [];
      try {
        config = configFinder.getConfig(filePath);
        if (this.configImportsModules(config) && !this.canImportModules(coffeelint)) {
          showUpgradeError = true;
        } else {
          result = coffeelint.lint(source, config, isLiterate);
        }
      } catch (_error) {
        e = _error;
        console.log(e.message);
        console.log(e.stack);
        result.push({
          lineNumber: 1,
          level: 'error',
          message: "CoffeeLint crashed, see console for error details.",
          rule: 'none'
        });
      }
      if (showUpgradeError) {
        result = [
          {
            lineNumber: 1,
            level: 'error',
            message: "http://git.io/local_upgrade upgrade your project's CoffeeLint",
            rule: 'none'
          }
        ];
      }
      return result;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1jb2ZmZWVsaW50L2xpYi9jb3JlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUVBO0FBQUEsTUFBQSxvQkFBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxTQUFDLEdBQUQsR0FBQTtXQUFTLFFBQUEsQ0FBUyxHQUFULEVBQWMsRUFBZCxFQUFUO0VBQUEsQ0FBUixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQU9FO0FBQUEsSUFBQSxNQUFBLEVBQVEsQ0FDTixlQURNLEVBRU4sa0JBRk0sRUFHTixtQkFITSxFQUlOLHVCQUpNLENBQVI7QUFBQSxJQU9BLGtCQUFBLEVBQW9CLFNBQUMsUUFBRCxHQUFBO0FBQ2xCLFVBQUEsV0FBQTtBQUFBO0FBQ0UsZUFBTyxJQUFJLENBQUMsT0FBTCxDQUFhLE9BQU8sQ0FBQyxJQUFSLENBQWEseUJBQWIsRUFBd0M7QUFBQSxVQUMxRCxPQUFBLEVBQVMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLENBRGlEO1NBQXhDLENBQWIsQ0FBUCxDQURGO09BQUEsY0FBQTtBQUtFLFFBREksVUFDSixDQUFBO0FBQUEsUUFBQSxRQUFBLEdBQVcsOENBQVgsQ0FBQTtBQUNBLFFBQUEsSUFBRyxDQUFDLENBQUMsT0FBUSwwQkFBVixLQUFpQyxRQUFwQztBQUNFLGlCQUFPLFlBQVAsQ0FERjtTQURBO0FBR0EsY0FBTSxDQUFOLENBUkY7T0FEa0I7SUFBQSxDQVBwQjtBQUFBLElBa0JBLG9CQUFBLEVBQXNCLFNBQUMsTUFBRCxHQUFBO0FBQ3BCLFVBQUEsdUJBQUE7QUFBQSxXQUFB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

//# sourceURL=/Users/ajenkins/.atom/packages/linter-coffeelint/lib/core.coffee

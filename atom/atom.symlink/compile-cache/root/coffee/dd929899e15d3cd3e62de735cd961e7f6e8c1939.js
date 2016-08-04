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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvbGludGVyLWNvZmZlZWxpbnQvbGliL2NvcmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBRUE7QUFBQSxNQUFBLG9CQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLFNBQUMsR0FBRCxHQUFBO1dBQVMsUUFBQSxDQUFTLEdBQVQsRUFBYyxFQUFkLEVBQVQ7RUFBQSxDQUFSLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVIsQ0FEVixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBT0U7QUFBQSxJQUFBLE1BQUEsRUFBUSxDQUNOLGVBRE0sRUFFTixrQkFGTSxFQUdOLG1CQUhNLEVBSU4sdUJBSk0sQ0FBUjtBQUFBLElBT0Esa0JBQUEsRUFBb0IsU0FBQyxRQUFELEdBQUE7QUFDbEIsVUFBQSxXQUFBO0FBQUE7QUFDRSxlQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsT0FBTyxDQUFDLElBQVIsQ0FBYSx5QkFBYixFQUF3QztBQUFBLFVBQzFELE9BQUEsRUFBUyxJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWIsQ0FEaUQ7U0FBeEMsQ0FBYixDQUFQLENBREY7T0FBQSxjQUFBO0FBS0UsUUFESSxVQUNKLENBQUE7QUFBQSxRQUFBLFFBQUEsR0FBVyw4Q0FBWCxDQUFBO0FBQ0EsUUFBQSxJQUFHLENBQUMsQ0FBQyxPQUFRLDBCQUFWLEtBQWlDLFFBQXBDO0FBQ0UsaUJBQU8sWUFBUCxDQURGO1NBREE7QUFHQSxjQUFNLENBQU4sQ0FSRjtPQURrQjtJQUFBLENBUHBCO0FBQUEsSUFrQkEsb0JBQUEsRUFBc0IsU0FBQyxNQUFELEdBQUE7QUFDcEIsVUFB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

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/linter-coffeelint/lib/core.coffee

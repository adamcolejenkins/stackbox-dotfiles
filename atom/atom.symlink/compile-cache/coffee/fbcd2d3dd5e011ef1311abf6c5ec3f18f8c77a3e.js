(function() {
  var ATOM_BUNDLE_IDENTIFIER, BufferedProcess, INSTALLATION_LINE_PATTERN, glob, path;

  path = require('path');

  glob = require('glob');

  BufferedProcess = require('atom').BufferedProcess;

  ATOM_BUNDLE_IDENTIFIER = 'com.github.atom';

  INSTALLATION_LINE_PATTERN = /^Installing +([^@]+)@(\S+).+\s+(\S+)$/;

  module.exports = {
    updatePackages: function(isAutoUpdate) {
      if (isAutoUpdate == null) {
        isAutoUpdate = true;
      }
      return this.runApmUpgrade((function(_this) {
        return function(log) {
          var entries, summary;
          entries = _this.parseLog(log);
          summary = _this.generateSummary(entries, isAutoUpdate);
          if (!summary) {
            return;
          }
          return _this.notify({
            title: 'Atom Package Updates',
            message: summary,
            sender: ATOM_BUNDLE_IDENTIFIER,
            activate: ATOM_BUNDLE_IDENTIFIER
          });
        };
      })(this));
    },
    runApmUpgrade: function(callback) {
      var args, command, exit, log, stdout;
      command = atom.packages.getApmPath();
      args = ['upgrade', '--no-confirm', '--no-color'];
      log = '';
      stdout = function(data) {
        return log += data;
      };
      exit = function(exitCode) {
        return callback(log);
      };
      return new BufferedProcess({
        command: command,
        args: args,
        stdout: stdout,
        exit: exit
      });
    },
    parseLog: function(log) {
      var line, lines, matches, name, result, version, _i, _len, _match, _results;
      lines = log.split('\n');
      _results = [];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        matches = line.match(INSTALLATION_LINE_PATTERN);
        if (matches == null) {
          continue;
        }
        _match = matches[0], name = matches[1], version = matches[2], result = matches[3];
        _results.push({
          'name': name,
          'version': version,
          'isInstalled': result === '\u2713'
        });
      }
      return _results;
    },
    generateSummary: function(entries, isAutoUpdate) {
      var names, successfulEntries, summary;
      if (isAutoUpdate == null) {
        isAutoUpdate = true;
      }
      successfulEntries = entries.filter(function(entry) {
        return entry.isInstalled;
      });
      if (!(successfulEntries.length > 0)) {
        return null;
      }
      names = successfulEntries.map(function(entry) {
        return entry.name;
      });
      summary = successfulEntries.length <= 5 ? this.generateEnumerationExpression(names) : "" + successfulEntries.length + " packages";
      summary += successfulEntries.length === 1 ? ' has' : ' have';
      summary += ' been updated';
      if (isAutoUpdate) {
        summary += ' automatically';
      }
      summary += '.';
      return summary;
    },
    generateEnumerationExpression: function(items) {
      var expression, index, item, _i, _len;
      expression = '';
      for (index = _i = 0, _len = items.length; _i < _len; index = ++_i) {
        item = items[index];
        if (index > 0) {
          if (index + 1 < items.length) {
            expression += ', ';
          } else {
            expression += ' and ';
          }
        }
        expression += item;
      }
      return expression;
    },
    notify: function(notification) {
      var args, command, key, value;
      command = this.getTerminalNotifierPath();
      if (!command) {
        return console.log("terminal-notifier is not found.");
      }
      args = [];
      for (key in notification) {
        value = notification[key];
        args.push("-" + key, value);
      }
      return new BufferedProcess({
        command: command,
        args: args
      });
    },
    getTerminalNotifierPath: function() {
      var paths, pattern;
      if (this.cachedTerminalNotifierPath !== void 0) {
        return this.cachedTerminalNotifierPath;
      }
      pattern = path.join(__dirname, '..', 'vendor', '**', 'terminal-notifier');
      paths = glob.sync(pattern);
      return this.cachedTerminalNotifierPath = paths.length === 0 ? null : paths[0];
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F1dG8tdXBkYXRlLXBhY2thZ2VzL2xpYi9wYWNrYWdlLXVwZGF0ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhFQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFGRCxDQUFBOztBQUFBLEVBSUEsc0JBQUEsR0FBeUIsaUJBSnpCLENBQUE7O0FBQUEsRUFLQSx5QkFBQSxHQUE0Qix1Q0FMNUIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGNBQUEsRUFBZ0IsU0FBQyxZQUFELEdBQUE7O1FBQUMsZUFBZTtPQUM5QjthQUFBLElBQUMsQ0FBQSxhQUFELENBQWUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsR0FBRCxHQUFBO0FBQ2IsY0FBQSxnQkFBQTtBQUFBLFVBQUEsT0FBQSxHQUFVLEtBQUMsQ0FBQSxRQUFELENBQVUsR0FBVixDQUFWLENBQUE7QUFBQSxVQUNBLE9BQUEsR0FBVSxLQUFDLENBQUEsZUFBRCxDQUFpQixPQUFqQixFQUEwQixZQUExQixDQURWLENBQUE7QUFFQSxVQUFBLElBQUEsQ0FBQSxPQUFBO0FBQUEsa0JBQUEsQ0FBQTtXQUZBO2lCQUdBLEtBQUMsQ0FBQSxNQUFELENBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyxzQkFBUDtBQUFBLFlBQ0EsT0FBQSxFQUFTLE9BRFQ7QUFBQSxZQUVBLE1BQUEsRUFBUSxzQkFGUjtBQUFBLFlBR0EsUUFBQSxFQUFVLHNCQUhWO1dBREYsRUFKYTtRQUFBLEVB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

//# sourceURL=/Users/ajenkins/.atom/packages/auto-update-packages/lib/package-updater.coffee

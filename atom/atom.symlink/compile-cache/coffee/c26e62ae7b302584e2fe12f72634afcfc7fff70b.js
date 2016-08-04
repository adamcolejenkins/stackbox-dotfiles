(function() {
  var PackageUpdater;

  PackageUpdater = require('../lib/package-updater');

  require('./spec-helper');

  describe('PackageUpdater', function() {
    afterEach(function() {
      return restoreEnvironment();
    });
    describe('.parseLog', function() {
      var entries;
      entries = null;
      describe('when some updates are done', function() {
        beforeEach(function() {
          var log;
          log = ['Package Updates Available (2)', '└── atom-lint 0.8.0 -> 0.8.1', '└── sort-lines 0.1.0 -> 0.3.0', '', 'Installing atom-lint@0.8.1 to /Users/me/.atom/packages ✓', 'Installing sort-lines@0.3.0 to /Users/me/.atom/packages ✗'].join('\n');
          return entries = PackageUpdater.parseLog(log);
        });
        it('returns entries of package installation', function() {
          return expect(entries.length).toBe(2);
        });
        it('extracts package name', function() {
          expect(entries[0].name).toBe('atom-lint');
          return expect(entries[1].name).toBe('sort-lines');
        });
        it('extracts package version', function() {
          expect(entries[0].version).toBe('0.8.1');
          return expect(entries[1].version).toBe('0.3.0');
        });
        return it('recognizes success and failure', function() {
          expect(entries[0].isInstalled).toBe(true);
          return expect(entries[1].isInstalled).toBe(false);
        });
      });
      describe("when there's no update", function() {
        beforeEach(function() {
          var log;
          log = ['Package Updates Available (0)', '└── (empty)'].join('\n');
          return entries = PackageUpdater.parseLog(log);
        });
        return it('returns empty array', function() {
          return expect(entries.length).toBe(0);
        });
      });
      return describe("when nothing is in the log", function() {
        beforeEach(function() {
          return entries = PackageUpdater.parseLog('');
        });
        return it('returns empty array', function() {
          return expect(entries.length).toBe(0);
        });
      });
    });
    return describe('.generateSummary', function() {
      describe('when no package is updated', function() {
        return it('returns null', function() {
          var entries, summary;
          entries = [
            {
              name: 'atom-lint',
              isInstalled: false
            }
          ];
          summary = PackageUpdater.generateSummary(entries);
          return expect(summary).toBeNull();
        });
      });
      describe('when a packages is updated', function() {
        return it('mentions the packages name', function() {
          var entries, summary;
          entries = [
            {
              name: 'atom-lint',
              isInstalled: true
            }
          ];
          summary = PackageUpdater.generateSummary(entries);
          return expect(summary).toBe('atom-lint has been updated automatically.');
        });
      });
      describe('when 2 packages are updated', function() {
        return it('handles conjugation properly', function() {
          var entries, summary;
          entries = [
            {
              name: 'atom-lint',
              isInstalled: true
            }, {
              name: 'sort-lines',
              isInstalled: true
            }
          ];
          summary = PackageUpdater.generateSummary(entries);
          return expect(summary).toBe('atom-lint and sort-lines have been updated automatically.');
        });
      });
      describe('when more than 2 packages are updated', function() {
        return it('lists the packages names properly', function() {
          var entries, summary;
          entries = [
            {
              name: 'atom-lint',
              isInstalled: true
            }, {
              name: 'sort-lines',
              isInstalled: true
            }, {
              name: 'language-slim',
              isInstalled: true
            }, {
              name: 'language-haskell',
              isInstalled: true
            }
          ];
          summary = PackageUpdater.generateSummary(entries);
          return expect(summary).toBe('atom-lint, sort-lines, language-slim and language-haskell ' + 'have been updated automatically.');
        });
      });
      describe('when more than 5 packages are updated', function() {
        return it('omits the package names', function() {
          var entries, summary;
          entries = [
            {
              name: 'atom-lint',
              isInstalled: true
            }, {
              name: 'sort-lines',
              isInstalled: true
            }, {
              name: 'language-slim',
              isInstalled: true
            }, {
              name: 'language-haskell',
              isInstalled: true
            }, {
              name: 'language-ruby',
              isInstalled: true
            }, {
              name: 'language-python',
              isInstalled: true
            }
          ];
          summary = PackageUpdater.generateSummary(entries);
          return expect(summary).toBe('6 packages have been updated automatically.');
        });
      });
      return describe('when non-auto-update', function() {
        return it('does not say "automatically"', function() {
          var entries, summary;
          entries = [
            {
              name: 'atom-lint',
              isInstalled: true
            }
          ];
          summary = PackageUpdater.generateSummary(entries, false);
          return expect(summary).toBe('atom-lint has been updated.');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F1dG8tdXBkYXRlLXBhY2thZ2VzL3NwZWMvcGFja2FnZS11cGRhdGVyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx3QkFBUixDQUFqQixDQUFBOztBQUFBLEVBQ0EsT0FBQSxDQUFRLGVBQVIsQ0FEQSxDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtBQUN6QixJQUFBLFNBQUEsQ0FBVSxTQUFBLEdBQUE7YUFDUixrQkFBQSxDQUFBLEVBRFE7SUFBQSxDQUFWLENBQUEsQ0FBQTtBQUFBLElBR0EsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTtBQUFBLE1BRUEsUUFBQSxDQUFTLDRCQUFULEVBQXVDLFNBQUEsR0FBQTtBQUNyQyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxjQUFBLEdBQUE7QUFBQSxVQUFBLEdBQUEsR0FBTSxDQUNKLCtCQURJLEVBRUosOEJBRkksRUFHSiwrQkFISSxFQUlKLEVBSkksRUFLSiwwREFMSSxFQU1KLDJEQU5JLENBT0wsQ0FBQyxJQVBJLENBT0MsSUFQRCxDQUFOLENBQUE7aUJBVUEsT0FBQSxHQUFVLGNBQWMsQ0FBQyxRQUFmLENBQXdCLEdBQXhCLEVBWEQ7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBYUEsRUFBQSxDQUFHLHlDQUFILEVBQThDLFNBQUEsR0FBQTtpQkFDNUMsTUFBQSxDQUFPLE9BQU8sQ0FBQyxNQUFmLENBQXNCLENBQUMsSUFBdkIsQ0FBNEIsQ0FBNUIsRUFENEM7UUFBQSxDQUE5QyxDQWJB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

//# sourceURL=/Users/ajenkins/.atom/packages/auto-update-packages/spec/package-updater-spec.coffee

(function() {
  var AutoUpdatePackages, PackageUpdater, fs;

  fs = require('fs');

  AutoUpdatePackages = require('../lib/auto-update-packages');

  PackageUpdater = require('../lib/package-updater');

  require('./spec-helper');

  describe('auto-upgrade-packages', function() {
    afterEach(function() {
      return restoreEnvironment();
    });
    describe('.loadLastUpdateTime', function() {
      describe('when no update has done ever', function() {
        beforeEach(function() {
          var path;
          path = AutoUpdatePackages.getLastUpdateTimeFilePath();
          if (fs.existsSync(path)) {
            return fs.unlinkSync(path);
          }
        });
        return it('returns null', function() {
          return expect(AutoUpdatePackages.loadLastUpdateTime()).toBeNull();
        });
      });
      return describe('when any update has done ever', function() {
        beforeEach(function() {
          return AutoUpdatePackages.saveLastUpdateTime();
        });
        return it('returns the time', function() {
          var loadedTime, now;
          loadedTime = AutoUpdatePackages.loadLastUpdateTime();
          now = Date.now();
          expect(loadedTime).toBeLessThan(now + 1);
          return expect(loadedTime).toBeGreaterThan(now - 1000);
        });
      });
    });
    describe('.updatePackagesIfAutoUpdateBlockIsExpired', function() {
      describe('when no update has done ever', function() {
        beforeEach(function() {
          var path;
          path = AutoUpdatePackages.getLastUpdateTimeFilePath();
          if (fs.existsSync(path)) {
            return fs.unlinkSync(path);
          }
        });
        return it('runs update', function() {
          spyOn(AutoUpdatePackages, 'updatePackages');
          AutoUpdatePackages.updatePackagesIfAutoUpdateBlockIsExpired();
          return expect(AutoUpdatePackages.updatePackages).toHaveBeenCalled();
        });
      });
      return describe('when a update has done just now', function() {
        beforeEach(function() {
          spyOn(PackageUpdater, 'updatePackages');
          return AutoUpdatePackages.updatePackagesIfAutoUpdateBlockIsExpired();
        });
        return it('does not run update', function() {
          spyOn(AutoUpdatePackages, 'updatePackages');
          AutoUpdatePackages.updatePackagesIfAutoUpdateBlockIsExpired();
          return expect(AutoUpdatePackages.updatePackages).not.toHaveBeenCalled();
        });
      });
    });
    describe('.getAutoUpdateBlockDuration', function() {
      describe('when "auto-update-packages.intervalMinutes" is 360', function() {
        beforeEach(function() {
          return atom.config.set('auto-update-packages.intervalMinutes', 360);
        });
        return it('returns 21600000 (6 hours)', function() {
          return expect(AutoUpdatePackages.getAutoUpdateBlockDuration()).toBe(21600000);
        });
      });
      describe('when "auto-update-packages.intervalMinutes" is 30', function() {
        beforeEach(function() {
          return atom.config.set('auto-update-packages.intervalMinutes', 30);
        });
        return it('returns 1800000', function() {
          return expect(AutoUpdatePackages.getAutoUpdateBlockDuration()).toBe(1800000);
        });
      });
      return describe('when "auto-update-packages.intervalMinutes" is 14', function() {
        beforeEach(function() {
          return atom.config.set('auto-update-packages.intervalMinutes', 14);
        });
        return it('returns 900000 (15 minutes) to avoid too frequent access to the server', function() {
          return expect(AutoUpdatePackages.getAutoUpdateBlockDuration()).toBe(900000);
        });
      });
    });
    return describe('.getAutoUpdateCheckInterval', function() {
      describe('when "auto-update-packages.intervalMinutes" is 360', function() {
        beforeEach(function() {
          return atom.config.set('auto-update-packages.intervalMinutes', 360);
        });
        return it('returns 1440000 (24 minutes)', function() {
          return expect(AutoUpdatePackages.getAutoUpdateCheckInterval()).toBe(1440000);
        });
      });
      return describe('when "auto-update-packages.intervalMinutes" is 30', function() {
        beforeEach(function() {
          return atom.config.set('auto-update-packages.intervalMinutes', 30);
        });
        return it('returns 120000 (2 minutes)', function() {
          return expect(AutoUpdatePackages.getAutoUpdateCheckInterval()).toBe(120000);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F1dG8tdXBkYXRlLXBhY2thZ2VzL3NwZWMvYXV0by11cGRhdGUtcGFja2FnZXMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0NBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0Esa0JBQUEsR0FBcUIsT0FBQSxDQUFRLDZCQUFSLENBRHJCLENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx3QkFBUixDQUZqQixDQUFBOztBQUFBLEVBR0EsT0FBQSxDQUFRLGVBQVIsQ0FIQSxDQUFBOztBQUFBLEVBS0EsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxJQUFBLFNBQUEsQ0FBVSxTQUFBLEdBQUE7YUFDUixrQkFBQSxDQUFBLEVBRFE7SUFBQSxDQUFWLENBQUEsQ0FBQTtBQUFBLElBR0EsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUEsR0FBQTtBQUM5QixNQUFBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBLEdBQUE7QUFDdkMsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsY0FBQSxJQUFBO0FBQUEsVUFBQSxJQUFBLEdBQU8sa0JBQWtCLENBQUMseUJBQW5CLENBQUEsQ0FBUCxDQUFBO0FBQ0EsVUFBQSxJQUF1QixFQUFFLENBQUMsVUFBSCxDQUFjLElBQWQsQ0FBdkI7bUJBQUEsRUFBRSxDQUFDLFVBQUgsQ0FBYyxJQUFkLEVBQUE7V0FGUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLGNBQUgsRUFBbUIsU0FBQSxHQUFBO2lCQUNqQixNQUFBLENBQU8sa0JBQWtCLENBQUMsa0JBQW5CLENBQUEsQ0FBUCxDQUErQyxDQUFD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

//# sourceURL=/Users/ajenkins/.atom/packages/auto-update-packages/spec/auto-update-packages-spec.coffee

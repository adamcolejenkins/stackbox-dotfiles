(function() {
  var Beautifier, PHPCSFixer, isWindows, path;

  PHPCSFixer = require("../src/beautifiers/php-cs-fixer");

  Beautifier = require("../src/beautifiers/beautifier");

  path = require('path');

  isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';

  describe("PHP-CS-Fixer Beautifier", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        var activationPromise, pack;
        activationPromise = atom.packages.activatePackage('atom-beautify');
        pack = atom.packages.getLoadedPackage("atom-beautify");
        pack.activateNow();
        return activationPromise;
      });
    });
    return describe("Beautifier::beautify", function() {
      var OSSpecificSpecs, beautifier;
      beautifier = null;
      beforeEach(function() {
        return beautifier = new PHPCSFixer();
      });
      OSSpecificSpecs = function() {
        var failWhichProgram, text;
        text = "<?php echo \"test\"; ?>";
        it("should error when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, language, options, p;
            language = "PHP";
            options = {
              fixers: "",
              levels: ""
            };
            beautifier.spawn = function(exe, args, options) {
              var er;
              er = new Error('ENOENT');
              er.code = 'ENOENT';
              return beautifier.Promise.reject(er);
            };
            p = beautifier.beautify(text, language, options);
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true, "Expected '" + v + "' to be instance of Error");
              expect(v.code).toBe("CommandNotFound", "Expected to be CommandNotFound");
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        failWhichProgram = function(failingProgram) {
          return it("should error when '" + failingProgram + "' not found", function() {
            expect(beautifier).not.toBe(null);
            expect(beautifier instanceof Beautifier).toBe(true);
            if (!beautifier.isWindows && failingProgram === "php") {
              return;
            }
            return waitsForPromise({
              shouldReject: true
            }, function() {
              var cb, language, oldSpawn, options, p;
              language = "PHP";
              options = {
                fixers: "",
                levels: ""
              };
              cb = function(v) {
                expect(v).not.toBe(null);
                expect(v instanceof Error).toBe(true, "Expected '" + v + "' to be instance of Error");
                expect(v.code).toBe("CommandNotFound", "Expected to be CommandNotFound");
                expect(v.file).toBe(failingProgram);
                return v;
              };
              beautifier.which = function(exe, options) {
                if (exe == null) {
                  return beautifier.Promise.resolve(null);
                }
                if (exe === failingProgram) {
                  return beautifier.Promise.resolve(failingProgram);
                } else {
                  return beautifier.Promise.resolve("/" + exe);
                }
              };
              oldSpawn = beautifier.spawn.bind(beautifier);
              beautifier.spawn = function(exe, args, options) {
                var er;
                if (exe === failingProgram) {
                  er = new Error('ENOENT');
                  er.code = 'ENOENT';
                  return beautifier.Promise.reject(er);
                } else {
                  return beautifier.Promise.resolve({
                    returnCode: 0,
                    stdout: 'stdout',
                    stderr: ''
                  });
                }
              };
              p = beautifier.beautify(text, language, options);
              expect(p).not.toBe(null);
              expect(p instanceof beautifier.Promise).toBe(true);
              p.then(cb, cb);
              return p;
            });
          });
        };
        return failWhichProgram('php-cs-fixer');
      };
      if (!isWindows) {
        describe("Mac/Linux", function() {
          beforeEach(function() {
            return beautifier.isWindows = false;
          });
          return OSSpecificSpecs();
        });
      }
      return describe("Windows", function() {
        beforeEach(function() {
          return beautifier.isWindows = true;
        });
        return OSSpecificSpecs();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3BlYy9iZWF1dGlmaWVyLXBocC1jcy1maXhlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1Q0FBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsaUNBQVIsQ0FBYixDQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSwrQkFBUixDQURiLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBVUEsU0FBQSxHQUFZLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLE9BQXBCLElBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFaLEtBQXNCLFFBRFosSUFFVixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQVosS0FBc0IsTUFaeEIsQ0FBQTs7QUFBQSxFQWNBLFFBQUEsQ0FBUyx5QkFBVCxFQUFvQyxTQUFBLEdBQUE7QUFFbEMsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBR1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7QUFDZCxZQUFBLHVCQUFBO0FBQUEsUUFBQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsZUFBOUIsQ0FBcEIsQ0FBQTtBQUFBLFFBRUEsSUFBQSxHQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsZUFBL0IsQ0FGUCxDQUFBO0FBQUEsUUFHQSxJQUFJLENBQUMsV0FBTCxDQUFBLENBSEEsQ0FBQTtBQU9BLGVBQU8saUJBQVAsQ0FSYztNQUFBLENBQWhCLEVBSFM7SUFBQSxDQUFYLENBQUEsQ0FBQTtXQWFBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBLEdBQUE7QUFFL0IsVUFBQSwyQkFBQTtBQUFB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

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/spec/beautifier-php-cs-fixer-spec.coffee

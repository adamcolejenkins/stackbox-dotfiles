(function() {
  var Beautifier, Beautifiers, Languages, Promise, beautifiers, fs, isWindows, path, temp, _;

  Beautifiers = require("../src/beautifiers");

  beautifiers = new Beautifiers();

  Beautifier = require("../src/beautifiers/beautifier");

  Languages = require('../src/languages/');

  _ = require('lodash');

  fs = require('fs');

  path = require('path');

  Promise = require("bluebird");

  temp = require('temp');

  temp.track();

  isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';

  describe("Atom-Beautify", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        var activationPromise, pack;
        activationPromise = atom.packages.activatePackage('atom-beautify');
        pack = atom.packages.getLoadedPackage("atom-beautify");
        pack.activateNow();
        return activationPromise;
      });
    });
    afterEach(function() {
      return temp.cleanupSync();
    });
    describe("Beautifiers", function() {
      var beautifier;
      beautifier = null;
      beforeEach(function() {
        return beautifier = new Beautifier();
      });
      return describe("Beautifier::run", function() {
        it("should error when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, p;
            p = beautifier.run("program", []);
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true);
              expect(v.code).toBe("CommandNotFound");
              expect(v.description).toBe(void 0, 'Error should not have a description.');
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        it("should error with help description when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, help, p;
            help = {
              link: "http://test.com",
              program: "test-program",
              pathOption: "Lang - Test Program Path"
            };
            p = beautifier.run("program", [], {
              help: help
            });
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true);
              expect(v.code).toBe("CommandNotFound");
              expect(v.description).not.toBe(null);
              expect(v.description.indexOf(help.link)).not.toBe(-1);
              expect(v.description.indexOf(help.program)).not.toBe(-1);
              expect(v.description.indexOf(help.pathOption)).not.toBe(-1, "Error should have a description.");
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        it("should error with Windows-specific help description when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, help, p, terminal, whichCmd;
            help = {
              link: "http://test.com",
              program: "test-program",
              pathOption: "Lang - Test Program Path"
            };
            beautifier.isWindows = true;
            terminal = 'CMD prompt';
            whichCmd = "where.exe";
            p = beautifier.run("program", [], {
              help: help
            });
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true);
              expect(v.code).toBe("CommandNotFound");
              expect(v.description).not.toBe(null);
              expect(v.description.indexOf(help.link)).not.toBe(-1);
              expect(v.description.indexOf(help.program)).not.toBe(-1);
              expect(v.description.indexOf(help.pathOption)).not.toBe(-1, "Error should have a description.");
              expect(v.description.indexOf(terminal)).not.toBe(-1, "Error should have a description including '" + terminal + "' in message.");
              expect(v.description.indexOf(whichCmd)).not.toBe(-1, "Error should have a description including '" + whichCmd + "' in message.");
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        if (!isWindows) {
          return it("should error with Mac/Linux-specific help description when beautifier's program not found", function() {
            expect(beautifier).not.toBe(null);
            expect(beautifier instanceof Beautifier).toBe(true);
            return waitsForPromise({
              shouldReject: true
            }, function() {
              var cb, help, p, terminal, whichCmd;
              help = {
                link: "http://test.com",
                program: "test-program",
                pathOption: "Lang - Test Program Path"
              };
              beautifier.isWindows = false;
              terminal = "Terminal";
              whichCmd = "which";
              p = beautifier.run("program", [], {
                help: help
              });
              expect(p).not.toBe(null);
              expect(p instanceof beautifier.Promise).toBe(true);
              cb = function(v) {
                expect(v).not.toBe(null);
                expect(v instanceof Error).toBe(true);
                expect(v.code).toBe("CommandNotFound");
                expect(v.description).not.toBe(null);
                expect(v.description.indexOf(help.link)).not.toBe(-1);
                expect(v.description.indexOf(help.program)).not.toBe(-1);
                expect(v.description.indexOf(terminal)).not.toBe(-1, "Error should have a description including '" + terminal + "' in message.");
                expect(v.description.indexOf(whichCmd)).not.toBe(-1, "Error should have a description including '" + whichCmd + "' in message.");
                return v;
              };
              p.then(cb, cb);
              return p;
            });
          });
        }
      });
    });
    return describe("Options", function() {
      var beautifier, beautifyEditor, editor, workspaceElement;
      editor = null;
      beautifier = null;
      workspaceElement = atom.views.getView(atom.workspace);
      beforeEach(function() {
        beautifier = new Beautifiers();
        return waitsForPromise(function() {
          return atom.workspace.open().then(function(e) {
            editor = e;
            return expect(editor.getText()).toEqual("");
          });
        });
      });
      describe("Migrate Settings", function() {
        var migrateSettings;
        migrateSettings = function(beforeKey, afterKey, val) {
          atom.config.set("atom-beautify." + beforeKey, val);
          atom.commands.dispatch(workspaceElement, "atom-beautify:migrate-settings");
          expect(_.has(atom.config.get('atom-beautify'), beforeKey)).toBe(false);
          return expect(atom.config.get("atom-beautify." + afterKey)).toBe(val);
        };
        it("should migrate js_indent_size to js.indent_size", function() {
          migrateSettings("js_indent_size", "js.indent_size", 1);
          return migrateSettings("js_indent_size", "js.indent_size", 10);
        });
        it("should migrate analytics to general.analytics", function() {
          migrateSettings("analytics", "general.analytics", true);
          return migrateSettings("analytics", "general.analytics", false);
        });
        it("should migrate _analyticsUserId to general._analyticsUserId", function() {
          migrateSettings("_analyticsUserId", "general._analyticsUserId", "userid");
          return migrateSettings("_analyticsUserId", "general._analyticsUserId", "userid2");
        });
        it("should migrate language_js_disabled to js.disabled", function() {
          migrateSettings("language_js_disabled", "js.disabled", false);
          return migrateSettings("language_js_disabled", "js.disabled", true);
        });
        it("should migrate language_js_default_beautifier to js.default_beautifier", function() {
          migrateSettings("language_js_default_beautifier", "js.default_beautifier", "Pretty Diff");
          return migrateSettings("language_js_default_beautifier", "js.default_beautifier", "JS Beautify");
        });
        return it("should migrate language_js_beautify_on_save to js.beautify_on_save", function() {
          migrateSettings("language_js_beautify_on_save", "js.beautify_on_save", true);
          return migrateSettings("language_js_beautify_on_save", "js.beautify_on_save", false);
        });
      });
      beautifyEditor = function(callback) {
        var beforeText, delay, isComplete;
        isComplete = false;
        beforeText = null;
        delay = 500;
        runs(function() {
          beforeText = editor.getText();
          atom.commands.dispatch(workspaceElement, "atom-beautify:beautify-editor");
          return setTimeout(function() {
            return isComplete = true;
          }, delay);
        });
        waitsFor(function() {
          return isComplete;
        });
        return runs(function() {
          var afterText;
          afterText = editor.getText();
          expect(typeof beforeText).toBe('string');
          expect(typeof afterText).toBe('string');
          return callback(beforeText, afterText);
        });
      };
      return describe("JavaScript", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            var packName;
            packName = 'language-javascript';
            return atom.packages.activatePackage(packName);
          });
          return runs(function() {
            var code, grammar;
            code = "var hello='world';function(){console.log('hello '+hello)}";
            editor.setText(code);
            grammar = atom.grammars.selectGrammar('source.js');
            expect(grammar.name).toBe('JavaScript');
            editor.setGrammar(grammar);
            expect(editor.getGrammar().name).toBe('JavaScript');
            return jasmine.unspy(window, 'setTimeout');
          });
        });
        describe(".jsbeautifyrc", function() {
          return it("should look at directories above file", function() {
            var cb, isDone;
            isDone = false;
            cb = function(err) {
              isDone = true;
              return expect(err).toBe(void 0);
            };
            runs(function() {
              var err;
              try {
                return temp.mkdir('dir1', function(err, dirPath) {
                  var myData, myData1, rcPath;
                  if (err) {
                    return cb(err);
                  }
                  rcPath = path.join(dirPath, '.jsbeautifyrc');
                  myData1 = {
                    indent_size: 1,
                    indent_char: '\t'
                  };
                  myData = JSON.stringify(myData1);
                  return fs.writeFile(rcPath, myData, function(err) {
                    if (err) {
                      return cb(err);
                    }
                    dirPath = path.join(dirPath, 'dir2');
                    return fs.mkdir(dirPath, function(err) {
                      var myData2;
                      if (err) {
                        return cb(err);
                      }
                      rcPath = path.join(dirPath, '.jsbeautifyrc');
                      myData2 = {
                        indent_size: 2,
                        indent_char: ' '
                      };
                      myData = JSON.stringify(myData2);
                      return fs.writeFile(rcPath, myData, function(err) {
                        if (err) {
                          return cb(err);
                        }
                        return Promise.all(beautifier.getOptionsForPath(rcPath, null)).then(function(allOptions) {
                          var config1, config2, configOptions, editorConfigOptions, editorOptions, homeOptions, projectOptions, _ref;
                          editorOptions = allOptions[0], configOptions = allOptions[1], homeOptions = allOptions[2], editorConfigOptions = allOptions[3];
                          projectOptions = allOptions.slice(4);
                          _ref = projectOptions.slice(-2), config1 = _ref[0], config2 = _ref[1];
                          expect(_.get(config1, '_default.indent_size')).toBe(myData1.indent_size);
                          expect(_.get(config2, '_default.indent_size')).toBe(myData2.indent_size);
                          expect(_.get(config1, '_default.indent_char')).toBe(myData1.indent_char);
                          expect(_.get(config2, '_default.indent_char')).toBe(myData2.indent_char);
                          return cb();
                        });
                      });
                    });
                  });
                });
              } catch (_error) {
                err = _error;
                return cb(err);
              }
            });
            return waitsFor(function() {
              return isDone;
            });
          });
        });
        return describe("Package settings", function() {
          var getOptions;
          getOptions = function(callback) {
            var options;
            options = null;
            waitsForPromise(function() {
              var allOptions;
              allOptions = beautifier.getOptionsForPath(null, null);
              return Promise.all(allOptions).then(function(allOptions) {
                return options = allOptions;
              });
            });
            return runs(function() {
              return callback(options);
            });
          };
          it("should change indent_size to 1", function() {
            atom.config.set('atom-beautify.js.indent_size', 1);
            return getOptions(function(allOptions) {
              var configOptions;
              expect(typeof allOptions).toBe('object');
              configOptions = allOptions[1];
              expect(typeof configOptions).toBe('object');
              expect(configOptions.js.indent_size).toBe(1);
              return beautifyEditor(function(beforeText, afterText) {
                return expect(afterText).toBe("var hello = 'world';\n\nfunction() {\n console.log('hello ' + hello)\n}");
              });
            });
          });
          return it("should change indent_size to 10", function() {
            atom.config.set('atom-beautify.js.indent_size', 10);
            return getOptions(function(allOptions) {
              var configOptions;
              expect(typeof allOptions).toBe('object');
              configOptions = allOptions[1];
              expect(typeof configOptions).toBe('object');
              expect(configOptions.js.indent_size).toBe(10);
              return beautifyEditor(function(beforeText, afterText) {
                return expect(afterText).toBe("var hello = 'world';\n\nfunction() {\n          console.log('hello ' + hello)\n}");
              });
            });
          });
        });
      });
    });
  });

  describe("Languages", function() {
    var languages;
    languages = null;
    beforeEach(function() {
      return languages = new Languages();
    });
    return describe("Languages::namespace", function() {
      return it("should verify that multiple languages do not share the same namespace", function() {
        var namespaceGroups, namespaceOverlap, namespacePairs;
        namespaceGroups = _.groupBy(languages.languages, "namespace");
        namespacePairs = _.toPairs(namespaceGroups);
        namespaceOverlap = _.filter(namespacePairs, function(_arg) {
          var group, namespace;
          namespace = _arg[0], group = _arg[1];
          return group.length > 1;
        });
        return expect(namespaceOverlap.length).toBe(0, "Language namespaces are overlapping.\nNamespaces are unique: only one language for each namespace.\n" + _.map(namespaceOverlap, function(_arg) {
          var group, namespace;
          namespace = _arg[0], group = _arg[1];
          return "- '" + namespace + "': Check languages " + (_.map(group, 'name').join(', ')) + " for using namespace '" + namespace + "'.";
        }).join('\n'));
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3BlYy9hdG9tLWJlYXV0aWZ5LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNGQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxvQkFBUixDQUFkLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWtCLElBQUEsV0FBQSxDQUFBLENBRGxCLENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEsT0FBQSxDQUFRLCtCQUFSLENBRmIsQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVIsQ0FIWixDQUFBOztBQUFBLEVBSUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBSkosQ0FBQTs7QUFBQSxFQUtBLEVBQUEsR0FBTyxPQUFBLENBQVEsSUFBUixDQUxQLENBQUE7O0FBQUEsRUFNQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FOUCxDQUFBOztBQUFBLEVBT0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSLENBUFYsQ0FBQTs7QUFBQSxFQVFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQVJQLENBQUE7O0FBQUEsRUFTQSxJQUFJLENBQUMsS0FBTCxDQUFBLENBVEEsQ0FBQTs7QUFBQSxFQWlCQSxTQUFBLEdBQVksT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FBcEIsSUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQVosS0FBc0IsUUFEWixJQUVWLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBWixLQUFzQixNQW5CeEIsQ0FBQTs7QUFBQSxFQXFCQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7QUFFeEIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBR1QsZUFBQSxDQUFnQixTQUFBLEdB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

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/spec/atom-beautify-spec.coffee

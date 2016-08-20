'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Promise = require('bluebird');
var readdir = Promise.promisify(require('fs').readdir);
var path = require('path');
var fuzzaldrin = require('fuzzaldrin');
var escapeRegExp = require('lodash.escaperegexp');
var get = require('lodash.get');
var findBabelConfig = require('find-babel-config');
var internalModules = require('./internal-modules');

var LINE_REGEXP = /require|import|export\s+(?:\*|{[a-zA-Z0-9_$,\s]+})+\s+from|}\s*from\s*['"]/;
var SELECTOR = ['.source.js .string.quoted',
// for babel-language plugin
'.source.js .punctuation.definition.string.begin', '.source.ts .string.quoted', '.source.coffee .string.quoted'];
var SELECTOR_DISABLE = ['.source.js .comment', '.source.js .keyword', '.source.ts .comment', '.source.ts .keyword'];

var CompletionProvider = (function () {
  function CompletionProvider() {
    _classCallCheck(this, CompletionProvider);

    this.selector = SELECTOR.join(', ');
    this.disableForSelector = SELECTOR_DISABLE.join(', ');
    this.inclusionPriority = 1;
  }

  _createClass(CompletionProvider, [{
    key: 'getSuggestions',
    value: function getSuggestions(_ref) {
      var _this = this;

      var editor = _ref.editor;
      var bufferPosition = _ref.bufferPosition;
      var prefix = _ref.prefix;

      var line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      if (!LINE_REGEXP.test(line)) {
        return [];
      }

      var realPrefix = this.getRealPrefix(prefix, line);
      if (!realPrefix) {
        return [];
      }

      if (realPrefix[0] === '.') {
        return this.lookupLocal(realPrefix, path.dirname(editor.getPath()));
      }

      var vendors = atom.config.get('autocomplete-modules.vendors');

      var promises = vendors.map(function (vendor) {
        return _this.lookupGlobal(realPrefix, vendor);
      });

      var webpack = atom.config.get('autocomplete-modules.webpack');
      if (webpack) {
        promises.push(this.lookupWebpack(realPrefix));
      }

      var babelPluginModuleAlias = atom.config.get('autocomplete-modules.babelPluginModuleAlias');
      if (babelPluginModuleAlias) {
        promises.push(this.lookupBabelPluginModuleAlias(realPrefix));
      }

      return Promise.all(promises).then(function (suggestions) {
        var _ref2;

        return (_ref2 = []).concat.apply(_ref2, _toConsumableArray(suggestions));
      });
    }
  }, {
    key: 'getRealPrefix',
    value: function getRealPrefix(prefix, line) {
      try {
        var realPrefixRegExp = new RegExp('[\'"]((?:.+?)*' + escapeRegExp(prefix) + ')');
        var realPrefixMathes = realPrefixRegExp.exec(line);
        if (!realPrefixMathes) {
          return false;
        }

        return realPrefixMathes[1];
      } catch (e) {
        return false;
      }
    }
  }, {
    key: 'filterSuggestions',
    value: function filterSuggestions(prefix, suggestions) {
      return fuzzaldrin.filter(suggestions, prefix, {
        key: 'text'
      });
    }
  }, {
    key: 'lookupLocal',
    value: function lookupLocal(prefix, dirname) {
      var _this2 = this;

      var filterPrefix = prefix.replace(path.dirname(prefix), '').replace('/', '');
      if (filterPrefix[filterPrefix.length - 1] === '/') {
        filterPrefix = '';
      }

      var includeExtension = atom.config.get('autocomplete-modules.includeExtension');
      var lookupDirname = path.resolve(dirname, prefix);
      if (filterPrefix) {
        lookupDirname = lookupDirname.replace(new RegExp(escapeRegExp(filterPrefix) + '$'), '');
      }

      return readdir(lookupDirname)['catch'](function (e) {
        if (e.code !== 'ENOENT') {
          throw e;
        }

        return [];
      }).filter(function (filename) {
        return filename[0] !== '.';
      }).map(function (pathname) {
        return {
          text: includeExtension ? pathname : _this2.normalizeLocal(pathname),
          displayText: pathname,
          type: 'package'
        };
      }).then(function (suggestions) {
        return _this2.filterSuggestions(filterPrefix, suggestions);
      });
    }
  }, {
    key: 'normalizeLocal',
    value: function normalizeLocal(filename) {
      return filename.replace(/\.(js|es6|jsx|coffee|ts|tsx)$/, '');
    }
  }, {
    key: 'lookupGlobal',
    value: function lookupGlobal(prefix) {
      var _this3 = this;

      var vendor = arguments.length <= 1 || arguments[1] === undefined ? 'node_modules' : arguments[1];

      var projectPath = atom.project.getPaths()[0];
      if (!projectPath) {
        return Promise.resolve([]);
      }

      var vendorPath = path.join(projectPath, vendor);
      if (prefix.indexOf('/') !== -1) {
        return this.lookupLocal('./' + prefix, vendorPath);
      }

      return readdir(vendorPath)['catch'](function (e) {
        if (e.code !== 'ENOENT') {
          throw e;
        }

        return [];
      }).then(function (libs) {
        return [].concat(_toConsumableArray(internalModules), _toConsumableArray(libs));
      }).map(function (lib) {
        return {
          text: lib,
          type: 'package'
        };
      }).then(function (suggestions) {
        return _this3.filterSuggestions(prefix, suggestions);
      });
    }
  }, {
    key: 'lookupWebpack',
    value: function lookupWebpack(prefix) {
      var _this4 = this;

      var projectPath = atom.project.getPaths()[0];
      if (!projectPath) {
        return Promise.resolve([]);
      }

      var vendors = atom.config.get('autocomplete-modules.vendors');
      var webpackConfig = this.fetchWebpackConfig(projectPath);

      var moduleSearchPaths = get(webpackConfig, 'resolve.modulesDirectories', []);
      moduleSearchPaths = moduleSearchPaths.filter(function (item) {
        return vendors.indexOf(item) === -1;
      });

      return Promise.all(moduleSearchPaths.map(function (searchPath) {
        return _this4.lookupLocal(prefix, searchPath);
      })).then(function (suggestions) {
        var _ref3;

        return (_ref3 = []).concat.apply(_ref3, _toConsumableArray(suggestions));
      });
    }
  }, {
    key: 'fetchWebpackConfig',
    value: function fetchWebpackConfig(rootPath) {
      var webpackConfigFilename = atom.config.get('autocomplete-modules.webpackConfigFilename');
      var webpackConfigPath = path.join(rootPath, webpackConfigFilename);

      try {
        return require(webpackConfigPath); // eslint-disable-line
      } catch (error) {
        return {};
      }
    }
  }, {
    key: 'lookupBabelPluginModuleAlias',
    value: function lookupBabelPluginModuleAlias(prefix) {
      var _this5 = this;

      var projectPath = atom.project.getPaths()[0];
      if (projectPath) {
        var c = findBabelConfig(projectPath);
        if (c && c.config && Array.isArray(c.config.plugins)) {
          var _ret = (function () {
            var pluginConfig = c.config.plugins.find(function (p) {
              return p[0] === 'module-alias';
            });
            if (!pluginConfig) {
              return {
                v: Promise.resolve([])
              };
            }

            // determine the right prefix
            // `realPrefix` is the prefix we want to use to find the right file/suggestions
            // when the prefix is a sub module (eg. module/subfile),
            // `modulePrefix` will be "module", and `realPrefix` will be "subfile"
            var prefixSplit = prefix.split('/');
            var modulePrefix = prefixSplit[0];
            var realPrefix = prefixSplit.pop();
            var moduleSearchPath = prefixSplit.join('/');

            // get the alias configs for the specific module
            var aliasesConfig = pluginConfig[1].filter(function (alias) {
              return alias.expose.startsWith(modulePrefix);
            });

            return {
              v: Promise.all(aliasesConfig.map(function (alias) {
                // The search path is the parent directory of the source directory specified in .babelrc
                // then we append the `moduleSearchPath` to get the real search path
                var searchPath = path.join(path.dirname(path.resolve(projectPath, alias.src)), moduleSearchPath);

                return _this5.lookupLocal(realPrefix, searchPath);
              })).then(function (suggestions) {
                var _ref4;

                return (_ref4 = []).concat.apply(_ref4, _toConsumableArray(suggestions));
              }).then(function (suggestions) {
                if (prefix === realPrefix) {
                  // make sure the suggestions are from the compatible aliases
                  return suggestions.filter(function (sugg) {
                    return aliasesConfig.find(function (a) {
                      return a.expose === sugg.text;
                    });
                  });
                }
                return suggestions;
              })
            };
          })();

          if (typeof _ret === 'object') return _ret.v;
        }
      }

      return Promise.resolve([]);
    }
  }]);

  return CompletionProvider;
})();

module.exports = CompletionProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS9hdG9tLnN5bWxpbmsvcGFja2FnZXMvYXV0b2NvbXBsZXRlLW1vZHVsZXMvc3JjL2NvbXBsZXRpb24tcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7OztBQUVaLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6RCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3pDLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ3BELElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNsQyxJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNyRCxJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs7QUFFdEQsSUFBTSxXQUFXLEdBQUcsNEVBQTRFLENBQUM7QUFDakcsSUFBTSxRQUFRLEdBQUcsQ0FDZiwyQkFBMkI7O0FBRTNCLGlEQUFpRCxFQUNqRCwyQkFBMkIsRUFDM0IsK0JBQStCLENBQ2hDLENBQUM7QUFDRixJQUFNLGdCQUFnQixHQUFHLENBQ3ZCLHFCQUFxQixFQUNyQixxQkFBcUIsRUFDckIscUJBQXFCLEVBQ3JCLHFCQUFxQixDQUN0QixDQUFDOztJQUVJLGtCQUFrQjtBQUNYLFdBRFAsa0JBQWtCLEdBQ1I7MEJBRFYsa0JBQWtCOztBQUVwQixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEMs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QUFDOztBQUU3RjtpQkFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ2xDLFVBQUMsS0FBSyxFQUFLOzs7QUFHVCxvQkFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFDbEQsZ0JBQWdCLENBQ2pCLENBQUM7O0FBRUYsdUJBQU8sT0FBSyxXQUFXLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2VBQ2pELENBQ0YsQ0FBQyxDQUFDLElBQUksQ0FDTCxVQUFDLFdBQVc7Ozt1QkFBSyxTQUFBLEVBQUUsRUFBQyxNQUFNLE1BQUEsMkJBQUksV0FBVyxFQUFDO2VBQUEsQ0FDM0MsQ0FBQyxJQUFJLENBQUMsVUFBQSxXQUFXLEVBQUk7QUFDcEIsb0JBQUksTUFBTSxLQUFLLFVBQVUsRUFBRTs7QUFFekIseUJBQU8sV0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUk7MkJBQzVCLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDOzZCQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLElBQUk7cUJBQUEsQ0FBQzttQkFBQSxDQUNoRCxDQUFDO2lCQUNIO0FBQ0QsdUJBQU8sV0FBVyxDQUFDO2VBQ3BCLENBQUM7Y0FBQzs7OztTQUNKO09BQ0Y7O0FBRUQsYUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzVCOzs7U0EzTUcsa0JBQWtCOzs7QUE4TXhCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsa0JBQWtCLENBQUMiLCJmaWxlIjoiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdXRvY29tcGxldGUtbW9kdWxlcy9zcmMvY29tcGxldGlvbi1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbmNvbnN0IHJlYWRkaXIgPSBQcm9taXNlLnByb21pc2lmeShyZXF1aXJlKCdmcycpLnJlYWRkaXIpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IGZ1enphbGRyaW4gPSByZXF1aXJlKCdmdXp6YWxkcmluJyk7XG5jb25zdCBlc2NhcGVSZWdFeHAgPSByZXF1aXJlKCdsb2Rhc2guZXNjYXBlcmVnZXhwJyk7XG5jb25zdCBnZXQgPSByZXF1aXJlKCdsb2Rhc2guZ2V0Jyk7XG5jb25zdCBmaW5kQmFiZWxDb25maWcgPSByZXF1aXJlKCdmaW5kLWJhYmVsLWNvbmZpZycpO1xuY29uc3QgaW50ZXJuYWxNb2R1bGVzID0gcmVxdWlyZSgnLi9pbnRlcm5hbC1tb2R1bGVzJyk7XG5cbmNvbnN0IExJTkVfUkVHRVhQID0gL3JlcXVpcmV8aW1wb3J0fGV4cG9ydFxccysoPzpcXCp8e1thLXpBLVowLTlfJCxcXHNdK30pK1xccytmcm9tfH1cXHMqZnJvbVxccypbJ1wiXS87XG5jb25zdCBTRUxFQ1RPUiA9IFtcbiAgJy5zb3VyY2UuanMgLnN0cmluZy5xdW90ZWQnLFxuICAvLyBmb3IgYmFiZWwtbGFuZ3VhZ2UgcGx1Z2luXG4gICcuc291cmNlLmpzIC5wdW5jdHVhdGlvbi5kZWZpbml0aW9uLnN0cmluZy5iZWdpbicsXG4gICcuc291cmNlLnRzIC5zdHJpbmcucXVvdGVkJyxcbiAgJy5zb3VyY2UuY29mZmVlIC5zdHJpbmcucXVvdGVkJ1xuXTtcbmNvbnN0IFNFTEVDVE9SX0RJU0FCTEUgPSBbXG4gICcuc291cmNlLmpzIC5jb21tZW50JyxcbiAgJy5zb3VyY2UuanMgLmtleXdvcmQnLFxuICAnLnNvdXJjZS50cyAuY29tbWVudCcsXG4gICcuc291cmNlLnRzIC5rZXl3b3JkJ1xuXTtcblxuY2xhc3MgQ29tcGxldGlvblByb3ZpZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWxlY3RvciA9IFNFTEVDVE9SLmpvaW4oJywgJyk7XG4gICAgdGhpcy5kaXNhYmxlRm9yU2VsZWN0b3IgPSBTRUxFQ1RPUl9ESVNBQkxFLmpvaW4oJywgJyk7XG4gICAgdGhpcy5pbmNsdXNpb25Qcmlvcml0eSA9IDE7XG4gIH1cblxuICBnZXRTdWdnZXN0aW9ucyh7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgcHJlZml4fSkge1xuICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pO1xuICAgIGlmICghTElORV9SRUdFWFAudGVzdChsaW5lKSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IHJlYWxQcmVmaXggPSB0aGlzLmdldFJlYWxQcmVmaXgocHJlZml4LCBsaW5lKTtcbiAgICBpZiAoIXJlYWxQcmVmaXgpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBpZiAocmVhbFByZWZpeFswXSA9PT0gJy4nKSB7XG4gICAgICByZXR1cm4gdGhpcy5sb29rdXBMb2NhbChyZWFsUHJlZml4LCBwYXRoLmRpcm5hbWUoZWRpdG9yLmdldFBhdGgoKSkpO1xuICAgIH1cblxuICAgIGNvbnN0IHZlbmRvcnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1tb2R1bGVzLnZlbmRvcnMnKTtcblxuICAgIGNvbnN0IHByb21pc2VzID0gdmVuZG9ycy5tYXAoXG4gICAgICAodmVuZG9yKSA9PiB0aGlzLmxvb2t1cEdsb2JhbChyZWFsUHJlZml4LCB2ZW5kb3IpXG4gICAgKTtcblxuICAgIGNvbnN0IHdlYnBhY2sgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1tb2R1bGVzLndlYnBhY2snKTtcbiAgICBpZiAod2VicGFjaykge1xuICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLmxvb2t1cFdlYnBhY2socmVhbFByZWZpeCkpO1xuICAgIH1cblxuICAgIGNvbnN0IGJhYmVsUGx1Z2luTW9kdWxlQWxpYXMgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1tb2R1bGVzLmJhYmVsUGx1Z2luTW9kdWxlQWxpYXMnKTtcbiAgICBpZiAoYmFiZWxQbHVnaW5Nb2R1bGVBbGlhcykge1xuICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLmxvb2t1cEJhYmVsUGx1Z2luTW9kdWxlQWxpYXMocmVhbFByZWZpeCkpO1xuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihcbiAgICAgIChzdWdnZXN0aW9ucykgPT4gW10uY29uY2F0KC4uLnN1Z2dlc3Rpb25zKVxuICAgICk7XG4gIH1cblxuICBnZXRSZWFsUHJlZml4KHByZWZpeCwgbGluZSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZWFsUHJlZml4UmVnRXhwID0gbmV3IFJlZ0V4cChgWydcIl0oKD86Lis/KSoke2VzY2FwZVJlZ0V4cChwcmVmaXgpfSlgKTtcbiAgICAgIGNvbnN0IHJlYWxQcmVmaXhNYXRoZXMgPSByZWFsUHJlZml4UmVnRXhwLmV4ZWMobGluZSk7XG4gICAgICBpZiAoIXJlYWxQcmVmaXhNYXRoZXMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVhbFByZWZpeE1hdGhlc1sxXTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZmlsdGVyU3VnZ2VzdGlvbnMocHJlZml4LCBzdWdnZXN0aW9ucykge1xuICAgIHJldHVybiBmdXp6YWxkcmluLmZpbHRlcihzdWdnZXN0aW9ucywgcHJlZml4LCB7XG4gICAgICBrZXk6ICd0ZXh0J1xuICAgIH0pO1xuICB9XG5cbiAgbG9va3VwTG9jYWwocHJlZml4LCBkaXJuYW1lKSB7XG4gICAgbGV0IGZpbHRlclByZWZpeCA9IHByZWZpeC5yZXBsYWNlKHBhdGguZGlybmFtZShwcmVmaXgpLCAnJykucmVwbGFjZSgnLycsICcnKTtcbiAgICBpZiAoZmlsdGVyUHJlZml4W2ZpbHRlclByZWZpeC5sZW5ndGggLSAxXSA9PT0gJy8nKSB7XG4gICAgICBmaWx0ZXJQcmVmaXggPSAnJztcbiAgICB9XG5cbiAgICBjb25zdCBpbmNsdWRlRXh0ZW5zaW9uID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtbW9kdWxlcy5pbmNsdWRlRXh0ZW5zaW9uJyk7XG4gICAgbGV0IGxvb2t1cERpcm5hbWUgPSBwYXRoLnJlc29sdmUoZGlybmFtZSwgcHJlZml4KTtcbiAgICBpZiAoZmlsdGVyUHJlZml4KSB7XG4gICAgICBsb29rdXBEaXJuYW1lID0gbG9va3VwRGlybmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoYCR7ZXNjYXBlUmVnRXhwKGZpbHRlclByZWZpeCl9JGApLCAnJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlYWRkaXIobG9va3VwRGlybmFtZSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIGlmIChlLmNvZGUgIT09ICdFTk9FTlQnKSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbXTtcbiAgICB9KS5maWx0ZXIoXG4gICAgICAoZmlsZW5hbWUpID0+IGZpbGVuYW1lWzBdICE9PSAnLidcbiAgICApLm1hcCgocGF0aG5hbWUpID0+ICh7XG4gICAgICB0ZXh0OiBpbmNsdWRlRXh0ZW5zaW9uID8gcGF0aG5hbWUgOiB0aGlzLm5vcm1hbGl6ZUxvY2FsKHBhdGhuYW1lKSxcbiAgICAgIGRpc3BsYXlUZXh0OiBwYXRobmFtZSxcbiAgICAgIHR5cGU6ICdwYWNrYWdlJ1xuICAgIH0pKS50aGVuKFxuICAgICAgKHN1Z2dlc3Rpb25zKSA9PiB0aGlzLmZpbHRlclN1Z2dlc3Rpb25zKGZpbHRlclByZWZpeCwgc3VnZ2VzdGlvbnMpXG4gICAgKTtcbiAgfVxuXG4gIG5vcm1hbGl6ZUxvY2FsKGZpbGVuYW1lKSB7XG4gICAgcmV0dXJuIGZpbGVuYW1lLnJlcGxhY2UoL1xcLihqc3xlczZ8anN4fGNvZmZlZXx0c3x0c3gpJC8sICcnKTtcbiAgfVxuXG4gIGxvb2t1cEdsb2JhbChwcmVmaXgsIHZlbmRvciA9ICdub2RlX21vZHVsZXMnKSB7XG4gICAgY29uc3QgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXTtcbiAgICBpZiAoIXByb2plY3RQYXRoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICB9XG5cbiAgICBjb25zdCB2ZW5kb3JQYXRoID0gcGF0aC5qb2luKHByb2plY3RQYXRoLCB2ZW5kb3IpO1xuICAgIGlmIChwcmVmaXguaW5kZXhPZignLycpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIHRoaXMubG9va3VwTG9jYWwoYC4vJHtwcmVmaXh9YCwgdmVuZG9yUGF0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlYWRkaXIodmVuZG9yUGF0aCkuY2F0Y2goKGUpID0+IHtcbiAgICAgIGlmIChlLmNvZGUgIT09ICdFTk9FTlQnKSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbXTtcbiAgICB9KS50aGVuKFxuICAgICAgKGxpYnMpID0+IFsuLi5pbnRlcm5hbE1vZHVsZXMsIC4uLmxpYnNdXG4gICAgKS5tYXAoKGxpYikgPT4gKHtcbiAgICAgIHRleHQ6IGxpYixcbiAgICAgIHR5cGU6ICdwYWNrYWdlJ1xuICAgIH0pKS50aGVuKFxuICAgICAgKHN1Z2dlc3Rpb25zKSA9PiB0aGlzLmZpbHRlclN1Z2dlc3Rpb25zKHByZWZpeCwgc3VnZ2VzdGlvbnMpXG4gICAgKTtcbiAgfVxuXG4gIGxvb2t1cFdlYnBhY2socHJlZml4KSB7XG4gICAgY29uc3QgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXTtcbiAgICBpZiAoIXByb2plY3RQYXRoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICB9XG5cbiAgICBjb25zdCB2ZW5kb3JzID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtbW9kdWxlcy52ZW5kb3JzJyk7XG4gICAgY29uc3Qgd2VicGFja0NvbmZpZyA9IHRoaXMuZmV0Y2hXZWJwYWNrQ29uZmlnKHByb2plY3RQYXRoKTtcblxuICAgIGxldCBtb2R1bGVTZWFyY2hQYXRocyA9IGdldCh3ZWJwYWNrQ29uZmlnLCAncmVzb2x2ZS5tb2R1bGVzRGlyZWN0b3JpZXMnLCBbXSk7XG4gICAgbW9kdWxlU2VhcmNoUGF0aHMgPSBtb2R1bGVTZWFyY2hQYXRocy5maWx0ZXIoXG4gICAgICAoaXRlbSkgPT4gdmVuZG9ycy5pbmRleE9mKGl0ZW0pID09PSAtMVxuICAgICk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwobW9kdWxlU2VhcmNoUGF0aHMubWFwKFxuICAgICAgKHNlYXJjaFBhdGgpID0+IHRoaXMubG9va3VwTG9jYWwocHJlZml4LCBzZWFyY2hQYXRoKVxuICAgICkpLnRoZW4oXG4gICAgICAoc3VnZ2VzdGlvbnMpID0+IFtdLmNvbmNhdCguLi5zdWdnZXN0aW9ucylcbiAgICApO1xuICB9XG5cbiAgZmV0Y2hXZWJwYWNrQ29uZmlnKHJvb3RQYXRoKSB7XG4gICAgY29uc3Qgd2VicGFja0NvbmZpZ0ZpbGVuYW1lID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtbW9kdWxlcy53ZWJwYWNrQ29uZmlnRmlsZW5hbWUnKTtcbiAgICBjb25zdCB3ZWJwYWNrQ29uZmlnUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgd2VicGFja0NvbmZpZ0ZpbGVuYW1lKTtcblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gcmVxdWlyZSh3ZWJwYWNrQ29uZmlnUGF0aCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfVxuXG4gIGxvb2t1cEJhYmVsUGx1Z2luTW9kdWxlQWxpYXMocHJlZml4KSB7XG4gICAgY29uc3QgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXTtcbiAgICBpZiAocHJvamVjdFBhdGgpIHtcbiAgICAgIGNvbnN0IGMgPSBmaW5kQmFiZWxDb25maWcocHJvamVjdFBhdGgpO1xuICAgICAgaWYgKGMgJiYgYy5jb25maWcgJiYgQXJyYXkuaXNBcnJheShjLmNvbmZpZy5wbHVnaW5zKSkge1xuICAgICAgICBjb25zdCBwbHVnaW5Db25maWcgPSBjLmNvbmZpZy5wbHVnaW5zLmZpbmQocCA9PiBwWzBdID09PSAnbW9kdWxlLWFsaWFzJyk7XG4gICAgICAgIGlmICghcGx1Z2luQ29uZmlnKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZXRlcm1pbmUgdGhlIHJpZ2h0IHByZWZpeFxuICAgICAgICAvLyBgcmVhbFByZWZpeGAgaXMgdGhlIHByZWZpeCB3ZSB3YW50IHRvIHVzZSB0byBmaW5kIHRoZSByaWdodCBmaWxlL3N1Z2dlc3Rpb25zXG4gICAgICAgIC8vIHdoZW4gdGhlIHByZWZpeCBpcyBhIHN1YiBtb2R1bGUgKGVnLiBtb2R1bGUvc3ViZmlsZSksXG4gICAgICAgIC8vIGBtb2R1bGVQcmVmaXhgIHdpbGwgYmUgXCJtb2R1bGVcIiwgYW5kIGByZWFsUHJlZml4YCB3aWxsIGJlIFwic3ViZmlsZVwiXG4gICAgICAgIGNvbnN0IHByZWZpeFNwbGl0ID0gcHJlZml4LnNwbGl0KCcvJyk7XG4gICAgICAgIGNvbnN0IG1vZHVsZVByZWZpeCA9IHByZWZpeFNwbGl0WzBdO1xuICAgICAgICBjb25zdCByZWFsUHJlZml4ID0gcHJlZml4U3BsaXQucG9wKCk7XG4gICAgICAgIGNvbnN0IG1vZHVsZVNlYXJjaFBhdGggPSBwcmVmaXhTcGxpdC5qb2luKCcvJyk7XG5cbiAgICAgICAgLy8gZ2V0IHRoZSBhbGlhcyBjb25maWdzIGZvciB0aGUgc3BlY2lmaWMgbW9kdWxlXG4gICAgICAgIGNvbnN0IGFsaWFzZXNDb25maWcgPSBwbHVnaW5Db25maWdbMV0uZmlsdGVyKGFsaWFzID0+IGFsaWFzLmV4cG9zZS5zdGFydHNXaXRoKG1vZHVsZVByZWZpeCkpO1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChhbGlhc2VzQ29uZmlnLm1hcChcbiAgICAgICAgICAoYWxpYXMpID0+IHtcbiAgICAgICAgICAgIC8vIFRoZSBzZWFyY2ggcGF0aCBpcyB0aGUgcGFyZW50IGRpcmVjdG9yeSBvZiB0aGUgc291cmNlIGRpcmVjdG9yeSBzcGVjaWZpZWQgaW4gLmJhYmVscmNcbiAgICAgICAgICAgIC8vIHRoZW4gd2UgYXBwZW5kIHRoZSBgbW9kdWxlU2VhcmNoUGF0aGAgdG8gZ2V0IHRoZSByZWFsIHNlYXJjaCBwYXRoXG4gICAgICAgICAgICBjb25zdCBzZWFyY2hQYXRoID0gcGF0aC5qb2luKFxuICAgICAgICAgICAgICBwYXRoLmRpcm5hbWUocGF0aC5yZXNvbHZlKHByb2plY3RQYXRoLCBhbGlhcy5zcmMpKSxcbiAgICAgICAgICAgICAgbW9kdWxlU2VhcmNoUGF0aFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9va3VwTG9jYWwocmVhbFByZWZpeCwgc2VhcmNoUGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICApKS50aGVuKFxuICAgICAgICAgIChzdWdnZXN0aW9ucykgPT4gW10uY29uY2F0KC4uLnN1Z2dlc3Rpb25zKVxuICAgICAgICApLnRoZW4oc3VnZ2VzdGlvbnMgPT4ge1xuICAgICAgICAgIGlmIChwcmVmaXggPT09IHJlYWxQcmVmaXgpIHtcbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgc3VnZ2VzdGlvbnMgYXJlIGZyb20gdGhlIGNvbXBhdGlibGUgYWxpYXNlc1xuICAgICAgICAgICAgcmV0dXJuIHN1Z2dlc3Rpb25zLmZpbHRlcihzdWdnID0+XG4gICAgICAgICAgICAgIGFsaWFzZXNDb25maWcuZmluZChhID0+IGEuZXhwb3NlID09PSBzdWdnLnRleHQpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc3VnZ2VzdGlvbnM7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcGxldGlvblByb3ZpZGVyO1xuIl19
//# sourceURL=/Users/ajenkins/.dotfiles/atom/atom.symlink/packages/autocomplete-modules/src/completion-provider.js

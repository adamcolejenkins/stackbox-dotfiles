'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CompletionProvider = require('./completion-provider');

var AutocompleteModulesPlugin = (function () {
  function AutocompleteModulesPlugin() {
    _classCallCheck(this, AutocompleteModulesPlugin);

    this.config = {
      includeExtension: {
        order: 1,
        title: 'Include file extension',
        description: "Include the file's extension when filling in the completion.",
        type: 'boolean',
        'default': false
      },
      vendors: {
        order: 2,
        title: 'Vendor directories',
        description: 'A list of directories to search for modules relative to the project root.',
        type: 'array',
        'default': ['node_modules'],
        items: {
          type: 'string'
        }
      },
      webpack: {
        order: 3,
        title: 'Webpack support',
        description: 'Attempts to use the given webpack configuration file resolution settings to search for modules.',
        type: 'boolean',
        'default': false
      },
      webpackConfigFilename: {
        order: 4,
        title: 'Webpack configuration filename',
        description: 'When "Webpack support" is enabled this is the config file used to supply module search paths.',
        type: 'string',
        'default': 'webpack.config.js'
      },
      babelPluginModuleAlias: {
        order: 5,
        title: 'Babel Plugin Module Alias support',
        description: 'Use the <a href="https://github.com/tleunen/babel-plugin-module-alias">Babel Plugin Module Alias</a> configuration located in your `.babelrc` or in the babel configuration in `package.json`.',
        type: 'boolean',
        'default': false
      }
    };
  }

  _createClass(AutocompleteModulesPlugin, [{
    key: 'activate',
    value: function activate() {
      this.completionProvider = new CompletionProvider();
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      delete this.completionProvider;
      this.completionProvider = null;
    }
  }, {
    key: 'getCompletionProvider',
    value: function getCompletionProvider() {
      return this.completionProvider;
    }
  }]);

  return AutocompleteModulesPlugin;
})();

module.exports = new AutocompleteModulesPlugin();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS9hdG9tLnN5bWxpbmsvcGFja2FnZXMvYXV0b2NvbXBsZXRlLW1vZHVsZXMvc3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7QUFFWixJQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDOztJQUV0RCx5QkFBeUI7QUFDbEIsV0FEUCx5QkFBeUIsR0FDZjswQkFEVix5QkFBeUI7O0FBRTNCLFFBQUksQ0FBQyxNQUFNLEdBQUc7QUFDWixzQkFBZ0IsRUFBRTtBQUNoQixhQUFLLEVBQUUsQ0FBQztBQUNSLGFBQUssRUFBRSx3QkFBd0I7QUFDL0IsbUJBQVcsRUFBRSw4REFBOEQ7QUFDM0UsWUFBSSxFQUFFLFNBQVM7QUFDZixtQkFBUyxLQUFLO09BQ2Y7QUFDRCxhQUFPLEVBQUU7QUFDUCxhQUFLLEVBQUUsQ0FBQztBQUNSLGFBQUssRUFBRSxvQkFBb0I7QUFDM0IsbUJBQVcsRUFBRSwyRUFBMkU7QUFDeEYsWUFBSSxFQUFFLE9BQU87QUFDYixtQkFBUyxDQUFDLGNBQWMsQ0FBQztBQUN6QixhQUFLLEVBQUU7QUFDTCxjQUFJLEVBQUUsUUFBUTtTQUNmO09BQ0Y7QUFDRCxhQUFPLEVBQUU7QUFDUCxhQUFLLEVBQUUsQ0FBQztBQUNSLGFBQUssRUFBRSxpQkFBaUI7QUFDeEIsbUJBQVcsRUFBRSxpR0FBaUc7QUFDOUcsWUFBSSxFQUFFLFNBQVM7QUFDZixtQkFBUyxLQUFLO09BQ2Y7QUFDRCwyQkFBcUIsRUFBRTtBQUNyQixhQUFLLEVBQUUsQ0FBQztBQUNSLGFBQUssRUFBRSxnQ0FBZ0M7QUFDdkMsbUJBQVcsRUFBRSwrRkFBK0Y7QUFDNUcsWUFBSSxFQUFFLFFBQVE7QUFDZCxtQkFBUyxtQkFBbUI7T0FDN0I7QUFDRCw0QkFBc0IsRUFBRTtBQUN0QixhQUFLLEVBQUUsQ0FBQztBQUNSLGFBQUssRUFBRSxtQ0FBbUM7QUFDMUMsbUJBQVcsRUFBRSxnTUFBZ007QUFDN00sWUFBSSxFQUFFLFNBQVM7QUFDZixtQkFBUyxLQUFLO09BQ2Y7S0FDRixDQUFDO0dBQ0g7O2VBMUNHLHlCQUF5Qjs7V0E0Q3JCLG9CQUFHO0FBQ1QsVUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztLQUNwRDs7O1dBRVMsc0JBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztBQUMvQixVQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0tBQ2hDOzs7V0FFb0IsaUNBQUc7QUFDdEIsYUFBTyxJQUFJLENBQUMsa0JBQWtCLENBQUM7S0FDaEM7OztTQXZERyx5QkFBeUI7OztBQTBEL0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLHlCQUF5QixFQUFFLENBQUMiLCJmaWxlIjoiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdXRvY29tcGxldGUtbW9kdWxlcy9zcmMvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCBDb21wbGV0aW9uUHJvdmlkZXIgPSByZXF1aXJlKCcuL2NvbXBsZXRpb24tcHJvdmlkZXInKTtcblxuY2xhc3MgQXV0b2NvbXBsZXRlTW9kdWxlc1BsdWdpbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgaW5jbHVkZUV4dGVuc2lvbjoge1xuICAgICAgICBvcmRlcjogMSxcbiAgICAgICAgdGl0bGU6ICdJbmNsdWRlIGZpbGUgZXh0ZW5zaW9uJyxcbiAgICAgICAgZGVzY3JpcHRpb246IFwiSW5jbHVkZSB0aGUgZmlsZSdzIGV4dGVuc2lvbiB3aGVuIGZpbGxpbmcgaW4gdGhlIGNvbXBsZXRpb24uXCIsXG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIH0sXG4gICAgICB2ZW5kb3JzOiB7XG4gICAgICAgIG9yZGVyOiAyLFxuICAgICAgICB0aXRsZTogJ1ZlbmRvciBkaXJlY3RvcmllcycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQSBsaXN0IG9mIGRpcmVjdG9yaWVzIHRvIHNlYXJjaCBmb3IgbW9kdWxlcyByZWxhdGl2ZSB0byB0aGUgcHJvamVjdCByb290LicsXG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIGRlZmF1bHQ6IFsnbm9kZV9tb2R1bGVzJ10sXG4gICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHdlYnBhY2s6IHtcbiAgICAgICAgb3JkZXI6IDMsXG4gICAgICAgIHRpdGxlOiAnV2VicGFjayBzdXBwb3J0JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdBdHRlbXB0cyB0byB1c2UgdGhlIGdpdmVuIHdlYnBhY2sgY29uZmlndXJhdGlvbiBmaWxlIHJlc29sdXRpb24gc2V0dGluZ3MgdG8gc2VhcmNoIGZvciBtb2R1bGVzLicsXG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIH0sXG4gICAgICB3ZWJwYWNrQ29uZmlnRmlsZW5hbWU6IHtcbiAgICAgICAgb3JkZXI6IDQsXG4gICAgICAgIHRpdGxlOiAnV2VicGFjayBjb25maWd1cmF0aW9uIGZpbGVuYW1lJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdXaGVuIFwiV2VicGFjayBzdXBwb3J0XCIgaXMgZW5hYmxlZCB0aGlzIGlzIHRoZSBjb25maWcgZmlsZSB1c2VkIHRvIHN1cHBseSBtb2R1bGUgc2VhcmNoIHBhdGhzLicsXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBkZWZhdWx0OiAnd2VicGFjay5jb25maWcuanMnXG4gICAgICB9LFxuICAgICAgYmFiZWxQbHVnaW5Nb2R1bGVBbGlhczoge1xuICAgICAgICBvcmRlcjogNSxcbiAgICAgICAgdGl0bGU6ICdCYWJlbCBQbHVnaW4gTW9kdWxlIEFsaWFzIHN1cHBvcnQnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1VzZSB0aGUgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS90bGV1bmVuL2JhYmVsLXBsdWdpbi1tb2R1bGUtYWxpYXNcIj5CYWJlbCBQbHVnaW4gTW9kdWxlIEFsaWFzPC9hPiBjb25maWd1cmF0aW9uIGxvY2F0ZWQgaW4geW91ciBgLmJhYmVscmNgIG9yIGluIHRoZSBiYWJlbCBjb25maWd1cmF0aW9uIGluIGBwYWNrYWdlLmpzb25gLicsXG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5jb21wbGV0aW9uUHJvdmlkZXIgPSBuZXcgQ29tcGxldGlvblByb3ZpZGVyKCk7XG4gIH1cblxuICBkZWFjdGl2YXRlKCkge1xuICAgIGRlbGV0ZSB0aGlzLmNvbXBsZXRpb25Qcm92aWRlcjtcbiAgICB0aGlzLmNvbXBsZXRpb25Qcm92aWRlciA9IG51bGw7XG4gIH1cblxuICBnZXRDb21wbGV0aW9uUHJvdmlkZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tcGxldGlvblByb3ZpZGVyO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEF1dG9jb21wbGV0ZU1vZHVsZXNQbHVnaW4oKTtcbiJdfQ==
//# sourceURL=/Users/ajenkins/.dotfiles/atom/atom.symlink/packages/autocomplete-modules/src/main.js

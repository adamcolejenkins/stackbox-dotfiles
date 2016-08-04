'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CompletionProvider = require('./completion-provider');

var AutocompleteModulesPlugin = (function () {
  function AutocompleteModulesPlugin() {
    _classCallCheck(this, AutocompleteModulesPlugin);

    this.config = {
      includeExtension: {
        title: 'Include file extension',
        description: "Include the file's extension when filling in the completion.",
        type: 'boolean',
        'default': false
      },
      vendors: {
        title: 'Vendor directories',
        description: 'A list of directories to search for modules relative to the project root.',
        type: 'array',
        'default': ['node_modules'],
        items: {
          type: 'string'
        }
      },
      webpack: {
        title: 'Webpack support',
        description: 'Attempts to use the given webpack configuration file resolution settings to search for modules.',
        type: 'boolean',
        'default': false
      },
      webpackConfigFilename: {
        title: 'Webpack configuration filename',
        description: 'When "Webpack support" is enabled this is the config file used to supply module search paths.',
        type: 'string',
        'default': 'webpack.config.js'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtbW9kdWxlcy9zcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7OztBQUVaLElBQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7O0lBRXRELHlCQUF5QjtBQUNsQixXQURQLHlCQUF5QixHQUNmOzBCQURWLHlCQUF5Qjs7QUFFM0IsUUFBSSxDQUFDLE1BQU0sR0FBRztBQUNaLHNCQUFnQixFQUFFO0FBQ2hCLGFBQUssRUFBRSx3QkFBd0I7QUFDL0IsbUJBQVcsRUFBRSw4REFBOEQ7QUFDM0UsWUFBSSxFQUFFLFNBQVM7QUFDZixtQkFBUyxLQUFLO09BQ2Y7QUFDRCxhQUFPLEVBQUU7QUFDUCxhQUFLLEVBQUUsb0JBQW9CO0FBQzNCLG1CQUFXLEVBQUUsMkVBQTJFO0FBQ3hGLFlBQUksRUFBRSxPQUFPO0FBQ2IsbUJBQVMsQ0FBQyxjQUFjLENBQUM7QUFDekIsYUFBSyxFQUFFO0FBQ0wsY0FBSSxFQUFFLFFBQVE7U0FDZjtPQUNGO0FBQ0QsYUFBTyxFQUFFO0FBQ1AsYUFBSyxFQUFFLGlCQUFpQjtBQUN4QixtQkFBVyxFQUFFLGlHQUFpRztBQUM5RyxZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLEtBQUs7T0FDZjtBQUNELDJCQUFxQixFQUFFO0FBQ3JCLGFBQUssRUFBRSxnQ0FBZ0M7QUFDdkMsbUJBQVcsRUFBRSwrRkFBK0Y7QUFDNUcsWUFBSSxFQUFFLFFBQVE7QUFDZCxtQkFBUyxtQkFBbUI7T0FDN0I7S0FDRixDQUFDO0dBQ0g7O2VBL0JHLHlCQUF5Qjs7V0FpQ3JCLG9CQUFHO0FBQ1QsVUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztLQUNwRDs7O1dBRVMsc0JBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztBQUMvQixVQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0tBQ2hDOzs7V0FFb0IsaUNBQUc7QUFDdEIsYUFBTyxJQUFJLENBQUMsa0JBQWtCLENBQUM7S0FDaEM7OztTQTVDRyx5QkFBeUI7OztBQStDL0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLHlCQUF5QixFQUFFLENBQUMiLCJmaWxlIjoiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1tb2R1bGVzL3NyYy9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmNvbnN0IENvbXBsZXRpb25Qcm92aWRlciA9IHJlcXVpcmUoJy4vY29tcGxldGlvbi1wcm92aWRlcicpO1xuXG5jbGFzcyBBdXRvY29tcGxldGVNb2R1bGVzUGx1Z2luIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICBpbmNsdWRlRXh0ZW5zaW9uOiB7XG4gICAgICAgIHRpdGxlOiAnSW5jbHVkZSBmaWxlIGV4dGVuc2lvbicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkluY2x1ZGUgdGhlIGZpbGUncyBleHRlbnNpb24gd2hlbiBmaWxsaW5nIGluIHRoZSBjb21wbGV0aW9uLlwiLFxuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB9LFxuICAgICAgdmVuZG9yczoge1xuICAgICAgICB0aXRsZTogJ1ZlbmRvciBkaXJlY3RvcmllcycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQSBsaXN0IG9mIGRpcmVjdG9yaWVzIHRvIHNlYXJjaCBmb3IgbW9kdWxlcyByZWxhdGl2ZSB0byB0aGUgcHJvamVjdCByb290LicsXG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIGRlZmF1bHQ6IFsnbm9kZV9tb2R1bGVzJ10sXG4gICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHdlYnBhY2s6IHtcbiAgICAgICAgdGl0bGU6ICdXZWJwYWNrIHN1cHBvcnQnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0F0dGVtcHRzIHRvIHVzZSB0aGUgZ2l2ZW4gd2VicGFjayBjb25maWd1cmF0aW9uIGZpbGUgcmVzb2x1dGlvbiBzZXR0aW5ncyB0byBzZWFyY2ggZm9yIG1vZHVsZXMuJyxcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgfSxcbiAgICAgIHdlYnBhY2tDb25maWdGaWxlbmFtZToge1xuICAgICAgICB0aXRsZTogJ1dlYnBhY2sgY29uZmlndXJhdGlvbiBmaWxlbmFtZScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnV2hlbiBcIldlYnBhY2sgc3VwcG9ydFwiIGlzIGVuYWJsZWQgdGhpcyBpcyB0aGUgY29uZmlnIGZpbGUgdXNlZCB0byBzdXBwbHkgbW9kdWxlIHNlYXJjaCBwYXRocy4nLFxuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZGVmYXVsdDogJ3dlYnBhY2suY29uZmlnLmpzJ1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmNvbXBsZXRpb25Qcm92aWRlciA9IG5ldyBDb21wbGV0aW9uUHJvdmlkZXIoKTtcbiAgfVxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgZGVsZXRlIHRoaXMuY29tcGxldGlvblByb3ZpZGVyO1xuICAgIHRoaXMuY29tcGxldGlvblByb3ZpZGVyID0gbnVsbDtcbiAgfVxuXG4gIGdldENvbXBsZXRpb25Qcm92aWRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5jb21wbGV0aW9uUHJvdmlkZXI7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQXV0b2NvbXBsZXRlTW9kdWxlc1BsdWdpbigpO1xuIl19
//# sourceURL=/Users/ajenkins/.atom/packages/autocomplete-modules/src/main.js

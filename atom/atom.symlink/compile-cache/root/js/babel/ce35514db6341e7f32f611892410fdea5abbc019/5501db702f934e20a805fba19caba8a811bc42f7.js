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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1tb2R1bGVzL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7O0FBRVosSUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7SUFFdEQseUJBQXlCO0FBQ2xCLFdBRFAseUJBQXlCLEdBQ2Y7MEJBRFYseUJBQXlCOztBQUUzQixRQUFJLENBQUMsTUFBTSxHQUFHO0FBQ1osc0JBQWdCLEVBQUU7QUFDaEIsYUFBSyxFQUFFLHdCQUF3QjtBQUMvQixtQkFBVyxFQUFFLDhEQUE4RDtBQUMzRSxZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLEtBQUs7T0FDZjtBQUNELGFBQU8sRUFBRTtBQUNQLGFBQUssRUFBRSxvQkFBb0I7QUFDM0IsbUJBQVcsRUFBRSwyRUFBMkU7QUFDeEYsWUFBSSxFQUFFLE9BQU87QUFDYixtQkFBUyxDQUFDLGNBQWMsQ0FBQztBQUN6QixhQUFLLEVBQUU7QUFDTCxjQUFJLEVBQUUsUUFBUTtTQUNmO09BQ0Y7QUFDRCxhQUFPLEVBQUU7QUFDUCxhQUFLLEVBQUUsaUJBQWlCO0FBQ3hCLG1CQUFXLEVBQUUsaUdBQWlHO0FBQzlHLFlBQUksRUFBRSxTQUFTO0FBQ2YsbUJBQVMsS0FBSztPQUNmO0FBQ0QsMkJBQXFCLEVBQUU7QUFDckIsYUFBSyxFQUFFLGdDQUFnQztBQUN2QyxtQkFBVyxFQUFFLCtGQUErRjtBQUM1RyxZQUFJLEVBQUUsUUFBUTtBQUNkLG1CQUFTLG1CQUFtQjtPQUM3QjtLQUNGLENBQUM7R0FDSDs7ZUEvQkcseUJBQXlCOztXQWlDckIsb0JBQUc7QUFDVCxVQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO0tBQ3BEOzs7V0FFUyxzQkFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO0FBQy9CLFVBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7S0FDaEM7OztXQUVvQixpQ0FBRztBQUN0QixhQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztLQUNoQzs7O1NBNUNHLHlCQUF5Qjs7O0FBK0MvQixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUkseUJBQXlCLEVBQUUsQ0FBQyIsImZpbGUiOiIvVXNlcnMvYWplbmtpbnMvLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdXRvY29tcGxldGUtbW9kdWxlcy9zcmMvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCBDb21wbGV0aW9uUHJvdmlkZXIgPSByZXF1aXJlKCcuL2NvbXBsZXRpb24tcHJvdmlkZXInKTtcblxuY2xhc3MgQXV0b2NvbXBsZXRlTW9kdWxlc1BsdWdpbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgaW5jbHVkZUV4dGVuc2lvbjoge1xuICAgICAgICB0aXRsZTogJ0luY2x1ZGUgZmlsZSBleHRlbnNpb24nLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJJbmNsdWRlIHRoZSBmaWxlJ3MgZXh0ZW5zaW9uIHdoZW4gZmlsbGluZyBpbiB0aGUgY29tcGxldGlvbi5cIixcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgfSxcbiAgICAgIHZlbmRvcnM6IHtcbiAgICAgICAgdGl0bGU6ICdWZW5kb3IgZGlyZWN0b3JpZXMnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0EgbGlzdCBvZiBkaXJlY3RvcmllcyB0byBzZWFyY2ggZm9yIG1vZHVsZXMgcmVsYXRpdmUgdG8gdGhlIHByb2plY3Qgcm9vdC4nLFxuICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICBkZWZhdWx0OiBbJ25vZGVfbW9kdWxlcyddLFxuICAgICAgICBpdGVtczoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB3ZWJwYWNrOiB7XG4gICAgICAgIHRpdGxlOiAnV2VicGFjayBzdXBwb3J0JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdBdHRlbXB0cyB0byB1c2UgdGhlIGdpdmVuIHdlYnBhY2sgY29uZmlndXJhdGlvbiBmaWxlIHJlc29sdXRpb24gc2V0dGluZ3MgdG8gc2VhcmNoIGZvciBtb2R1bGVzLicsXG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIH0sXG4gICAgICB3ZWJwYWNrQ29uZmlnRmlsZW5hbWU6IHtcbiAgICAgICAgdGl0bGU6ICdXZWJwYWNrIGNvbmZpZ3VyYXRpb24gZmlsZW5hbWUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1doZW4gXCJXZWJwYWNrIHN1cHBvcnRcIiBpcyBlbmFibGVkIHRoaXMgaXMgdGhlIGNvbmZpZyBmaWxlIHVzZWQgdG8gc3VwcGx5IG1vZHVsZSBzZWFyY2ggcGF0aHMuJyxcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGRlZmF1bHQ6ICd3ZWJwYWNrLmNvbmZpZy5qcydcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5jb21wbGV0aW9uUHJvdmlkZXIgPSBuZXcgQ29tcGxldGlvblByb3ZpZGVyKCk7XG4gIH1cblxuICBkZWFjdGl2YXRlKCkge1xuICAgIGRlbGV0ZSB0aGlzLmNvbXBsZXRpb25Qcm92aWRlcjtcbiAgICB0aGlzLmNvbXBsZXRpb25Qcm92aWRlciA9IG51bGw7XG4gIH1cblxuICBnZXRDb21wbGV0aW9uUHJvdmlkZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tcGxldGlvblByb3ZpZGVyO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEF1dG9jb21wbGV0ZU1vZHVsZXNQbHVnaW4oKTtcbiJdfQ==
//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/autocomplete-modules/src/main.js

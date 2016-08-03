Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _decoratorsElement = require('./decorators/element');

var _decoratorsElement2 = _interopRequireDefault(_decoratorsElement);

/**
 * @access private
 */
'use babel';

var MinimapPluginGeneratorElement = (function () {
  function MinimapPluginGeneratorElement() {
    _classCallCheck(this, _MinimapPluginGeneratorElement);
  }

  _createClass(MinimapPluginGeneratorElement, [{
    key: 'createdCallback',
    value: function createdCallback() {
      this.previouslyFocusedElement = null;
      this.mode = null;

      this.modal = document.createElement('atom-panel');

      this.modal.classList.add('minimap-plugin-generator');
      this.modal.classList.add('modal');
      this.modal.classList.add('overlay');
      this.modal.classList.add('from-top');

      this.editor = atom.workspace.buildTextEditor({ mini: true });
      this.editorElement = atom.views.getView(this.editor);

      this.error = document.createElement('div');
      this.error.classList.add('error');

      this.message = document.createElement('div');
      this.message.classList.add('message');

      this.modal.appendChild(this.editorElement);
      this.modal.appendChild(this.error);
      this.modal.appendChild(this.message);

      this.appendChild(this.modal);
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      this.previouslyFocusedElement = document.activeElement;
      this.message.textContent = 'Enter plugin path';
      this.setPathText('my-minimap-plugin');
      this.editorElement.focus();
    }
  }, {
    key: 'attach',
    value: function attach() {
      atom.views.getView(atom.workspace).appendChild(this);
    }
  }, {
    key: 'setPathText',
    value: function setPathText(placeholderName, rangeToSelect) {
      if (!rangeToSelect) {
        rangeToSelect = [0, placeholderName.length];
      }

      var packagesDirectory = this.getPackagesDirectory();

      this.editor.setText(_path2['default'].join(packagesDirectory, placeholderName));

      var pathLength = this.editor.getText().length;
      var endOfDirectoryIndex = pathLength - placeholderName.length;

      this.editor.setSelectedBufferRange([[0, endOfDirectoryIndex + rangeToSelect[0]], [0, endOfDirectoryIndex + rangeToSelect[1]]]);
    }
  }, {
    key: 'detach',
    value: function detach() {
      if (!this.parentNode) {
        return;
      }

      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
      }

      this.parentNode.removeChild(this);
    }
  }, {
    key: 'confirm',
    value: function confirm() {
      var _this = this;

      if (this.validPackagePath()) {
        this.removeChild(this.modal);
        this.message.innerHTML = '\n        <span class=\'loading loading-spinner-tiny inline-block\'></span>\n        Generate plugin at <span class="text-primary">' + this.getPackagePath() + '</span>\n      ';

        this.createPackageFiles(function () {
          var packagePath = _this.getPackagePath();
          atom.open({ pathsToOpen: [packagePath], devMode: atom.config.get('minimap.createPluginInDevMode') });

          _this.message.innerHTML = '<span class="text-success">Plugin successfully generated, opening it now...</span>';

          setTimeout(function () {
            _this.detach();
          }, 2000);
        });
      }
    }
  }, {
    key: 'getPackagePath',
    value: function getPackagePath() {
      var packagePath = this.editor.getText();
      var packageName = _underscorePlus2['default'].dasherize(_path2['default'].basename(packagePath));

      return _path2['default'].join(_path2['default'].dirname(packagePath), packageName);
    }
  }, {
    key: 'getPackagesDirectory',
    value: function getPackagesDirectory() {
      return atom.config.get('core.projectHome') || process.env.ATOM_REPOS_HOME || _path2['default'].join(_fsPlus2['default'].getHomeDirectory(), 'github');
    }
  }, {
    key: 'validPackagePath',
    value: function validPackagePath() {
      if (_fsPlus2['default'].existsSync(this.getPackagePath())) {
        this.error.textContent = 'Path already exists at \'' + this.getPackagePath() + '\'';
        this.error.style.display = 'block';
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: 'initPackage',
    value: function initPackage(packagePath, callback) {
      var templatePath = _path2['default'].resolve(__dirname, _path2['default'].join('..', 'templates', 'plugin-' + this.template));
      this.runCommand(atom.packages.getApmPath(), ['init', '-p', '' + packagePath, '--template', templatePath], callback);
    }
  }, {
    key: 'linkPackage',
    value: function linkPackage(packagePath, callback) {
      var args = ['link'];
      if (atom.config.get('minimap.createPluginInDevMode')) {
        args.push('--dev');
      }
      args.push(packagePath.toString());

      this.runCommand(atom.packages.getApmPath(), args, callback);
    }
  }, {
    key: 'installPackage',
    value: function installPackage(packagePath, callback) {
      var args = ['install'];

      this.runCommand(atom.packages.getApmPath(), args, callback, { cwd: packagePath });
    }
  }, {
    key: 'isStoredInDotAtom',
    value: function isStoredInDotAtom(packagePath) {
      var packagesPath = _path2['default'].join(atom.getConfigDirPath(), 'packages', _path2['default'].sep);
      if (packagePath.indexOf(packagesPath) === 0) {
        return true;
      }

      var devPackagesPath = _path2['default'].join(atom.getConfigDirPath(), 'dev', 'packages', _path2['default'].sep);

      return packagePath.indexOf(devPackagesPath) === 0;
    }
  }, {
    key: 'createPackageFiles',
    value: function createPackageFiles(callback) {
      var _this2 = this;

      var packagePath = this.getPackagePath();

      if (this.isStoredInDotAtom(packagePath)) {
        this.initPackage(packagePath, function () {
          _this2.installPackage(packagePath, callback);
        });
      } else {
        this.initPackage(packagePath, function () {
          _this2.linkPackage(packagePath, function () {
            _this2.installPackage(packagePath, callback);
          });
        });
      }
    }
  }, {
    key: 'runCommand',
    value: function runCommand(command, args, exit) {
      var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

      return new _atom.BufferedProcess({ command: command, args: args, exit: exit, options: options });
    }
  }]);

  var _MinimapPluginGeneratorElement = MinimapPluginGeneratorElement;
  MinimapPluginGeneratorElement = (0, _decoratorsElement2['default'])('minimap-plugin-generator')(MinimapPluginGeneratorElement) || MinimapPluginGeneratorElement;
  return MinimapPluginGeneratorElement;
})();

exports['default'] = MinimapPluginGeneratorElement;

atom.commands.add('minimap-plugin-generator', {
  'core:confirm': function coreConfirm() {
    this.confirm();
  },
  'core:cancel': function coreCancel() {
    this.detach();
  }
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taW5pbWFwLXBsdWdpbi1nZW5lcmF0b3ItZWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzhCQUVjLGlCQUFpQjs7OztzQkFDaEIsU0FBUzs7OztvQkFDUCxNQUFNOzs7O29CQUNPLE1BQU07O2lDQUNoQixzQkFBc0I7Ozs7Ozs7QUFOMUMsV0FBVyxDQUFBOztJQVlVLDZCQUE2QjtXQUE3Qiw2QkFBNkI7Ozs7ZUFBN0IsNkJBQTZCOztXQUVoQywyQkFBRztBQUNqQixVQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFBO0FBQ3BDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBOztBQUVoQixVQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUE7O0FBRWpELFVBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0FBQ3BELFVBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNqQyxVQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDbkMsVUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBOztBQUVwQyxVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7QUFDMUQsVUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7O0FBRXBELFVBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMs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Qiw2QkFBNkI7OztxQkFBN0IsNkJBQTZCOztBQTZKbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUU7QUFDNUMsZ0JBQWMsRUFBQyx1QkFBRztBQUFFLFFBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtHQUFFO0FBQ3BDLGVBQWEsRUFBQyxzQkFBRztBQUFFLFFBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtHQUFFO0NBQ25DLENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWplbmtpbnMvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWluaW1hcC1wbHVnaW4tZ2VuZXJhdG9yLWVsZW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlLXBsdXMnXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQge0J1ZmZlcmVkUHJvY2Vzc30gZnJvbSAnYXRvbSdcbmltcG9ydCBlbGVtZW50IGZyb20gJy4vZGVjb3JhdG9ycy9lbGVtZW50J1xuXG4vKipcbiAqIEBhY2Nlc3MgcHJpdmF0ZVxuICovXG5AZWxlbWVudCgnbWluaW1hcC1wbHVnaW4tZ2VuZXJhdG9yJylcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pbmltYXBQbHVnaW5HZW5lcmF0b3JFbGVtZW50IHtcblxuICBjcmVhdGVkQ2FsbGJhY2sgKCkge1xuICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gbnVsbFxuICAgIHRoaXMubW9kZSA9IG51bGxcblxuICAgIHRoaXMubW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdG9tLXBhbmVsJylcblxuICAgIHRoaXMubW9kYWwuY2xhc3NMaXN0LmFkZCgnbWluaW1hcC1wbHVnaW4tZ2VuZXJhdG9yJylcbiAgICB0aGlzLm1vZGFsLmNsYXNzTGlzdC5hZGQoJ21vZGFsJylcbiAgICB0aGlzLm1vZGFsLmNsYXNzTGlzdC5hZGQoJ292ZXJsYXknKVxuICAgIHRoaXMubW9kYWwuY2xhc3NMaXN0LmFkZCgnZnJvbS10b3AnKVxuXG4gICAgdGhpcy5lZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3Ioe21pbmk6IHRydWV9KVxuICAgIHRoaXMuZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0Vmlldyh0aGlzLmVkaXRvcilcblxuICAgIHRoaXMuZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuZXJyb3IuY2xhc3NMaXN0LmFkZCgnZXJyb3InKVxuXG4gICAgdGhpcy5tZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLm1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnbWVzc2FnZScpXG5cbiAgICB0aGlzLm1vZGFsLmFwcGVuZENoaWxkKHRoaXMuZWRpdG9yRWxlbWVudClcbiAgICB0aGlzLm1vZGFsLmFwcGVuZENoaWxkKHRoaXMuZXJyb3IpXG4gICAgdGhpcy5tb2RhbC5hcHBlbmRDaGlsZCh0aGlzLm1lc3NhZ2UpXG5cbiAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMubW9kYWwpXG4gIH1cblxuICBhdHRhY2hlZENhbGxiYWNrICgpIHtcbiAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRcbiAgICB0aGlzLm1lc3NhZ2UudGV4dENvbnRlbnQgPSAnRW50ZXIgcGx1Z2luIHBhdGgnXG4gICAgdGhpcy5zZXRQYXRoVGV4dCgnbXktbWluaW1hcC1wbHVnaW4nKVxuICAgIHRoaXMuZWRpdG9yRWxlbWVudC5mb2N1cygpXG4gIH1cblxuICBhdHRhY2ggKCkge1xuICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkuYXBwZW5kQ2hpbGQodGhpcylcbiAgfVxuXG4gIHNldFBhdGhUZXh0IChwbGFjZWhvbGRlck5hbWUsIHJhbmdlVG9TZWxlY3QpIHtcbiAgICBpZiAoIXJhbmdlVG9TZWxlY3QpIHsgcmFuZ2VUb1NlbGVjdCA9IFswLCBwbGFjZWhvbGRlck5hbWUubGVuZ3RoXSB9XG5cbiAgICBsZXQgcGFja2FnZXNEaXJlY3RvcnkgPSB0aGlzLmdldFBhY2thZ2VzRGlyZWN0b3J5KClcblxuICAgIHRoaXMuZWRpdG9yLnNldFRleHQocGF0aC5qb2luKHBhY2thZ2VzRGlyZWN0b3J5LCBwbGFjZWhvbGRlck5hbWUpKVxuXG4gICAgbGV0IHBhdGhMZW5ndGggPSB0aGlzLmVkaXRvci5nZXRUZXh0KCkubGVuZ3RoXG4gICAgbGV0IGVuZE9mRGlyZWN0b3J5SW5kZXggPSBwYXRoTGVuZ3RoIC0gcGxhY2Vob2xkZXJOYW1lLmxlbmd0aFxuXG4gICAgdGhpcy5lZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShbXG4gICAgICBbMCwgZW5kT2ZEaXJlY3RvcnlJbmRleCArIHJhbmdlVG9TZWxlY3RbMF1dLFxuICAgICAgWzAsIGVuZE9mRGlyZWN0b3J5SW5kZXggKyByYW5nZVRvU2VsZWN0WzFdXVxuICAgIF0pXG4gIH1cblxuICBkZXRhY2ggKCkge1xuICAgIGlmICghdGhpcy5wYXJlbnROb2RlKSB7IHJldHVybiB9XG5cbiAgICBpZiAodGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQpIHtcbiAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzKClcbiAgICB9XG5cbiAgICB0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcylcbiAgfVxuXG4gIGNvbmZpcm0gKCkge1xuICAgIGlmICh0aGlzLnZhbGlkUGFja2FnZVBhdGgoKSkge1xuICAgICAgdGhpcy5yZW1vdmVDaGlsZCh0aGlzLm1vZGFsKVxuICAgICAgdGhpcy5tZXNzYWdlLmlubmVySFRNTCA9IGBcbiAgICAgICAgPHNwYW4gY2xhc3M9J2xvYWRpbmcgbG9hZGluZy1zcGlubmVyLXRpbnkgaW5saW5lLWJsb2NrJz48L3NwYW4+XG4gICAgICAgIEdlbmVyYXRlIHBsdWdpbiBhdCA8c3BhbiBjbGFzcz1cInRleHQtcHJpbWFyeVwiPiR7dGhpcy5nZXRQYWNrYWdlUGF0aCgpfTwvc3Bhbj5cbiAgICAgIGBcblxuICAgICAgdGhpcy5jcmVhdGVQYWNrYWdlRmlsZXMoKCkgPT4ge1xuICAgICAgICBsZXQgcGFja2FnZVBhdGggPSB0aGlzLmdldFBhY2thZ2VQYXRoKClcbiAgICAgICAgYXRvbS5vcGVuKHtwYXRoc1RvT3BlbjogW3BhY2thZ2VQYXRoXSwgZGV2TW9kZTogYXRvbS5jb25maWcuZ2V0KCdtaW5pbWFwLmNyZWF0ZVBsdWdpbkluRGV2TW9kZScpfSlcblxuICAgICAgICB0aGlzLm1lc3NhZ2UuaW5uZXJIVE1MID0gJzxzcGFuIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+UGx1Z2luIHN1Y2Nlc3NmdWxseSBnZW5lcmF0ZWQsIG9wZW5pbmcgaXQgbm93Li4uPC9zcGFuPidcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5kZXRhY2goKSB9LCAyMDAwKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBnZXRQYWNrYWdlUGF0aCAoKSB7XG4gICAgbGV0IHBhY2thZ2VQYXRoID0gdGhpcy5lZGl0b3IuZ2V0VGV4dCgpXG4gICAgbGV0IHBhY2thZ2VOYW1lID0gXy5kYXNoZXJpemUocGF0aC5iYXNlbmFtZShwYWNrYWdlUGF0aCkpXG5cbiAgICByZXR1cm4gcGF0aC5qb2luKHBhdGguZGlybmFtZShwYWNrYWdlUGF0aCksIHBhY2thZ2VOYW1lKVxuICB9XG5cbiAgZ2V0UGFja2FnZXNEaXJlY3RvcnkgKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2NvcmUucHJvamVjdEhvbWUnKSB8fFxuICAgICAgICAgICBwcm9jZXNzLmVudi5BVE9NX1JFUE9TX0hPTUUgfHxcbiAgICAgICAgICAgcGF0aC5qb2luKGZzLmdldEhvbWVEaXJlY3RvcnkoKSwgJ2dpdGh1YicpXG4gIH1cblxuICB2YWxpZFBhY2thZ2VQYXRoICgpIHtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyh0aGlzLmdldFBhY2thZ2VQYXRoKCkpKSB7XG4gICAgICB0aGlzLmVycm9yLnRleHRDb250ZW50ID0gYFBhdGggYWxyZWFkeSBleGlzdHMgYXQgJyR7dGhpcy5nZXRQYWNrYWdlUGF0aCgpfSdgXG4gICAgICB0aGlzLmVycm9yLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBpbml0UGFja2FnZSAocGFja2FnZVBhdGgsIGNhbGxiYWNrKSB7XG4gICAgbGV0IHRlbXBsYXRlUGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHBhdGguam9pbignLi4nLCAndGVtcGxhdGVzJywgYHBsdWdpbi0ke3RoaXMudGVtcGxhdGV9YCkpXG4gICAgdGhpcy5ydW5Db21tYW5kKGF0b20ucGFja2FnZXMuZ2V0QXBtUGF0aCgpLCBbJ2luaXQnLCAnLXAnLCBgJHtwYWNrYWdlUGF0aH1gLCAnLS10ZW1wbGF0ZScsIHRlbXBsYXRlUGF0aF0sIGNhbGxiYWNrKVxuICB9XG5cbiAgbGlua1BhY2thZ2UgKHBhY2thZ2VQYXRoLCBjYWxsYmFjaykge1xuICAgIGxldCBhcmdzID0gWydsaW5rJ11cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdtaW5pbWFwLmNyZWF0ZVBsdWdpbkluRGV2TW9kZScpKSB7IGFyZ3MucHVzaCgnLS1kZXYnKSB9XG4gICAgYXJncy5wdXNoKHBhY2thZ2VQYXRoLnRvU3RyaW5nKCkpXG5cbiAgICB0aGlzLnJ1bkNvbW1hbmQoYXRvbS5wYWNrYWdlcy5nZXRBcG1QYXRoKCksIGFyZ3MsIGNhbGxiYWNrKVxuICB9XG5cbiAgaW5zdGFsbFBhY2thZ2UgKHBhY2thZ2VQYXRoLCBjYWxsYmFjaykge1xuICAgIGxldCBhcmdzID0gWydpbnN0YWxsJ11cblxuICAgIHRoaXMucnVuQ29tbWFuZChhdG9tLnBhY2thZ2VzLmdldEFwbVBhdGgoKSwgYXJncywgY2FsbGJhY2ssIHtjd2Q6IHBhY2thZ2VQYXRofSlcbiAgfVxuXG4gIGlzU3RvcmVkSW5Eb3RBdG9tIChwYWNrYWdlUGF0aCkge1xuICAgIGxldCBwYWNrYWdlc1BhdGggPSBwYXRoLmpvaW4oYXRvbS5nZXRDb25maWdEaXJQYXRoKCksICdwYWNrYWdlcycsIHBhdGguc2VwKVxuICAgIGlmIChwYWNrYWdlUGF0aC5pbmRleE9mKHBhY2thZ2VzUGF0aCkgPT09IDApIHsgcmV0dXJuIHRydWUgfVxuXG4gICAgbGV0IGRldlBhY2thZ2VzUGF0aCA9IHBhdGguam9pbihhdG9tLmdldENvbmZpZ0RpclBhdGgoKSwgJ2RldicsICdwYWNrYWdlcycsIHBhdGguc2VwKVxuXG4gICAgcmV0dXJuIHBhY2thZ2VQYXRoLmluZGV4T2YoZGV2UGFja2FnZXNQYXRoKSA9PT0gMFxuICB9XG5cbiAgY3JlYXRlUGFja2FnZUZpbGVzIChjYWxsYmFjaykge1xuICAgIGxldCBwYWNrYWdlUGF0aCA9IHRoaXMuZ2V0UGFja2FnZVBhdGgoKVxuXG4gICAgaWYgKHRoaXMuaXNTdG9yZWRJbkRvdEF0b20ocGFja2FnZVBhdGgpKSB7XG4gICAgICB0aGlzLmluaXRQYWNrYWdlKHBhY2thZ2VQYXRoLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuaW5zdGFsbFBhY2thZ2UocGFja2FnZVBhdGgsIGNhbGxiYWNrKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbml0UGFja2FnZShwYWNrYWdlUGF0aCwgKCkgPT4ge1xuICAgICAgICB0aGlzLmxpbmtQYWNrYWdlKHBhY2thZ2VQYXRoLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5pbnN0YWxsUGFja2FnZShwYWNrYWdlUGF0aCwgY2FsbGJhY2spXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJ1bkNvbW1hbmQgKGNvbW1hbmQsIGFyZ3MsIGV4aXQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyZWRQcm9jZXNzKHtjb21tYW5kLCBhcmdzLCBleGl0LCBvcHRpb25zfSlcbiAgfVxufVxuXG5hdG9tLmNvbW1hbmRzLmFkZCgnbWluaW1hcC1wbHVnaW4tZ2VuZXJhdG9yJywge1xuICAnY29yZTpjb25maXJtJyAoKSB7IHRoaXMuY29uZmlybSgpIH0sXG4gICdjb3JlOmNhbmNlbCcgKCkgeyB0aGlzLmRldGFjaCgpIH1cbn0pXG4iXX0=
//# sourceURL=/Users/ajenkins/.atom/packages/minimap/lib/minimap-plugin-generator-element.js

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

var _season = require('season');

var _season2 = _interopRequireDefault(_season);

'use babel';

var Project = (function () {
  function Project() {
    var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Project);

    this.props = this.defaultProps;
    this.emitter = new _atom.Emitter();
    this.settings = new _settings2['default']();
    this.updateProps(props);
    this.lookForUpdates();
  }

  _createClass(Project, [{
    key: 'updateProps',
    value: function updateProps(props) {
      var activePaths = atom.project.getPaths();
      var newProps = _underscorePlus2['default'].clone(this.props);
      _underscorePlus2['default'].deepExtend(newProps, props);
      this.props = newProps;

      if (this.isCurrent()) {
        // Add any new paths.
        for (var path of this.props.paths) {
          if (activePaths.indexOf(path) < 0) {
            atom.project.addPath(path);
          }
        }

        // Remove paths that have been removed.
        for (var activePath of activePaths) {
          if (this.props.paths.indexOf(activePath) < 0) {
            atom.project.removePath(activePath);
          }
        }
      }

      try {
        var stats = _fs2['default'].statSync(this.rootPath);
        this.stats = stats;
      } catch (e) {
        this.stats = false;
      }
    }
  }, {
    key: 'getPropsToSave',
    value: function getPropsToSave() {
      var saveProps = {};
      var value = undefined;
      var key = undefined;
      for (key in this.props) {
        value = this.props[key];
        if (!this.isDefaultProp(key, value)) {
          saveProps[key] = value;
        }
      }

      return saveProps;
    }
  }, {
    key: 'isDefaultProp',
    value: function isDefaultProp(key, value) {
      if (!this.defaultProps.hasOwnProperty(key)) {
        return false;
      }

      var defaultProp = this.defaultProps[key];
      if (typeof defaultProp === 'object' && _underscorePlus2['default'].isEqual(defaultProp, value)) {
        return true;
      }

      if (defaultProp === value) {
        return true;
      }

      return false;
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      if (typeof key === 'object') {
        for (var i in key) {
          value = key[i];
          this.props[i] = value;
        }

        this.save();
      } else {
        this.props[key] = value;
        this.save();
      }
    }
  }, {
    key: 'unset',
    value: function unset(key) {
      if (_underscorePlus2['default'].has(this.defaultProps, key)) {
        this.props[key] = this.defaultProps[key];
      } else {
        this.props[key] = null;
      }

      this.save();
    }
  }, {
    key: 'lookForUpdates',
    value: function lookForUpdates() {
      var _this = this;

      if (this.props._id) {
        var id = this.props._id;
        var query = {
          key: 'paths',
          value: this.props.paths
        };
        _db2['default'].addUpdater(id, query, function (props) {
          if (props) {
            var updatedProps = _this.defaultProps;
            _underscorePlus2['default'].deepExtend(updatedProps, props);
            if (!_underscorePlus2['default'].isEqual(_this.props, updatedProps)) {
              _this.updateProps(props);
              _this.emitter.emit('updated');

              if (_this.isCurrent()) {
                _this.load();
              }
            }
          }
        });
      }
    }
  }, {
    key: 'isCurrent',
    value: function isCurrent() {
      var activePath = atom.project.getPaths()[0];
      if (activePath === this.rootPath) {
        return true;
      }

      return false;
    }
  }, {
    key: 'isValid',
    value: function isValid() {
      var _this2 = this;

      var valid = true;
      this.requiredProperties.forEach(function (key) {
        if (!_this2.props[key] || !_this2.props[key].length) {
          valid = false;
        }
      });

      return valid;
    }
  }, {
    key: 'load',
    value: function load() {
      if (this.isCurrent()) {
        this.checkForLocalSettings();
        this.settings.load(this.props.settings);
      }
    }
  }, {
    key: 'checkForLocalSettings',
    value: function checkForLocalSettings() {
      var _this3 = this;

      if (this.localSettingsWatcher) {
        this.localSettingsWatcher.close();
      }

      if (!this.localSettingsChecked) {
        this.localSettingsChecked = true;
        try {
          var localSettingsFile = this.rootPath + '/project.cson';
          var settings = _season2['default'].readFileSync(localSettingsFile);

          if (settings) {
            this.localSettingsWatcher = _fs2['default'].watch(localSettingsFile, function () {
              _this3.localSettingsChecked = false;

              if (_this3.isCurrent()) {
                _this3.load();
              } else {
                _this3.checkForLocalSettings();
              }
            });

            this.updateProps(settings);
          }
        } catch (e) {}
      }
    }
  }, {
    key: 'save',
    value: function save() {
      var _this4 = this;

      if (this.isValid()) {
        if (this.props._id) {
          _db2['default'].update(this.getPropsToSave());
        } else {
          _db2['default'].add(this.getPropsToSave(), function (id) {
            _this4.props._id = id;
            _this4.lookForUpdates();
          });
        }

        return true;
      }

      return false;
    }
  }, {
    key: 'remove',
    value: function remove() {
      _db2['default']['delete'](this.props._id);
    }
  }, {
    key: 'open',
    value: function open() {
      var win = atom.getCurrentWindow();
      var closeCurrent = atom.config.get('project-manager.closeCurrent');

      atom.open({
        pathsToOpen: this.props.paths,
        devMode: this.props.devMode,
        newWindow: closeCurrent
      });

      if (closeCurrent) {
        setTimeout(function () {
          win.close();
        }, 0);
      }
    }
  }, {
    key: 'onUpdate',
    value: function onUpdate(callback) {
      this.emitter.on('updated', function () {
        return callback();
      });
    }
  }, {
    key: 'requiredProperties',
    get: function get() {
      return ['title', 'paths'];
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        title: '',
        paths: [],
        icon: 'icon-chevron-right',
        settings: {},
        group: null,
        devMode: false,
        template: null
      };
    }
  }, {
    key: 'rootPath',
    get: function get() {
      if (this.props.paths[0]) {
        return this.props.paths[0];
      }

      return '';
    }
  }, {
    key: 'lastModified',
    get: function get() {
      var mtime = 0;
      try {
        var stats = _fs2['default'].statSync(this.rootPath);
        mtime = stats.mtime;
      } catch (e) {
        mtime = new Date(0);
      }

      return mtime;
    }
  }]);

  return Project;
})();

exports['default'] = Project;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3Byb2plY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFc0IsTUFBTTs7OEJBQ2QsaUJBQWlCOzs7O3dCQUNWLFlBQVk7Ozs7a0JBQ2xCLElBQUk7Ozs7a0JBQ0osTUFBTTs7OztzQkFDSixRQUFROzs7O0FBUHpCLFdBQVcsQ0FBQzs7SUFTUyxPQUFPO0FBRWYsV0FGUSxPQUFPLEdBRUo7UUFBVixLQUFLLHlEQUFDLEVBQUU7OzBCQUZELE9BQU87O0FBR3hCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztBQUMvQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUM7QUFDN0IsUUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBYyxDQUFDO0FBQy9CLFFBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEIsUUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0dBQ3ZCOztlQVJrQixPQUFPOztXQThDZixxQkFBQyxLQUFLLEVBQUU7QUFDakIsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUM1QyxVQUFNLFFBQVEsR0FBRyw0QkFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JDLGtDQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDOUIsVUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7O0FBRXRCLFVBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFOztBQUVwQixhQUFLLElBQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO0FBQ25DLGNBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDakMsZ0JBQUksQ0FBQyxPQUFPLENBQUMs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YUFBSyxFQUFFLEVBQUU7QUFDVCxhQUFLLEVBQUUsRUFBRTtBQUNULFlBQUksRUFBRSxvQkFBb0I7QUFDMUIsZ0JBQVEsRUFBRSxFQUFFO0FBQ1osYUFBSyxFQUFFLElBQUk7QUFDWCxlQUFPLEVBQUUsS0FBSztBQUNkLGdCQUFRLEVBQUUsSUFBSTtPQUNmLENBQUM7S0FDSDs7O1NBRVcsZUFBRztBQUNiLFVBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDdkIsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUM1Qjs7QUFFRCxhQUFPLEVBQUUsQ0FBQztLQUNYOzs7U0FFZSxlQUFHO0FBQ2pCLFVBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNkLFVBQUk7QUFDRixZQUFNLEtBQUssR0FBRyxnQkFBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pDLGFBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO09BQ3JCLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixhQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDckI7O0FBRUQsYUFBTyxLQUFLLENBQUM7S0FDZDs7O1NBNUNrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiIvVXNlcnMvYWplbmtpbnMvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9wcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7RW1pdHRlcn0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuaW1wb3J0IFNldHRpbmdzIGZyb20gJy4vc2V0dGluZ3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBkYiBmcm9tICcuL2RiJztcbmltcG9ydCBDU09OIGZyb20gJ3NlYXNvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2plY3Qge1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzPXt9KSB7XG4gICAgdGhpcy5wcm9wcyA9IHRoaXMuZGVmYXVsdFByb3BzO1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgdGhpcy5zZXR0aW5ncyA9IG5ldyBTZXR0aW5ncygpO1xuICAgIHRoaXMudXBkYXRlUHJvcHMocHJvcHMpO1xuICAgIHRoaXMubG9va0ZvclVwZGF0ZXMoKTtcbiAgfVxuXG4gIGdldCByZXF1aXJlZFByb3BlcnRpZXMoKSB7XG4gICAgcmV0dXJuIFsndGl0bGUnLCAncGF0aHMnXTtcbiAgfVxuXG4gIGdldCBkZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpdGxlOiAnJyxcbiAgICAgIHBhdGhzOiBbXSxcbiAgICAgIGljb246ICdpY29uLWNoZXZyb24tcmlnaHQnLFxuICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgZ3JvdXA6IG51bGwsXG4gICAgICBkZXZNb2RlOiBmYWxzZSxcbiAgICAgIHRlbXBsYXRlOiBudWxsXG4gICAgfTtcbiAgfVxuXG4gIGdldCByb290UGF0aCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5wYXRoc1swXSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucGF0aHNbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgZ2V0IGxhc3RNb2RpZmllZCgpIHtcbiAgICBsZXQgbXRpbWUgPSAwO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdGF0cyA9IGZzLnN0YXRTeW5jKHRoaXMucm9vdFBhdGgpO1xuICAgICAgbXRpbWUgPSBzdGF0cy5tdGltZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBtdGltZSA9IG5ldyBEYXRlKDApO1xuICAgIH1cblxuICAgIHJldHVybiBtdGltZTtcbiAgfVxuXG4gIHVwZGF0ZVByb3BzKHByb3BzKSB7XG4gICAgY29uc3QgYWN0aXZlUGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcbiAgICBjb25zdCBuZXdQcm9wcyA9IF8uY2xvbmUodGhpcy5wcm9wcyk7XG4gICAgXy5kZWVwRXh0ZW5kKG5ld1Byb3BzLCBwcm9wcyk7XG4gICAgdGhpcy5wcm9wcyA9IG5ld1Byb3BzO1xuXG4gICAgaWYgKHRoaXMuaXNDdXJyZW50KCkpIHtcbiAgICAgIC8vIEFkZCBhbnkgbmV3IHBhdGhzLlxuICAgICAgZm9yIChjb25zdCBwYXRoIG9mIHRoaXMucHJvcHMucGF0aHMpIHtcbiAgICAgICAgaWYgKGFjdGl2ZVBhdGhzLmluZGV4T2YocGF0aCkgPCAwKSB7XG4gICAgICAgICAgYXRvbS5wcm9qZWN0LmFkZFBhdGgocGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gUmVtb3ZlIHBhdGhzIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZWQuXG4gICAgICBmb3IgKGNvbnN0IGFjdGl2ZVBhdGggb2YgYWN0aXZlUGF0aHMpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMucGF0aHMuaW5kZXhPZihhY3RpdmVQYXRoKSA8IDApIHtcbiAgICAgICAgICBhdG9tLnByb2plY3QucmVtb3ZlUGF0aChhY3RpdmVQYXRoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdGF0cyA9IGZzLnN0YXRTeW5jKHRoaXMucm9vdFBhdGgpO1xuICAgICAgdGhpcy5zdGF0cyA9IHN0YXRzO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMuc3RhdHMgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBnZXRQcm9wc1RvU2F2ZSgpIHtcbiAgICBsZXQgc2F2ZVByb3BzID0ge307XG4gICAgbGV0IHZhbHVlO1xuICAgIGxldCBrZXk7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5wcm9wcykge1xuICAgICAgdmFsdWUgPSB0aGlzLnByb3BzW2tleV07XG4gICAgICBpZiAoIXRoaXMuaXNEZWZhdWx0UHJvcChrZXksIHZhbHVlKSkge1xuICAgICAgICBzYXZlUHJvcHNba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzYXZlUHJvcHM7XG4gIH1cblxuICBpc0RlZmF1bHRQcm9wKGtleSwgdmFsdWUpIHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdFByb3BzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBkZWZhdWx0UHJvcCA9IHRoaXMuZGVmYXVsdFByb3BzW2tleV07XG4gICAgaWYgKHR5cGVvZiBkZWZhdWx0UHJvcCA9PT0gJ29iamVjdCcgJiYgXy5pc0VxdWFsKGRlZmF1bHRQcm9wLCB2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkZWZhdWx0UHJvcCA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNldChrZXksIHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiBrZXkgPT09ICdvYmplY3QnKSB7XG4gICAgICBmb3IgKGxldCBpIGluIGtleSkge1xuICAgICAgICB2YWx1ZSA9IGtleVtpXTtcbiAgICAgICAgdGhpcy5wcm9wc1tpXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNhdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wc1trZXldID0gdmFsdWU7XG4gICAgICB0aGlzLnNhdmUoKTtcbiAgICB9XG4gIH1cblxuICB1bnNldChrZXkpIHtcbiAgICBpZiAoXy5oYXModGhpcy5kZWZhdWx0UHJvcHMsIGtleSkpIHtcbiAgICAgIHRoaXMucHJvcHNba2V5XSA9IHRoaXMuZGVmYXVsdFByb3BzW2tleV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHNba2V5XSA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5zYXZlKCk7XG4gIH1cblxuICBsb29rRm9yVXBkYXRlcygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5faWQpIHtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5wcm9wcy5faWQ7XG4gICAgICBjb25zdCBxdWVyeSA9IHtcbiAgICAgICAga2V5OiAncGF0aHMnLFxuICAgICAgICB2YWx1ZTogdGhpcy5wcm9wcy5wYXRoc1xuICAgICAgfTtcbiAgICAgIGRiLmFkZFVwZGF0ZXIoaWQsIHF1ZXJ5LCAocHJvcHMpID0+IHtcbiAgICAgICAgaWYgKHByb3BzKSB7XG4gICAgICAgICAgY29uc3QgdXBkYXRlZFByb3BzID0gdGhpcy5kZWZhdWx0UHJvcHM7XG4gICAgICAgICAgXy5kZWVwRXh0ZW5kKHVwZGF0ZWRQcm9wcywgcHJvcHMpO1xuICAgICAgICAgIGlmICghXy5pc0VxdWFsKHRoaXMucHJvcHMsIHVwZGF0ZWRQcm9wcykpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvcHMocHJvcHMpO1xuICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3VwZGF0ZWQnKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDdXJyZW50KCkpIHtcbiAgICAgICAgICAgICAgdGhpcy5sb2FkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBpc0N1cnJlbnQoKSB7XG4gICAgY29uc3QgYWN0aXZlUGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdO1xuICAgIGlmIChhY3RpdmVQYXRoID09PSB0aGlzLnJvb3RQYXRoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc1ZhbGlkKCkge1xuICAgIGxldCB2YWxpZCA9IHRydWU7XG4gICAgdGhpcy5yZXF1aXJlZFByb3BlcnRpZXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnByb3BzW2tleV0gfHwgIXRoaXMucHJvcHNba2V5XS5sZW5ndGgpIHtcbiAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB2YWxpZDtcbiAgfVxuXG4gIGxvYWQoKSB7XG4gICAgaWYgKHRoaXMuaXNDdXJyZW50KCkpIHtcbiAgICAgIHRoaXMuY2hlY2tGb3JMb2NhbFNldHRpbmdzKCk7XG4gICAgICB0aGlzLnNldHRpbmdzLmxvYWQodGhpcy5wcm9wcy5zZXR0aW5ncyk7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tGb3JMb2NhbFNldHRpbmdzKCkge1xuICAgIGlmICh0aGlzLmxvY2FsU2V0dGluZ3NXYXRjaGVyKSB7XG4gICAgICB0aGlzLmxvY2FsU2V0dGluZ3NXYXRjaGVyLmNsb3NlKCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmxvY2FsU2V0dGluZ3NDaGVja2VkKSB7XG4gICAgICB0aGlzLmxvY2FsU2V0dGluZ3NDaGVja2VkID0gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGxvY2FsU2V0dGluZ3NGaWxlID0gYCR7dGhpcy5yb290UGF0aH0vcHJvamVjdC5jc29uYDtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBDU09OLnJlYWRGaWxlU3luYyhsb2NhbFNldHRpbmdzRmlsZSk7XG5cbiAgICAgICAgaWYgKHNldHRpbmdzKSB7XG4gICAgICAgICAgdGhpcy5sb2NhbFNldHRpbmdzV2F0Y2hlciA9IGZzLndhdGNoKGxvY2FsU2V0dGluZ3NGaWxlLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU2V0dGluZ3NDaGVja2VkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ3VycmVudCgpKSB7XG4gICAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5jaGVja0ZvckxvY2FsU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMudXBkYXRlUHJvcHMoc2V0dGluZ3MpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cbiAgfVxuXG4gIHNhdmUoKSB7XG4gICAgaWYgKHRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5faWQpIHtcbiAgICAgICAgZGIudXBkYXRlKHRoaXMuZ2V0UHJvcHNUb1NhdmUoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYi5hZGQodGhpcy5nZXRQcm9wc1RvU2F2ZSgpLCBpZCA9PiB7XG4gICAgICAgICAgdGhpcy5wcm9wcy5faWQgPSBpZDtcbiAgICAgICAgICB0aGlzLmxvb2tGb3JVcGRhdGVzKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgZGIuZGVsZXRlKHRoaXMucHJvcHMuX2lkKTtcbiAgfVxuXG4gIG9wZW4oKSB7XG4gICAgY29uc3Qgd2luID0gYXRvbS5nZXRDdXJyZW50V2luZG93KCk7XG4gICAgY29uc3QgY2xvc2VDdXJyZW50ID0gYXRvbS5jb25maWcuZ2V0KCdwcm9qZWN0LW1hbmFnZXIuY2xvc2VDdXJyZW50Jyk7XG5cbiAgICBhdG9tLm9wZW4oe1xuICAgICAgcGF0aHNUb09wZW46IHRoaXMucHJvcHMucGF0aHMsXG4gICAgICBkZXZNb2RlOiB0aGlzLnByb3BzLmRldk1vZGUsXG4gICAgICBuZXdXaW5kb3c6IGNsb3NlQ3VycmVudFxuICAgIH0pO1xuXG4gICAgaWYgKGNsb3NlQ3VycmVudCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbi5jbG9zZSgpO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9XG5cbiAgb25VcGRhdGUoY2FsbGJhY2spIHtcbiAgICB0aGlzLmVtaXR0ZXIub24oJ3VwZGF0ZWQnLCAoKSA9PiBjYWxsYmFjaygpKTtcbiAgfVxufVxuIl19
//# sourceURL=/Users/ajenkins/.atom/packages/project-manager/lib/project.js

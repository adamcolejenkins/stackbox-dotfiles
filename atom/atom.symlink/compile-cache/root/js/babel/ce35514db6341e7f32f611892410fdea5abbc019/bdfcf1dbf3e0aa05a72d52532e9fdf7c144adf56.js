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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVzQixNQUFNOzs4QkFDZCxpQkFBaUI7Ozs7d0JBQ1YsWUFBWTs7OztrQkFDbEIsSUFBSTs7OztrQkFDSixNQUFNOzs7O3NCQUNKLFFBQVE7Ozs7QUFQekIsV0FBVyxDQUFDOztJQVNTLE9BQU87QUFFZixXQUZRLE9BQU8sR0FFSjtRQUFWLEtBQUsseURBQUMsRUFBRTs7MEJBRkQsT0FBTzs7QUFHeEIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO0FBQy9CLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQztBQUM3QixRQUFJLENBQUMsUUFBUSxHQUFHLDJCQUFjLENBQUM7QUFDL0IsUUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QixRQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7R0FDdkI7O2VBUmtCLE9BQU87O1dBOENmLHFCQUFDLEtBQUssRUFBRTtBQUNqQixVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzVDLFVBQU0sUUFBUSxHQUFHLDRCQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckMsa0NBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM5QixVQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQzs7QUFFdEIsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7O0FBRXBCLGFBQUssSUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7QUFDbkMsY0FBSSxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNqQyxnQkFB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O0FBQ2pCLGFBQU87QUFDTCxhQUFLLEVBQUUsRUFBRTtBQUNULGFBQUssRUFBRSxFQUFFO0FBQ1QsWUFBSSxFQUFFLG9CQUFvQjtBQUMxQixnQkFBUSxFQUFFLEVBQUU7QUFDWixhQUFLLEVBQUUsSUFBSTtBQUNYLGVBQU8sRUFBRSxLQUFLO0FBQ2QsZ0JBQVEsRUFBRSxJQUFJO09BQ2YsQ0FBQztLQUNIOzs7U0FFVyxlQUFHO0FBQ2IsVUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUN2QixlQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQzVCOztBQUVELGFBQU8sRUFBRSxDQUFDO0tBQ1g7OztTQUVlLGVBQUc7QUFDakIsVUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsVUFBSTtBQUNGLFlBQU0sS0FBSyxHQUFHLGdCQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekMsYUFBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7T0FDckIsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLGFBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNyQjs7QUFFRCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7U0E1Q2tCLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6Ii9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQge0VtaXR0ZXJ9IGZyb20gJ2F0b20nO1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcbmltcG9ydCBTZXR0aW5ncyBmcm9tICcuL3NldHRpbmdzJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgZGIgZnJvbSAnLi9kYic7XG5pbXBvcnQgQ1NPTiBmcm9tICdzZWFzb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9qZWN0IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcz17fSkge1xuICAgIHRoaXMucHJvcHMgPSB0aGlzLmRlZmF1bHRQcm9wcztcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICAgIHRoaXMuc2V0dGluZ3MgPSBuZXcgU2V0dGluZ3MoKTtcbiAgICB0aGlzLnVwZGF0ZVByb3BzKHByb3BzKTtcbiAgICB0aGlzLmxvb2tGb3JVcGRhdGVzKCk7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRQcm9wZXJ0aWVzKCkge1xuICAgIHJldHVybiBbJ3RpdGxlJywgJ3BhdGhzJ107XG4gIH1cblxuICBnZXQgZGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0aXRsZTogJycsXG4gICAgICBwYXRoczogW10sXG4gICAgICBpY29uOiAnaWNvbi1jaGV2cm9uLXJpZ2h0JyxcbiAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgIGdyb3VwOiBudWxsLFxuICAgICAgZGV2TW9kZTogZmFsc2UsXG4gICAgICB0ZW1wbGF0ZTogbnVsbFxuICAgIH07XG4gIH1cblxuICBnZXQgcm9vdFBhdGgoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMucGF0aHNbMF0pIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnBhdGhzWzBdO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIGdldCBsYXN0TW9kaWZpZWQoKSB7XG4gICAgbGV0IG10aW1lID0gMDtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3RhdHMgPSBmcy5zdGF0U3luYyh0aGlzLnJvb3RQYXRoKTtcbiAgICAgIG10aW1lID0gc3RhdHMubXRpbWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbXRpbWUgPSBuZXcgRGF0ZSgwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbXRpbWU7XG4gIH1cblxuICB1cGRhdGVQcm9wcyhwcm9wcykge1xuICAgIGNvbnN0IGFjdGl2ZVBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk7XG4gICAgY29uc3QgbmV3UHJvcHMgPSBfLmNsb25lKHRoaXMucHJvcHMpO1xuICAgIF8uZGVlcEV4dGVuZChuZXdQcm9wcywgcHJvcHMpO1xuICAgIHRoaXMucHJvcHMgPSBuZXdQcm9wcztcblxuICAgIGlmICh0aGlzLmlzQ3VycmVudCgpKSB7XG4gICAgICAvLyBBZGQgYW55IG5ldyBwYXRocy5cbiAgICAgIGZvciAoY29uc3QgcGF0aCBvZiB0aGlzLnByb3BzLnBhdGhzKSB7XG4gICAgICAgIGlmIChhY3RpdmVQYXRocy5pbmRleE9mKHBhdGgpIDwgMCkge1xuICAgICAgICAgIGF0b20ucHJvamVjdC5hZGRQYXRoKHBhdGgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFJlbW92ZSBwYXRocyB0aGF0IGhhdmUgYmVlbiByZW1vdmVkLlxuICAgICAgZm9yIChjb25zdCBhY3RpdmVQYXRoIG9mIGFjdGl2ZVBhdGhzKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnBhdGhzLmluZGV4T2YoYWN0aXZlUGF0aCkgPCAwKSB7XG4gICAgICAgICAgYXRvbS5wcm9qZWN0LnJlbW92ZVBhdGgoYWN0aXZlUGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3RhdHMgPSBmcy5zdGF0U3luYyh0aGlzLnJvb3RQYXRoKTtcbiAgICAgIHRoaXMuc3RhdHMgPSBzdGF0cztcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLnN0YXRzID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZ2V0UHJvcHNUb1NhdmUoKSB7XG4gICAgbGV0IHNhdmVQcm9wcyA9IHt9O1xuICAgIGxldCB2YWx1ZTtcbiAgICBsZXQga2V5O1xuICAgIGZvciAoa2V5IGluIHRoaXMucHJvcHMpIHtcbiAgICAgIHZhbHVlID0gdGhpcy5wcm9wc1trZXldO1xuICAgICAgaWYgKCF0aGlzLmlzRGVmYXVsdFByb3Aoa2V5LCB2YWx1ZSkpIHtcbiAgICAgICAgc2F2ZVByb3BzW2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2F2ZVByb3BzO1xuICB9XG5cbiAgaXNEZWZhdWx0UHJvcChrZXksIHZhbHVlKSB7XG4gICAgaWYgKCF0aGlzLmRlZmF1bHRQcm9wcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgZGVmYXVsdFByb3AgPSB0aGlzLmRlZmF1bHRQcm9wc1trZXldO1xuICAgIGlmICh0eXBlb2YgZGVmYXVsdFByb3AgPT09ICdvYmplY3QnICYmIF8uaXNFcXVhbChkZWZhdWx0UHJvcCwgdmFsdWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZGVmYXVsdFByb3AgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgIGlmICh0eXBlb2Yga2V5ID09PSAnb2JqZWN0Jykge1xuICAgICAgZm9yIChsZXQgaSBpbiBrZXkpIHtcbiAgICAgICAgdmFsdWUgPSBrZXlbaV07XG4gICAgICAgIHRoaXMucHJvcHNbaV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zYXZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHNba2V5XSA9IHZhbHVlO1xuICAgICAgdGhpcy5zYXZlKCk7XG4gICAgfVxuICB9XG5cbiAgdW5zZXQoa2V5KSB7XG4gICAgaWYgKF8uaGFzKHRoaXMuZGVmYXVsdFByb3BzLCBrZXkpKSB7XG4gICAgICB0aGlzLnByb3BzW2tleV0gPSB0aGlzLmRlZmF1bHRQcm9wc1trZXldO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3BzW2tleV0gPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuc2F2ZSgpO1xuICB9XG5cbiAgbG9va0ZvclVwZGF0ZXMoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuX2lkKSB7XG4gICAgICBjb25zdCBpZCA9IHRoaXMucHJvcHMuX2lkO1xuICAgICAgY29uc3QgcXVlcnkgPSB7XG4gICAgICAgIGtleTogJ3BhdGhzJyxcbiAgICAgICAgdmFsdWU6IHRoaXMucHJvcHMucGF0aHNcbiAgICAgIH07XG4gICAgICBkYi5hZGRVcGRhdGVyKGlkLCBxdWVyeSwgKHByb3BzKSA9PiB7XG4gICAgICAgIGlmIChwcm9wcykge1xuICAgICAgICAgIGNvbnN0IHVwZGF0ZWRQcm9wcyA9IHRoaXMuZGVmYXVsdFByb3BzO1xuICAgICAgICAgIF8uZGVlcEV4dGVuZCh1cGRhdGVkUHJvcHMsIHByb3BzKTtcbiAgICAgICAgICBpZiAoIV8uaXNFcXVhbCh0aGlzLnByb3BzLCB1cGRhdGVkUHJvcHMpKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb3BzKHByb3BzKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCd1cGRhdGVkJyk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ3VycmVudCgpKSB7XG4gICAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaXNDdXJyZW50KCkge1xuICAgIGNvbnN0IGFjdGl2ZVBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXTtcbiAgICBpZiAoYWN0aXZlUGF0aCA9PT0gdGhpcy5yb290UGF0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNWYWxpZCgpIHtcbiAgICBsZXQgdmFsaWQgPSB0cnVlO1xuICAgIHRoaXMucmVxdWlyZWRQcm9wZXJ0aWVzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmICghdGhpcy5wcm9wc1trZXldIHx8ICF0aGlzLnByb3BzW2tleV0ubGVuZ3RoKSB7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdmFsaWQ7XG4gIH1cblxuICBsb2FkKCkge1xuICAgIGlmICh0aGlzLmlzQ3VycmVudCgpKSB7XG4gICAgICB0aGlzLmNoZWNrRm9yTG9jYWxTZXR0aW5ncygpO1xuICAgICAgdGhpcy5zZXR0aW5ncy5sb2FkKHRoaXMucHJvcHMuc2V0dGluZ3MpO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrRm9yTG9jYWxTZXR0aW5ncygpIHtcbiAgICBpZiAodGhpcy5sb2NhbFNldHRpbmdzV2F0Y2hlcikge1xuICAgICAgdGhpcy5sb2NhbFNldHRpbmdzV2F0Y2hlci5jbG9zZSgpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5sb2NhbFNldHRpbmdzQ2hlY2tlZCkge1xuICAgICAgdGhpcy5sb2NhbFNldHRpbmdzQ2hlY2tlZCA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBsb2NhbFNldHRpbmdzRmlsZSA9IGAke3RoaXMucm9vdFBhdGh9L3Byb2plY3QuY3NvbmA7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gQ1NPTi5yZWFkRmlsZVN5bmMobG9jYWxTZXR0aW5nc0ZpbGUpO1xuXG4gICAgICAgIGlmIChzZXR0aW5ncykge1xuICAgICAgICAgIHRoaXMubG9jYWxTZXR0aW5nc1dhdGNoZXIgPSBmcy53YXRjaChsb2NhbFNldHRpbmdzRmlsZSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2NhbFNldHRpbmdzQ2hlY2tlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0N1cnJlbnQoKSkge1xuICAgICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JMb2NhbFNldHRpbmdzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLnVwZGF0ZVByb3BzKHNldHRpbmdzKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG4gIH1cblxuICBzYXZlKCkge1xuICAgIGlmICh0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgaWYgKHRoaXMucHJvcHMuX2lkKSB7XG4gICAgICAgIGRiLnVwZGF0ZSh0aGlzLmdldFByb3BzVG9TYXZlKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGIuYWRkKHRoaXMuZ2V0UHJvcHNUb1NhdmUoKSwgaWQgPT4ge1xuICAgICAgICAgIHRoaXMucHJvcHMuX2lkID0gaWQ7XG4gICAgICAgICAgdGhpcy5sb29rRm9yVXBkYXRlcygpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGRiLmRlbGV0ZSh0aGlzLnByb3BzLl9pZCk7XG4gIH1cblxuICBvcGVuKCkge1xuICAgIGNvbnN0IHdpbiA9IGF0b20uZ2V0Q3VycmVudFdpbmRvdygpO1xuICAgIGNvbnN0IGNsb3NlQ3VycmVudCA9IGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLmNsb3NlQ3VycmVudCcpO1xuXG4gICAgYXRvbS5vcGVuKHtcbiAgICAgIHBhdGhzVG9PcGVuOiB0aGlzLnByb3BzLnBhdGhzLFxuICAgICAgZGV2TW9kZTogdGhpcy5wcm9wcy5kZXZNb2RlLFxuICAgICAgbmV3V2luZG93OiBjbG9zZUN1cnJlbnRcbiAgICB9KTtcblxuICAgIGlmIChjbG9zZUN1cnJlbnQpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW4uY2xvc2UoKTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgfVxuXG4gIG9uVXBkYXRlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCd1cGRhdGVkJywgKCkgPT4gY2FsbGJhY2soKSk7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/project-manager/lib/project.js

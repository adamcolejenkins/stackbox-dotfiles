Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

'use babel';

var Settings = (function () {
  function Settings() {
    _classCallCheck(this, Settings);
  }

  _createClass(Settings, [{
    key: 'update',
    value: function update() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this.load(settings);
    }
  }, {
    key: 'load',
    value: function load() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if ('global' in settings) {
        settings['*'] = settings.global;
        delete settings.global;
      }

      if ('*' in settings) {
        var scopedSettings = settings;
        settings = settings['*'];
        delete scopedSettings['*'];

        var setting = undefined;
        var scope = undefined;
        for (scope in scopedSettings) {
          setting = scopedSettings[scope];
          this.set(setting, scope);
        }
      }

      this.set(settings);
    }
  }, {
    key: 'set',
    value: function set(settings, scope) {
      var flatSettings = {};
      var setting = undefined;
      var value = undefined;
      var valueOptions = undefined;
      var currentValue = undefined;
      var options = scope ? { scopeSelector: scope } : {};
      options.save = false;
      this.flatten(flatSettings, settings);

      for (setting in flatSettings) {
        value = flatSettings[setting];

        atom.config.set(setting, value, options);
      }
    }
  }, {
    key: 'flatten',
    value: function flatten(root, dict, path) {
      var key = undefined;
      var value = undefined;
      var dotPath = undefined;
      var isObject = undefined;
      for (key in dict) {
        value = dict[key];
        dotPath = path ? path + '.' + key : key;
        isObject = !_underscorePlus2['default'].isArray(value) && _underscorePlus2['default'].isObject(value);

        if (isObject) {
          this.flatten(root, dict[key], dotPath);
        } else {
          root[dotPath] = value;
        }
      }
    }
  }]);

  return Settings;
})();

exports['default'] = Settings;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3NldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OEJBRWMsaUJBQWlCOzs7O0FBRi9CLFdBQVcsQ0FBQzs7SUFJUyxRQUFRO1dBQVIsUUFBUTswQkFBUixRQUFROzs7ZUFBUixRQUFROztXQUNyQixrQkFBYztVQUFiLFFBQVEseURBQUMsRUFBRTs7QUFDaEIsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNyQjs7O1dBRUcsZ0JBQWM7VUFBYixRQUFRLHlEQUFDLEVBQUU7O0FBQ2QsVUFBSSxRQUFRLElBQUksUUFBUSxFQUFFO0FBQ3hCLGdCQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUNoQyxlQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUM7T0FDeEI7O0FBRUQsVUFBSSxHQUFHLElBQUksUUFBUSxFQUFFO0FBQ25CLFlBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQztBQUM5QixnQkFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QixlQUFPLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFM0IsWUFBSSxPQUFPLFlBQUEsQ0FBQztBQUNaLFlBQUksS0FBSyxZQUFBLENBQUM7QUFDVixhQUFLLEtBQUssSUFBSSxjQUFjLEVBQUU7QUFDNUIsaUJBQU8sR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDMUI7T0FDRjs7QUFFRCxVQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3BCOzs7V0FFRSxhQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUU7QUFDbkIsVUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFVBQUksT0FBTyxZQUFBLENBQUM7QUFDWixVQUFJLEtBQUssWUFBQSxDQUFDO0FBQ1YsVUFBSSxZQUFZLFlBQUEsQ0FBQztBQUNqQixVQUFJLFlBQVksWUFBQSxDQUFDO0FBQ2pCLFVBQUksT0FBTyxHQUFHLEtBQUssR0FBRyxFQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUMsR0FBRyxFQUFFLENBQUM7QUFDbEQsYUFBTyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7QUFDckIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7O0FBRXJDLFdBQUssT0FBTyxJQUFJLFlBQVksRUFBRTtBQUM1QixhQUFLLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU5QixZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO09BQzFDO0tBQ0Y7OztXQUVNLGlCQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ3hCLFVBQUksR0FBRyxZQUFBLENBQUM7QUFDUixVQUFJLEtBQUssWUFBQSxDQUFDO0FBQ1YsVUFBSSxPQUFPLFlBQUEsQ0FBQztBQUNaLFVBQUksUUFBUSxZQUFBLENBQUM7QUFDYixXQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUU7QUFDaEIsYUFBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQixlQUFPLEdBQUcsSUFBSSxHQUFNLElBQUksU0FBSSxHQUFHLEdBQUssR0FBRyxDQUFDO0FBQ3hDLGdCQUFRLEdBQUcsQ0FBQyw0QkFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksNEJBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVsRCxZQUFJLFFBQVEsRUFBRTtBQUNaLGNBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUN4QyxNQUFNO0FBQ0wsY0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUN2QjtPQUNGO0tBQ0Y7OztTQTVEa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvc2V0dGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0dGluZ3Mge1xuICB1cGRhdGUoc2V0dGluZ3M9e30pIHtcbiAgICB0aGlzLmxvYWQoc2V0dGluZ3MpO1xuICB9XG5cbiAgbG9hZChzZXR0aW5ncz17fSkge1xuICAgIGlmICgnZ2xvYmFsJyBpbiBzZXR0aW5ncykge1xuICAgICAgc2V0dGluZ3NbJyonXSA9IHNldHRpbmdzLmdsb2JhbDtcbiAgICAgIGRlbGV0ZSBzZXR0aW5ncy5nbG9iYWw7XG4gICAgfVxuXG4gICAgaWYgKCcqJyBpbiBzZXR0aW5ncykge1xuICAgICAgbGV0IHNjb3BlZFNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgICBzZXR0aW5ncyA9IHNldHRpbmdzWycqJ107XG4gICAgICBkZWxldGUgc2NvcGVkU2V0dGluZ3NbJyonXTtcblxuICAgICAgbGV0IHNldHRpbmc7XG4gICAgICBsZXQgc2NvcGU7XG4gICAgICBmb3IgKHNjb3BlIGluIHNjb3BlZFNldHRpbmdzKSB7XG4gICAgICAgIHNldHRpbmcgPSBzY29wZWRTZXR0aW5nc1tzY29wZV07XG4gICAgICAgIHRoaXMuc2V0KHNldHRpbmcsIHNjb3BlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldChzZXR0aW5ncyk7XG4gIH1cblxuICBzZXQoc2V0dGluZ3MsIHNjb3BlKSB7XG4gICAgbGV0IGZsYXRTZXR0aW5ncyA9IHt9O1xuICAgIGxldCBzZXR0aW5nO1xuICAgIGxldCB2YWx1ZTtcbiAgICBsZXQgdmFsdWVPcHRpb25zO1xuICAgIGxldCBjdXJyZW50VmFsdWU7XG4gICAgbGV0IG9wdGlvbnMgPSBzY29wZSA/IHtzY29wZVNlbGVjdG9yOiBzY29wZX0gOiB7fTtcbiAgICBvcHRpb25zLnNhdmUgPSBmYWxzZTtcbiAgICB0aGlzLmZsYXR0ZW4oZmxhdFNldHRpbmdzLCBzZXR0aW5ncyk7XG5cbiAgICBmb3IgKHNldHRpbmcgaW4gZmxhdFNldHRpbmdzKSB7XG4gICAgICB2YWx1ZSA9IGZsYXRTZXR0aW5nc1tzZXR0aW5nXTtcblxuICAgICAgYXRvbS5jb25maWcuc2V0KHNldHRpbmcsIHZhbHVlLCBvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICBmbGF0dGVuKHJvb3QsIGRpY3QsIHBhdGgpIHtcbiAgICBsZXQga2V5O1xuICAgIGxldCB2YWx1ZTtcbiAgICBsZXQgZG90UGF0aDtcbiAgICBsZXQgaXNPYmplY3Q7XG4gICAgZm9yIChrZXkgaW4gZGljdCkge1xuICAgICAgdmFsdWUgPSBkaWN0W2tleV07XG4gICAgICBkb3RQYXRoID0gcGF0aCA/IGAke3BhdGh9LiR7a2V5fWAgOiBrZXk7XG4gICAgICBpc09iamVjdCA9ICFfLmlzQXJyYXkodmFsdWUpICYmIF8uaXNPYmplY3QodmFsdWUpO1xuXG4gICAgICBpZiAoaXNPYmplY3QpIHtcbiAgICAgICAgdGhpcy5mbGF0dGVuKHJvb3QsIGRpY3Rba2V5XSwgZG90UGF0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByb290W2RvdFBhdGhdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/ajenkins/.atom/packages/project-manager/lib/settings.js

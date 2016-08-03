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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvc2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs4QkFFYyxpQkFBaUI7Ozs7QUFGL0IsV0FBVyxDQUFDOztJQUlTLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBQ3JCLGtCQUFjO1VBQWIsUUFBUSx5REFBQyxFQUFFOztBQUNoQixVQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3JCOzs7V0FFRyxnQkFBYztVQUFiLFFBQVEseURBQUMsRUFBRTs7QUFDZCxVQUFJLFFBQVEsSUFBSSxRQUFRLEVBQUU7QUFDeEIsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQ2hDLGVBQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQztPQUN4Qjs7QUFFRCxVQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUU7QUFDbkIsWUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDO0FBQzlCLGdCQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLGVBQU8sY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUUzQixZQUFJLE9BQU8sWUFBQSxDQUFDO0FBQ1osWUFBSSxLQUFLLFlBQUEsQ0FBQztBQUNWLGFBQUssS0FBSyxJQUFJLGNBQWMsRUFBRTtBQUM1QixpQkFBTyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoQyxjQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMxQjtPQUNGOztBQUVELFVBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDcEI7OztXQUVFLGFBQUMsUUFBUSxFQUFFLEtBQUssRUFBRTtBQUNuQixVQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDdEIsVUFBSSxPQUFPLFlBQUEsQ0FBQztBQUNaLFVBQUksS0FBSyxZQUFBLENBQUM7QUFDVixVQUFJLFlBQVksWUFBQSxDQUFDO0FBQ2pCLFVBQUksWUFBWSxZQUFBLENBQUM7QUFDakIsVUFBSSxPQUFPLEdBQUcsS0FBSyxHQUFHLEVBQUMsYUFBYSxFQUFFLEtBQUssRUFBQyxHQUFHLEVBQUUsQ0FBQztBQUNsRCxhQUFPLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztBQUNyQixVQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFckMsV0FBSyxPQUFPLElBQUksWUFBWSxFQUFFO0FBQzVCLGFBQUssR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTlCLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7T0FDMUM7S0FDRjs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7QUFDeEIsVUFBSSxHQUFHLFlBQUEsQ0FBQztBQUNSLFVBQUksS0FBSyxZQUFBLENBQUM7QUFDVixVQUFJLE9BQU8sWUFBQSxDQUFDO0FBQ1osVUFBSSxRQUFRLFlBQUEsQ0FBQztBQUNiLFdBQUssR0FBRyxJQUFJLElBQUksRUFBRTtBQUNoQixhQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLGVBQU8sR0FBRyxJQUFJLEdBQU0sSUFBSSxTQUFJLEdBQUcsR0FBSyxHQUFHLENBQUM7QUFDeEMsZ0JBQVEsR0FBRyxDQUFDLDRCQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSw0QkFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWxELFlBQUksUUFBUSxFQUFFO0FBQ1osY0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3hDLE1BQU07QUFDTCxjQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQ3ZCO09BQ0Y7S0FDRjs7O1NBNURrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvVXNlcnMvYWplbmtpbnMvLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3NldHRpbmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNldHRpbmdzIHtcbiAgdXBkYXRlKHNldHRpbmdzPXt9KSB7XG4gICAgdGhpcy5sb2FkKHNldHRpbmdzKTtcbiAgfVxuXG4gIGxvYWQoc2V0dGluZ3M9e30pIHtcbiAgICBpZiAoJ2dsb2JhbCcgaW4gc2V0dGluZ3MpIHtcbiAgICAgIHNldHRpbmdzWycqJ10gPSBzZXR0aW5ncy5nbG9iYWw7XG4gICAgICBkZWxldGUgc2V0dGluZ3MuZ2xvYmFsO1xuICAgIH1cblxuICAgIGlmICgnKicgaW4gc2V0dGluZ3MpIHtcbiAgICAgIGxldCBzY29wZWRTZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgICAgc2V0dGluZ3MgPSBzZXR0aW5nc1snKiddO1xuICAgICAgZGVsZXRlIHNjb3BlZFNldHRpbmdzWycqJ107XG5cbiAgICAgIGxldCBzZXR0aW5nO1xuICAgICAgbGV0IHNjb3BlO1xuICAgICAgZm9yIChzY29wZSBpbiBzY29wZWRTZXR0aW5ncykge1xuICAgICAgICBzZXR0aW5nID0gc2NvcGVkU2V0dGluZ3Nbc2NvcGVdO1xuICAgICAgICB0aGlzLnNldChzZXR0aW5nLCBzY29wZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXQoc2V0dGluZ3MpO1xuICB9XG5cbiAgc2V0KHNldHRpbmdzLCBzY29wZSkge1xuICAgIGxldCBmbGF0U2V0dGluZ3MgPSB7fTtcbiAgICBsZXQgc2V0dGluZztcbiAgICBsZXQgdmFsdWU7XG4gICAgbGV0IHZhbHVlT3B0aW9ucztcbiAgICBsZXQgY3VycmVudFZhbHVlO1xuICAgIGxldCBvcHRpb25zID0gc2NvcGUgPyB7c2NvcGVTZWxlY3Rvcjogc2NvcGV9IDoge307XG4gICAgb3B0aW9ucy5zYXZlID0gZmFsc2U7XG4gICAgdGhpcy5mbGF0dGVuKGZsYXRTZXR0aW5ncywgc2V0dGluZ3MpO1xuXG4gICAgZm9yIChzZXR0aW5nIGluIGZsYXRTZXR0aW5ncykge1xuICAgICAgdmFsdWUgPSBmbGF0U2V0dGluZ3Nbc2V0dGluZ107XG5cbiAgICAgIGF0b20uY29uZmlnLnNldChzZXR0aW5nLCB2YWx1ZSwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgZmxhdHRlbihyb290LCBkaWN0LCBwYXRoKSB7XG4gICAgbGV0IGtleTtcbiAgICBsZXQgdmFsdWU7XG4gICAgbGV0IGRvdFBhdGg7XG4gICAgbGV0IGlzT2JqZWN0O1xuICAgIGZvciAoa2V5IGluIGRpY3QpIHtcbiAgICAgIHZhbHVlID0gZGljdFtrZXldO1xuICAgICAgZG90UGF0aCA9IHBhdGggPyBgJHtwYXRofS4ke2tleX1gIDoga2V5O1xuICAgICAgaXNPYmplY3QgPSAhXy5pc0FycmF5KHZhbHVlKSAmJiBfLmlzT2JqZWN0KHZhbHVlKTtcblxuICAgICAgaWYgKGlzT2JqZWN0KSB7XG4gICAgICAgIHRoaXMuZmxhdHRlbihyb290LCBkaWN0W2tleV0sIGRvdFBhdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdFtkb3RQYXRoXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19
//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/project-manager/lib/settings.js

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _season = require('season');

var _season2 = _interopRequireDefault(_season);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

'use babel';

var CSONDB = (function () {
  function CSONDB() {
    var _this = this;

    _classCallCheck(this, CSONDB);

    this.emitter = new _atom.Emitter();
    this.updaters = {};

    this.onUpdate(function (projects) {
      for (var project of projects) {
        _this.sendUpdate(project);
      }
    });

    _fs2['default'].exists(this.file(), function (exists) {
      if (exists) {
        _this.observeProjects();
      } else {
        _this.writeFile({});
      }
    });
  }

  _createClass(CSONDB, [{
    key: 'find',
    value: function find() {
      var _this2 = this;

      var callback = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      this.readFile(function (results) {
        var projects = [];

        for (var key in results) {
          var result = results[key];
          var template = result.template || null;

          if (_this2.isProject(result) === false) {
            continue;
          }

          result._id = key;
          if (template && results[template] !== null) {
            var templateSettings = results[template];
            var projectSettings = result;
            result = _underscorePlus2['default'].deepExtend({}, templateSettings, projectSettings);
          }

          for (var i in result.paths) {
            if (typeof result.paths[i] !== 'string') {
              continue;
            }

            if (result.paths[i].charAt(0) === '~') {
              result.paths[i] = result.paths[i].replace('~', _os2['default'].homedir());
            }
          }

          projects.push(result);
        }

        if (callback) {
          callback(projects);
        }
      });
    }
  }, {
    key: 'isProject',
    value: function isProject(settings) {
      if (typeof settings.paths === 'undefined') {
        return false;
      }

      if (settings.paths.length === 0) {
        return false;
      }

      return true;
    }
  }, {
    key: 'add',
    value: function add(props, callback) {
      var _this3 = this;

      this.readFile(function (projects) {
        var id = _this3.generateID(props.title);
        projects[id] = props;

        _this3.writeFile(projects, function () {
          atom.notifications.addSuccess(props.title + ' has been added');

          if (callback) {
            callback(id);
          }
        });
      });
    }
  }, {
    key: 'update',
    value: function update(props) {
      var _this4 = this;

      if (!props._id) {
        return false;
      }

      var id = props._id;
      delete props._id;

      this.readFile(function (projects) {
        projects[id] = props;
        _this4.writeFile(projects);
      });
    }
  }, {
    key: 'delete',
    value: function _delete(id, callback) {
      var _this5 = this;

      this.readFile(function (projects) {
        for (var key in projects) {
          if (key === id) {
            delete projects[key];
          }
        }

        _this5.writeFile(projects, function () {
          if (callback) {
            callback();
          }
        });
      });
    }
  }, {
    key: 'onUpdate',
    value: function onUpdate() {
      var _this6 = this;

      var callback = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      this.emitter.on('db-updated', function () {
        _this6.find(callback);
      });
    }
  }, {
    key: 'sendUpdate',
    value: function sendUpdate(project) {
      for (var key in this.updaters) {
        var _updaters$key = this.updaters[key];
        var id = _updaters$key.id;
        var query = _updaters$key.query;
        var callback = _updaters$key.callback;

        if (Object.keys(query).length === 0) {
          callback(project);
        } else if (id === project._id || _underscorePlus2['default'].isEqual(project[query.key], query.value)) {
          callback(project);
        }
      }
    }
  }, {
    key: 'addUpdater',
    value: function addUpdater(id, query, callback) {
      this.updaters[id] = {
        id: id,
        query: query,
        callback: callback
      };
    }
  }, {
    key: 'observeProjects',
    value: function observeProjects() {
      var _this7 = this;

      if (this.fileWatcher) {
        this.fileWatcher.close();
      }

      try {
        this.fileWatcher = _fs2['default'].watch(this.file(), function () {
          _this7.emitter.emit('db-updated');
        });
      } catch (error) {
        var url = 'https://github.com/atom/atom/blob/master/docs/';
        url += 'build-instructions/linux.md#typeerror-unable-to-watch-path';
        var filename = _path2['default'].basename(this.file());
        var errorMessage = '<b>Project Manager</b><br>Could not watch changes\n        to ' + filename + '. Make sure you have permissions to ' + this.file() + '.\n        On linux there can be problems with watch sizes.\n        See <a href=\'' + url + '\'> this document</a> for more info.>';
        this.notifyFailure(errorMessage);
      }
    }
  }, {
    key: 'updateFile',
    value: function updateFile() {
      var _this8 = this;

      _fs2['default'].exists(this.file(true), function (exists) {
        if (!exists) {
          _this8.writeFile({});
        }
      });
    }
  }, {
    key: 'generateID',
    value: function generateID(string) {
      return string.replace(/\s+/g, '').toLowerCase();
    }
  }, {
    key: 'updateFilepath',
    value: function updateFilepath(filepath) {
      this.filepath = filepath;
      this.observeProjects();
    }
  }, {
    key: 'file',
    value: function file() {
      if (this.filepath) {
        return this.filepath;
      }

      var filename = 'projects.cson';
      var filedir = atom.getConfigDirPath();

      if (this.environmentSpecificProjects) {
        var hostname = _os2['default'].hostname().split('.').shift().toLowerCase();
        filename = 'projects.' + hostname + '.cson';
      }

      return filedir + '/' + filename;
    }
  }, {
    key: 'readFile',
    value: function readFile() {
      var callback = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var exists = _fs2['default'].existsSync(this.file());
      var projects = null;

      if (exists) {
        try {
          projects = _season2['default'].readFileSync(this.file()) || {};
        } catch (error) {
          console.log(error);
          var message = 'Failed to load ' + _path2['default'].basename(this.file());
          var detail = error.location != null ? error.stack : error.message;
          this.notifyFailure(message, detail);
        }
      } else {
        _fs2['default'].writeFileSync(this.file(), '{}');
        projects = {};
      }

      if (callback) {
        callback(projects);
      }

      return projects;
    }
  }, {
    key: 'writeFile',
    value: function writeFile(projects, callback) {
      try {
        _season2['default'].writeFileSync(this.file(), projects);
      } catch (e) {
        console.log(e);
      }

      if (callback) {
        callback();
      }
    }
  }, {
    key: 'notifyFailure',
    value: function notifyFailure(message) {
      var detail = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      atom.notifications.addError(message, {
        detail: detail,
        dismissable: true
      });
    }
  }, {
    key: 'environmentSpecificProjects',
    get: function get() {
      return atom.config.get('project-manager.environmentSpecificProjects');
    }
  }]);

  return CSONDB;
})();

exports['default'] = CSONDB;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL2Nzb24tZGIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFc0IsTUFBTTs7c0JBQ1gsUUFBUTs7OztrQkFDVixJQUFJOzs7O29CQUNGLE1BQU07Ozs7a0JBQ1IsSUFBSTs7Ozs4QkFDTCxpQkFBaUI7Ozs7QUFQL0IsV0FBVyxDQUFDOztJQVNTLE1BQU07QUFDZCxXQURRLE1BQU0sR0FDWDs7OzBCQURLLE1BQU07O0FBRXZCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQztBQUM3QixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQzs7QUFFbkIsUUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUMxQixXQUFLLElBQUksT0FBTyxJQUFJLFFBQVEsRUFBRTtBQUM1QixjQUFLLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUMxQjtLQUNGLENBQUMsQ0FBQzs7QUFFSCxvQkFBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLFVBQUMsTUFBTSxFQUFLO0FBQ2pDLFVBQUksTUFBTSxFQUFFO0FBQ1YsY0FBSyxlQUFlLEVBQUUsQ0FBQztPQUN4QixNQUFNO0FBQ0wsY0FBSyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7T0FDcEI7S0FDRixDQUFDLENBQUM7R0FDSjs7ZUFsQmtCLE1BQU07O1dBd0JyQixnQkFBZ0I7OztVQUFmLFFBQVEseURBQUMsSUFBSTs7QUFDaEIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUN2QixZQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7O0FBRXBCLGFBQUssSUFBTSxHQUFHLElBQUksT0FBTyxFQUFFO0FBQ3pCLGNBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxQixjQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxJ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QUM7U0FDckM7T0FDRixNQUFNO0FBQ0wsd0JBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwQyxnQkFBUSxHQUFHLEVBQUUsQ0FBQztPQUNmOztBQUVELFVBQUksUUFBUSxFQUFFO0FBQ1osZ0JBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUNwQjs7QUFFRCxhQUFPLFFBQVEsQ0FBQztLQUNqQjs7O1dBRVEsbUJBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRTtBQUM1QixVQUFJO0FBQ0YsNEJBQUssYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztPQUMzQyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsZUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNoQjs7QUFFRCxVQUFJLFFBQVEsRUFBRTtBQUNaLGdCQUFRLEVBQUUsQ0FBQztPQUNaO0tBQ0Y7OztXQUVZLHVCQUFDLE9BQU8sRUFBZTtVQUFiLE1BQU0seURBQUMsSUFBSTs7QUFDaEMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO0FBQ25DLGNBQU0sRUFBRSxNQUFNO0FBQ2QsbUJBQVcsRUFBRSxJQUFJO09BQ2xCLENBQUMsQ0FBQztLQUNKOzs7U0E5TjhCLGVBQUc7QUFDaEMsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0tBQ3ZFOzs7U0F0QmtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL2Nzb24tZGIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdhdG9tJztcbmltcG9ydCBDU09OIGZyb20gJ3NlYXNvbic7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ1NPTkRCIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZXJzID0ge307XG5cbiAgICB0aGlzLm9uVXBkYXRlKChwcm9qZWN0cykgPT4ge1xuICAgICAgZm9yIChsZXQgcHJvamVjdCBvZiBwcm9qZWN0cykge1xuICAgICAgICB0aGlzLnNlbmRVcGRhdGUocHJvamVjdCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBmcy5leGlzdHModGhpcy5maWxlKCksIChleGlzdHMpID0+IHtcbiAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlUHJvamVjdHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMud3JpdGVGaWxlKHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldCBlbnZpcm9ubWVudFNwZWNpZmljUHJvamVjdHMoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLmVudmlyb25tZW50U3BlY2lmaWNQcm9qZWN0cycpO1xuICB9XG5cbiAgZmluZChjYWxsYmFjaz1udWxsKSB7XG4gICAgdGhpcy5yZWFkRmlsZShyZXN1bHRzID0+IHtcbiAgICAgIGNvbnN0IHByb2plY3RzID0gW107XG5cbiAgICAgIGZvciAoY29uc3Qga2V5IGluIHJlc3VsdHMpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHJlc3VsdHNba2V5XTtcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSByZXN1bHQudGVtcGxhdGUgfHwgbnVsbDtcblxuICAgICAgICBpZiAodGhpcy5pc1Byb2plY3QocmVzdWx0KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdC5faWQgPSBrZXk7XG4gICAgICAgIGlmICh0ZW1wbGF0ZSAmJiByZXN1bHRzW3RlbXBsYXRlXSAhPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IHRlbXBsYXRlU2V0dGluZ3MgPSByZXN1bHRzW3RlbXBsYXRlXTtcbiAgICAgICAgICBjb25zdCBwcm9qZWN0U2V0dGluZ3MgPSByZXN1bHQ7XG4gICAgICAgICAgcmVzdWx0ID0gXy5kZWVwRXh0ZW5kKHt9LCB0ZW1wbGF0ZVNldHRpbmdzLCBwcm9qZWN0U2V0dGluZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSBpbiByZXN1bHQucGF0aHMpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdC5wYXRoc1tpXSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChyZXN1bHQucGF0aHNbaV0uY2hhckF0KDApID09PSAnficpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wYXRoc1tpXSA9IHJlc3VsdC5wYXRoc1tpXS5yZXBsYWNlKCd+Jywgb3MuaG9tZWRpcigpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcm9qZWN0cy5wdXNoKHJlc3VsdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhwcm9qZWN0cyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBpc1Byb2plY3Qoc2V0dGluZ3MpIHtcbiAgICBpZiAodHlwZW9mIHNldHRpbmdzLnBhdGhzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChzZXR0aW5ncy5wYXRocy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFkZChwcm9wcywgY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlYWRGaWxlKHByb2plY3RzID0+IHtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5nZW5lcmF0ZUlEKHByb3BzLnRpdGxlKTtcbiAgICAgIHByb2plY3RzW2lkXSA9IHByb3BzO1xuXG4gICAgICB0aGlzLndyaXRlRmlsZShwcm9qZWN0cywgKCkgPT4ge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhgJHtwcm9wcy50aXRsZX0gaGFzIGJlZW4gYWRkZWRgKTtcblxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBjYWxsYmFjayhpZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlKHByb3BzKSB7XG4gICAgaWYgKCFwcm9wcy5faWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBpZCA9IHByb3BzLl9pZDtcbiAgICBkZWxldGUgcHJvcHMuX2lkO1xuXG4gICAgdGhpcy5yZWFkRmlsZShwcm9qZWN0cyA9PiB7XG4gICAgICBwcm9qZWN0c1tpZF0gPSBwcm9wcztcbiAgICAgIHRoaXMud3JpdGVGaWxlKHByb2plY3RzKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRlbGV0ZShpZCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlYWRGaWxlKHByb2plY3RzID0+IHtcbiAgICAgIGZvciAobGV0IGtleSBpbiBwcm9qZWN0cykge1xuICAgICAgICBpZiAoa2V5ID09PSBpZCkge1xuICAgICAgICAgIGRlbGV0ZShwcm9qZWN0c1trZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLndyaXRlRmlsZShwcm9qZWN0cywgKCkgPT4ge1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uVXBkYXRlKGNhbGxiYWNrPW51bGwpIHtcbiAgICB0aGlzLmVtaXR0ZXIub24oJ2RiLXVwZGF0ZWQnLCAoKSA9PiB7XG4gICAgICB0aGlzLmZpbmQoY2FsbGJhY2spO1xuICAgIH0pO1xuICB9XG5cbiAgc2VuZFVwZGF0ZShwcm9qZWN0KSB7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMudXBkYXRlcnMpIHtcbiAgICAgIGNvbnN0IHtpZCwgcXVlcnksIGNhbGxiYWNrfSA9IHRoaXMudXBkYXRlcnNba2V5XTtcblxuICAgICAgaWYgKE9iamVjdC5rZXlzKHF1ZXJ5KS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY2FsbGJhY2socHJvamVjdCk7XG4gICAgICB9IGVsc2UgaWYgKGlkID09PSBwcm9qZWN0Ll9pZCB8fFxuICAgICAgICBfLmlzRXF1YWwocHJvamVjdFtxdWVyeS5rZXldLCBxdWVyeS52YWx1ZSkpIHtcbiAgICAgICAgY2FsbGJhY2socHJvamVjdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWRkVXBkYXRlcihpZCwgcXVlcnksIGNhbGxiYWNrKSB7XG4gICAgdGhpcy51cGRhdGVyc1tpZF0gPSB7XG4gICAgICBpZCxcbiAgICAgIHF1ZXJ5LFxuICAgICAgY2FsbGJhY2tcbiAgICB9O1xuICB9XG5cbiAgb2JzZXJ2ZVByb2plY3RzKCkge1xuICAgIGlmICh0aGlzLmZpbGVXYXRjaGVyKSB7XG4gICAgICB0aGlzLmZpbGVXYXRjaGVyLmNsb3NlKCk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZmlsZVdhdGNoZXIgPSBmcy53YXRjaCh0aGlzLmZpbGUoKSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGItdXBkYXRlZCcpO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxldCB1cmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL2F0b20vYXRvbS9ibG9iL21hc3Rlci9kb2NzLyc7XG4gICAgICB1cmwgKz0gJ2J1aWxkLWluc3RydWN0aW9ucy9saW51eC5tZCN0eXBlZXJyb3ItdW5hYmxlLXRvLXdhdGNoLXBhdGgnO1xuICAgICAgY29uc3QgZmlsZW5hbWUgPSBwYXRoLmJhc2VuYW1lKHRoaXMuZmlsZSgpKTtcbiAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGA8Yj5Qcm9qZWN0IE1hbmFnZXI8L2I+PGJyPkNvdWxkIG5vdCB3YXRjaCBjaGFuZ2VzXG4gICAgICAgIHRvICR7ZmlsZW5hbWV9LiBNYWtlIHN1cmUgeW91IGhhdmUgcGVybWlzc2lvbnMgdG8gJHt0aGlzLmZpbGUoKX0uXG4gICAgICAgIE9uIGxpbnV4IHRoZXJlIGNhbiBiZSBwcm9ibGVtcyB3aXRoIHdhdGNoIHNpemVzLlxuICAgICAgICBTZWUgPGEgaHJlZj0nJHt1cmx9Jz4gdGhpcyBkb2N1bWVudDwvYT4gZm9yIG1vcmUgaW5mby4+YDtcbiAgICAgIHRoaXMubm90aWZ5RmFpbHVyZShlcnJvck1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUZpbGUoKSB7XG4gICAgZnMuZXhpc3RzKHRoaXMuZmlsZSh0cnVlKSwgKGV4aXN0cykgPT4ge1xuICAgICAgaWYgKCFleGlzdHMpIHtcbiAgICAgICAgdGhpcy53cml0ZUZpbGUoe30pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2VuZXJhdGVJRChzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1xccysvZywgJycpLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICB1cGRhdGVGaWxlcGF0aChmaWxlcGF0aCkge1xuICAgIHRoaXMuZmlsZXBhdGggPSBmaWxlcGF0aDtcbiAgICB0aGlzLm9ic2VydmVQcm9qZWN0cygpO1xuICB9XG5cbiAgZmlsZSgpIHtcbiAgICBpZiAodGhpcy5maWxlcGF0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsZXBhdGg7XG4gICAgfVxuXG4gICAgbGV0IGZpbGVuYW1lID0gJ3Byb2plY3RzLmNzb24nO1xuICAgIGNvbnN0IGZpbGVkaXIgPSBhdG9tLmdldENvbmZpZ0RpclBhdGgoKTtcblxuICAgIGlmICh0aGlzLmVudmlyb25tZW50U3BlY2lmaWNQcm9qZWN0cykge1xuICAgICAgbGV0IGhvc3RuYW1lID0gb3MuaG9zdG5hbWUoKS5zcGxpdCgnLicpLnNoaWZ0KCkudG9Mb3dlckNhc2UoKTtcbiAgICAgIGZpbGVuYW1lID0gYHByb2plY3RzLiR7aG9zdG5hbWV9LmNzb25gO1xuICAgIH1cblxuICAgIHJldHVybiBgJHtmaWxlZGlyfS8ke2ZpbGVuYW1lfWA7XG4gIH1cblxuICByZWFkRmlsZShjYWxsYmFjaz1udWxsKSB7XG4gICAgY29uc3QgZXhpc3RzID0gZnMuZXhpc3RzU3luYyh0aGlzLmZpbGUoKSk7XG4gICAgbGV0IHByb2plY3RzID0gbnVsbDtcblxuICAgIGlmIChleGlzdHMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHByb2plY3RzID0gQ1NPTi5yZWFkRmlsZVN5bmModGhpcy5maWxlKCkpIHx8IHt9O1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gYEZhaWxlZCB0byBsb2FkICR7cGF0aC5iYXNlbmFtZSh0aGlzLmZpbGUoKSl9YDtcbiAgICAgICAgY29uc3QgZGV0YWlsID0gZXJyb3IubG9jYXRpb24gIT0gbnVsbCA/IGVycm9yLnN0YWNrIDogZXJyb3IubWVzc2FnZTtcbiAgICAgICAgdGhpcy5ub3RpZnlGYWlsdXJlKG1lc3NhZ2UsIGRldGFpbCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmModGhpcy5maWxlKCksICd7fScpO1xuICAgICAgcHJvamVjdHMgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKHByb2plY3RzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvamVjdHM7XG4gIH1cblxuICB3cml0ZUZpbGUocHJvamVjdHMsIGNhbGxiYWNrKSB7XG4gICAgdHJ5IHtcbiAgICAgIENTT04ud3JpdGVGaWxlU3luYyh0aGlzLmZpbGUoKSwgcHJvamVjdHMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIH1cblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnlGYWlsdXJlKG1lc3NhZ2UsIGRldGFpbD1udWxsKSB7XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKG1lc3NhZ2UsIHtcbiAgICAgIGRldGFpbDogZGV0YWlsLFxuICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICB9KTtcbiAgfVxufVxuIl19
//# sourceURL=/Users/ajenkins/.atom/packages/project-manager/lib/cson-db.js

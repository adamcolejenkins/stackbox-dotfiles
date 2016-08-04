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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvY3Nvbi1kYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVzQixNQUFNOztzQkFDWCxRQUFROzs7O2tCQUNWLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztrQkFDUixJQUFJOzs7OzhCQUNMLGlCQUFpQjs7OztBQVAvQixXQUFXLENBQUM7O0lBU1MsTUFBTTtBQUNkLFdBRFEsTUFBTSxHQUNYOzs7MEJBREssTUFBTTs7QUFFdkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOztBQUVuQixRQUFJLENBQUMsUUFBUSxDQUFDLFVBQUMsUUFBUSxFQUFLO0FBQzFCLFdBQUssSUFBSSxPQUFPLElBQUksUUFBUSxFQUFFO0FBQzVCLGNBQUssVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQzFCO0tBQ0YsQ0FBQyxDQUFDOztBQUVILG9CQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsVUFBQyxNQUFNLEVBQUs7QUFDakMsVUFBSSxNQUFNLEVBQUU7QUFDVixjQUFLLGVBQWUsRUFBRSxDQUFDO09BQ3hCLE1BQU07QUFDTCxjQUFLLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztPQUNwQjtLQUNGLENBQUMsQ0FBQztHQUNKOztlQWxCa0IsTUFBTTs7V0F3QnJCLGdCQUFnQjs7O1VBQWYsUUFBUSx5REFBQyxJQUFJOztBQUNoQixVQUFJLENBQUMsUUFBUSxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ3ZCLFlBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQzs7QUFFcEIsYUFBSyxJQUFNLEdBQUcsSUFBSSxPQUFPLEVBQUU7QUFDekIsY0FBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLGNBQU0sUUFBUSxHQUFH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RUFBRSxNQUFNLENBQUMsQ0FBQztTQUNyQztPQUNGLE1BQU07QUFDTCx3QkFBRyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3BDLGdCQUFRLEdBQUcsRUFBRSxDQUFDO09BQ2Y7O0FBRUQsVUFBSSxRQUFRLEVBQUU7QUFDWixnQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQ3BCOztBQUVELGFBQU8sUUFBUSxDQUFDO0tBQ2pCOzs7V0FFUSxtQkFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQzVCLFVBQUk7QUFDRiw0QkFBSyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO09BQzNDLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixlQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ2hCOztBQUVELFVBQUksUUFBUSxFQUFFO0FBQ1osZ0JBQVEsRUFBRSxDQUFDO09BQ1o7S0FDRjs7O1dBRVksdUJBQUMsT0FBTyxFQUFlO1VBQWIsTUFBTSx5REFBQyxJQUFJOztBQUNoQyxVQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7QUFDbkMsY0FBTSxFQUFFLE1BQU07QUFDZCxtQkFBVyxFQUFFLElBQUk7T0FDbEIsQ0FBQyxDQUFDO0tBQ0o7OztTQTlOOEIsZUFBRztBQUNoQyxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7S0FDdkU7OztTQXRCa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9jc29uLWRiLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7RW1pdHRlcn0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgQ1NPTiBmcm9tICdzZWFzb24nO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENTT05EQiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgdGhpcy51cGRhdGVycyA9IHt9O1xuXG4gICAgdGhpcy5vblVwZGF0ZSgocHJvamVjdHMpID0+IHtcbiAgICAgIGZvciAobGV0IHByb2plY3Qgb2YgcHJvamVjdHMpIHtcbiAgICAgICAgdGhpcy5zZW5kVXBkYXRlKHByb2plY3QpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnMuZXhpc3RzKHRoaXMuZmlsZSgpLCAoZXhpc3RzKSA9PiB7XG4gICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZVByb2plY3RzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLndyaXRlRmlsZSh7fSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXQgZW52aXJvbm1lbnRTcGVjaWZpY1Byb2plY3RzKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5lbnZpcm9ubWVudFNwZWNpZmljUHJvamVjdHMnKTtcbiAgfVxuXG4gIGZpbmQoY2FsbGJhY2s9bnVsbCkge1xuICAgIHRoaXMucmVhZEZpbGUocmVzdWx0cyA9PiB7XG4gICAgICBjb25zdCBwcm9qZWN0cyA9IFtdO1xuXG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiByZXN1bHRzKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSByZXN1bHRzW2tleV07XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gcmVzdWx0LnRlbXBsYXRlIHx8IG51bGw7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNQcm9qZWN0KHJlc3VsdCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHQuX2lkID0ga2V5O1xuICAgICAgICBpZiAodGVtcGxhdGUgJiYgcmVzdWx0c1t0ZW1wbGF0ZV0gIT09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCB0ZW1wbGF0ZVNldHRpbmdzID0gcmVzdWx0c1t0ZW1wbGF0ZV07XG4gICAgICAgICAgY29uc3QgcHJvamVjdFNldHRpbmdzID0gcmVzdWx0O1xuICAgICAgICAgIHJlc3VsdCA9IF8uZGVlcEV4dGVuZCh7fSwgdGVtcGxhdGVTZXR0aW5ncywgcHJvamVjdFNldHRpbmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgaW4gcmVzdWx0LnBhdGhzKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQucGF0aHNbaV0gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocmVzdWx0LnBhdGhzW2ldLmNoYXJBdCgwKSA9PT0gJ34nKSB7XG4gICAgICAgICAgICByZXN1bHQucGF0aHNbaV0gPSByZXN1bHQucGF0aHNbaV0ucmVwbGFjZSgnficsIG9zLmhvbWVkaXIoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJvamVjdHMucHVzaChyZXN1bHQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2socHJvamVjdHMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaXNQcm9qZWN0KHNldHRpbmdzKSB7XG4gICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5wYXRocyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoc2V0dGluZ3MucGF0aHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhZGQocHJvcHMsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5yZWFkRmlsZShwcm9qZWN0cyA9PiB7XG4gICAgICBjb25zdCBpZCA9IHRoaXMuZ2VuZXJhdGVJRChwcm9wcy50aXRsZSk7XG4gICAgICBwcm9qZWN0c1tpZF0gPSBwcm9wcztcblxuICAgICAgdGhpcy53cml0ZUZpbGUocHJvamVjdHMsICgpID0+IHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoYCR7cHJvcHMudGl0bGV9IGhhcyBiZWVuIGFkZGVkYCk7XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2soaWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZShwcm9wcykge1xuICAgIGlmICghcHJvcHMuX2lkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgaWQgPSBwcm9wcy5faWQ7XG4gICAgZGVsZXRlIHByb3BzLl9pZDtcblxuICAgIHRoaXMucmVhZEZpbGUocHJvamVjdHMgPT4ge1xuICAgICAgcHJvamVjdHNbaWRdID0gcHJvcHM7XG4gICAgICB0aGlzLndyaXRlRmlsZShwcm9qZWN0cyk7XG4gICAgfSk7XG4gIH1cblxuICBkZWxldGUoaWQsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5yZWFkRmlsZShwcm9qZWN0cyA9PiB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gcHJvamVjdHMpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gaWQpIHtcbiAgICAgICAgICBkZWxldGUocHJvamVjdHNba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy53cml0ZUZpbGUocHJvamVjdHMsICgpID0+IHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBvblVwZGF0ZShjYWxsYmFjaz1udWxsKSB7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdkYi11cGRhdGVkJywgKCkgPT4ge1xuICAgICAgdGhpcy5maW5kKGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbmRVcGRhdGUocHJvamVjdCkge1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLnVwZGF0ZXJzKSB7XG4gICAgICBjb25zdCB7aWQsIHF1ZXJ5LCBjYWxsYmFja30gPSB0aGlzLnVwZGF0ZXJzW2tleV07XG5cbiAgICAgIGlmIChPYmplY3Qua2V5cyhxdWVyeSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNhbGxiYWNrKHByb2plY3QpO1xuICAgICAgfSBlbHNlIGlmIChpZCA9PT0gcHJvamVjdC5faWQgfHxcbiAgICAgICAgXy5pc0VxdWFsKHByb2plY3RbcXVlcnkua2V5XSwgcXVlcnkudmFsdWUpKSB7XG4gICAgICAgIGNhbGxiYWNrKHByb2plY3QpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZFVwZGF0ZXIoaWQsIHF1ZXJ5LCBjYWxsYmFjaykge1xuICAgIHRoaXMudXBkYXRlcnNbaWRdID0ge1xuICAgICAgaWQsXG4gICAgICBxdWVyeSxcbiAgICAgIGNhbGxiYWNrXG4gICAgfTtcbiAgfVxuXG4gIG9ic2VydmVQcm9qZWN0cygpIHtcbiAgICBpZiAodGhpcy5maWxlV2F0Y2hlcikge1xuICAgICAgdGhpcy5maWxlV2F0Y2hlci5jbG9zZSgpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB0aGlzLmZpbGVXYXRjaGVyID0gZnMud2F0Y2godGhpcy5maWxlKCksICgpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RiLXVwZGF0ZWQnKTtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsZXQgdXJsID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2F0b20vYmxvYi9tYXN0ZXIvZG9jcy8nO1xuICAgICAgdXJsICs9ICdidWlsZC1pbnN0cnVjdGlvbnMvbGludXgubWQjdHlwZWVycm9yLXVuYWJsZS10by13YXRjaC1wYXRoJztcbiAgICAgIGNvbnN0IGZpbGVuYW1lID0gcGF0aC5iYXNlbmFtZSh0aGlzLmZpbGUoKSk7XG4gICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBgPGI+UHJvamVjdCBNYW5hZ2VyPC9iPjxicj5Db3VsZCBub3Qgd2F0Y2ggY2hhbmdlc1xuICAgICAgICB0byAke2ZpbGVuYW1lfS4gTWFrZSBzdXJlIHlvdSBoYXZlIHBlcm1pc3Npb25zIHRvICR7dGhpcy5maWxlKCl9LlxuICAgICAgICBPbiBsaW51eCB0aGVyZSBjYW4gYmUgcHJvYmxlbXMgd2l0aCB3YXRjaCBzaXplcy5cbiAgICAgICAgU2VlIDxhIGhyZWY9JyR7dXJsfSc+IHRoaXMgZG9jdW1lbnQ8L2E+IGZvciBtb3JlIGluZm8uPmA7XG4gICAgICB0aGlzLm5vdGlmeUZhaWx1cmUoZXJyb3JNZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVGaWxlKCkge1xuICAgIGZzLmV4aXN0cyh0aGlzLmZpbGUodHJ1ZSksIChleGlzdHMpID0+IHtcbiAgICAgIGlmICghZXhpc3RzKSB7XG4gICAgICAgIHRoaXMud3JpdGVGaWxlKHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdlbmVyYXRlSUQoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9cXHMrL2csICcnKS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgdXBkYXRlRmlsZXBhdGgoZmlsZXBhdGgpIHtcbiAgICB0aGlzLmZpbGVwYXRoID0gZmlsZXBhdGg7XG4gICAgdGhpcy5vYnNlcnZlUHJvamVjdHMoKTtcbiAgfVxuXG4gIGZpbGUoKSB7XG4gICAgaWYgKHRoaXMuZmlsZXBhdGgpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbGVwYXRoO1xuICAgIH1cblxuICAgIGxldCBmaWxlbmFtZSA9ICdwcm9qZWN0cy5jc29uJztcbiAgICBjb25zdCBmaWxlZGlyID0gYXRvbS5nZXRDb25maWdEaXJQYXRoKCk7XG5cbiAgICBpZiAodGhpcy5lbnZpcm9ubWVudFNwZWNpZmljUHJvamVjdHMpIHtcbiAgICAgIGxldCBob3N0bmFtZSA9IG9zLmhvc3RuYW1lKCkuc3BsaXQoJy4nKS5zaGlmdCgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICBmaWxlbmFtZSA9IGBwcm9qZWN0cy4ke2hvc3RuYW1lfS5jc29uYDtcbiAgICB9XG5cbiAgICByZXR1cm4gYCR7ZmlsZWRpcn0vJHtmaWxlbmFtZX1gO1xuICB9XG5cbiAgcmVhZEZpbGUoY2FsbGJhY2s9bnVsbCkge1xuICAgIGNvbnN0IGV4aXN0cyA9IGZzLmV4aXN0c1N5bmModGhpcy5maWxlKCkpO1xuICAgIGxldCBwcm9qZWN0cyA9IG51bGw7XG5cbiAgICBpZiAoZXhpc3RzKSB7XG4gICAgICB0cnkge1xuICAgICAgICBwcm9qZWN0cyA9IENTT04ucmVhZEZpbGVTeW5jKHRoaXMuZmlsZSgpKSB8fCB7fTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGBGYWlsZWQgdG8gbG9hZCAke3BhdGguYmFzZW5hbWUodGhpcy5maWxlKCkpfWA7XG4gICAgICAgIGNvbnN0IGRldGFpbCA9IGVycm9yLmxvY2F0aW9uICE9IG51bGwgPyBlcnJvci5zdGFjayA6IGVycm9yLm1lc3NhZ2U7XG4gICAgICAgIHRoaXMubm90aWZ5RmFpbHVyZShtZXNzYWdlLCBkZXRhaWwpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHRoaXMuZmlsZSgpLCAne30nKTtcbiAgICAgIHByb2plY3RzID0ge307XG4gICAgfVxuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhwcm9qZWN0cyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2plY3RzO1xuICB9XG5cbiAgd3JpdGVGaWxlKHByb2plY3RzLCBjYWxsYmFjaykge1xuICAgIHRyeSB7XG4gICAgICBDU09OLndyaXRlRmlsZVN5bmModGhpcy5maWxlKCksIHByb2plY3RzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICB9XG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5RmFpbHVyZShtZXNzYWdlLCBkZXRhaWw9bnVsbCkge1xuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihtZXNzYWdlLCB7XG4gICAgICBkZXRhaWw6IGRldGFpbCxcbiAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/project-manager/lib/cson-db.js

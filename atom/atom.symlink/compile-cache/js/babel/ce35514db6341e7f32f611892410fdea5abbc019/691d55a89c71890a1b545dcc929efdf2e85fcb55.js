Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _project = require('./project');

var _project2 = _interopRequireDefault(_project);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

'use babel';

var Projects = (function () {
  function Projects() {
    var _this = this;

    _classCallCheck(this, Projects);

    this.emitter = new _atom.Emitter();
    this.projects = [];

    _db2['default'].addUpdater('iwantitall', {}, function (project) {
      _this.addProject(project);
    });
  }

  _createClass(Projects, [{
    key: 'onUpdate',
    value: function onUpdate(callback) {
      this.emitter.on('projects-updated', callback);
    }
  }, {
    key: 'getAll',
    value: function getAll(callback) {
      var _this2 = this;

      _db2['default'].find(function (projectSettings) {
        for (var setting of projectSettings) {
          _this2.addProject(setting);
        }

        callback(_this2.projects);
      });
    }
  }, {
    key: 'getCurrent',
    value: function getCurrent(callback) {
      this.getAll(function (projects) {
        projects.forEach(function (project) {
          if (project.isCurrent()) {
            callback(project);
          }
        });
      });
    }
  }, {
    key: 'addProject',
    value: function addProject(settings) {
      var found = null;

      for (var project of this.projects) {
        if (project.props._id === settings._id) {
          found = project;
        } else if (project.rootPath === settings.paths[0]) {
          found = project;
        }
      }

      if (found === null) {
        var newProject = new _project2['default'](settings);
        this.projects.push(newProject);

        if (!newProject.props._id) {
          newProject.save();
        }

        this.emitter.emit('projects-updated');
        found = newProject;
      }

      return found;
    }
  }]);

  return Projects;
})();

exports['default'] = new Projects();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3Byb2plY3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRXNCLE1BQU07O3VCQUNSLFdBQVc7Ozs7a0JBQ2hCLE1BQU07Ozs7QUFKckIsV0FBVyxDQUFDOztJQU1OLFFBQVE7QUFDRCxXQURQLFFBQVEsR0FDRTs7OzBCQURWLFFBQVE7O0FBRVYsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOztBQUVuQixvQkFBRyxVQUFVLENBQUMsWUFBWSxFQUFFLEVBQUUsRUFBRSxVQUFDLE9BQU8sRUFBSztBQUMzQyxZQUFLLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUMxQixDQUFDLENBQUM7R0FDSjs7ZUFSRyxRQUFROztXQVVKLGtCQUFDLFFBQVEsRUFBRTtBQUNqQixVQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUMvQzs7O1dBRUssZ0JBQUMsUUFBUSxFQUFFOzs7QUFDZixzQkFBRyxJQUFJLENBQUMsVUFBQSxlQUFlLEVBQUk7QUFDekIsYUFBSyxJQUFNLE9BQU8sSUFBSSxlQUFlLEVBQUU7QUFDckMsaUJBQUssVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzFCOztBQUVELGdCQUFRLENBQUMsT0FBSyxRQUFRLENBQUMsQ0FBQztPQUN6QixDQUFDLENBQUM7S0FDSjs7O1dBRVMsb0JBQUMsUUFBUSxFQUFFO0FBQ25CLFVBQUksQ0FBQyxNQUFNLENBQUMsVUFBQSxRQUFRLEVBQUk7QUFDdEIsZ0JBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDMUIsY0FBSSxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUU7QUFDdkIsb0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztXQUNuQjtTQUNGLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7V0FFUyxvQkFBQyxRQUFRLEVBQUU7QUFDbkIsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVqQixXQUFLLElBQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDbkMsWUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxRQUFRLENBQUMsR0FBRyxFQUFFO0FBQ3RDLGVBQUssR0FBRyxPQUFPLENBQUM7U0FDakIsTUFBTSxJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNqRCxlQUFLLEdBQUcsT0FBTyxDQUFDO1NBQ2pCO09BQ0Y7O0FBRUQsVUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQ2xCLFlBQU0sVUFBVSxHQUFHLHlCQUFZLFFBQVEsQ0FBQyxDQUFDO0FBQ3pDLFlBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUUvQixZQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDekIsb0JBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNuQjs7QUFFRCxZQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3RDLGFBQUssR0FBRyxVQUFVLENBQUM7T0FFcEI7O0FBRUQsYUFBTyxLQUFLLENBQUM7S0FDZDs7O1NBM0RHLFFBQVE7OztxQkE4REMsSUFBSSxRQUFRLEVBQUUiLCJmaWxlIjoiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdhdG9tJztcbmltcG9ydCBQcm9qZWN0IGZyb20gJy4vcHJvamVjdCc7XG5pbXBvcnQgZGIgZnJvbSAnLi9kYic7XG5cbmNsYXNzIFByb2plY3RzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICB0aGlzLnByb2plY3RzID0gW107XG5cbiAgICBkYi5hZGRVcGRhdGVyKCdpd2FudGl0YWxsJywge30sIChwcm9qZWN0KSA9PiB7XG4gICAgICB0aGlzLmFkZFByb2plY3QocHJvamVjdCk7XG4gICAgfSk7XG4gIH1cblxuICBvblVwZGF0ZShjYWxsYmFjaykge1xuICAgIHRoaXMuZW1pdHRlci5vbigncHJvamVjdHMtdXBkYXRlZCcsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGdldEFsbChjYWxsYmFjaykge1xuICAgIGRiLmZpbmQocHJvamVjdFNldHRpbmdzID0+IHtcbiAgICAgIGZvciAoY29uc3Qgc2V0dGluZyBvZiBwcm9qZWN0U2V0dGluZ3MpIHtcbiAgICAgICAgdGhpcy5hZGRQcm9qZWN0KHNldHRpbmcpO1xuICAgICAgfVxuXG4gICAgICBjYWxsYmFjayh0aGlzLnByb2plY3RzKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEN1cnJlbnQoY2FsbGJhY2spIHtcbiAgICB0aGlzLmdldEFsbChwcm9qZWN0cyA9PiB7XG4gICAgICBwcm9qZWN0cy5mb3JFYWNoKHByb2plY3QgPT4ge1xuICAgICAgICBpZiAocHJvamVjdC5pc0N1cnJlbnQoKSkge1xuICAgICAgICAgIGNhbGxiYWNrKHByb2plY3QpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGFkZFByb2plY3Qoc2V0dGluZ3MpIHtcbiAgICBsZXQgZm91bmQgPSBudWxsO1xuXG4gICAgZm9yIChjb25zdCBwcm9qZWN0IG9mIHRoaXMucHJvamVjdHMpIHtcbiAgICAgIGlmIChwcm9qZWN0LnByb3BzLl9pZCA9PT0gc2V0dGluZ3MuX2lkKSB7XG4gICAgICAgIGZvdW5kID0gcHJvamVjdDtcbiAgICAgIH0gZWxzZSBpZiAocHJvamVjdC5yb290UGF0aCA9PT0gc2V0dGluZ3MucGF0aHNbMF0pIHtcbiAgICAgICAgZm91bmQgPSBwcm9qZWN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmb3VuZCA9PT0gbnVsbCkge1xuICAgICAgY29uc3QgbmV3UHJvamVjdCA9IG5ldyBQcm9qZWN0KHNldHRpbmdzKTtcbiAgICAgIHRoaXMucHJvamVjdHMucHVzaChuZXdQcm9qZWN0KTtcblxuICAgICAgaWYgKCFuZXdQcm9qZWN0LnByb3BzLl9pZCkge1xuICAgICAgICBuZXdQcm9qZWN0LnNhdmUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Byb2plY3RzLXVwZGF0ZWQnKTtcbiAgICAgIGZvdW5kID0gbmV3UHJvamVjdDtcblxuICAgIH1cblxuICAgIHJldHVybiBmb3VuZDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgUHJvamVjdHMoKTtcbiJdfQ==
//# sourceURL=/Users/ajenkins/.atom/packages/project-manager/lib/projects.js

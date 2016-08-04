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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFc0IsTUFBTTs7dUJBQ1IsV0FBVzs7OztrQkFDaEIsTUFBTTs7OztBQUpyQixXQUFXLENBQUM7O0lBTU4sUUFBUTtBQUNELFdBRFAsUUFBUSxHQUNFOzs7MEJBRFYsUUFBUTs7QUFFVixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUM7QUFDN0IsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7O0FBRW5CLG9CQUFHLFVBQVUsQ0FBQyxZQUFZLEVBQUUsRUFBRSxFQUFFLFVBQUMsT0FBTyxFQUFLO0FBQzNDLFlBQUssVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzFCLENBQUMsQ0FBQztHQUNKOztlQVJHLFFBQVE7O1dBVUosa0JBQUMsUUFBUSxFQUFFO0FBQ2pCLFVBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQy9DOzs7V0FFSyxnQkFBQyxRQUFRLEVBQUU7OztBQUNmLHNCQUFHLElBQUksQ0FBQyxVQUFBLGVBQWUsRUFBSTtBQUN6QixhQUFLLElBQU0sT0FBTyxJQUFJLGVBQWUsRUFBRTtBQUNyQyxpQkFBSyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDMUI7O0FBRUQsZ0JBQVEsQ0FBQyxPQUFLLFFBQVEsQ0FBQyxDQUFDO09BQ3pCLENBQUMsQ0FBQztLQUNKOzs7V0FFUyxvQkFBQyxRQUFRLEVBQUU7QUFDbkIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUN0QixnQkFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUMxQixjQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUN2QixvQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1dBQ25CO1NBQ0YsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7OztXQUVTLG9CQUFDLFFBQVEsRUFBRTtBQUNuQixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWpCLFdBQUssSUFBTSxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNuQyxZQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLFFBQVEsQ0FBQyxHQUFHLEVBQUU7QUFDdEMsZUFBSyxHQUFHLE9BQU8sQ0FBQztTQUNqQixNQUFNLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ2pELGVBQUssR0FBRyxPQUFPLENBQUM7U0FDakI7T0FDRjs7QUFFRCxVQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7QUFDbEIsWUFBTSxVQUFVLEdBQUcseUJBQVksUUFBUSxDQUFDLENBQUM7QUFDekMsWUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRS9CLFlBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUN6QixvQkFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ25COztBQUVELFlBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDdEMsYUFBSyxHQUFHLFVBQVUsQ0FBQztPQUVwQjs7QUFFRCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7U0EzREcsUUFBUTs7O3FCQThEQyxJQUFJLFFBQVEsRUFBRSIsImZpbGUiOiIvVXNlcnMvYWplbmtpbnMvLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3Byb2plY3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7RW1pdHRlcn0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgUHJvamVjdCBmcm9tICcuL3Byb2plY3QnO1xuaW1wb3J0IGRiIGZyb20gJy4vZGInO1xuXG5jbGFzcyBQcm9qZWN0cyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgdGhpcy5wcm9qZWN0cyA9IFtdO1xuXG4gICAgZGIuYWRkVXBkYXRlcignaXdhbnRpdGFsbCcsIHt9LCAocHJvamVjdCkgPT4ge1xuICAgICAgdGhpcy5hZGRQcm9qZWN0KHByb2plY3QpO1xuICAgIH0pO1xuICB9XG5cbiAgb25VcGRhdGUoY2FsbGJhY2spIHtcbiAgICB0aGlzLmVtaXR0ZXIub24oJ3Byb2plY3RzLXVwZGF0ZWQnLCBjYWxsYmFjayk7XG4gIH1cblxuICBnZXRBbGwoY2FsbGJhY2spIHtcbiAgICBkYi5maW5kKHByb2plY3RTZXR0aW5ncyA9PiB7XG4gICAgICBmb3IgKGNvbnN0IHNldHRpbmcgb2YgcHJvamVjdFNldHRpbmdzKSB7XG4gICAgICAgIHRoaXMuYWRkUHJvamVjdChzZXR0aW5nKTtcbiAgICAgIH1cblxuICAgICAgY2FsbGJhY2sodGhpcy5wcm9qZWN0cyk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRDdXJyZW50KGNhbGxiYWNrKSB7XG4gICAgdGhpcy5nZXRBbGwocHJvamVjdHMgPT4ge1xuICAgICAgcHJvamVjdHMuZm9yRWFjaChwcm9qZWN0ID0+IHtcbiAgICAgICAgaWYgKHByb2plY3QuaXNDdXJyZW50KCkpIHtcbiAgICAgICAgICBjYWxsYmFjayhwcm9qZWN0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBhZGRQcm9qZWN0KHNldHRpbmdzKSB7XG4gICAgbGV0IGZvdW5kID0gbnVsbDtcblxuICAgIGZvciAoY29uc3QgcHJvamVjdCBvZiB0aGlzLnByb2plY3RzKSB7XG4gICAgICBpZiAocHJvamVjdC5wcm9wcy5faWQgPT09IHNldHRpbmdzLl9pZCkge1xuICAgICAgICBmb3VuZCA9IHByb2plY3Q7XG4gICAgICB9IGVsc2UgaWYgKHByb2plY3Qucm9vdFBhdGggPT09IHNldHRpbmdzLnBhdGhzWzBdKSB7XG4gICAgICAgIGZvdW5kID0gcHJvamVjdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZm91bmQgPT09IG51bGwpIHtcbiAgICAgIGNvbnN0IG5ld1Byb2plY3QgPSBuZXcgUHJvamVjdChzZXR0aW5ncyk7XG4gICAgICB0aGlzLnByb2plY3RzLnB1c2gobmV3UHJvamVjdCk7XG5cbiAgICAgIGlmICghbmV3UHJvamVjdC5wcm9wcy5faWQpIHtcbiAgICAgICAgbmV3UHJvamVjdC5zYXZlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdwcm9qZWN0cy11cGRhdGVkJyk7XG4gICAgICBmb3VuZCA9IG5ld1Byb2plY3Q7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gZm91bmQ7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFByb2plY3RzKCk7XG4iXX0=
//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/project-manager/lib/projects.js

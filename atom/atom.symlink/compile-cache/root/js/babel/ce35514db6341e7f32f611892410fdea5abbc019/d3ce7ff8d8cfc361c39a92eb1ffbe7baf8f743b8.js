'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ProjectManager = (function () {
  function ProjectManager() {
    _classCallCheck(this, ProjectManager);
  }

  _createClass(ProjectManager, null, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      var CompositeDisposable = require('atom').CompositeDisposable;
      this.disposables = new CompositeDisposable();
      this.projects = require('./projects');

      this.disposables.add(atom.commands.add('atom-workspace', {
        'project-manager:list-projects': function projectManagerListProjects() {
          if (!_this.projectsListView) {
            var ProjectsListView = require('./projects-list-view');
            _this.projectsListView = new ProjectsListView();
          }

          _this.projectsListView.toggle();
        },

        'project-manager:save-project': function projectManagerSaveProject() {
          if (!_this.saveDialog) {
            var SaveDialog = require('./save-dialog');
            _this.saveDialog = new SaveDialog();
          }

          _this.saveDialog.attach();
        },

        'project-manager:edit-projects': function projectManagerEditProjects() {
          if (!_this.db) {
            _this.db = require('./db');
          }

          atom.workspace.open(_this.db.file());
        }
      }));

      atom.project.onDidChangePaths(function () {
        return _this.updatePaths();
      });
      this.loadProject();
    }
  }, {
    key: 'loadProject',
    value: function loadProject() {
      var _this2 = this;

      this.projects.getCurrent(function (project) {
        if (project) {
          _this2.project = project;
          _this2.project.load();
        }
      });
    }
  }, {
    key: 'updatePaths',
    value: function updatePaths() {
      this.projects.getCurrent(function (project) {
        var newPaths = atom.project.getPaths();
        var currentRoot = newPaths.length ? newPaths[0] : null;

        if (project.rootPath === currentRoot) {
          project.set('paths', newPaths);
        }
      });
    }
  }, {
    key: 'provideProjects',
    value: function provideProjects() {
      return {
        projects: this.projects
      };
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.disposables.dispose();
    }
  }]);

  return ProjectManager;
})();

exports['default'] = ProjectManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdC1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztJQUVTLGNBQWM7V0FBZCxjQUFjOzBCQUFkLGNBQWM7OztlQUFkLGNBQWM7O1dBQ2xCLG9CQUFHOzs7QUFDaEIsVUFBTSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsbUJBQW1CLENBQUM7QUFDaEUsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7QUFDN0MsVUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRXRDLFVBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ3ZELHVDQUErQixFQUFFLHNDQUFNO0FBQ3JDLGNBQUksQ0FBQyxNQUFLLGdCQUFnQixFQUFFO0FBQzFCLGdCQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3pELGtCQUFLLGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztXQUNoRDs7QUFFRCxnQkFBSyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNoQzs7QUFFRCxzQ0FBOEIsRUFBRSxxQ0FBTTtBQUNwQyxjQUFJLENBQUMsTUFBSyxVQUFVLEVBQUU7QUFDcEIsZ0JBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUM1QyxrQkFBSyxVQUFVLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztXQUNwQzs7QUFFRCxnQkFBSyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDMUI7O0FBRUQsdUNBQStCLEVBQUUsc0NBQU07QUFDckMsY0FBSSxDQUFDLE1BQUssRUFBRSxFQUFFO0FBQ1osa0JBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztXQUMzQjs7QUFFRCxjQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQ3JDO09BQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUosVUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztlQUFNLE1BQUssV0FBVyxFQUFFO09BQUEsQ0FBQyxDQUFDO0FBQ3hELFVBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUNwQjs7O1dBRWlCLHVCQUFHOzs7QUFDbkIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDbEMsWUFBSSxPQUFPLEVBQUU7QUFDWCxpQkFBSyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLGlCQUFLLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNyQjtPQUNGLENBQUMsQ0FBQztLQUNKOzs7V0FFaUIsdUJBQUc7QUFDbkIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDbEMsWUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUN6QyxZQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7O0FBRXpELFlBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxXQUFXLEVBQUU7QUFDcEMsaUJBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ2hDO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7OztXQUVxQiwyQkFBRztBQUN2QixhQUFPO0FBQ0wsZ0JBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtPQUN4QixDQUFDO0tBQ0g7OztXQUVnQixzQkFBRztBQUNsQixVQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzVCOzs7U0FsRWtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvcHJvamVjdC1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2plY3RNYW5hZ2VyIHtcbiAgc3RhdGljIGFjdGl2YXRlKCkge1xuICAgIGNvbnN0IENvbXBvc2l0ZURpc3Bvc2FibGUgPSByZXF1aXJlKCdhdG9tJykuQ29tcG9zaXRlRGlzcG9zYWJsZTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnByb2plY3RzID0gcmVxdWlyZSgnLi9wcm9qZWN0cycpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ3Byb2plY3QtbWFuYWdlcjpsaXN0LXByb2plY3RzJzogKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMucHJvamVjdHNMaXN0Vmlldykge1xuICAgICAgICAgIGNvbnN0IFByb2plY3RzTGlzdFZpZXcgPSByZXF1aXJlKCcuL3Byb2plY3RzLWxpc3QtdmlldycpO1xuICAgICAgICAgIHRoaXMucHJvamVjdHNMaXN0VmlldyA9IG5ldyBQcm9qZWN0c0xpc3RWaWV3KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByb2plY3RzTGlzdFZpZXcudG9nZ2xlKCk7XG4gICAgICB9LFxuXG4gICAgICAncHJvamVjdC1tYW5hZ2VyOnNhdmUtcHJvamVjdCc6ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnNhdmVEaWFsb2cpIHtcbiAgICAgICAgICBjb25zdCBTYXZlRGlhbG9nID0gcmVxdWlyZSgnLi9zYXZlLWRpYWxvZycpO1xuICAgICAgICAgIHRoaXMuc2F2ZURpYWxvZyA9IG5ldyBTYXZlRGlhbG9nKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNhdmVEaWFsb2cuYXR0YWNoKCk7XG4gICAgICB9LFxuXG4gICAgICAncHJvamVjdC1tYW5hZ2VyOmVkaXQtcHJvamVjdHMnOiAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgIHRoaXMuZGIgPSByZXF1aXJlKCcuL2RiJyk7XG4gICAgICAgIH1cblxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHRoaXMuZGIuZmlsZSgpKTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICBhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocygoKSA9PiB0aGlzLnVwZGF0ZVBhdGhzKCkpO1xuICAgIHRoaXMubG9hZFByb2plY3QoKTtcbiAgfVxuXG4gIHN0YXRpYyBsb2FkUHJvamVjdCgpIHtcbiAgICB0aGlzLnByb2plY3RzLmdldEN1cnJlbnQocHJvamVjdCA9PiB7XG4gICAgICBpZiAocHJvamVjdCkge1xuICAgICAgICB0aGlzLnByb2plY3QgPSBwcm9qZWN0O1xuICAgICAgICB0aGlzLnByb2plY3QubG9hZCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIHVwZGF0ZVBhdGhzKCkge1xuICAgIHRoaXMucHJvamVjdHMuZ2V0Q3VycmVudChwcm9qZWN0ID0+IHtcbiAgICAgIGNvbnN0IG5ld1BhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk7XG4gICAgICBjb25zdCBjdXJyZW50Um9vdCA9IG5ld1BhdGhzLmxlbmd0aCA/IG5ld1BhdGhzWzBdIDogbnVsbDtcblxuICAgICAgaWYgKHByb2plY3Qucm9vdFBhdGggPT09IGN1cnJlbnRSb290KSB7XG4gICAgICAgIHByb2plY3Quc2V0KCdwYXRocycsIG5ld1BhdGhzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBwcm92aWRlUHJvamVjdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb2plY3RzOiB0aGlzLnByb2plY3RzXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpO1xuICB9XG59XG4iXX0=
//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/project-manager/lib/project-manager.js

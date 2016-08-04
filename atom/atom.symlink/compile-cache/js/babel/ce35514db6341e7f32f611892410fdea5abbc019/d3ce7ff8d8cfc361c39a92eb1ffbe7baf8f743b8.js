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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3Byb2plY3QtbWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7SUFFUyxjQUFjO1dBQWQsY0FBYzswQkFBZCxjQUFjOzs7ZUFBZCxjQUFjOztXQUNsQixvQkFBRzs7O0FBQ2hCLFVBQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLG1CQUFtQixDQUFDO0FBQ2hFLFVBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO0FBQzdDLFVBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUV0QyxVQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN2RCx1Q0FBK0IsRUFBRSxzQ0FBTTtBQUNyQyxjQUFJLENBQUMsTUFBSyxnQkFBZ0IsRUFBRTtBQUMxQixnQkFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUN6RCxrQkFBSyxnQkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7V0FDaEQ7O0FBRUQsZ0JBQUssZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDaEM7O0FBRUQsc0NBQThCLEVBQUUscUNBQU07QUFDcEMsY0FBSSxDQUFDLE1BQUssVUFBVSxFQUFFO0FBQ3BCLGdCQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDNUMsa0JBQUssVUFBVSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7V0FDcEM7O0FBRUQsZ0JBQUssVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQzFCOztBQUVELHVDQUErQixFQUFFLHNDQUFNO0FBQ3JDLGNBQUksQ0FBQyxNQUFLLEVBQUUsRUFBRTtBQUNaLGtCQUFLLEVBQUUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7V0FDM0I7O0FBRUQsY0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBSyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUNyQztPQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVKLFVBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7ZUFBTSxNQUFLLFdBQVcsRUFBRTtPQUFBLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDcEI7OztXQUVpQix1QkFBRzs7O0FBQ25CLFVBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ2xDLFlBQUksT0FBTyxFQUFFO0FBQ1gsaUJBQUssT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixpQkFBSyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDckI7T0FDRixDQUFDLENBQUM7S0FDSjs7O1dBRWlCLHVCQUFHO0FBQ25CLFVBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ2xDLFlBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDekMsWUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDOztBQUV6RCxZQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssV0FBVyxFQUFFO0FBQ3BDLGlCQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNoQztPQUNGLENBQUMsQ0FBQztLQUNKOzs7V0FFcUIsMkJBQUc7QUFDdkIsYUFBTztBQUNMLGdCQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7T0FDeEIsQ0FBQztLQUNIOzs7V0FFZ0Isc0JBQUc7QUFDbEIsVUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUM1Qjs7O1NBbEVrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvVXNlcnMvYWplbmtpbnMvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9wcm9qZWN0LW1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvamVjdE1hbmFnZXIge1xuICBzdGF0aWMgYWN0aXZhdGUoKSB7XG4gICAgY29uc3QgQ29tcG9zaXRlRGlzcG9zYWJsZSA9IHJlcXVpcmUoJ2F0b20nKS5Db21wb3NpdGVEaXNwb3NhYmxlO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMucHJvamVjdHMgPSByZXF1aXJlKCcuL3Byb2plY3RzJyk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAncHJvamVjdC1tYW5hZ2VyOmxpc3QtcHJvamVjdHMnOiAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5wcm9qZWN0c0xpc3RWaWV3KSB7XG4gICAgICAgICAgY29uc3QgUHJvamVjdHNMaXN0VmlldyA9IHJlcXVpcmUoJy4vcHJvamVjdHMtbGlzdC12aWV3Jyk7XG4gICAgICAgICAgdGhpcy5wcm9qZWN0c0xpc3RWaWV3ID0gbmV3IFByb2plY3RzTGlzdFZpZXcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJvamVjdHNMaXN0Vmlldy50b2dnbGUoKTtcbiAgICAgIH0sXG5cbiAgICAgICdwcm9qZWN0LW1hbmFnZXI6c2F2ZS1wcm9qZWN0JzogKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuc2F2ZURpYWxvZykge1xuICAgICAgICAgIGNvbnN0IFNhdmVEaWFsb2cgPSByZXF1aXJlKCcuL3NhdmUtZGlhbG9nJyk7XG4gICAgICAgICAgdGhpcy5zYXZlRGlhbG9nID0gbmV3IFNhdmVEaWFsb2coKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2F2ZURpYWxvZy5hdHRhY2goKTtcbiAgICAgIH0sXG5cbiAgICAgICdwcm9qZWN0LW1hbmFnZXI6ZWRpdC1wcm9qZWN0cyc6ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICAgICAgdGhpcy5kYiA9IHJlcXVpcmUoJy4vZGInKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4odGhpcy5kYi5maWxlKCkpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKCgpID0+IHRoaXMudXBkYXRlUGF0aHMoKSk7XG4gICAgdGhpcy5sb2FkUHJvamVjdCgpO1xuICB9XG5cbiAgc3RhdGljIGxvYWRQcm9qZWN0KCkge1xuICAgIHRoaXMucHJvamVjdHMuZ2V0Q3VycmVudChwcm9qZWN0ID0+IHtcbiAgICAgIGlmIChwcm9qZWN0KSB7XG4gICAgICAgIHRoaXMucHJvamVjdCA9IHByb2plY3Q7XG4gICAgICAgIHRoaXMucHJvamVjdC5sb2FkKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgdXBkYXRlUGF0aHMoKSB7XG4gICAgdGhpcy5wcm9qZWN0cy5nZXRDdXJyZW50KHByb2plY3QgPT4ge1xuICAgICAgY29uc3QgbmV3UGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRSb290ID0gbmV3UGF0aHMubGVuZ3RoID8gbmV3UGF0aHNbMF0gOiBudWxsO1xuXG4gICAgICBpZiAocHJvamVjdC5yb290UGF0aCA9PT0gY3VycmVudFJvb3QpIHtcbiAgICAgICAgcHJvamVjdC5zZXQoJ3BhdGhzJywgbmV3UGF0aHMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIHByb3ZpZGVQcm9qZWN0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvamVjdHM6IHRoaXMucHJvamVjdHNcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKCk7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/ajenkins/.atom/packages/project-manager/lib/project-manager.js

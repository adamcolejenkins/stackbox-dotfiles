Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _projects = require('./projects');

var _projects2 = _interopRequireDefault(_projects);

'use babel';

var ProjectsListView = (function (_SelectListView) {
  _inherits(ProjectsListView, _SelectListView);

  function ProjectsListView() {
    _classCallCheck(this, ProjectsListView);

    _get(Object.getPrototypeOf(ProjectsListView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ProjectsListView, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(ProjectsListView.prototype), 'initialize', this).call(this);
      this.addClass('project-manager');
    }
  }, {
    key: 'activate',
    value: function activate() {}
  }, {
    key: 'getFilterKey',
    value: function getFilterKey() {
      var input = this.filterEditorView.getText();
      var inputArr = input.split(':');
      var isFilterKey = _underscorePlus2['default'].contains(this.possibleFilterKeys, inputArr[0]);
      var filter = this.defaultFilterKey;

      if (inputArr.length > 1 && isFilterKey) {
        filter = inputArr[0];
      }

      return filter;
    }
  }, {
    key: 'getFilterQuery',
    value: function getFilterQuery() {
      var input = this.filterEditorView.getText();
      var inputArr = input.split(':');
      var filter = input;

      if (inputArr.length > 1) {
        filter = inputArr[1];
      }

      return filter;
    }
  }, {
    key: 'getEmptyMessage',
    value: function getEmptyMessage(itemCount, filteredItemCount) {
      if (itemCount === 0) {
        return 'No projects saved yet';
      } else {
        _get(Object.getPrototypeOf(ProjectsListView.prototype), 'getEmptyMessage', this).call(this, itemCount, filteredItemCount);
      }
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      var _this = this;

      if (this.panel && this.panel.isVisible()) {
        this.close();
      } else {
        _projects2['default'].getAll(function (projects) {
          return _this.show(projects);
        });
      }
    }
  }, {
    key: 'show',
    value: function show(projects) {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({ item: this });
      }

      var items = [];
      for (var project of projects) {
        var item = _underscorePlus2['default'].clone(project.props);
        item.project = project;
        items.push(item);
      }

      this.panel.show();
      items = this.sortItems(items);
      this.setItems(items);
      this.focusFilterEditor();
    }
  }, {
    key: 'confirmed',
    value: function confirmed(item) {
      if (item && item.project.stats) {
        item.project.open();
        this.close();
      }
    }
  }, {
    key: 'close',
    value: function close() {
      if (this.panel) {
        this.panel.destroy();
        this.panel = null;
      }

      atom.workspace.getActivePane().activate();
    }
  }, {
    key: 'cancelled',
    value: function cancelled() {
      this.close();
    }
  }, {
    key: 'viewForItem',
    value: function viewForItem(_ref) {
      var _id = _ref._id;
      var title = _ref.title;
      var group = _ref.group;
      var icon = _ref.icon;
      var devMode = _ref.devMode;
      var paths = _ref.paths;
      var project = _ref.project;

      var showPath = this.showPath;
      var projectMissing = project.stats ? false : true;

      return (0, _atomSpacePenViews.$$)(function () {
        var _this2 = this;

        this.li({ 'class': 'two-lines' }, { 'data-project-id': _id, 'data-path-missing': projectMissing }, function () {
          _this2.div({ 'class': 'primary-line' }, function () {
            if (devMode) {
              _this2.span({ 'class': 'project-manager-devmode' });
            }

            _this2.div({ 'class': 'icon ' + icon }, function () {
              _this2.span(title);
              if (group != null) {
                _this2.span({ 'class': 'project-manager-list-group' }, group);
              }
            });
          });
          _this2.div({ 'class': 'secondary-line' }, function () {
            if (projectMissing) {
              _this2.div({ 'class': 'icon icon-alert' }, 'Path is not available');
            } else if (showPath) {
              var path = undefined;
              for (path of paths) {
                _this2.div({ 'class': 'no-icon' }, path);
              }
            }
          });
        });
      });
    }
  }, {
    key: 'sortItems',
    value: function sortItems(items) {
      var key = this.sortBy;
      if (key === 'default') {
        return items;
      } else if (key === 'last modified') {
        items.sort(function (a, b) {
          a = a.project.lastModified.getTime();
          b = b.project.lastModified.getTime();

          return a > b ? -1 : 1;
        });
      } else {
        items.sort(function (a, b) {
          a = (a[key] || '￿').toUpperCase();
          b = (b[key] || '￿').toUpperCase();

          return a > b ? 1 : -1;
        });
      }

      return items;
    }
  }, {
    key: 'possibleFilterKeys',
    get: function get() {
      return ['title', 'group', 'template'];
    }
  }, {
    key: 'defaultFilterKey',
    get: function get() {
      return 'title';
    }
  }, {
    key: 'sortBy',
    get: function get() {
      return atom.config.get('project-manager.sortBy');
    }
  }, {
    key: 'showPath',
    get: function get() {
      return atom.config.get('project-manager.showPath');
    }
  }]);

  return ProjectsListView;
})(_atomSpacePenViews.SelectListView);

exports['default'] = ProjectsListView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3Byb2plY3RzLWxpc3Qtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztpQ0FFaUMsc0JBQXNCOzs4QkFDekMsaUJBQWlCOzs7O3dCQUNWLFlBQVk7Ozs7QUFKakMsV0FBVyxDQUFDOztJQU1TLGdCQUFnQjtZQUFoQixnQkFBZ0I7O1dBQWhCLGdCQUFnQjswQkFBaEIsZ0JBQWdCOzsrQkFBaEIsZ0JBQWdCOzs7ZUFBaEIsZ0JBQWdCOztXQUN6QixzQkFBRztBQUNYLGlDQUZpQixnQkFBZ0IsNENBRWQ7QUFDbkIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ2xDOzs7V0FFTyxvQkFBRyxFQUNWOzs7V0FrQlcsd0JBQUc7QUFDYixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDOUMsVUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxVQUFNLFdBQVcsR0FBRyw0QkFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JFLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQzs7QUFFbkMsVUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxXQUFXLEVBQUU7QUFDdEMsY0FBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUN0Qjs7QUFFRCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7V0FFYSwwQkFBRztBQUNmLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM5QyxVQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FB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QixDQUFDLENBQUM7S0FDcEQ7OztTQXZCa0IsZ0JBQWdCOzs7cUJBQWhCLGdCQUFnQiIsImZpbGUiOiIvVXNlcnMvYWplbmtpbnMvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9wcm9qZWN0cy1saXN0LXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHtTZWxlY3RMaXN0VmlldywgJCR9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJztcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5pbXBvcnQgcHJvamVjdHMgZnJvbSAnLi9wcm9qZWN0cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2plY3RzTGlzdFZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0VmlldyB7XG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuYWRkQ2xhc3MoJ3Byb2plY3QtbWFuYWdlcicpO1xuICB9XG5cbiAgYWN0aXZhdGUoKSB7XG4gIH1cblxuICBnZXQgcG9zc2libGVGaWx0ZXJLZXlzKCkge1xuICAgIHJldHVybiBbJ3RpdGxlJywgJ2dyb3VwJywgJ3RlbXBsYXRlJ107XG4gIH1cblxuICBnZXQgZGVmYXVsdEZpbHRlcktleSgpIHtcbiAgICByZXR1cm4gJ3RpdGxlJztcbiAgfVxuXG4gIGdldCBzb3J0QnkoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLnNvcnRCeScpO1xuICB9XG5cbiAgZ2V0IHNob3dQYXRoKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5zaG93UGF0aCcpO1xuICB9XG5cbiAgZ2V0RmlsdGVyS2V5KCkge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5maWx0ZXJFZGl0b3JWaWV3LmdldFRleHQoKTtcbiAgICBjb25zdCBpbnB1dEFyciA9IGlucHV0LnNwbGl0KCc6Jyk7XG4gICAgY29uc3QgaXNGaWx0ZXJLZXkgPSBfLmNvbnRhaW5zKHRoaXMucG9zc2libGVGaWx0ZXJLZXlzLCBpbnB1dEFyclswXSk7XG4gICAgbGV0IGZpbHRlciA9IHRoaXMuZGVmYXVsdEZpbHRlcktleTtcblxuICAgIGlmIChpbnB1dEFyci5sZW5ndGggPiAxICYmIGlzRmlsdGVyS2V5KSB7XG4gICAgICBmaWx0ZXIgPSBpbnB1dEFyclswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsdGVyO1xuICB9XG5cbiAgZ2V0RmlsdGVyUXVlcnkoKSB7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmZpbHRlckVkaXRvclZpZXcuZ2V0VGV4dCgpO1xuICAgIGNvbnN0IGlucHV0QXJyID0gaW5wdXQuc3BsaXQoJzonKTtcbiAgICBsZXQgZmlsdGVyID0gaW5wdXQ7XG5cbiAgICBpZiAoaW5wdXRBcnIubGVuZ3RoID4gMSkge1xuICAgICAgZmlsdGVyID0gaW5wdXRBcnJbMV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbHRlcjtcbiAgfVxuXG4gIGdldEVtcHR5TWVzc2FnZShpdGVtQ291bnQsIGZpbHRlcmVkSXRlbUNvdW50KSB7XG4gICAgaWYgKGl0ZW1Db3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuICdObyBwcm9qZWN0cyBzYXZlZCB5ZXQnO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdXBlci5nZXRFbXB0eU1lc3NhZ2UoaXRlbUNvdW50LCBmaWx0ZXJlZEl0ZW1Db3VudCk7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlKCkge1xuICAgIGlmICh0aGlzLnBhbmVsICYmIHRoaXMucGFuZWwuaXNWaXNpYmxlKCkpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvamVjdHMuZ2V0QWxsKChwcm9qZWN0cykgPT4gdGhpcy5zaG93KHByb2plY3RzKSk7XG4gICAgfVxuICB9XG5cbiAgc2hvdyhwcm9qZWN0cykge1xuICAgIGlmICh0aGlzLnBhbmVsID09IG51bGwpIHtcbiAgICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHtpdGVtOiB0aGlzfSk7XG4gICAgfVxuXG4gICAgbGV0IGl0ZW1zID0gW107XG4gICAgZm9yIChsZXQgcHJvamVjdCBvZiBwcm9qZWN0cykge1xuICAgICAgY29uc3QgaXRlbSA9IF8uY2xvbmUocHJvamVjdC5wcm9wcyk7XG4gICAgICBpdGVtLnByb2plY3QgPSBwcm9qZWN0O1xuICAgICAgaXRlbXMucHVzaChpdGVtKTtcbiAgICB9XG5cbiAgICB0aGlzLnBhbmVsLnNob3coKTtcbiAgICBpdGVtcyA9IHRoaXMuc29ydEl0ZW1zKGl0ZW1zKTtcbiAgICB0aGlzLnNldEl0ZW1zKGl0ZW1zKTtcbiAgICB0aGlzLmZvY3VzRmlsdGVyRWRpdG9yKCk7XG4gIH1cblxuICBjb25maXJtZWQoaXRlbSkge1xuICAgIGlmIChpdGVtICYmIGl0ZW0ucHJvamVjdC5zdGF0cykge1xuICAgICAgaXRlbS5wcm9qZWN0Lm9wZW4oKTtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC5kZXN0cm95KCk7XG4gICAgICB0aGlzLnBhbmVsID0gbnVsbDtcbiAgICB9XG5cbiAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuYWN0aXZhdGUoKTtcbiAgfVxuXG4gIGNhbmNlbGxlZCgpIHtcbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cblxuICB2aWV3Rm9ySXRlbSh7X2lkLCB0aXRsZSwgZ3JvdXAsIGljb24sIGRldk1vZGUsIHBhdGhzLCBwcm9qZWN0fSkge1xuICAgIGNvbnN0IHNob3dQYXRoID0gdGhpcy5zaG93UGF0aDtcbiAgICBjb25zdCBwcm9qZWN0TWlzc2luZyA9IHByb2plY3Quc3RhdHMgPyBmYWxzZSA6IHRydWU7XG5cbiAgICByZXR1cm4gJCQoZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5saSh7Y2xhc3M6ICd0d28tbGluZXMnfSxcbiAgICAgIHsnZGF0YS1wcm9qZWN0LWlkJzogX2lkLCAnZGF0YS1wYXRoLW1pc3NpbmcnOiBwcm9qZWN0TWlzc2luZ30sICgpID0+IHtcbiAgICAgICAgdGhpcy5kaXYoe2NsYXNzOiAncHJpbWFyeS1saW5lJ30sICgpID0+IHtcbiAgICAgICAgICBpZiAoZGV2TW9kZSkge1xuICAgICAgICAgICAgdGhpcy5zcGFuKHtjbGFzczogJ3Byb2plY3QtbWFuYWdlci1kZXZtb2RlJ30pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuZGl2KHtjbGFzczogYGljb24gJHtpY29ufWB9LCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNwYW4odGl0bGUpO1xuICAgICAgICAgICAgaWYgKGdyb3VwICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgdGhpcy5zcGFuKHtjbGFzczogJ3Byb2plY3QtbWFuYWdlci1saXN0LWdyb3VwJ30sIGdyb3VwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGl2KHtjbGFzczogJ3NlY29uZGFyeS1saW5lJ30sICgpID0+IHtcbiAgICAgICAgICBpZiAocHJvamVjdE1pc3NpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZGl2KHtjbGFzczogJ2ljb24gaWNvbi1hbGVydCd9LCAnUGF0aCBpcyBub3QgYXZhaWxhYmxlJyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzaG93UGF0aCkge1xuICAgICAgICAgICAgbGV0IHBhdGg7XG4gICAgICAgICAgICBmb3IgKHBhdGggb2YgcGF0aHMpIHtcbiAgICAgICAgICAgICAgdGhpcy5kaXYoe2NsYXNzOiAnbm8taWNvbid9LCBwYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzb3J0SXRlbXMoaXRlbXMpIHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnNvcnRCeTtcbiAgICBpZiAoa2V5ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiBpdGVtcztcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2xhc3QgbW9kaWZpZWQnKSB7XG4gICAgICBpdGVtcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGEgPSBhLnByb2plY3QubGFzdE1vZGlmaWVkLmdldFRpbWUoKTtcbiAgICAgICAgYiA9IGIucHJvamVjdC5sYXN0TW9kaWZpZWQuZ2V0VGltZSgpO1xuXG4gICAgICAgIHJldHVybiBhID4gYiA/IC0xIDogMTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpdGVtcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGEgPSAoYVtrZXldIHx8ICdcXHVmZmZmJykudG9VcHBlckNhc2UoKTtcbiAgICAgICAgYiA9IChiW2tleV0gfHwgJ1xcdWZmZmYnKS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgIHJldHVybiBhID4gYiA/IDEgOiAtMTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBpdGVtcztcbiAgfVxufVxuIl19
//# sourceURL=/Users/ajenkins/.atom/packages/project-manager/lib/projects-list-view.js

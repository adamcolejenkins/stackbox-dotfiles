Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var stylesheetPath = _path2['default'].resolve(__dirname, '../../styles/minimap.less');
var stylesheet = atom.themes.loadStylesheet(stylesheetPath);

exports['default'] = { stylesheet: stylesheet };

beforeEach(function () {
  if (!atom.workspace.buildTextEditor) {
    (function () {
      var _require = require('atom');

      var TextEditor = _require.TextEditor;

      atom.workspace.buildTextEditor = function (opts) {
        return new TextEditor(opts);
      };
    })();
  }

  var jasmineContent = document.body.querySelector('#jasmine-content');
  var styleNode = document.createElement('style');
  styleNode.textContent = '\n    ' + stylesheet + '\n    atom-text-editor {\n      position: relative;\n    }\n\n    atom-text-editor-minimap[stand-alone] {\n      width: 100px;\n      height: 100px;\n    }\n\n    atom-text-editor, atom-text-editor::shadow {\n      line-height: 17px;\n    }\n\n    atom-text-editor atom-text-editor-minimap, atom-text-editor::shadow atom-text-editor-minimap {\n      background: rgba(255,0,0,0.3);\n    }\n\n    atom-text-editor atom-text-editor-minimap::shadow .minimap-scroll-indicator, atom-text-editor::shadow atom-text-editor-minimap::shadow .minimap-scroll-indicator {\n      background: rgba(0,0,255,0.3);\n    }\n\n    atom-text-editor atom-text-editor-minimap::shadow .minimap-visible-area, atom-text-editor::shadow atom-text-editor-minimap::shadow .minimap-visible-area {\n      background: rgba(0,255,0,0.3);\n      opacity: 1;\n    }\n\n    atom-text-editor::shadow atom-text-editor-minimap::shadow .open-minimap-quick-settings {\n      opacity: 1 !important;\n    }\n  ';

  jasmineContent.appendChild(styleNode);
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL3NwZWMvaGVscGVycy93b3Jrc3BhY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUVpQixNQUFNOzs7O0FBRnZCLFdBQVcsQ0FBQTs7QUFJWCxJQUFJLGNBQWMsR0FBRyxrQkFBSyxPQUFPLENBQUMsU0FBUyxFQUFFLDJCQUEyQixDQUFDLENBQUE7QUFDekUsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUE7O3FCQUU1QyxFQUFDLFVBQVUsRUFBVixVQUFVLEVBQUM7O0FBRTNCLFVBQVUsQ0FBQyxZQUFNO0FBQ2YsTUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFOztxQkFDaEIsT0FBTyxDQUFDLE1BQU0sQ0FBQzs7VUFBN0IsVUFBVSxZQUFWLFVBQVU7O0FBQ2YsVUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEdBQUcsVUFBVSxJQUFJLEVBQUU7QUFDL0MsZUFBTyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtPQUM1QixDQUFBOztHQUNGOztBQUVELE1BQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUE7QUFDcEUsTUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUMvQyxXQUFTLENBQUMsV0FBVyxjQUNqQixVQUFVLDA4QkE4QmIsQ0FBQTs7QUFFRCxnQkFBYyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtDQUN0QyxDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvc3BlYy9oZWxwZXJzL3dvcmtzcGFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmxldCBzdHlsZXNoZWV0UGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi9zdHlsZXMvbWluaW1hcC5sZXNzJylcbmxldCBzdHlsZXNoZWV0ID0gYXRvbS50aGVtZXMubG9hZFN0eWxlc2hlZXQoc3R5bGVzaGVldFBhdGgpXG5cbmV4cG9ydCBkZWZhdWx0IHtzdHlsZXNoZWV0fVxuXG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgaWYgKCFhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3IpIHtcbiAgICBsZXQge1RleHRFZGl0b3J9ID0gcmVxdWlyZSgnYXRvbScpXG4gICAgYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICAgIHJldHVybiBuZXcgVGV4dEVkaXRvcihvcHRzKVxuICAgIH1cbiAgfVxuXG4gIGxldCBqYXNtaW5lQ29udGVudCA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignI2phc21pbmUtY29udGVudCcpXG4gIGxldCBzdHlsZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG4gIHN0eWxlTm9kZS50ZXh0Q29udGVudCA9IGBcbiAgICAke3N0eWxlc2hlZXR9XG4gICAgYXRvbS10ZXh0LWVkaXRvciB7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgfVxuXG4gICAgYXRvbS10ZXh0LWVkaXRvci1taW5pbWFwW3N0YW5kLWFsb25lXSB7XG4gICAgICB3aWR0aDogMTAwcHg7XG4gICAgICBoZWlnaHQ6IDEwMHB4O1xuICAgIH1cblxuICAgIGF0b20tdGV4dC1lZGl0b3IsIGF0b20tdGV4dC1lZGl0b3I6OnNoYWRvdyB7XG4gICAgICBsaW5lLWhlaWdodDogMTdweDtcbiAgICB9XG5cbiAgICBhdG9tLXRleHQtZWRpdG9yIGF0b20tdGV4dC1lZGl0b3ItbWluaW1hcCwgYXRvbS10ZXh0LWVkaXRvcjo6c2hhZG93IGF0b20tdGV4dC1lZGl0b3ItbWluaW1hcCB7XG4gICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwwLDAsMC4zKTtcbiAgICB9XG5cbiAgICBhdG9tLXRleHQtZWRpdG9yIGF0b20tdGV4dC1lZGl0b3ItbWluaW1hcDo6c2hhZG93IC5taW5pbWFwLXNjcm9sbC1pbmRpY2F0b3IsIGF0b20tdGV4dC1lZGl0b3I6OnNoYWRvdyBhdG9tLXRleHQtZWRpdG9yLW1pbmltYXA6OnNoYWRvdyAubWluaW1hcC1zY3JvbGwtaW5kaWNhdG9yIHtcbiAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwwLDI1NSwwLjMpO1xuICAgIH1cblxuICAgIGF0b20tdGV4dC1lZGl0b3IgYXRvbS10ZXh0LWVkaXRvci1taW5pbWFwOjpzaGFkb3cgLm1pbmltYXAtdmlzaWJsZS1hcmVhLCBhdG9tLXRleHQtZWRpdG9yOjpzaGFkb3cgYXRvbS10ZXh0LWVkaXRvci1taW5pbWFwOjpzaGFkb3cgLm1pbmltYXAtdmlzaWJsZS1hcmVhIHtcbiAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwyNTUsMCwwLjMpO1xuICAgICAgb3BhY2l0eTogMTtcbiAgICB9XG5cbiAgICBhdG9tLXRleHQtZWRpdG9yOjpzaGFkb3cgYXRvbS10ZXh0LWVkaXRvci1taW5pbWFwOjpzaGFkb3cgLm9wZW4tbWluaW1hcC1xdWljay1zZXR0aW5ncyB7XG4gICAgICBvcGFjaXR5OiAxICFpbXBvcnRhbnQ7XG4gICAgfVxuICBgXG5cbiAgamFzbWluZUNvbnRlbnQuYXBwZW5kQ2hpbGQoc3R5bGVOb2RlKVxufSlcbiJdfQ==
//# sourceURL=/Users/ajenkins/.atom/packages/minimap/spec/helpers/workspace.js

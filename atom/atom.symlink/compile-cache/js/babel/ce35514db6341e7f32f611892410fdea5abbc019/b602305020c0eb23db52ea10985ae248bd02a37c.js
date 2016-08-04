var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _dialog = require('./dialog');

var _dialog2 = _interopRequireDefault(_dialog);

var _project = require('./project');

var _project2 = _interopRequireDefault(_project);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var SaveDialog = (function (_Dialog) {
  _inherits(SaveDialog, _Dialog);

  function SaveDialog() {
    _classCallCheck(this, SaveDialog);

    _get(Object.getPrototypeOf(SaveDialog.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SaveDialog, [{
    key: 'isAttached',
    value: function isAttached() {
      var firstPath = atom.project.getPaths()[0];
      var title = _path2['default'].basename(firstPath);
      this.setLabel('Enter name of project', 'icon-arrow-right');
      this.setInput(title, true);
    }
  }, {
    key: 'confirm',
    value: function confirm() {
      var input = this.editor.getText();

      if (input) {
        var properties = {
          title: input,
          paths: atom.project.getPaths()
        };

        var project = new _project2['default'](properties);
        project.save();

        this.close();
      }
    }
  }]);

  return SaveDialog;
})(_dialog2['default']);

module.exports = SaveDialog = document.registerElement('project-manager-dialog', SaveDialog);

// atom.commands.add('project-manager-dialog', {
//   'core:confirm': () => this.confirm(),
//   'core:cancel': () => this.cancel()
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL19zYXZlLWRpYWxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUVtQixVQUFVOzs7O3VCQUNULFdBQVc7Ozs7b0JBQ2QsTUFBTTs7OztBQUp2QixXQUFXLENBQUM7O0lBTU4sVUFBVTtZQUFWLFVBQVU7O1dBQVYsVUFBVTswQkFBVixVQUFVOzsrQkFBVixVQUFVOzs7ZUFBVixVQUFVOztXQUVKLHNCQUFHO0FBQ1gsVUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQyxVQUFJLEtBQUssR0FBRyxrQkFBSyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckMsVUFBSSxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBQzNELFVBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzVCOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRWxDLFVBQUksS0FBSyxFQUFFO0FBQ1QsWUFBSSxVQUFVLEdBQUc7QUFDZixlQUFLLEVBQUUsS0FBSztBQUNaLGVBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtTQUMvQixDQUFDOztBQUVGLFlBQUksT0FBTyxHQUFHLHlCQUFZLFVBQVUsQ0FBQyxDQUFDO0FBQ3RDLGVBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFZixZQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDZDtLQUNGOzs7U0F2QkcsVUFBVTs7O0FBMEJoQixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLHdCQUF3QixFQUFFLFVBQVUsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL19zYXZlLWRpYWxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgRGlhbG9nIGZyb20gJy4vZGlhbG9nJztcbmltcG9ydCBQcm9qZWN0IGZyb20gJy4vcHJvamVjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY2xhc3MgU2F2ZURpYWxvZyBleHRlbmRzIERpYWxvZyB7XG5cbiAgaXNBdHRhY2hlZCgpIHtcbiAgICBsZXQgZmlyc3RQYXRoID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF07XG4gICAgbGV0IHRpdGxlID0gcGF0aC5iYXNlbmFtZShmaXJzdFBhdGgpO1xuICAgIHRoaXMuc2V0TGFiZWwoJ0VudGVyIG5hbWUgb2YgcHJvamVjdCcsICdpY29uLWFycm93LXJpZ2h0Jyk7XG4gICAgdGhpcy5zZXRJbnB1dCh0aXRsZSwgdHJ1ZSk7XG4gIH1cblxuICBjb25maXJtKCkge1xuICAgIGxldCBpbnB1dCA9IHRoaXMuZWRpdG9yLmdldFRleHQoKTtcblxuICAgIGlmIChpbnB1dCkge1xuICAgICAgbGV0IHByb3BlcnRpZXMgPSB7XG4gICAgICAgIHRpdGxlOiBpbnB1dCxcbiAgICAgICAgcGF0aHM6IGF0b20ucHJvamVjdC5nZXRQYXRocygpXG4gICAgICB9O1xuXG4gICAgICBsZXQgcHJvamVjdCA9IG5ldyBQcm9qZWN0KHByb3BlcnRpZXMpO1xuICAgICAgcHJvamVjdC5zYXZlKCk7XG5cbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTYXZlRGlhbG9nID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdwcm9qZWN0LW1hbmFnZXItZGlhbG9nJywgU2F2ZURpYWxvZyk7XG5cbi8vIGF0b20uY29tbWFuZHMuYWRkKCdwcm9qZWN0LW1hbmFnZXItZGlhbG9nJywge1xuLy8gICAnY29yZTpjb25maXJtJzogKCkgPT4gdGhpcy5jb25maXJtKCksXG4vLyAgICdjb3JlOmNhbmNlbCc6ICgpID0+IHRoaXMuY2FuY2VsKClcbi8vIH0pO1xuIl19
//# sourceURL=/Users/ajenkins/.atom/packages/project-manager/lib/_save-dialog.js

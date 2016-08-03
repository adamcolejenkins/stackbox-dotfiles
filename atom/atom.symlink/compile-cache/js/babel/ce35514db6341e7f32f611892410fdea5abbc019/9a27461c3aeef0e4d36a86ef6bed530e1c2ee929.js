Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

'use babel';

var Dialog = (function (_HTMLElement) {
  _inherits(Dialog, _HTMLElement);

  function Dialog() {
    _classCallCheck(this, Dialog);

    _get(Object.getPrototypeOf(Dialog.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Dialog, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.disposables = new _atom.CompositeDisposable();

      this.classList.add('project-manager-dialog', 'overlay', 'from-top');

      this.label = document.createElement('label');
      this.label.classList.add('project-manager-dialog-label', 'icon');

      this.editor = new _atom.TextEditor({ mini: true });
      this.editorElement = atom.views.getView(this.editor);

      this.errorMessage = document.createElement('div');
      this.errorMessage.classList.add('error');

      this.appendChild(this.label);
      this.appendChild(this.editorElement);
      this.appendChild(this.errorMessage);

      this.disposables.add(atom.commands.add('project-manager-dialog', {
        'core:confirm': function coreConfirm() {
          return _this.confirm();
        },
        'core:cancel': function coreCancel() {
          return _this.cancel();
        }
      }));

      this.editorElement.addEventListener('blur', function () {
        return _this.cancel();
      });

      this.isAttached();
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      this.editorElement.focus();
    }
  }, {
    key: 'attach',
    value: function attach() {
      atom.views.getView(atom.workspace).appendChild(this);
    }
  }, {
    key: 'detach',
    value: function detach() {
      if (this.parentNode == 'undefined' || this.parentNode == null) {
        return false;
      }

      this.disposables.dispose();
      atom.workspace.getActivePane().activate();
      this.parentNode.removeChild(this);
    }

    // attributeChangedCallback(attr, oldVal, newVal) {
    //
    // }

  }, {
    key: 'setLabel',
    value: function setLabel(text, iconClass) {
      if (text === undefined) text = '';

      this.label.textContent = text;
      if (iconClass) {
        this.label.classList.add(iconClass);
      }
    }
  }, {
    key: 'setInput',
    value: function setInput() {
      var input = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var select = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      this.editor.setText(input);

      if (select) {
        var range = [[0, 0], [0, input.length]];
        this.editor.setSelectedBufferRange(range);
      }
    }
  }, {
    key: 'showError',
    value: function showError() {
      var message = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

      this.errorMessage.textContent(message);
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.detach();
    }
  }, {
    key: 'close',
    value: function close() {
      this.detach();
    }
  }]);

  return Dialog;
})(HTMLElement);

exports['default'] = Dialog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL19kaWFsb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUU4QyxNQUFNOztBQUZwRCxXQUFXLENBQUM7O0lBSVMsTUFBTTtZQUFOLE1BQU07O1dBQU4sTUFBTTswQkFBTixNQUFNOzsrQkFBTixNQUFNOzs7ZUFBTixNQUFNOztXQUVWLDJCQUFHOzs7QUFDaEIsVUFBSSxDQUFDLFdBQVcsR0FBRywrQkFBeUIsQ0FBQzs7QUFFN0MsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDOztBQUVwRSxVQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0MsVUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVqRSxVQUFJLENBQUMsTUFBTSxHQUFHLHFCQUFlLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7QUFDM0MsVUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXJELFVBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsRCxVQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRXpDLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdCLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3JDLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUVwQyxVQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRTtBQUMvRCxzQkFBYyxFQUFFO2lCQUFNLE1BQUssT0FBTyxFQUFFO1NBQUE7QUFDcEMscUJBQWEsRUFBRTtpQkFBTSxNQUFLLE1BQU0sRUFBRTtTQUFBO09BQ25DLENBQUMsQ0FBQyxDQUFDOztBQUVKLFVBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFO2VBQU0sTUFBSyxNQUFNLEVBQUU7T0FBQSxDQUFDLENBQUM7O0FBRWpFLFVBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztLQUNuQjs7O1dBRWUsNEJBQUc7QUFDakIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUM1Qjs7O1dBRUssa0JBQUc7QUFDUCxVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3REOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxXQUFXLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLEVBQUU7QUFDN0QsZUFBTyxLQUFLLENBQUM7T0FDZDs7QUFFRCxVQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzNCLFVBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDMUMsVUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbkM7Ozs7Ozs7O1dBTU8sa0JBQUMsSUFBSSxFQUFLLFNBQVMsRUFBRTtVQUFwQixJQUFJLGdCQUFKLElBQUksR0FBQyxFQUFFOztBQUNkLFVBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUM5QixVQUFJLFNBQVMsRUFBRTtBQUNiLFlBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztPQUNyQztLQUNGOzs7V0FFTyxvQkFBeUI7VUFBeEIsS0FBSyx5REFBQyxFQUFFO1VBQUUsTUFBTSx5REFBQyxLQUFLOztBQUM3QixVQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFM0IsVUFBSSxNQUFNLEVBQUU7QUFDVixZQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLFlBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDM0M7S0FDRjs7O1dBRVEscUJBQWE7VUFBWixPQUFPLHlEQUFDLEVBQUU7O0FBQ2xCLFVBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3hDOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7V0FFSSxpQkFBRztBQUNOLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7U0E5RWtCLE1BQU07R0FBUyxXQUFXOztxQkFBMUIsTUFBTSIsImZpbGUiOiIvVXNlcnMvYWplbmtpbnMvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9fZGlhbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7VGV4dEVkaXRvciwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpYWxvZyBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ3Byb2plY3QtbWFuYWdlci1kaWFsb2cnLCAnb3ZlcmxheScsICdmcm9tLXRvcCcpO1xuXG4gICAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgdGhpcy5sYWJlbC5jbGFzc0xpc3QuYWRkKCdwcm9qZWN0LW1hbmFnZXItZGlhbG9nLWxhYmVsJywgJ2ljb24nKTtcblxuICAgIHRoaXMuZWRpdG9yID0gbmV3IFRleHRFZGl0b3Ioe21pbmk6IHRydWV9KTtcbiAgICB0aGlzLmVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcodGhpcy5lZGl0b3IpO1xuXG4gICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmVycm9yTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuXG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcbiAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuZWRpdG9yRWxlbWVudCk7XG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmVycm9yTWVzc2FnZSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgncHJvamVjdC1tYW5hZ2VyLWRpYWxvZycsIHtcbiAgICAgICdjb3JlOmNvbmZpcm0nOiAoKSA9PiB0aGlzLmNvbmZpcm0oKSxcbiAgICAgICdjb3JlOmNhbmNlbCc6ICgpID0+IHRoaXMuY2FuY2VsKClcbiAgICB9KSk7XG5cbiAgICB0aGlzLmVkaXRvckVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsICgpID0+IHRoaXMuY2FuY2VsKCkpO1xuXG4gICAgdGhpcy5pc0F0dGFjaGVkKCk7XG4gIH1cblxuICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuZWRpdG9yRWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgYXR0YWNoKCkge1xuICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkuYXBwZW5kQ2hpbGQodGhpcyk7XG4gIH1cblxuICBkZXRhY2goKSB7XG4gICAgaWYgKHRoaXMucGFyZW50Tm9kZSA9PSAndW5kZWZpbmVkJyB8fCB0aGlzLnBhcmVudE5vZGUgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpO1xuICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZSgpO1xuICAgIHRoaXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgfVxuXG4gIC8vIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyLCBvbGRWYWwsIG5ld1ZhbCkge1xuICAvL1xuICAvLyB9XG5cbiAgc2V0TGFiZWwodGV4dD0nJywgaWNvbkNsYXNzKSB7XG4gICAgdGhpcy5sYWJlbC50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgaWYgKGljb25DbGFzcykge1xuICAgICAgdGhpcy5sYWJlbC5jbGFzc0xpc3QuYWRkKGljb25DbGFzcyk7XG4gICAgfVxuICB9XG5cbiAgc2V0SW5wdXQoaW5wdXQ9JycsIHNlbGVjdD1mYWxzZSkge1xuICAgIHRoaXMuZWRpdG9yLnNldFRleHQoaW5wdXQpO1xuXG4gICAgaWYgKHNlbGVjdCkge1xuICAgICAgbGV0IHJhbmdlID0gW1swLCAwXSwgWzAsIGlucHV0Lmxlbmd0aF1dO1xuICAgICAgdGhpcy5lZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShyYW5nZSk7XG4gICAgfVxuICB9XG5cbiAgc2hvd0Vycm9yKG1lc3NhZ2U9JycpIHtcbiAgICB0aGlzLmVycm9yTWVzc2FnZS50ZXh0Q29udGVudChtZXNzYWdlKTtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICB0aGlzLmRldGFjaCgpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5kZXRhY2goKTtcbiAgfVxuXG59XG4iXX0=
//# sourceURL=/Users/ajenkins/.atom/packages/project-manager/lib/_dialog.js

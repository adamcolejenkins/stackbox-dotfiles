Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _linterHandlebarsProvider = require('./linter-handlebars-provider');

var _linterHandlebarsProvider2 = _interopRequireDefault(_linterHandlebarsProvider);

var _atomPackageDeps = require('atom-package-deps');

"use babel";

exports['default'] = {

  activate: function activate() {
    if (!atom.inSpecMode()) {
      (0, _atomPackageDeps.install)('linter-handlebars');
    }
  },

  provideLinter: function provideLinter() {
    return _linterHandlebarsProvider2['default'];
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2xpbnRlci1oYW5kbGViYXJzL2xpYi9pbml0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozt3Q0FFcUMsOEJBQThCOzs7OytCQUMzQyxtQkFBbUI7O0FBSDNDLFdBQVcsQ0FBQTs7cUJBS0k7O0FBRWIsVUFBUSxFQUFBLG9CQUFHO0FBQ1QsUUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtBQUN0QixvQ0FBUSxtQkFBbUIsQ0FBQyxDQUFBO0tBQzdCO0dBQ0Y7O0FBRUQsZUFBYSxFQUFFOztHQUE4QjtDQUM5QyIsImZpbGUiOiIvVXNlcnMvYWplbmtpbnMvLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9saW50ZXItaGFuZGxlYmFycy9saWIvaW5pdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCJcblxuaW1wb3J0IExpbnRlckhhbmRsZWJhcnNQcm92aWRlciBmcm9tICcuL2xpbnRlci1oYW5kbGViYXJzLXByb3ZpZGVyJ1xuaW1wb3J0IHsgaW5zdGFsbCB9IGZyb20gJ2F0b20tcGFja2FnZS1kZXBzJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgYWN0aXZhdGUoKSB7XG4gICAgaWYgKCFhdG9tLmluU3BlY01vZGUoKSkge1xuICAgICAgaW5zdGFsbCgnbGludGVyLWhhbmRsZWJhcnMnKVxuICAgIH1cbiAgfSxcblxuICBwcm92aWRlTGludGVyOiAoKSA9PiBMaW50ZXJIYW5kbGViYXJzUHJvdmlkZXJcbn1cbiJdfQ==
//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/linter-handlebars/lib/init.js

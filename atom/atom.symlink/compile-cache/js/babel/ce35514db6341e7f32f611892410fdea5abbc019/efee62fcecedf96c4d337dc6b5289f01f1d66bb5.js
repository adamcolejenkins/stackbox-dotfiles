Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _commandsGenerate = require('./commands/generate');

var _commandsGenerate2 = _interopRequireDefault(_commandsGenerate);

var lazyReq = require('lazy-req')(require); // eslint-disable-line
var editorconfig = lazyReq('editorconfig');

function init(editor) {
	(0, _commandsGenerate2['default'])();

	if (!editor) {
		return;
	}

	var file = editor.getURI();

	var lineEndings = {
		crlf: '\r\n',
		lf: '\n'
	};

	if (!file) {
		return;
	}

	editorconfig().parse(file).then(function (config) {
		if (Object.keys(config).length === 0) {
			return;
		}

		var indentStyle = config.indent_style || (editor.getSoftTabs() ? 'space' : 'tab');

		if (indentStyle === 'tab') {
			editor.setSoftTabs(false);

			if (config.tab_width) {
				editor.setTabLength(config.tab_width);
			}
		} else if (indentStyle === 'space') {
			editor.setSoftTabs(true);

			if (config.indent_size) {
				editor.setTabLength(config.indent_size);
			}
		}

		if (config.end_of_line && config.end_of_line in lineEndings) {
			var preferredLineEnding = lineEndings[config.end_of_line];
			editor.getBuffer().setPreferredLineEnding(preferredLineEnding);
		}

		if (config.charset) {
			// by default Atom uses charset name without any dashes in them
			// (i.e. 'utf16le' instead of 'utf-16le').
			editor.setEncoding(config.charset.replace(/-/g, '').toLowerCase());
		}
	});
}

var activate = function activate() {
	atom.workspace.observeTextEditors(init);
};
exports.activate = activate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9lZGl0b3Jjb25maWcvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Z0NBQzJCLHFCQUFxQjs7OztBQUVoRCxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0MsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUU3QyxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDckIscUNBQWdCLENBQUM7O0FBRWpCLEtBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWixTQUFPO0VBQ1A7O0FBRUQsS0FBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUU3QixLQUFNLFdBQVcsR0FBRztBQUNuQixNQUFJLEVBQUUsTUFBTTtBQUNaLElBQUUsRUFBRSxJQUFJO0VBQ1IsQ0FBQzs7QUFFRixLQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1YsU0FBTztFQUNQOztBQUVELGFBQVksRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDekMsTUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDckMsVUFBTztHQUNQOztBQUVELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEtBQUssTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFHLE9BQU8sR0FBRyxLQUFLLENBQUEsQUFBQyxDQUFDOztBQUVwRixNQUFJLFdBQVcsS0FBSyxLQUFLLEVBQUU7QUFDMUIsU0FBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFMUIsT0FBSSxNQUFNLENBQUMsU0FBUyxFQUFFO0FBQ3JCLFVBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3RDO0dBQ0QsTUFBTSxJQUFJLFdBQVcsS0FBSyxPQUFPLEVBQUU7QUFDbkMsU0FBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFekIsT0FBSSxNQUFNLENBQUMsV0FBVyxFQUFFO0FBQ3ZCLFVBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3hDO0dBQ0Q7O0FBRUQsTUFBSSxNQUFNLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxXQUFXLElBQUksV0FBVyxFQUFFO0FBQzVELE9BQU0sbUJBQW1CLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM1RCxTQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsc0JBQXNCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztHQUMvRDs7QUFFRCxNQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7OztBQUduQixTQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0dBQ25FO0VBQ0QsQ0FBQyxDQUFDO0NBQ0g7O0FBRU0sSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLEdBQVM7QUFDN0IsS0FBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUN4QyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9lZGl0b3Jjb25maWcvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5pbXBvcnQgZ2VuZXJhdGVDb25maWcgZnJvbSAnLi9jb21tYW5kcy9nZW5lcmF0ZSc7XG5cbmNvbnN0IGxhenlSZXEgPSByZXF1aXJlKCdsYXp5LXJlcScpKHJlcXVpcmUpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5jb25zdCBlZGl0b3Jjb25maWcgPSBsYXp5UmVxKCdlZGl0b3Jjb25maWcnKTtcblxuZnVuY3Rpb24gaW5pdChlZGl0b3IpIHtcblx0Z2VuZXJhdGVDb25maWcoKTtcblxuXHRpZiAoIWVkaXRvcikge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGZpbGUgPSBlZGl0b3IuZ2V0VVJJKCk7XG5cblx0Y29uc3QgbGluZUVuZGluZ3MgPSB7XG5cdFx0Y3JsZjogJ1xcclxcbicsXG5cdFx0bGY6ICdcXG4nXG5cdH07XG5cblx0aWYgKCFmaWxlKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0ZWRpdG9yY29uZmlnKCkucGFyc2UoZmlsZSkudGhlbihjb25maWcgPT4ge1xuXHRcdGlmIChPYmplY3Qua2V5cyhjb25maWcpLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGluZGVudFN0eWxlID0gY29uZmlnLmluZGVudF9zdHlsZSB8fCAoZWRpdG9yLmdldFNvZnRUYWJzKCkgPyAnc3BhY2UnIDogJ3RhYicpO1xuXG5cdFx0aWYgKGluZGVudFN0eWxlID09PSAndGFiJykge1xuXHRcdFx0ZWRpdG9yLnNldFNvZnRUYWJzKGZhbHNlKTtcblxuXHRcdFx0aWYgKGNvbmZpZy50YWJfd2lkdGgpIHtcblx0XHRcdFx0ZWRpdG9yLnNldFRhYkxlbmd0aChjb25maWcudGFiX3dpZHRoKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKGluZGVudFN0eWxlID09PSAnc3BhY2UnKSB7XG5cdFx0XHRlZGl0b3Iuc2V0U29mdFRhYnModHJ1ZSk7XG5cblx0XHRcdGlmIChjb25maWcuaW5kZW50X3NpemUpIHtcblx0XHRcdFx0ZWRpdG9yLnNldFRhYkxlbmd0aChjb25maWcuaW5kZW50X3NpemUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChjb25maWcuZW5kX29mX2xpbmUgJiYgY29uZmlnLmVuZF9vZl9saW5lIGluIGxpbmVFbmRpbmdzKSB7XG5cdFx0XHRjb25zdCBwcmVmZXJyZWRMaW5lRW5kaW5nID0gbGluZUVuZGluZ3NbY29uZmlnLmVuZF9vZl9saW5lXTtcblx0XHRcdGVkaXRvci5nZXRCdWZmZXIoKS5zZXRQcmVmZXJyZWRMaW5lRW5kaW5nKHByZWZlcnJlZExpbmVFbmRpbmcpO1xuXHRcdH1cblxuXHRcdGlmIChjb25maWcuY2hhcnNldCkge1xuXHRcdFx0Ly8gYnkgZGVmYXVsdCBBdG9tIHVzZXMgY2hhcnNldCBuYW1lIHdpdGhvdXQgYW55IGRhc2hlcyBpbiB0aGVtXG5cdFx0XHQvLyAoaS5lLiAndXRmMTZsZScgaW5zdGVhZCBvZiAndXRmLTE2bGUnKS5cblx0XHRcdGVkaXRvci5zZXRFbmNvZGluZyhjb25maWcuY2hhcnNldC5yZXBsYWNlKC8tL2csICcnKS50b0xvd2VyQ2FzZSgpKTtcblx0XHR9XG5cdH0pO1xufVxuXG5leHBvcnQgY29uc3QgYWN0aXZhdGUgPSAoKSA9PiB7XG5cdGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyhpbml0KTtcbn07XG4iXX0=
//# sourceURL=/Users/ajenkins/.atom/packages/editorconfig/index.js
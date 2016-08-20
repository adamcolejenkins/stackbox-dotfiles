function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */
/* eslint-env jasmine, atomtest */

/*
  This file contains verifying specs for:
  https://github.com/sindresorhus/atom-editorconfig/issues/69
*/

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var projectRoot = _path2['default'].join(__dirname, 'fixtures');
var filePath = _path2['default'].join(projectRoot, 'iss69.txt');

describe('when opening any file', function () {
	var textEditor = null;

	beforeEach(function () {
		waitsForPromise(function () {
			return Promise.all([atom.packages.activatePackage('editorconfig'), atom.workspace.open(filePath)]).then(function (results) {
				textEditor = results[1];
			});
		});
	});

	it('shouldn\'t being changed without any action', function () {
		expect(textEditor.isModified()).toBeFalsy();
	});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9lZGl0b3Jjb25maWcvc3BlYy9pc3M2OS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBUWlCLE1BQU07Ozs7QUFFdkIsSUFBTSxXQUFXLEdBQUcsa0JBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNyRCxJQUFNLFFBQVEsR0FBRyxrQkFBSyxJQUFJLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDOztBQUVyRCxRQUFRLENBQUMsdUJBQXVCLEVBQUUsWUFBTTtBQUN2QyxLQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7O0FBRXRCLFdBQVUsQ0FBQyxZQUFNO0FBQ2hCLGlCQUFlLENBQUM7VUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLENBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLEVBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUM3QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ2xCLGNBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEIsQ0FBQztHQUFBLENBQ0YsQ0FBQztFQUNGLENBQUMsQ0FBQzs7QUFFSCxHQUFFLENBQUMsNkNBQTZDLEVBQUUsWUFBTTtBQUN2RCxRQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7RUFDNUMsQ0FBQyxDQUFDO0NBQ0gsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9lZGl0b3Jjb25maWcvc3BlYy9pc3M2OS1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyogZXNsaW50LWVudiBqYXNtaW5lLCBhdG9tdGVzdCAqL1xuXG4vKlxuICBUaGlzIGZpbGUgY29udGFpbnMgdmVyaWZ5aW5nIHNwZWNzIGZvcjpcbiAgaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9hdG9tLWVkaXRvcmNvbmZpZy9pc3N1ZXMvNjlcbiovXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBwcm9qZWN0Um9vdCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycpO1xuY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4ocHJvamVjdFJvb3QsICdpc3M2OS50eHQnKTtcblxuZGVzY3JpYmUoJ3doZW4gb3BlbmluZyBhbnkgZmlsZScsICgpID0+IHtcblx0bGV0IHRleHRFZGl0b3IgPSBudWxsO1xuXG5cdGJlZm9yZUVhY2goKCkgPT4ge1xuXHRcdHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuXHRcdFx0UHJvbWlzZS5hbGwoW1xuXHRcdFx0XHRhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnZWRpdG9yY29uZmlnJyksXG5cdFx0XHRcdGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgpXG5cdFx0XHRdKS50aGVuKHJlc3VsdHMgPT4ge1xuXHRcdFx0XHR0ZXh0RWRpdG9yID0gcmVzdWx0c1sxXTtcblx0XHRcdH0pXG5cdFx0KTtcblx0fSk7XG5cblx0aXQoJ3Nob3VsZG5cXCd0IGJlaW5nIGNoYW5nZWQgd2l0aG91dCBhbnkgYWN0aW9uJywgKCkgPT4ge1xuXHRcdGV4cGVjdCh0ZXh0RWRpdG9yLmlzTW9kaWZpZWQoKSkudG9CZUZhbHN5KCk7XG5cdH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/ajenkins/.atom/packages/editorconfig/spec/iss69-spec.js
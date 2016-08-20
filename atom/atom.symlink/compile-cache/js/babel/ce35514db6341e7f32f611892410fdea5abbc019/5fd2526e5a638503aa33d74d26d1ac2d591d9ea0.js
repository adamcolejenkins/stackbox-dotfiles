function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */
/* eslint-env jasmine, atomtest */

/* This file contains all specs to ensure the base-functionality of
this plugin. */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var projectRoot = _path2['default'].join(__dirname, 'fixtures');
var filePath = _path2['default'].join(projectRoot, 'base.txt');

describe('editorconfig', function () {
	var textEditor = null;

	beforeEach(function () {
		waitsForPromise(function () {
			return Promise.all([atom.packages.activatePackage('editorconfig'), atom.workspace.open(filePath)]).then(function (results) {
				textEditor = results[1];
			});
		});
	});

	it('should provide the EditorConfig:generate-config command', function () {
		var isAvailable = false;
		atom.commands.findCommands({ target: atom.views.getView(atom.workspace) }).forEach(function (command) {
			if (command.name === 'EditorConfig:generate-config') {
				isAvailable = true;
			}
		});
		expect(isAvailable).toBeTruthy();
	});

	it('should have set the indent_style to "space"', function () {
		expect(textEditor.getSoftTabs()).toBeTruthy();
	});

	it('should have set the indent_size to 4 characters', function () {
		expect(textEditor.getTabLength()).toEqual(4);
	});

	it('should have set the end_of_line-character to "lf"', function () {
		expect(textEditor.getBuffer().getPreferredLineEnding()).toMatch("\n");
	});

	it('should have set the charset of the document to "utf8"', function () {
		expect(textEditor.getEncoding()).toMatch('utf8');
	});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9lZGl0b3Jjb25maWcvc3BlYy9iYXNlLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBTWlCLE1BQU07Ozs7QUFFdkIsSUFBTSxXQUFXLEdBQUcsa0JBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNyRCxJQUFNLFFBQVEsR0FBRyxrQkFBSyxJQUFJLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDOztBQUVwRCxRQUFRLENBQUMsY0FBYyxFQUFFLFlBQU07QUFDOUIsS0FBSSxVQUFVLEdBQUcsSUFBSSxDQUFDOztBQUV0QixXQUFVLENBQUMsWUFBTTtBQUNoQixpQkFBZSxDQUFDO1VBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxFQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUNsQixjQUFVLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7R0FBQSxDQUNGLENBQUM7RUFDRixDQUFDLENBQUM7O0FBRUgsR0FBRSxDQUFDLHlEQUF5RCxFQUFFLFlBQU07QUFDbkUsTUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLE1BQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQyxDQUFDLENBQ3RFLE9BQU8sQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUNuQixPQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssOEJBQThCLEVBQUU7QUFDcEQsZUFBVyxHQUFHLElBQUksQ0FBQztJQUNuQjtHQUNELENBQUMsQ0FBQztBQUNKLFFBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztFQUNqQyxDQUFDLENBQUM7O0FBRUgsR0FBRSxDQUFDLDZDQUE2QyxFQUFFLFlBQU07QUFDdkQsUUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO0VBQzlDLENBQUMsQ0FBQzs7QUFFSCxHQUFFLENBQUMsaURBQWlELEVBQUUsWUFBTTtBQUMzRCxRQUFNLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzdDLENBQUMsQ0FBQzs7QUFFSCxHQUFFLENBQUMsbURBQW1ELEVBQUUsWUFBTTtBQUM3RCxRQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDdEUsQ0FBQyxDQUFDOztBQUVILEdBQUUsQ0FBQyx1REFBdUQsRUFBRSxZQUFNO0FBQ2pFLFFBQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDakQsQ0FBQyxDQUFDO0NBQ0gsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9lZGl0b3Jjb25maWcvc3BlYy9iYXNlLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiBlc2xpbnQtZW52IGphc21pbmUsIGF0b210ZXN0ICovXG5cbi8qIFRoaXMgZmlsZSBjb250YWlucyBhbGwgc3BlY3MgdG8gZW5zdXJlIHRoZSBiYXNlLWZ1bmN0aW9uYWxpdHkgb2ZcbnRoaXMgcGx1Z2luLiAqL1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgcHJvamVjdFJvb3QgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnKTtcbmNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKHByb2plY3RSb290LCAnYmFzZS50eHQnKTtcblxuZGVzY3JpYmUoJ2VkaXRvcmNvbmZpZycsICgpID0+IHtcblx0bGV0IHRleHRFZGl0b3IgPSBudWxsO1xuXG5cdGJlZm9yZUVhY2goKCkgPT4ge1xuXHRcdHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuXHRcdFx0UHJvbWlzZS5hbGwoW1xuXHRcdFx0XHRhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnZWRpdG9yY29uZmlnJyksXG5cdFx0XHRcdGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgpXG5cdFx0XHRdKS50aGVuKHJlc3VsdHMgPT4ge1xuXHRcdFx0XHR0ZXh0RWRpdG9yID0gcmVzdWx0c1sxXTtcblx0XHRcdH0pXG5cdFx0KTtcblx0fSk7XG5cblx0aXQoJ3Nob3VsZCBwcm92aWRlIHRoZSBFZGl0b3JDb25maWc6Z2VuZXJhdGUtY29uZmlnIGNvbW1hbmQnLCAoKSA9PiB7XG5cdFx0bGV0IGlzQXZhaWxhYmxlID0gZmFsc2U7XG5cdFx0YXRvbS5jb21tYW5kcy5maW5kQ29tbWFuZHMoe3RhcmdldDogYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKX0pXG5cdFx0XHQuZm9yRWFjaChjb21tYW5kID0+IHtcblx0XHRcdFx0aWYgKGNvbW1hbmQubmFtZSA9PT0gJ0VkaXRvckNvbmZpZzpnZW5lcmF0ZS1jb25maWcnKSB7XG5cdFx0XHRcdFx0aXNBdmFpbGFibGUgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRleHBlY3QoaXNBdmFpbGFibGUpLnRvQmVUcnV0aHkoKTtcblx0fSk7XG5cblx0aXQoJ3Nob3VsZCBoYXZlIHNldCB0aGUgaW5kZW50X3N0eWxlIHRvIFwic3BhY2VcIicsICgpID0+IHtcblx0XHRleHBlY3QodGV4dEVkaXRvci5nZXRTb2Z0VGFicygpKS50b0JlVHJ1dGh5KCk7XG5cdH0pO1xuXG5cdGl0KCdzaG91bGQgaGF2ZSBzZXQgdGhlIGluZGVudF9zaXplIHRvIDQgY2hhcmFjdGVycycsICgpID0+IHtcblx0XHRleHBlY3QodGV4dEVkaXRvci5nZXRUYWJMZW5ndGgoKSkudG9FcXVhbCg0KTtcblx0fSk7XG5cblx0aXQoJ3Nob3VsZCBoYXZlIHNldCB0aGUgZW5kX29mX2xpbmUtY2hhcmFjdGVyIHRvIFwibGZcIicsICgpID0+IHtcblx0XHRleHBlY3QodGV4dEVkaXRvci5nZXRCdWZmZXIoKS5nZXRQcmVmZXJyZWRMaW5lRW5kaW5nKCkpLnRvTWF0Y2goXCJcXG5cIik7XG5cdH0pO1xuXG5cdGl0KCdzaG91bGQgaGF2ZSBzZXQgdGhlIGNoYXJzZXQgb2YgdGhlIGRvY3VtZW50IHRvIFwidXRmOFwiJywgKCkgPT4ge1xuXHRcdGV4cGVjdCh0ZXh0RWRpdG9yLmdldEVuY29kaW5nKCkpLnRvTWF0Y2goJ3V0ZjgnKTtcblx0fSk7XG59KTtcbiJdfQ==
//# sourceURL=/Users/ajenkins/.atom/packages/editorconfig/spec/base-spec.js
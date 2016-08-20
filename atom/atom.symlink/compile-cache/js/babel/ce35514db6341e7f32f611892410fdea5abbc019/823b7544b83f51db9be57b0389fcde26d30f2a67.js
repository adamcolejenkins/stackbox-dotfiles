/** @babel */
/* eslint-env jasmine, atomtest */

/*
	This file contains an informational output for the developer, help getting a
	performance-awareness.
*/

describe('editorconfig', function () {
	beforeEach(function () {
		waitsForPromise(function () {
			return atom.packages.activatePackage('editorconfig');
		});
	});

	it('should have been loaded fine', function () {
		var pack = atom.packages.getLoadedPackage('editorconfig');

		expect(pack).not.toBeUndefined();
		if (typeof pack !== 'undefined') {
			console.info('The package took ' + pack.loadTime + 'ms to load and ' + pack.activateTime + 'ms to activate.');
		}
	});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9lZGl0b3Jjb25maWcvc3BlYy9iZW5jaG1hcmstc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQVFBLFFBQVEsQ0FBQyxjQUFjLEVBQUUsWUFBTTtBQUM5QixXQUFVLENBQUMsWUFBTTtBQUNoQixpQkFBZSxDQUFDO1VBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDO0dBQUEsQ0FBQyxDQUFDO0VBQ3JFLENBQUMsQ0FBQzs7QUFFSCxHQUFFLENBQUMsOEJBQThCLEVBQUUsWUFBTTtBQUN4QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUU1RCxRQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ2pDLE1BQUksT0FBTyxJQUFJLEtBQUssV0FBVyxFQUFFO0FBQ2hDLFVBQU8sQ0FBQyxJQUFJLHVCQUFxQixJQUFJLENBQUMsUUFBUSx1QkFDM0MsSUFBSSxDQUFDLFlBQVkscUJBQWtCLENBQUM7R0FDdkM7RUFDRCxDQUFDLENBQUM7Q0FDSCxDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2VkaXRvcmNvbmZpZy9zcGVjL2JlbmNobWFyay1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyogZXNsaW50LWVudiBqYXNtaW5lLCBhdG9tdGVzdCAqL1xuXG4vKlxuXHRUaGlzIGZpbGUgY29udGFpbnMgYW4gaW5mb3JtYXRpb25hbCBvdXRwdXQgZm9yIHRoZSBkZXZlbG9wZXIsIGhlbHAgZ2V0dGluZyBhXG5cdHBlcmZvcm1hbmNlLWF3YXJlbmVzcy5cbiovXG5cbmRlc2NyaWJlKCdlZGl0b3Jjb25maWcnLCAoKSA9PiB7XG5cdGJlZm9yZUVhY2goKCkgPT4ge1xuXHRcdHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnZWRpdG9yY29uZmlnJykpO1xuXHR9KTtcblxuXHRpdCgnc2hvdWxkIGhhdmUgYmVlbiBsb2FkZWQgZmluZScsICgpID0+IHtcblx0XHRjb25zdCBwYWNrID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKCdlZGl0b3Jjb25maWcnKTtcblxuXHRcdGV4cGVjdChwYWNrKS5ub3QudG9CZVVuZGVmaW5lZCgpO1xuXHRcdGlmICh0eXBlb2YgcGFjayAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdGNvbnNvbGUuaW5mbyhgVGhlIHBhY2thZ2UgdG9vayAke3BhY2subG9hZFRpbWV9bXMgdG8gbG9hZCBcXFxuYW5kICR7cGFjay5hY3RpdmF0ZVRpbWV9bXMgdG8gYWN0aXZhdGUuYCk7XG5cdFx0fVxuXHR9KTtcbn0pO1xuIl19
//# sourceURL=/Users/ajenkins/.atom/packages/editorconfig/spec/benchmark-spec.js
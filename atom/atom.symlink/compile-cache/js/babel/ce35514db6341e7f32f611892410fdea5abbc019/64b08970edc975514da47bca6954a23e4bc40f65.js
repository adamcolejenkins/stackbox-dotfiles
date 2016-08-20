/** @babel */
/* eslint-env jasmine, atomtest */

/*
  This file contains verifying specs for:
  https://github.com/sindresorhus/atom-editorconfig/issues/69
*/

var _commandsGenerate = require('../commands/generate');

xdescribe('editorconfig', function () {
	describe('when opening the keymap', function () {
		it('should\'t throw an exception when the generation of editorconfig fails', function () {
			runs(function () {
				atom.config.set('whitespace.removeTrailingWhitespace', true);
				atom.commands.dispatch(atom.views.getView(atom.workspace.getActivePane()), 'application:open-your-keymap');
				console.info(atom.textEditors.editors.size);
			});

			waitsFor(function () {
				console.info(atom.textEditors.editors.size);

				return atom.workspace.getTextEditors().length > 0;
			}, 'the keymap being opened', 5000);

			runs(function () {
				console.info(atom.workspace.getTextEditors()[0].getPath());
				expect(_commandsGenerate.init).not.toThrow();
			});
		});
	});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9lZGl0b3Jjb25maWcvc3BlYy9pc3M0Ny1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O2dDQVFxQyxzQkFBc0I7O0FBRTNELFNBQVMsQ0FBQyxjQUFjLEVBQUUsWUFBTTtBQUMvQixTQUFRLENBQUMseUJBQXlCLEVBQUUsWUFBTTtBQUN6QyxJQUFFLENBQUMsd0VBQXdFLEVBQUUsWUFBTTtBQUNsRixPQUFJLENBQUMsWUFBTTtBQUNWLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzdELFFBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDLEVBQ2xELDhCQUE4QixDQUM5QixDQUFDO0FBQ0YsV0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDLENBQUM7O0FBRUgsV0FBUSxDQUFDLFlBQU07QUFDZCxXQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUU1QyxXQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNsRCxFQUFFLHlCQUF5QixFQUFFLElBQUksQ0FBQyxDQUFDOztBQUVwQyxPQUFJLENBQUMsWUFBTTtBQUNWLFdBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQzNELFVBQU0sd0JBQWdCLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3JDLENBQUMsQ0FBQztHQUNILENBQUMsQ0FBQztFQUNILENBQUMsQ0FBQztDQUNILENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvYWplbmtpbnMvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL3NwZWMvaXNzNDctc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qIGVzbGludC1lbnYgamFzbWluZSwgYXRvbXRlc3QgKi9cblxuLypcbiAgVGhpcyBmaWxlIGNvbnRhaW5zIHZlcmlmeWluZyBzcGVjcyBmb3I6XG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvYXRvbS1lZGl0b3Jjb25maWcvaXNzdWVzLzY5XG4qL1xuXG5pbXBvcnQge2luaXQgYXMgZ2VuZXJhdGVDb25maWd9IGZyb20gJy4uL2NvbW1hbmRzL2dlbmVyYXRlJztcblxueGRlc2NyaWJlKCdlZGl0b3Jjb25maWcnLCAoKSA9PiB7XG5cdGRlc2NyaWJlKCd3aGVuIG9wZW5pbmcgdGhlIGtleW1hcCcsICgpID0+IHtcblx0XHRpdCgnc2hvdWxkXFwndCB0aHJvdyBhbiBleGNlcHRpb24gd2hlbiB0aGUgZ2VuZXJhdGlvbiBvZiBlZGl0b3Jjb25maWcgZmFpbHMnLCAoKSA9PiB7XG5cdFx0XHRydW5zKCgpID0+IHtcblx0XHRcdFx0YXRvbS5jb25maWcuc2V0KCd3aGl0ZXNwYWNlLnJlbW92ZVRyYWlsaW5nV2hpdGVzcGFjZScsIHRydWUpO1xuXHRcdFx0XHRhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKFxuXHRcdFx0XHRcdGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkpLFxuXHRcdFx0XHRcdCdhcHBsaWNhdGlvbjpvcGVuLXlvdXIta2V5bWFwJ1xuXHRcdFx0XHQpO1xuXHRcdFx0XHRjb25zb2xlLmluZm8oYXRvbS50ZXh0RWRpdG9ycy5lZGl0b3JzLnNpemUpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHdhaXRzRm9yKCgpID0+IHtcblx0XHRcdFx0Y29uc29sZS5pbmZvKGF0b20udGV4dEVkaXRvcnMuZWRpdG9ycy5zaXplKTtcblxuXHRcdFx0XHRyZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5sZW5ndGggPiAwO1xuXHRcdFx0fSwgJ3RoZSBrZXltYXAgYmVpbmcgb3BlbmVkJywgNTAwMCk7XG5cblx0XHRcdHJ1bnMoKCkgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmluZm8oYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVswXS5nZXRQYXRoKCkpO1xuXHRcdFx0XHRleHBlY3QoZ2VuZXJhdGVDb25maWcpLm5vdC50b1Rocm93KCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSk7XG59KTtcbiJdfQ==
//# sourceURL=/Users/ajenkins/.atom/packages/editorconfig/spec/iss47-spec.js
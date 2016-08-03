function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _testHelper = require('./test-helper');

var _libLinterHandlebarsProvider = require('../lib/linter-handlebars-provider');

var _libLinterHandlebarsProvider2 = _interopRequireDefault(_libLinterHandlebarsProvider);

"use babel";

describe("Lint handlebars", function () {

  beforeEach(function () {
    (0, _testHelper.resetConfig)();
    atom.workspace.destroyActivePaneItem();
    return waitsForPromise(function () {
      return atom.packages.activatePackage('linter-handlebars');
    });
  });

  describe("checks a file with a missing open block", function () {
    it('retuns one error', function () {
      waitsForPromise(function () {
        return atom.workspace.open(_path2['default'].join(__dirname, 'files', 'error-missing-open.hbs')).then(function (editor) {
          return _libLinterHandlebarsProvider2['default'].lint(editor);
        }).then(function (messages) {
          expect(messages.length).toEqual(1);
          expect(messages[0].text).toEqual("Expecting 'EOF', got 'OPEN_ENDBLOCK'");
          expect(messages[0].range).toEqual([[2, 0], [2, 7]]);
        });
      });
    });

    it('retuns one error (CRFL)', function () {
      waitsForPromise(function () {
        return atom.workspace.open(_path2['default'].join(__dirname, 'files', 'error-missing-open-crfl.hbs')).then(function (editor) {
          return _libLinterHandlebarsProvider2['default'].lint(editor);
        }).then(function (messages) {
          expect(messages.length).toEqual(1);
          expect(messages[0].text).toEqual("Expecting 'EOF', got 'OPEN_ENDBLOCK'");
          expect(messages[0].range).toEqual([[2, 0], [2, 7]]);
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2xpbnRlci1oYW5kbGViYXJzL3NwZWMvbGludGVyLWhhbmRsZWJhcnMtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztvQkFFaUIsTUFBTTs7OzswQkFDSyxlQUFlOzsyQ0FDTixtQ0FBbUM7Ozs7QUFKeEUsV0FBVyxDQUFBOztBQU1YLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxZQUFNOztBQUVoQyxZQUFVLENBQUMsWUFBTTtBQUNmLGtDQUFhLENBQUE7QUFDYixRQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFxQixFQUFFLENBQUE7QUFDdEMsV0FBTyxlQUFlLENBQUMsWUFBTTtBQUMzQixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUE7S0FDMUQsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyx5Q0FBeUMsRUFBRSxZQUFNO0FBQ3hELE1BQUUsQ0FBQyxrQkFBa0IsRUFBRSxZQUFNO0FBQzNCLHFCQUFlLENBQUMsWUFBTTtBQUNwQixlQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLHdCQUF3QixDQUFDLENBQUMsQ0FDaEYsSUFBSSxDQUFDLFVBQUMsTUFBTTtpQkFBSyx5Q0FBeUIsSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUFBLENBQUMsQ0FDdkQsSUFBSSxDQUFDLFVBQUMsUUFBUSxFQUFLO0FBQ2xCLGdCQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNsQyxnQkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQTtBQUN4RSxnQkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDcEQsQ0FBQyxDQUFBO09BQ0wsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQyx5QkFBeUIsRUFBRSxZQUFNO0FBQ2xDLHFCQUFlLENBQUMsWUFBTTtBQUNwQixlQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLDZCQUE2QixDQUFDLENBQUMsQ0FDckYsSUFBSSxDQUFDLFVBQUMsTUFBTTtpQkFBSyx5Q0FBeUIsSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUFBLENBQUMsQ0FDdkQsSUFBSSxDQUFDLFVBQUMsUUFBUSxFQUFLO0FBQ2xCLGdCQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNsQyxnQkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQTtBQUN4RSxnQkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDcEQsQ0FBQyxDQUFBO09BQ0wsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2xpbnRlci1oYW5kbGViYXJzL3NwZWMvbGludGVyLWhhbmRsZWJhcnMtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCJcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IHJlc2V0Q29uZmlnIH0gZnJvbSAnLi90ZXN0LWhlbHBlcidcbmltcG9ydCBMaW50ZXJIYW5kbGViYXJzUHJvdmlkZXIgZnJvbSAnLi4vbGliL2xpbnRlci1oYW5kbGViYXJzLXByb3ZpZGVyJ1xuXG5kZXNjcmliZShcIkxpbnQgaGFuZGxlYmFyc1wiLCAoKSA9PiB7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgcmVzZXRDb25maWcoKVxuICAgIGF0b20ud29ya3NwYWNlLmRlc3Ryb3lBY3RpdmVQYW5lSXRlbSgpXG4gICAgcmV0dXJuIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICByZXR1cm4gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xpbnRlci1oYW5kbGViYXJzJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKFwiY2hlY2tzIGEgZmlsZSB3aXRoIGEgbWlzc2luZyBvcGVuIGJsb2NrXCIsICgpID0+IHtcbiAgICBpdCgncmV0dW5zIG9uZSBlcnJvcicsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGguam9pbihfX2Rpcm5hbWUsICdmaWxlcycsICdlcnJvci1taXNzaW5nLW9wZW4uaGJzJykpXG4gICAgICAgICAgLnRoZW4oKGVkaXRvcikgPT4gTGludGVySGFuZGxlYmFyc1Byb3ZpZGVyLmxpbnQoZWRpdG9yKSlcbiAgICAgICAgICAudGhlbigobWVzc2FnZXMpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvRXF1YWwoMSlcbiAgICAgICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS50ZXh0KS50b0VxdWFsKFwiRXhwZWN0aW5nICdFT0YnLCBnb3QgJ09QRU5fRU5EQkxPQ0snXCIpXG4gICAgICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0ucmFuZ2UpLnRvRXF1YWwoW1syLCAwXSwgWzIsIDddXSlcbiAgICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVucyBvbmUgZXJyb3IgKENSRkwpJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpbGVzJywgJ2Vycm9yLW1pc3Npbmctb3Blbi1jcmZsLmhicycpKVxuICAgICAgICAgIC50aGVuKChlZGl0b3IpID0+IExpbnRlckhhbmRsZWJhcnNQcm92aWRlci5saW50KGVkaXRvcikpXG4gICAgICAgICAgLnRoZW4oKG1lc3NhZ2VzKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0VxdWFsKDEpXG4gICAgICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0udGV4dCkudG9FcXVhbChcIkV4cGVjdGluZyAnRU9GJywgZ290ICdPUEVOX0VOREJMT0NLJ1wiKVxuICAgICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnJhbmdlKS50b0VxdWFsKFtbMiwgMF0sIFsyLCA3XV0pXG4gICAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=
//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/linter-handlebars/spec/linter-handlebars-spec.js

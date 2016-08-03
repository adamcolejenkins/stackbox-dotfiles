Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

'use babel';

exports['default'] = {
  config: {
    erbExecutablePath: {
      description: 'Path to the `erb` executable',
      type: 'string',
      'default': 'erb'
    },
    trimMode: {
      description: 'What trim mode ERB should use',
      type: 'string',
      'enum': ['None', '0', '1', '2', '-'],
      'default': 'None'
    },
    rubyExecutablePath: {
      description: 'Path to the `ruby` executable',
      type: 'string',
      'default': 'ruby'
    }
  },

  activate: function activate() {
    var _this = this;

    require('atom-package-deps').install();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter-erb.erbExecutablePath', function (erbExecutablePath) {
      _this.erbPath = erbExecutablePath;
    }));
    this.subscriptions.add(atom.config.observe('linter-erb.trimMode', function (trimMode) {
      _this.trimMode = trimMode;
    }));
    this.subscriptions.add(atom.config.observe('linter-erb.rubyExecutablePath', function (rubyExecutablePath) {
      _this.rubyPath = rubyExecutablePath;
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    var helpers = require('atom-linter');
    return {
      name: 'ERB',
      grammarScopes: ['text.html.erb', 'text.html.ruby'],
      scope: 'file',
      lintOnFly: true,
      lint: function lint(textEditor) {
        var filePath = textEditor.getPath();
        var fileDir = _path2['default'].dirname(filePath);
        var text = textEditor.getText();
        var erbArgs = ['-x'];
        var rubyArgs = ['-c', '-'];

        if (!text) {
          return Promise.resolve([]);
        }

        // Specify the trim mode, if needed
        if (_this2.trimMode !== 'None') {
          erbArgs.push('-T', _this2.trimMode);
        }
        erbArgs.push('-');

        // Call ERB to "de-templatize" the code
        return helpers.exec(_this2.erbPath, erbArgs, { stdin: text, cwd: fileDir }).then(function (erbOut) {
          var rubyCode = erbOut;
          // Deal with the <%= function_with trailing block do %> ... <% end %>
          // From Ruby on Rails code
          var scopes = textEditor.getLastCursor().getScopeDescriptor().getScopesArray();
          if (scopes.indexOf('text.html.erb') !== -1) {
            rubyCode = erbOut.replace(/_erbout.concat\(\((.+?do.+?)\).to_s\)/g, '\$1');
          }
          // Run Ruby on the "de-templatized" code
          var rubyProcessOpt = { stdin: rubyCode, stream: 'stderr' };
          return helpers.exec(_this2.rubyPath, rubyArgs, rubyProcessOpt).then(function (output) {
            var regex = /.+:(\d+):\s+(?:.+?)[,:]\s(.+)/g;
            var messages = [];
            var match = regex.exec(output);
            while (match !== null) {
              messages.push({
                type: 'Error',
                text: match[2],
                filePath: filePath,
                // Bump line number down 2 instead of 1 due to inserted extra line
                range: helpers.rangeFromLineNumber(textEditor, match[1] - 2)
              });
              match = regex.exec(output);
            }
            return messages;
          });
        });
      }
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2xpbnRlci1lcmIvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFaUIsTUFBTTs7OztvQkFDYSxNQUFNOztBQUgxQyxXQUFXLENBQUM7O3FCQUtHO0FBQ2IsUUFBTSxFQUFFO0FBQ04scUJBQWlCLEVBQUU7QUFDakIsaUJBQVcsRUFBRSw4QkFBOEI7QUFDM0MsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxLQUFLO0tBQ2Y7QUFDRCxZQUFRLEVBQUU7QUFDUixpQkFBVyxFQUFFLCtCQUErQjtBQUM1QyxVQUFJLEVBQUUsUUFBUTtBQUNkLGNBQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0FBQ2xDLGlCQUFTLE1BQU07S0FDaEI7QUFDRCxzQkFBa0IsRUFBRTtBQUNsQixpQkFBVyxFQUFFLCtCQUErQjtBQUM1QyxVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLE1BQU07S0FDaEI7R0FDRjs7QUFFRCxVQUFRLEVBQUEsb0JBQUc7OztBQUNULFdBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3ZDLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7O0FBRS9DLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsRUFBRSxVQUFBLGlCQUFpQixFQUFJO0FBQ3ZFLFlBQUssT0FBTyxHQUFHLGlCQUFpQixDQUFDO0tBQ2xDLENBQUMsQ0FDSCxDQUFDO0FBQ0YsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLFVBQUEsUUFBUSxFQUFJO0FBQ3JELFlBQUssUUFBUSxHQUFHLFFBQVEsQ0FBQztLQUMx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O2VBQzdELENBQUMsQ0FBQztBQUNILG1CQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUM1QjtBQUNELG1CQUFPLFFBQVEsQ0FBQztXQUNqQixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7T0FDSjtLQUNGLENBQUM7R0FDSDtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2xpbnRlci1lcmIvbGliL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzoge1xuICAgIGVyYkV4ZWN1dGFibGVQYXRoOiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ1BhdGggdG8gdGhlIGBlcmJgIGV4ZWN1dGFibGUnLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnZXJiJ1xuICAgIH0sXG4gICAgdHJpbU1vZGU6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnV2hhdCB0cmltIG1vZGUgRVJCIHNob3VsZCB1c2UnLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ05vbmUnLCAnMCcsICcxJywgJzInLCAnLSddLFxuICAgICAgZGVmYXVsdDogJ05vbmUnXG4gICAgfSxcbiAgICBydWJ5RXhlY3V0YWJsZVBhdGg6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnUGF0aCB0byB0aGUgYHJ1YnlgIGV4ZWN1dGFibGUnLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAncnVieSdcbiAgICB9XG4gIH0sXG5cbiAgYWN0aXZhdGUoKSB7XG4gICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItZXJiLmVyYkV4ZWN1dGFibGVQYXRoJywgZXJiRXhlY3V0YWJsZVBhdGggPT4ge1xuICAgICAgICB0aGlzLmVyYlBhdGggPSBlcmJFeGVjdXRhYmxlUGF0aDtcbiAgICAgIH0pXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWVyYi50cmltTW9kZScsIHRyaW1Nb2RlID0+IHtcbiAgICAgICAgdGhpcy50cmltTW9kZSA9IHRyaW1Nb2RlO1xuICAgICAgfSlcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItZXJiLnJ1YnlFeGVjdXRhYmxlUGF0aCcsIHJ1YnlFeGVjdXRhYmxlUGF0aCA9PiB7XG4gICAgICAgIHRoaXMucnVieVBhdGggPSBydWJ5RXhlY3V0YWJsZVBhdGg7XG4gICAgICB9KVxuICAgICk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9LFxuXG4gIHByb3ZpZGVMaW50ZXIoKSB7XG4gICAgY29uc3QgaGVscGVycyA9IHJlcXVpcmUoJ2F0b20tbGludGVyJyk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdFUkInLFxuICAgICAgZ3JhbW1hclNjb3BlczogWyd0ZXh0Lmh0bWwuZXJiJywgJ3RleHQuaHRtbC5ydWJ5J10sXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludE9uRmx5OiB0cnVlLFxuICAgICAgbGludDogdGV4dEVkaXRvciA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gdGV4dEVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGNvbnN0IGZpbGVEaXIgPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpO1xuICAgICAgICBjb25zdCB0ZXh0ID0gdGV4dEVkaXRvci5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGVyYkFyZ3MgPSBbJy14J107XG4gICAgICAgIGNvbnN0IHJ1YnlBcmdzID0gWyctYycsICctJ107XG5cbiAgICAgICAgaWYgKCF0ZXh0KSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTcGVjaWZ5IHRoZSB0cmltIG1vZGUsIGlmIG5lZWRlZFxuICAgICAgICBpZiAodGhpcy50cmltTW9kZSAhPT0gJ05vbmUnKSB7XG4gICAgICAgICAgZXJiQXJncy5wdXNoKCctVCcsIHRoaXMudHJpbU1vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVyYkFyZ3MucHVzaCgnLScpO1xuXG4gICAgICAgIC8vIENhbGwgRVJCIHRvIFwiZGUtdGVtcGxhdGl6ZVwiIHRoZSBjb2RlXG4gICAgICAgIHJldHVybiBoZWxwZXJzLmV4ZWModGhpcy5lcmJQYXRoLCBlcmJBcmdzLFxuICAgICAgICAgIHsgc3RkaW46IHRleHQsIGN3ZDogZmlsZURpciB9XG4gICAgICAgICkudGhlbihlcmJPdXQgPT4ge1xuICAgICAgICAgIGxldCBydWJ5Q29kZSA9IGVyYk91dDtcbiAgICAgICAgICAvLyBEZWFsIHdpdGggdGhlIDwlPSBmdW5jdGlvbl93aXRoIHRyYWlsaW5nIGJsb2NrIGRvICU+IC4uLiA8JSBlbmQgJT5cbiAgICAgICAgICAvLyBGcm9tIFJ1Ynkgb24gUmFpbHMgY29kZVxuICAgICAgICAgIGNvbnN0IHNjb3BlcyA9IHRleHRFZGl0b3IuZ2V0TGFzdEN1cnNvcigpLmdldFNjb3BlRGVzY3JpcHRvcigpLmdldFNjb3Blc0FycmF5KCk7XG4gICAgICAgICAgaWYgKHNjb3Blcy5pbmRleE9mKCd0ZXh0Lmh0bWwuZXJiJykgIT09IC0xKSB7XG4gICAgICAgICAgICBydWJ5Q29kZSA9IGVyYk91dC5yZXBsYWNlKC9fZXJib3V0LmNvbmNhdFxcKFxcKCguKz9kby4rPylcXCkudG9fc1xcKS9nLCAnXFwkMScpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBSdW4gUnVieSBvbiB0aGUgXCJkZS10ZW1wbGF0aXplZFwiIGNvZGVcbiAgICAgICAgICBjb25zdCBydWJ5UHJvY2Vzc09wdCA9IHsgc3RkaW46IHJ1YnlDb2RlLCBzdHJlYW06ICdzdGRlcnInIH07XG4gICAgICAgICAgcmV0dXJuIGhlbHBlcnMuZXhlYyh0aGlzLnJ1YnlQYXRoLCBydWJ5QXJncywgcnVieVByb2Nlc3NPcHQpLnRoZW4ob3V0cHV0ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlZ2V4ID0gLy4rOihcXGQrKTpcXHMrKD86Lis/KVssOl1cXHMoLispL2c7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlcyA9IFtdO1xuICAgICAgICAgICAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhvdXRwdXQpO1xuICAgICAgICAgICAgd2hpbGUgKG1hdGNoICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgICAgICAgICAgdGV4dDogbWF0Y2hbMl0sXG4gICAgICAgICAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgICAgICAgICAgLy8gQnVtcCBsaW5lIG51bWJlciBkb3duIDIgaW5zdGVhZCBvZiAxIGR1ZSB0byBpbnNlcnRlZCBleHRyYSBsaW5lXG4gICAgICAgICAgICAgICAgcmFuZ2U6IGhlbHBlcnMucmFuZ2VGcm9tTGluZU51bWJlcih0ZXh0RWRpdG9yLCBtYXRjaFsxXSAtIDIpXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBtYXRjaCA9IHJlZ2V4LmV4ZWMob3V0cHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtZXNzYWdlcztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcbiJdfQ==
//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/linter-erb/lib/index.js

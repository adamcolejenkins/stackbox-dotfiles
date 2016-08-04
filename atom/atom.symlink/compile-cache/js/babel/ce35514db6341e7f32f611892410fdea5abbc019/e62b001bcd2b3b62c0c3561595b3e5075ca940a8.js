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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9saW50ZXItZXJiL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRWlCLE1BQU07Ozs7b0JBQ2EsTUFBTTs7QUFIMUMsV0FBVyxDQUFDOztxQkFLRztBQUNiLFFBQU0sRUFBRTtBQUNOLHFCQUFpQixFQUFFO0FBQ2pCLGlCQUFXLEVBQUUsOEJBQThCO0FBQzNDLFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMsS0FBSztLQUNmO0FBQ0QsWUFBUSxFQUFFO0FBQ1IsaUJBQVcsRUFBRSwrQkFBK0I7QUFDNUMsVUFBSSxFQUFFLFFBQVE7QUFDZCxjQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztBQUNsQyxpQkFBUyxNQUFNO0tBQ2hCO0FBQ0Qsc0JBQWtCLEVBQUU7QUFDbEIsaUJBQVcsRUFBRSwrQkFBK0I7QUFDNUMsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxNQUFNO0tBQ2hCO0dBQ0Y7O0FBRUQsVUFBUSxFQUFBLG9CQUFHOzs7QUFDVCxXQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN2QyxRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDOztBQUUvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsOEJBQThCLEVBQUUsVUFBQSxpQkFBaUIsRUFBSTtBQUN2RSxZQUFLLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQztLQUNsQyxDQUFDLENBQ0gsQ0FBQztBQUNGLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxVQUFBLFFBQVEsRUFBSTtBQUNyRCxZQUFLLFFBQVEsR0FBRyxRQUFRLENBQUM7S0FDMUIsQ0FBQyxDQUNILENBQUM7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QUFDSCxtQkFBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDNUI7QUFDRCxtQkFBTyxRQUFRLENBQUM7V0FDakIsQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDO09BQ0o7S0FDRixDQUFDO0dBQ0g7Q0FDRiIsImZpbGUiOiIvVXNlcnMvYWplbmtpbnMvLmF0b20vcGFja2FnZXMvbGludGVyLWVyYi9saWIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29uZmlnOiB7XG4gICAgZXJiRXhlY3V0YWJsZVBhdGg6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnUGF0aCB0byB0aGUgYGVyYmAgZXhlY3V0YWJsZScsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdlcmInXG4gICAgfSxcbiAgICB0cmltTW9kZToge1xuICAgICAgZGVzY3JpcHRpb246ICdXaGF0IHRyaW0gbW9kZSBFUkIgc2hvdWxkIHVzZScsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFsnTm9uZScsICcwJywgJzEnLCAnMicsICctJ10sXG4gICAgICBkZWZhdWx0OiAnTm9uZSdcbiAgICB9LFxuICAgIHJ1YnlFeGVjdXRhYmxlUGF0aDoge1xuICAgICAgZGVzY3JpcHRpb246ICdQYXRoIHRvIHRoZSBgcnVieWAgZXhlY3V0YWJsZScsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdydWJ5J1xuICAgIH1cbiAgfSxcblxuICBhY3RpdmF0ZSgpIHtcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1lcmIuZXJiRXhlY3V0YWJsZVBhdGgnLCBlcmJFeGVjdXRhYmxlUGF0aCA9PiB7XG4gICAgICAgIHRoaXMuZXJiUGF0aCA9IGVyYkV4ZWN1dGFibGVQYXRoO1xuICAgICAgfSlcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItZXJiLnRyaW1Nb2RlJywgdHJpbU1vZGUgPT4ge1xuICAgICAgICB0aGlzLnRyaW1Nb2RlID0gdHJpbU1vZGU7XG4gICAgICB9KVxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1lcmIucnVieUV4ZWN1dGFibGVQYXRoJywgcnVieUV4ZWN1dGFibGVQYXRoID0+IHtcbiAgICAgICAgdGhpcy5ydWJ5UGF0aCA9IHJ1YnlFeGVjdXRhYmxlUGF0aDtcbiAgICAgIH0pXG4gICAgKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpIHtcbiAgICBjb25zdCBoZWxwZXJzID0gcmVxdWlyZSgnYXRvbS1saW50ZXInKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0VSQicsXG4gICAgICBncmFtbWFyU2NvcGVzOiBbJ3RleHQuaHRtbC5lcmInLCAndGV4dC5odG1sLnJ1YnknXSxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICBsaW50OiB0ZXh0RWRpdG9yID0+IHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgZmlsZURpciA9IHBhdGguZGlybmFtZShmaWxlUGF0aCk7XG4gICAgICAgIGNvbnN0IHRleHQgPSB0ZXh0RWRpdG9yLmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgZXJiQXJncyA9IFsnLXgnXTtcbiAgICAgICAgY29uc3QgcnVieUFyZ3MgPSBbJy1jJywgJy0nXTtcblxuICAgICAgICBpZiAoIXRleHQpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNwZWNpZnkgdGhlIHRyaW0gbW9kZSwgaWYgbmVlZGVkXG4gICAgICAgIGlmICh0aGlzLnRyaW1Nb2RlICE9PSAnTm9uZScpIHtcbiAgICAgICAgICBlcmJBcmdzLnB1c2goJy1UJywgdGhpcy50cmltTW9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZXJiQXJncy5wdXNoKCctJyk7XG5cbiAgICAgICAgLy8gQ2FsbCBFUkIgdG8gXCJkZS10ZW1wbGF0aXplXCIgdGhlIGNvZGVcbiAgICAgICAgcmV0dXJuIGhlbHBlcnMuZXhlYyh0aGlzLmVyYlBhdGgsIGVyYkFyZ3MsXG4gICAgICAgICAgeyBzdGRpbjogdGV4dCwgY3dkOiBmaWxlRGlyIH1cbiAgICAgICAgKS50aGVuKGVyYk91dCA9PiB7XG4gICAgICAgICAgbGV0IHJ1YnlDb2RlID0gZXJiT3V0O1xuICAgICAgICAgIC8vIERlYWwgd2l0aCB0aGUgPCU9IGZ1bmN0aW9uX3dpdGggdHJhaWxpbmcgYmxvY2sgZG8gJT4gLi4uIDwlIGVuZCAlPlxuICAgICAgICAgIC8vIEZyb20gUnVieSBvbiBSYWlscyBjb2RlXG4gICAgICAgICAgY29uc3Qgc2NvcGVzID0gdGV4dEVkaXRvci5nZXRMYXN0Q3Vyc29yKCkuZ2V0U2NvcGVEZXNjcmlwdG9yKCkuZ2V0U2NvcGVzQXJyYXkoKTtcbiAgICAgICAgICBpZiAoc2NvcGVzLmluZGV4T2YoJ3RleHQuaHRtbC5lcmInKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJ1YnlDb2RlID0gZXJiT3V0LnJlcGxhY2UoL19lcmJvdXQuY29uY2F0XFwoXFwoKC4rP2RvLis/KVxcKS50b19zXFwpL2csICdcXCQxJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFJ1biBSdWJ5IG9uIHRoZSBcImRlLXRlbXBsYXRpemVkXCIgY29kZVxuICAgICAgICAgIGNvbnN0IHJ1YnlQcm9jZXNzT3B0ID0geyBzdGRpbjogcnVieUNvZGUsIHN0cmVhbTogJ3N0ZGVycicgfTtcbiAgICAgICAgICByZXR1cm4gaGVscGVycy5leGVjKHRoaXMucnVieVBhdGgsIHJ1YnlBcmdzLCBydWJ5UHJvY2Vzc09wdCkudGhlbihvdXRwdXQgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVnZXggPSAvLis6KFxcZCspOlxccysoPzouKz8pWyw6XVxccyguKykvZztcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VzID0gW107XG4gICAgICAgICAgICBsZXQgbWF0Y2ggPSByZWdleC5leGVjKG91dHB1dCk7XG4gICAgICAgICAgICB3aGlsZSAobWF0Y2ggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ0Vycm9yJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBtYXRjaFsyXSxcbiAgICAgICAgICAgICAgICBmaWxlUGF0aCxcbiAgICAgICAgICAgICAgICAvLyBCdW1wIGxpbmUgbnVtYmVyIGRvd24gMiBpbnN0ZWFkIG9mIDEgZHVlIHRvIGluc2VydGVkIGV4dHJhIGxpbmVcbiAgICAgICAgICAgICAgICByYW5nZTogaGVscGVycy5yYW5nZUZyb21MaW5lTnVtYmVyKHRleHRFZGl0b3IsIG1hdGNoWzFdIC0gMilcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIG1hdGNoID0gcmVnZXguZXhlYyhvdXRwdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2VzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuIl19
//# sourceURL=/Users/ajenkins/.atom/packages/linter-erb/lib/index.js

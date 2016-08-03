function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _xregexp = require('xregexp');

var _xregexp2 = _interopRequireDefault(_xregexp);

"use babel";

module.exports = {

  name: 'handlebars',

  grammarScopes: ['text.html.handlebars', 'source.hbs', 'source.handlebars'],

  scope: 'file',

  lintOnFly: true,

  regex: (0, _xregexp2['default'])('Parse error on line (?<line>[0-9]+)+:\n' + '[^\n]*\n' + '[^\n]*\n' + '(?<message>.*)'),

  lint: function lint(textEditor) {
    var _this = this;

    return new Promise(function (resolve, reject) {

      messages = [];
      bufferText = textEditor.getText();

      try {
        _handlebars2['default'].precompile(bufferText, {});
      } catch (err) {
        _xregexp2['default'].forEach(err.message, _this.regex, function (match) {
          messages.push({
            type: 'Error',
            text: match.message,
            filePath: textEditor.getPath(),
            range: _this.lineRange(match.line - 1, textEditor)
          });
        });
      }

      resolve(messages);
    });
  },

  lineRange: function lineRange(lineIdx, textEditor) {
    var line = textEditor.getBuffer().lineForRow(lineIdx);
    var pre = String(line.match(/^\s*/));

    return [[lineIdx, pre.length], [lineIdx, line.length]];
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2xpbnRlci1oYW5kbGViYXJzL2xpYi9saW50ZXItaGFuZGxlYmFycy1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztvQkFFaUIsTUFBTTs7OzswQkFDQSxZQUFZOzs7O3VCQUNmLFNBQVM7Ozs7QUFKN0IsV0FBVyxDQUFBOztBQU1YLE1BQU0sQ0FBQyxPQUFPLEdBQUc7O0FBRWYsTUFBSSxFQUFFLFlBQVk7O0FBRWxCLGVBQWEsRUFBRSxDQUFDLHNCQUFzQixFQUFFLFlBQVksRUFBRSxtQkFBbUIsQ0FBQzs7QUFFMUUsT0FBSyxFQUFFLE1BQU07O0FBRWIsV0FBUyxFQUFFLElBQUk7O0FBRWYsT0FBSyxFQUFFLDBCQUNMLHlDQUF5QyxHQUN6QyxVQUFVLEdBQ1YsVUFBVSxHQUNWLGdCQUFnQixDQUNqQjs7QUFFRCxNQUFJLEVBQUEsY0FBQyxVQUFVLEVBQUU7OztBQUVmLFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLOztBQUV0QyxjQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2IsZ0JBQVUsR0FBRyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUE7O0FBRWpDLFVBQUk7QUFDRixnQ0FBVyxVQUFVLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFBO09BRXRDLENBQUMsT0FBTSxHQUFHLEVBQUU7QUFDWCw2QkFBUSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFLLEtBQUssRUFBRSxVQUFDLEtBQUssRUFBSztBQUNsRCxrQkFBUSxDQUFDLElBQUksQ0FBQztBQUNaLGdCQUFJLEVBQUUsT0FBTztBQUNiLGdCQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU87QUFDbkIsb0JBQVEsRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFO0FBQzlCLGlCQUFLLEVBQUUsTUFBSyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsVUFBVSxDQUFDO1dBQ2xELENBQUMsQ0FBQTtTQUNILENBQUMsQ0FBQTtPQUNIOztBQUVELGFBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUNsQixDQUFDLENBQUE7R0FDSDs7QUFFRCxXQUFTLEVBQUEsbUJBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUM3QixRQUFNLElBQUksR0FBRyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3ZELFFBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7O0FBRXRDLFdBQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7R0FDdkQ7Q0FDRixDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2xpbnRlci1oYW5kbGViYXJzL2xpYi9saW50ZXItaGFuZGxlYmFycy1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCJcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBIYW5kbGViYXJzIGZyb20gJ2hhbmRsZWJhcnMnXG5pbXBvcnQgWFJlZ0V4cCBmcm9tICd4cmVnZXhwJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBuYW1lOiAnaGFuZGxlYmFycycsXG5cbiAgZ3JhbW1hclNjb3BlczogWyd0ZXh0Lmh0bWwuaGFuZGxlYmFycycsICdzb3VyY2UuaGJzJywgJ3NvdXJjZS5oYW5kbGViYXJzJ10sXG5cbiAgc2NvcGU6ICdmaWxlJyxcblxuICBsaW50T25GbHk6IHRydWUsXG5cbiAgcmVnZXg6IFhSZWdFeHAoXG4gICAgJ1BhcnNlIGVycm9yIG9uIGxpbmUgKD88bGluZT5bMC05XSspKzpcXG4nICtcbiAgICAnW15cXG5dKlxcbicgK1xuICAgICdbXlxcbl0qXFxuJyArXG4gICAgJyg/PG1lc3NhZ2U+LiopJ1xuICApLFxuXG4gIGxpbnQodGV4dEVkaXRvcikge1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgbWVzc2FnZXMgPSBbXVxuICAgICAgYnVmZmVyVGV4dCA9IHRleHRFZGl0b3IuZ2V0VGV4dCgpXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIEhhbmRsZWJhcnMucHJlY29tcGlsZShidWZmZXJUZXh0LCB7fSlcblxuICAgICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgWFJlZ0V4cC5mb3JFYWNoKGVyci5tZXNzYWdlLCB0aGlzLnJlZ2V4LCAobWF0Y2gpID0+IHtcbiAgICAgICAgICBtZXNzYWdlcy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgICAgICB0ZXh0OiBtYXRjaC5tZXNzYWdlLFxuICAgICAgICAgICAgZmlsZVBhdGg6IHRleHRFZGl0b3IuZ2V0UGF0aCgpLFxuICAgICAgICAgICAgcmFuZ2U6IHRoaXMubGluZVJhbmdlKG1hdGNoLmxpbmUgLSAxLCB0ZXh0RWRpdG9yKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHJlc29sdmUobWVzc2FnZXMpXG4gICAgfSlcbiAgfSxcblxuICBsaW5lUmFuZ2UobGluZUlkeCwgdGV4dEVkaXRvcikge1xuICAgIGNvbnN0IGxpbmUgPSB0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpLmxpbmVGb3JSb3cobGluZUlkeClcbiAgICBjb25zdCBwcmUgPSBTdHJpbmcobGluZS5tYXRjaCgvXlxccyovKSlcblxuICAgIHJldHVybiBbW2xpbmVJZHgsIHByZS5sZW5ndGhdLCBbbGluZUlkeCwgbGluZS5sZW5ndGhdXVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/linter-handlebars/lib/linter-handlebars-provider.js

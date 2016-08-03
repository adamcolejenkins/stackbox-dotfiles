Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';
'use strict';

var utils = {
  getDB: function getDB() {
    // db.updateFilepath(utils.dbPath());
    // spyOn(db, 'readFile').andCallFake((callback) => {
    //   const props = {
    //     test: {
    //       _id: 'test',
    //       title: 'Test',
    //       paths: ['/Users/test'],
    //       icon: 'icon-test',
    //     }
    //   };
    //
    //   callback(props);
    // });

    // return db;
  },

  dbPath: function dbPath() {
    var specPath = _path2['default'].join(__dirname, 'db');
    var id = utils.id();

    return specPath + '/' + id + '.cson';
  },

  id: function id() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
};

exports['default'] = utils;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvc3BlYy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBR2lCLE1BQU07Ozs7QUFIdkIsV0FBVyxDQUFDO0FBQ1osWUFBWSxDQUFDOztBQUliLElBQU0sS0FBSyxHQUFHO0FBQ1osT0FBSyxFQUFFLGlCQUFXOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JqQjs7QUFFRCxRQUFNLEVBQUUsa0JBQVc7QUFDakIsUUFBTSxRQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM1QyxRQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUM7O0FBRXRCLFdBQVUsUUFBUSxTQUFJLEVBQUUsV0FBUTtHQUNqQzs7QUFFRCxJQUFFLEVBQUUsY0FBVztBQUNiLFdBQU8sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztHQUN0RDtDQUNGLENBQUM7O3FCQUVhLEtBQUsiLCJmaWxlIjoiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9zcGVjL3V0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCB1dGlscyA9IHtcbiAgZ2V0REI6IGZ1bmN0aW9uKCkge1xuICAgIC8vIGRiLnVwZGF0ZUZpbGVwYXRoKHV0aWxzLmRiUGF0aCgpKTtcbiAgICAvLyBzcHlPbihkYiwgJ3JlYWRGaWxlJykuYW5kQ2FsbEZha2UoKGNhbGxiYWNrKSA9PiB7XG4gICAgLy8gICBjb25zdCBwcm9wcyA9IHtcbiAgICAvLyAgICAgdGVzdDoge1xuICAgIC8vICAgICAgIF9pZDogJ3Rlc3QnLFxuICAgIC8vICAgICAgIHRpdGxlOiAnVGVzdCcsXG4gICAgLy8gICAgICAgcGF0aHM6IFsnL1VzZXJzL3Rlc3QnXSxcbiAgICAvLyAgICAgICBpY29uOiAnaWNvbi10ZXN0JyxcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfTtcbiAgICAvL1xuICAgIC8vICAgY2FsbGJhY2socHJvcHMpO1xuICAgIC8vIH0pO1xuXG4gICAgLy8gcmV0dXJuIGRiO1xuICB9LFxuXG4gIGRiUGF0aDogZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3BlY1BhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZGInKTtcbiAgICBjb25zdCBpZCA9IHV0aWxzLmlkKCk7XG5cbiAgICByZXR1cm4gYCR7c3BlY1BhdGh9LyR7aWR9LmNzb25gO1xuICB9LFxuXG4gIGlkOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJ18nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDkpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB1dGlscztcbiJdfQ==
//# sourceURL=/Users/ajenkins/.atom/packages/project-manager/spec/utils.js

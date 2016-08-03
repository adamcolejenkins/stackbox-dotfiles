(function() {
  "use strict";
  var Beautifier, MarkoBeautifier,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = MarkoBeautifier = (function(_super) {
    __extends(MarkoBeautifier, _super);

    function MarkoBeautifier() {
      return MarkoBeautifier.__super__.constructor.apply(this, arguments);
    }

    MarkoBeautifier.prototype.name = 'Marko Beautifier';

    MarkoBeautifier.prototype.options = {
      Marko: true
    };

    MarkoBeautifier.prototype.beautify = function(text, language, options, context) {
      return new this.Promise(function(resolve, reject) {
        var error, i, indent, indent_char, indent_size, markoPrettyprint, prettyprintOptions, _i, _ref;
        markoPrettyprint = require('marko-prettyprint');
        indent_char = options.indent_char || ' ';
        indent_size = options.indent_size || 4;
        indent = '';
        for (i = _i = 0, _ref = indent_size - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          indent += indent_char;
        }
        prettyprintOptions = {
          syntax: options.syntax,
          filename: (context != null) && (context.filePath != null) ? context.filePath : require.resolve('marko-prettyprint'),
          indent: indent
        };
        try {
          return resolve(markoPrettyprint(text, prettyprintOptions));
        } catch (_error) {
          error = _error;
          return reject(error);
        }
      });
    };

    return MarkoBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL21hcmtvLWJlYXV0aWZpZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEsMkJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUVyQixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsOEJBQUEsSUFBQSxHQUFNLGtCQUFOLENBQUE7O0FBQUEsOEJBRUEsT0FBQSxHQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sSUFBUDtLQUhGLENBQUE7O0FBQUEsOEJBS0EsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsRUFBMEIsT0FBMUIsR0FBQTtBQUVSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNsQixZQUFBLDBGQUFBO0FBQUEsUUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsbUJBQVIsQ0FBbkIsQ0FBQTtBQUFBLFFBRUEsV0FBQSxHQUFjLE9BQU8sQ0FBQyxXQUFSLElBQXVCLEdBRnJDLENBQUE7QUFBQSxRQUdBLFdBQUEsR0FBYyxPQUFPLENBQUMsV0FBUixJQUF1QixDQUhyQyxDQUFBO0FBQUEsUUFLQSxNQUFBLEdBQVMsRUFMVCxDQUFBO0FBT0EsYUFBUyxvR0FBVCxHQUFBO0FBQ0UsVUFBQSxNQUFBLElBQVUsV0FBVixDQURGO0FBQUEsU0FQQTtBQUFBLFFBVUEsa0JBQUEsR0FDRTtBQUFBLFVBQUEsTUFBQSxFQUFTLE9BQU8sQ0FBQyxNQUFqQjtBQUFBLFVBQ0EsUUFBQSxFQUFhLGlCQUFBLElBQWEsMEJBQWhCLEdBQXVDLE9BQU8sQ0FBQyxRQUEvQyxHQUE2RCxPQUFPLENBQUMsT0FBUixDQUFnQixtQkFBaEIsQ0FEdkU7QUFBQSxVQUVBLE1BQUEsRUFBUSxNQUZSO1NBWEYsQ0FBQTtBQWVBO2lCQUNFLE9BQUEsQ0FBUSxnQkFBQSxDQUFpQixJQUFqQixFQUF1QixrQkFBdkIsQ0FBUixFQURGO1NBQUEsY0FBQTtBQUlFLFVBRkksY0FFSixDQUFBO2lCQUFBLE1BQUEsQ0FBTyxLQUFQLEVBSkY7U0FoQmtCO01BQUEsQ0FBVCxDQUFYLENBRlE7SUFBQSxDQUxWLENBQUE7OzJCQUFBOztLQUY2QyxXQUgvQyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/marko-beautifier.coffee

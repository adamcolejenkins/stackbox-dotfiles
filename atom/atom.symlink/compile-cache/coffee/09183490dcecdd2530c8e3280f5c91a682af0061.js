
/*
Requires https://github.com/avh4/elm-format
 */

(function() {
  "use strict";
  var Beautifier, ElmFormat,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = ElmFormat = (function(_super) {
    __extends(ElmFormat, _super);

    function ElmFormat() {
      return ElmFormat.__super__.constructor.apply(this, arguments);
    }

    ElmFormat.prototype.name = "elm-format";

    ElmFormat.prototype.options = {
      Elm: true
    };

    ElmFormat.prototype.beautify = function(text, language, options) {
      var tempfile;
      return tempfile = this.tempFile("input", text, ".elm").then((function(_this) {
        return function(name) {
          return _this.run("elm-format", ['--yes', name], {
            help: {
              link: 'https://github.com/avh4/elm-format'
            }
          }).then(function() {
            return _this.readFile(name);
          });
        };
      })(this));
    };

    return ElmFormat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL2VsbS1mb3JtYXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUdBLFlBSEEsQ0FBQTtBQUFBLE1BQUEscUJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUpiLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixnQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsd0JBQUEsSUFBQSxHQUFNLFlBQU4sQ0FBQTs7QUFBQSx3QkFFQSxPQUFBLEdBQVM7QUFBQSxNQUNQLEdBQUEsRUFBSyxJQURFO0tBRlQsQ0FBQTs7QUFBQSx3QkFNQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBQ1IsVUFBQSxRQUFBO2FBQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixFQUF5QixNQUF6QixDQUNYLENBQUMsSUFEVSxDQUNMLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtpQkFDSixLQUFDLENBQUEsR0FBRCxDQUFLLFlBQUwsRUFBbUIsQ0FDakIsT0FEaUIsRUFFakIsSUFGaUIsQ0FBbkIsRUFJRTtBQUFBLFlBQUUsSUFBQSxFQUFNO0FBQUEsY0FBRSxJQUFBLEVBQU0sb0NBQVI7YUFBUjtXQUpGLENBTUEsQ0FBQyxJQU5ELENBTU0sU0FBQSxHQUFBO21CQUNKLEtBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixFQURJO1VBQUEsQ0FOTixFQURJO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FESyxFQURIO0lBQUEsQ0FOVixDQUFBOztxQkFBQTs7S0FEdUMsV0FOekMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/elm-format.coffee

(function() {
  "use strict";
  var Beautifier, PugBeautify,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = PugBeautify = (function(_super) {
    __extends(PugBeautify, _super);

    function PugBeautify() {
      return PugBeautify.__super__.constructor.apply(this, arguments);
    }

    PugBeautify.prototype.name = "Pug Beautify";

    PugBeautify.prototype.options = {
      Jade: {
        fill_tab: [
          'indent_char', function(indent_char) {
            return indent_char === "\t";
          }
        ],
        omit_div: true,
        tab_size: "indent_size"
      }
    };

    PugBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var error, pugBeautify;
        pugBeautify = require("pug-beautify");
        try {
          return resolve(pugBeautify(text, options));
        } catch (_error) {
          error = _error;
          return reject(error);
        }
      });
    };

    return PugBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3B1Zy1iZWF1dGlmeS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSx1QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLGtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwwQkFBQSxJQUFBLEdBQU0sY0FBTixDQUFBOztBQUFBLDBCQUNBLE9BQUEsR0FBUztBQUFBLE1BRVAsSUFBQSxFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVU7VUFBQyxhQUFELEVBQWdCLFNBQUMsV0FBRCxHQUFBO0FBRXhCLG1CQUFRLFdBQUEsS0FBZSxJQUF2QixDQUZ3QjtVQUFBLENBQWhCO1NBQVY7QUFBQSxRQUlBLFFBQUEsRUFBVSxJQUpWO0FBQUEsUUFLQSxRQUFBLEVBQVUsYUFMVjtPQUhLO0tBRFQsQ0FBQTs7QUFBQSwwQkFZQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBRVIsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBQ2xCLFlBQUEsa0JBQUE7QUFBQSxRQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsY0FBUixDQUFkLENBQUE7QUFDQTtpQkFDRSxPQUFBLENBQVEsV0FBQSxDQUFZLElBQVosRUFBa0IsT0FBbEIsQ0FBUixFQURGO1NBQUEsY0FBQTtBQUlFLFVBRkksY0FFSixDQUFBO2lCQUFBLE1BQUEsQ0FBTyxLQUFQLEVBSkY7U0FGa0I7TUFBQSxDQUFULENBQVgsQ0FGUTtJQUFBLENBWlYsQ0FBQTs7dUJBQUE7O0tBRHlDLFdBSDNDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/pug-beautify.coffee

(function() {
  "use strict";
  var Beautifier, CoffeeFormatter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = CoffeeFormatter = (function(_super) {
    __extends(CoffeeFormatter, _super);

    function CoffeeFormatter() {
      return CoffeeFormatter.__super__.constructor.apply(this, arguments);
    }

    CoffeeFormatter.prototype.name = "Coffee Formatter";

    CoffeeFormatter.prototype.options = {
      CoffeeScript: true
    };

    CoffeeFormatter.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var CF, curr, i, len, lines, p, result, resultArr;
        CF = require("coffee-formatter");
        lines = text.split("\n");
        resultArr = [];
        i = 0;
        len = lines.length;
        while (i < len) {
          curr = lines[i];
          p = CF.formatTwoSpaceOperator(curr);
          p = CF.formatOneSpaceOperator(p);
          p = CF.shortenSpaces(p);
          resultArr.push(p);
          i++;
        }
        result = resultArr.join("\n");
        return resolve(result);
      });
    };

    return CoffeeFormatter;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL2NvZmZlZS1mb3JtYXR0ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEsMkJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUVyQixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsOEJBQUEsSUFBQSxHQUFNLGtCQUFOLENBQUE7O0FBQUEsOEJBRUEsT0FBQSxHQUFTO0FBQUEsTUFDUCxZQUFBLEVBQWMsSUFEUDtLQUZULENBQUE7O0FBQUEsOEJBTUEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUVSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUVsQixZQUFBLDZDQUFBO0FBQUEsUUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLGtCQUFSLENBQUwsQ0FBQTtBQUFBLFFBQ0EsS0FBQSxHQUFRLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxDQURSLENBQUE7QUFBQSxRQUVBLFNBQUEsR0FBWSxFQUZaLENBQUE7QUFBQSxRQUdBLENBQUEsR0FBSSxDQUhKLENBQUE7QUFBQSxRQUlBLEdBQUEsR0FBTSxLQUFLLENBQUMsTUFKWixDQUFBO0FBTUEsZUFBTSxDQUFBLEdBQUksR0FBVixHQUFBO0FBQ0UsVUFBQSxJQUFBLEdBQU8sS0FBTSxDQUFBLENBQUEsQ0FBYixDQUFBO0FBQUEsVUFDQSxDQUFBLEdBQUksRUFBRSxDQUFDLHNCQUFILENBQTBCLElBQTFCLENBREosQ0FBQTtBQUFBLFVBRUEsQ0FBQSxHQUFJLEVBQUUsQ0FBQyxzQkFBSCxDQUEwQixDQUExQixDQUZKLENBQUE7QUFBQSxVQUdBLENBQUEsR0FBSSxFQUFFLENBQUMsYUFBSCxDQUFpQixDQUFqQixDQUhKLENBQUE7QUFBQSxVQUlBLFNBQVMsQ0FBQyxJQUFWLENBQWUsQ0FBZixDQUpBLENBQUE7QUFBQSxVQUtBLENBQUEsRUFMQSxDQURGO1FBQUEsQ0FOQTtBQUFBLFFBYUEsTUFBQSxHQUFTLFNBQVMsQ0FBQyxJQUFWLENBQWUsSUFBZixDQWJULENBQUE7ZUFjQSxPQUFBLENBQVEsTUFBUixFQWhCa0I7TUFBQSxDQUFULENBQVgsQ0FGUTtJQUFBLENBTlYsQ0FBQTs7MkJBQUE7O0tBRjZDLFdBSC9DLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/coffee-formatter.coffee

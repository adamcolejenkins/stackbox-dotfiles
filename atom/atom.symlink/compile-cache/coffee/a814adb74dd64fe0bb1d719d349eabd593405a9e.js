(function() {
  "use strict";
  var Beautifier, CoffeeFmt,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = CoffeeFmt = (function(_super) {
    __extends(CoffeeFmt, _super);

    function CoffeeFmt() {
      return CoffeeFmt.__super__.constructor.apply(this, arguments);
    }

    CoffeeFmt.prototype.name = "coffee-fmt";

    CoffeeFmt.prototype.options = {
      CoffeeScript: {
        tab: [
          "indent_size", "indent_char", "indent_with_tabs", function(indentSize, indentChar, indentWithTabs) {
            if (indentWithTabs) {
              return "\t";
            }
            return Array(indentSize + 1).join(indentChar);
          }
        ]
      }
    };

    CoffeeFmt.prototype.beautify = function(text, language, options) {
      this.verbose('beautify', language, options);
      return new this.Promise(function(resolve, reject) {
        var e, fmt, results;
        options.newLine = "\n";
        fmt = require('coffee-fmt');
        try {
          results = fmt.format(text, options);
          return resolve(results);
        } catch (_error) {
          e = _error;
          return reject(e);
        }
      });
    };

    return CoffeeFmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL2NvZmZlZS1mbXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEscUJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixnQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsd0JBQUEsSUFBQSxHQUFNLFlBQU4sQ0FBQTs7QUFBQSx3QkFFQSxPQUFBLEdBQVM7QUFBQSxNQUVQLFlBQUEsRUFDRTtBQUFBLFFBQUEsR0FBQSxFQUFLO1VBQUMsYUFBRCxFQUNILGFBREcsRUFDWSxrQkFEWixFQUVILFNBQUMsVUFBRCxFQUFhLFVBQWIsRUFBeUIsY0FBekIsR0FBQTtBQUNFLFlBQUEsSUFBZSxjQUFmO0FBQUEscUJBQU8sSUFBUCxDQUFBO2FBQUE7bUJBQ0EsS0FBQSxDQUFNLFVBQUEsR0FBVyxDQUFqQixDQUFtQixDQUFDLElBQXBCLENBQXlCLFVBQXpCLEVBRkY7VUFBQSxDQUZHO1NBQUw7T0FISztLQUZULENBQUE7O0FBQUEsd0JBYUEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxVQUFULEVBQXFCLFFBQXJCLEVBQStCLE9BQS9CLENBQUEsQ0FBQTtBQUNBLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUVsQixZQUFBLGVBQUE7QUFBQSxRQUFBLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLElBQWxCLENBQUE7QUFBQSxRQUVBLEdBQUEsR0FBTSxPQUFBLENBQVEsWUFBUixDQUZOLENBQUE7QUFJQTtBQUNFLFVBQUEsT0FBQSxHQUFVLEdBQUcsQ0FBQyxNQUFKLENBQVcsSUFBWCxFQUFpQixPQUFqQixDQUFWLENBQUE7aUJBRUEsT0FBQSxDQUFRLE9BQVIsRUFIRjtTQUFBLGNBQUE7QUFLRSxVQURJLFVBQ0osQ0FBQTtpQkFBQSxNQUFBLENBQU8sQ0FBUCxFQUxGO1NBTmtCO01BQUEsQ0FBVCxDQUFYLENBRlE7SUFBQSxDQWJWLENBQUE7O3FCQUFBOztLQUR1QyxXQUh6QyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/coffee-fmt.coffee


/*
Requires [perltidy](http://perltidy.sourceforge.net)
 */

(function() {
  "use strict";
  var Beautifier, PerlTidy,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = PerlTidy = (function(_super) {
    __extends(PerlTidy, _super);

    function PerlTidy() {
      return PerlTidy.__super__.constructor.apply(this, arguments);
    }

    PerlTidy.prototype.name = "Perltidy";

    PerlTidy.prototype.options = {
      Perl: true
    };

    PerlTidy.prototype.cli = function(options) {
      if (options.perltidy_path == null) {
        return new Error("'Perl Perltidy Path' not set!" + " Please set this in the Atom Beautify package settings.");
      } else {
        return options.perltidy_path;
      }
    };

    PerlTidy.prototype.beautify = function(text, language, options) {
      var _ref;
      return this.run("perltidy", ['--standard-output', '--standard-error-output', '--quiet', ((_ref = options.perltidy_profile) != null ? _ref.length : void 0) ? "--profile=" + options.perltidy_profile : void 0, this.tempFile("input", text)], {
        help: {
          link: "http://perltidy.sourceforge.net/"
        }
      });
    };

    return PerlTidy;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3Blcmx0aWR5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7O0dBQUE7QUFBQTtBQUFBO0FBQUEsRUFHQSxZQUhBLENBQUE7QUFBQSxNQUFBLG9CQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FKYixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHVCQUFBLElBQUEsR0FBTSxVQUFOLENBQUE7O0FBQUEsdUJBRUEsT0FBQSxHQUFTO0FBQUEsTUFDUCxJQUFBLEVBQU0sSUFEQztLQUZULENBQUE7O0FBQUEsdUJBTUEsR0FBQSxHQUFLLFNBQUMsT0FBRCxHQUFBO0FBQ0gsTUFBQSxJQUFPLDZCQUFQO0FBQ0UsZUFBVyxJQUFBLEtBQUEsQ0FBTSwrQkFBQSxHQUNmLHlEQURTLENBQVgsQ0FERjtPQUFBLE1BQUE7QUFJRSxlQUFPLE9BQU8sQ0FBQyxhQUFmLENBSkY7T0FERztJQUFBLENBTkwsQ0FBQTs7QUFBQSx1QkFhQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBQ1IsVUFBQSxJQUFBO2FBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxVQUFMLEVBQWlCLENBQ2YsbUJBRGUsRUFFZix5QkFGZSxFQUdmLFNBSGUsbURBSW9ELENBQUUsZ0JBQXJFLEdBQUMsWUFBQSxHQUFZLE9BQU8sQ0FBQyxnQkFBckIsR0FBQSxNQUplLEVBS2YsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBTGUsQ0FBakIsRUFNSztBQUFBLFFBQUEsSUFBQSxFQUFNO0FBQUEsVUFDUCxJQUFBLEVBQU0sa0NBREM7U0FBTjtPQU5MLEVBRFE7SUFBQSxDQWJWLENBQUE7O29CQUFBOztLQURzQyxXQU54QyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/perltidy.coffee

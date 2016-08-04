(function() {
  "use strict";
  var Beautifier, Remark,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = Remark = (function(_super) {
    __extends(Remark, _super);

    function Remark() {
      return Remark.__super__.constructor.apply(this, arguments);
    }

    Remark.prototype.name = "Remark";

    Remark.prototype.options = {
      _: {
        gfm: true,
        yaml: true,
        commonmark: true,
        footnotes: true,
        pedantic: true,
        breaks: true,
        entities: true,
        setext: true,
        closeAtx: true,
        looseTable: true,
        spacedTable: true,
        fence: true,
        fences: true,
        bullet: true,
        listItemIndent: true,
        incrementListMarker: true,
        rule: true,
        ruleRepetition: true,
        ruleSpaces: true,
        strong: true,
        emphasis: true,
        position: true
      },
      Markdown: true
    };

    Remark.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var cleanMarkdown, err, remark;
        try {
          remark = require('remark');
          cleanMarkdown = remark.process(text, options);
          return resolve(cleanMarkdown);
        } catch (_error) {
          err = _error;
          this.error("Remark error: " + err);
          return reject(err);
        }
      });
    };

    return Remark;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3JlbWFyay5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSxrQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLDZCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxxQkFBQSxJQUFBLEdBQU0sUUFBTixDQUFBOztBQUFBLHFCQUNBLE9BQUEsR0FBUztBQUFBLE1BQ1AsQ0FBQSxFQUFHO0FBQUEsUUFDRCxHQUFBLEVBQUssSUFESjtBQUFBLFFBRUQsSUFBQSxFQUFNLElBRkw7QUFBQSxRQUdELFVBQUEsRUFBWSxJQUhYO0FBQUEsUUFJRCxTQUFBLEVBQVcsSUFKVjtBQUFBLFFBS0QsUUFBQSxFQUFVLElBTFQ7QUFBQSxRQU1ELE1BQUEsRUFBUSxJQU5QO0FBQUEsUUFPRCxRQUFBLEVBQVUsSUFQVDtBQUFBLFFBUUQsTUFBQSxFQUFRLElBUlA7QUFBQSxRQVNELFFBQUEsRUFBVSxJQVRUO0FBQUEsUUFVRCxVQUFBLEVBQVksSUFWWDtBQUFBLFFBV0QsV0FBQSxFQUFhLElBWFo7QUFBQSxRQVlELEtBQUEsRUFBTyxJQVpOO0FBQUEsUUFhRCxNQUFBLEVBQVEsSUFiUDtBQUFBLFFBY0QsTUFBQSxFQUFRLElBZFA7QUFBQSxRQWVELGNBQUEsRUFBZ0IsSUFmZjtBQUFBLFFBZ0JELG1CQUFBLEVBQXFCLElBaEJwQjtBQUFBLFFBaUJELElBQUEsRUFBTSxJQWpCTDtBQUFBLFFBa0JELGNBQUEsRUFBZ0IsSUFsQmY7QUFBQSxRQW1CRCxVQUFBLEVBQVksSUFuQlg7QUFBQSxRQW9CRCxNQUFBLEVBQVEsSUFwQlA7QUFBQSxRQXFCRCxRQUFBLEVBQVUsSUFyQlQ7QUFBQSxRQXNCRCxRQUFBLEVBQVUsSUF0QlQ7T0FESTtBQUFBLE1BeUJQLFFBQUEsRUFBVSxJQXpCSDtLQURULENBQUE7O0FBQUEscUJBNkJBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFDUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDbEIsWUFBQSwwQkFBQTtBQUFBO0FBQ0UsVUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FBVCxDQUFBO0FBQUEsVUFDQSxhQUFBLEdBQWdCLE1BQU0sQ0FBQyxPQUFQLENBQWUsSUFBZixFQUFxQixPQUFyQixDQURoQixDQUFBO2lCQUVBLE9BQUEsQ0FBUSxhQUFSLEVBSEY7U0FBQSxjQUFBO0FBS0UsVUFESSxZQUNKLENBQUE7QUFBQSxVQUFBLElBQUMsQ0FBQSxLQUFELENBQVEsZ0JBQUEsR0FBZ0IsR0FBeEIsQ0FBQSxDQUFBO2lCQUNBLE1BQUEsQ0FBTyxHQUFQLEVBTkY7U0FEa0I7TUFBQSxDQUFULENBQVgsQ0FEUTtJQUFBLENBN0JWLENBQUE7O2tCQUFBOztLQURvQyxXQUh0QyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/remark.coffee

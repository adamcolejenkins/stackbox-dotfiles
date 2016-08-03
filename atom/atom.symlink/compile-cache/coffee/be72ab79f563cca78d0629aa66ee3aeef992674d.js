
/*
 */

(function() {
  "use strict";
  var Beautifier, Gherkin, Lexer, logger,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  Lexer = require('gherkin').Lexer('en');

  logger = require('../logger')(__filename);

  module.exports = Gherkin = (function(_super) {
    __extends(Gherkin, _super);

    function Gherkin() {
      return Gherkin.__super__.constructor.apply(this, arguments);
    }

    Gherkin.prototype.name = "Gherkin formatter";

    Gherkin.prototype.options = {
      gherkin: true
    };

    Gherkin.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var lexer, line, loggerLevel, recorder, _i, _len, _ref;
        recorder = {
          lines: [],
          tags: [],
          comments: [],
          last_obj: null,
          indent_to: function(indent_level) {
            if (indent_level == null) {
              indent_level = 0;
            }
            return options.indent_char.repeat(options.indent_size * indent_level);
          },
          write_blank: function() {
            return this.lines.push('');
          },
          write_indented: function(content, indent) {
            var line, _i, _len, _ref, _results;
            if (indent == null) {
              indent = 0;
            }
            _ref = content.trim().split("\n");
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              line = _ref[_i];
              _results.push(this.lines.push("" + (this.indent_to(indent)) + (line.trim())));
            }
            return _results;
          },
          write_comments: function(indent) {
            var comment, _i, _len, _ref, _results;
            if (indent == null) {
              indent = 0;
            }
            _ref = this.comments.splice(0, this.comments.length);
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              comment = _ref[_i];
              _results.push(this.write_indented(comment, indent));
            }
            return _results;
          },
          write_tags: function(indent) {
            if (indent == null) {
              indent = 0;
            }
            if (this.tags.length > 0) {
              return this.write_indented(this.tags.splice(0, this.tags.length).join(' '), indent);
            }
          },
          comment: function(value, line) {
            logger.verbose({
              token: 'comment',
              value: value.trim(),
              line: line
            });
            return this.comments.push(value);
          },
          tag: function(value, line) {
            logger.verbose({
              token: 'tag',
              value: value,
              line: line
            });
            return this.tags.push(value);
          },
          feature: function(keyword, name, description, line) {
            logger.verbose({
              token: 'feature',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_comments(0);
            this.write_tags(0);
            this.write_indented("" + keyword + ": " + name, '');
            if (description) {
              return this.write_indented(description, 1);
            }
          },
          background: function(keyword, name, description, line) {
            logger.verbose({
              token: 'background',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_indented("" + keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          scenario: function(keyword, name, description, line) {
            logger.verbose({
              token: 'scenario',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_tags(1);
            this.write_indented("" + keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          scenario_outline: function(keyword, name, description, line) {
            logger.verbose({
              token: 'outline',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_tags(1);
            this.write_indented("" + keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          examples: function(keyword, name, description, line) {
            logger.verbose({
              token: 'examples',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(2);
            this.write_tags(2);
            this.write_indented("" + keyword + ": " + name, 2);
            if (description) {
              return this.write_indented(description, 3);
            }
          },
          step: function(keyword, name, line) {
            logger.verbose({
              token: 'step',
              keyword: keyword,
              name: name,
              line: line
            });
            this.write_comments(2);
            return this.write_indented("" + keyword + name, 2);
          },
          doc_string: function(content_type, string, line) {
            var three_quotes;
            logger.verbose({
              token: 'doc_string',
              content_type: content_type,
              string: string,
              line: line
            });
            three_quotes = '"""';
            this.write_comments(2);
            return this.write_indented("" + three_quotes + content_type + "\n" + string + "\n" + three_quotes, 3);
          },
          row: function(cells, line) {
            logger.verbose({
              token: 'row',
              cells: cells,
              line: line
            });
            this.write_comments(3);
            return this.write_indented("| " + (cells.join(' | ')) + " |", 3);
          },
          eof: function() {
            logger.verbose({
              token: 'eof'
            });
            return this.write_comments(2);
          }
        };
        lexer = new Lexer(recorder);
        lexer.scan(text);
        loggerLevel = typeof atom !== "undefined" && atom !== null ? atom.config.get('atom-beautify.general.loggerLevel') : void 0;
        if (loggerLevel === 'verbose') {
          _ref = recorder.lines;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            line = _ref[_i];
            logger.verbose("> " + line);
          }
        }
        return resolve(recorder.lines.join("\n"));
      });
    };

    return Gherkin;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL2doZXJraW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTtHQUFBO0FBQUE7QUFBQTtBQUFBLEVBR0EsWUFIQSxDQUFBO0FBQUEsTUFBQSxrQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBSmIsQ0FBQTs7QUFBQSxFQUtBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQUFrQixDQUFDLEtBQW5CLENBQXlCLElBQXpCLENBTFIsQ0FBQTs7QUFBQSxFQU1BLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUixDQUFBLENBQXFCLFVBQXJCLENBTlQsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLDhCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxzQkFBQSxJQUFBLEdBQU0sbUJBQU4sQ0FBQTs7QUFBQSxzQkFFQSxPQUFBLEdBQVM7QUFBQSxNQUNQLE9BQUEsRUFBUyxJQURGO0tBRlQsQ0FBQTs7QUFBQSxzQkFNQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBQ1IsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBQ2xCLFlBQUEsa0RBQUE7QUFBQSxRQUFBLFFBQUEsR0FBVztBQUFBLFVBQ1QsS0FBQSxFQUFPLEVBREU7QUFBQSxVQUVULElBQUEsRUFBTSxFQUZHO0FBQUEsVUFHVCxRQUFBLEVBQVUsRUFIRDtBQUFBLFVBS1QsUUFBQSxFQUFVLElBTEQ7QUFBQSxVQU9ULFNBQUEsRUFBVyxTQUFDLFlBQUQsR0FBQTs7Y0FBQyxlQUFlO2FBQ3pCO0FBQUEs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

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/gherkin.coffee

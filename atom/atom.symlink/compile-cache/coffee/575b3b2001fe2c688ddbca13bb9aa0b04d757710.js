(function() {
  "use strict";
  var Beautifier, PrettyDiff,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = PrettyDiff = (function(_super) {
    __extends(PrettyDiff, _super);

    function PrettyDiff() {
      return PrettyDiff.__super__.constructor.apply(this, arguments);
    }

    PrettyDiff.prototype.name = "Pretty Diff";

    PrettyDiff.prototype.options = {
      _: {
        inchar: [
          "indent_with_tabs", "indent_char", function(indent_with_tabs, indent_char) {
            if (indent_with_tabs === true) {
              return "\t";
            } else {
              return indent_char;
            }
          }
        ],
        insize: [
          "indent_with_tabs", "indent_size", function(indent_with_tabs, indent_size) {
            if (indent_with_tabs === true) {
              return 1;
            } else {
              return indent_size;
            }
          }
        ],
        objsort: function(objsort) {
          return objsort || false;
        },
        preserve: [
          'preserve_newlines', function(preserve_newlines) {
            if (preserve_newlines === true) {
              return "all";
            } else {
              return "none";
            }
          }
        ],
        cssinsertlines: "newline_between_rules",
        comments: [
          "indent_comments", function(indent_comments) {
            if (indent_comments === false) {
              return "noindent";
            } else {
              return "indent";
            }
          }
        ],
        force: "force_indentation",
        quoteConvert: "convert_quotes",
        vertical: [
          'align_assignments', function(align_assignments) {
            if (align_assignments === true) {
              return "all";
            } else {
              return "none";
            }
          }
        ],
        wrap: "wrap_line_length",
        space: "space_after_anon_function",
        noleadzero: "no_lead_zero",
        endcomma: "end_with_comma",
        methodchain: [
          'break_chained_methods', function(break_chained_methods) {
            if (break_chained_methods === true) {
              return false;
            } else {
              return true;
            }
          }
        ],
        ternaryline: "preserve_ternary_lines"
      },
      CSV: true,
      Coldfusion: true,
      ERB: true,
      EJS: true,
      HTML: true,
      Handlebars: true,
      XML: true,
      SVG: true,
      Spacebars: true,
      JSX: true,
      JavaScript: true,
      CSS: true,
      SCSS: true,
      Sass: true,
      JSON: true,
      TSS: true,
      Twig: true,
      LESS: true,
      Swig: true,
      Visualforce: true,
      "Riot.js": true,
      XTemplate: true
    };

    PrettyDiff.prototype.beautify = function(text, language, options) {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var args, lang, output, prettydiff, result, _;
          prettydiff = require("prettydiff");
          _ = require('lodash');
          lang = "auto";
          switch (language) {
            case "CSV":
              lang = "csv";
              break;
            case "Coldfusion":
              lang = "html";
              break;
            case "EJS":
            case "Twig":
              lang = "ejs";
              break;
            case "ERB":
              lang = "html_ruby";
              break;
            case "Handlebars":
            case "Mustache":
            case "Spacebars":
            case "Swig":
            case "Riot.js":
            case "XTemplate":
              lang = "handlebars";
              break;
            case "SGML":
              lang = "markup";
              break;
            case "XML":
            case "Visualforce":
            case "SVG":
              lang = "xml";
              break;
            case "HTML":
              lang = "html";
              break;
            case "JavaScript":
              lang = "javascript";
              break;
            case "JSON":
              lang = "json";
              break;
            case "JSX":
              lang = "jsx";
              break;
            case "JSTL":
              lang = "jsp";
              break;
            case "CSS":
              lang = "css";
              break;
            case "LESS":
              lang = "less";
              break;
            case "SCSS":
            case "Sass":
              lang = "scss";
              break;
            case "TSS":
              lang = "tss";
              break;
            default:
              lang = "auto";
          }
          args = {
            source: text,
            lang: lang,
            mode: "beautify"
          };
          _.merge(options, args);
          _this.verbose('prettydiff', options);
          output = prettydiff.api(options);
          result = output[0];
          return resolve(result);
        };
      })(this));
    };

    return PrettyDiff;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3ByZXR0eWRpZmYuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEsc0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEseUJBQUEsSUFBQSxHQUFNLGFBQU4sQ0FBQTs7QUFBQSx5QkFDQSxPQUFBLEdBQVM7QUFBQSxNQUVQLENBQUEsRUFDRTtBQUFBLFFBQUEsTUFBQSxFQUFRO1VBQUMsa0JBQUQsRUFBcUIsYUFBckIsRUFBb0MsU0FBQyxnQkFBRCxFQUFtQixXQUFuQixHQUFBO0FBQzFDLFlBQUEsSUFBSSxnQkFBQSxLQUFvQixJQUF4QjtxQkFDRSxLQURGO2FBQUEsTUFBQTtxQkFDWSxZQURaO2FBRDBDO1VBQUEsQ0FBcEM7U0FBUjtBQUFBLFFBSUEsTUFBQSxFQUFRO1VBQUMsa0JBQUQsRUFBcUIsYUFBckIsRUFBb0MsU0FBQyxnQkFBRCxFQUFtQixXQUFuQixHQUFBO0FBQzFDLFlBQUEsSUFBSSxnQkFBQSxLQUFvQixJQUF4QjtxQkFDRSxFQURGO2FBQUEsTUFBQTtxQkFDUyxZQURUO2FBRDBDO1VBQUEsQ0FBcEM7U0FKUjtBQUFBLFFBUUEsT0FBQSxFQUFTLFNBQUMsT0FBRCxHQUFBO2lCQUNQLE9BQUEsSUFBVyxNQURKO1FBQUEsQ0FSVDtBQUFBLFFBVUEsUUFBQSxFQUFVO1VBQUMsbUJBQUQsRUFBc0IsU0FBQyxpQkFBRCxHQUFBO0FBQzlCLFlBQUEsSUFBSSxpQkFBQSxLQUFxQixJQUF6Qjtx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

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/prettydiff.coffee

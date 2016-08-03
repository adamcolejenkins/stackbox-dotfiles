
/*
Requires http://uncrustify.sourceforge.net/
 */

(function() {
  "use strict";
  var Beautifier, Uncrustify, cfg, expandHomeDir, path, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('../beautifier');

  cfg = require("./cfg");

  path = require("path");

  expandHomeDir = require('expand-home-dir');

  _ = require('lodash');

  module.exports = Uncrustify = (function(_super) {
    __extends(Uncrustify, _super);

    function Uncrustify() {
      return Uncrustify.__super__.constructor.apply(this, arguments);
    }

    Uncrustify.prototype.name = "Uncrustify";

    Uncrustify.prototype.options = {
      Apex: true,
      C: true,
      "C++": true,
      "C#": true,
      "Objective-C": true,
      D: true,
      Pawn: true,
      Vala: true,
      Java: true,
      Arduino: true
    };

    Uncrustify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var basePath, configPath, editor;
        configPath = options.configPath;
        if (!configPath) {
          return cfg(options, function(error, cPath) {
            if (error) {
              throw error;
            }
            return resolve(cPath);
          });
        } else {
          editor = atom.workspace.getActiveTextEditor();
          if (editor != null) {
            basePath = path.dirname(editor.getPath());
            configPath = path.resolve(basePath, configPath);
            return resolve(configPath);
          } else {
            return reject(new Error("No Uncrustify Config Path set! Please configure Uncrustify with Atom Beautify."));
          }
        }
      }).then((function(_this) {
        return function(configPath) {
          var lang, outputFile;
          configPath = expandHomeDir(configPath);
          lang = "C";
          switch (language) {
            case "Apex":
              lang = "Apex";
              break;
            case "C":
              lang = "C";
              break;
            case "C++":
              lang = "CPP";
              break;
            case "C#":
              lang = "CS";
              break;
            case "Objective-C":
            case "Objective-C++":
              lang = "OC+";
              break;
            case "D":
              lang = "D";
              break;
            case "Pawn":
              lang = "PAWN";
              break;
            case "Vala":
              lang = "VALA";
              break;
            case "Java":
              lang = "JAVA";
              break;
            case "Arduino":
              lang = "CPP";
          }
          return _this.run("uncrustify", ["-c", configPath, "-f", _this.tempFile("input", text), "-o", outputFile = _this.tempFile("output", text), "-l", lang], {
            help: {
              link: "http://sourceforge.net/projects/uncrustify/"
            }
          }).then(function() {
            return _this.readFile(outputFile);
          });
        };
      })(this));
    };

    return Uncrustify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3VuY3J1c3RpZnkvaW5kZXguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUdBLFlBSEEsQ0FBQTtBQUFBLE1BQUEsbURBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUpiLENBQUE7O0FBQUEsRUFLQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVIsQ0FMTixDQUFBOztBQUFBLEVBTUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTlAsQ0FBQTs7QUFBQSxFQU9BLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGlCQUFSLENBUGhCLENBQUE7O0FBQUEsRUFRQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FSSixDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLElBQUEsR0FBTSxZQUFOLENBQUE7O0FBQUEseUJBQ0EsT0FBQSxHQUFTO0FBQUEsTUFDUCxJQUFBLEVBQU0sSUFEQztBQUFBLE1BRVAsQ0FBQSxFQUFHLElBRkk7QUFBQSxNQUdQLEtBQUEsRUFBTyxJQUhBO0FBQUEsTUFJUCxJQUFBLEVBQU0sSUFKQztBQUFBLE1BS1AsYUFBQSxFQUFlLElBTFI7QUFBQSxNQU1QLENBQUEsRUFBRyxJQU5JO0FBQUEsTUFPUCxJQUFBLEVBQU0sSUFQQztBQUFBLE1BUVAsSUFBQSxFQUFNLElBUkM7QUFBQSxNQVNQLElBQUEsRUFBTSxJQVRDO0FBQUEsTUFVUCxPQUFBLEVBQVMsSUFWRjtLQURULENBQUE7O0FBQUEseUJBY0EsUUFBQSxHQUFVLFNBQUMsSUFB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

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/beautifiers/uncrustify/index.coffee


/*
Language Support and default options.
 */

(function() {
  "use strict";
  var Languages, extend, _;

  _ = require('lodash');

  extend = null;

  module.exports = Languages = (function() {
    Languages.prototype.languageNames = ["apex", "arduino", "c-sharp", "c", "coffeescript", "coldfusion", "cpp", "crystal", "css", "csv", "d", "ejs", "elm", "erb", "erlang", "gherkin", "go", "fortran", "handlebars", "haskell", "html", "jade", "java", "javascript", "json", "jsx", "latex", "less", "markdown", 'marko', "mustache", "objective-c", "ocaml", "pawn", "perl", "php", "puppet", "python", "riotjs", "ruby", "rust", "sass", "scss", "spacebars", "sql", "svg", "swig", "tss", "twig", "typescript", "vala", "visualforce", "xml", "xtemplate"];


    /*
    Languages
     */

    Languages.prototype.languages = null;


    /*
    Namespaces
     */

    Languages.prototype.namespaces = null;


    /*
    Constructor
     */

    function Languages() {
      this.languages = _.map(this.languageNames, function(name) {
        return require("./" + name);
      });
      this.namespaces = _.map(this.languages, function(language) {
        return language.namespace;
      });
    }


    /*
    Get language for grammar and extension
     */

    Languages.prototype.getLanguages = function(_arg) {
      var extension, grammar, name, namespace;
      name = _arg.name, namespace = _arg.namespace, grammar = _arg.grammar, extension = _arg.extension;
      return _.union(_.filter(this.languages, function(language) {
        return _.isEqual(language.name, name);
      }), _.filter(this.languages, function(language) {
        return _.isEqual(language.namespace, namespace);
      }), _.filter(this.languages, function(language) {
        return _.includes(language.grammars, grammar);
      }), _.filter(this.languages, function(language) {
        return _.includes(language.extensions, extension);
      }));
    };

    return Languages;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2xhbmd1YWdlcy9pbmRleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBR0EsWUFIQSxDQUFBO0FBQUEsTUFBQSxvQkFBQTs7QUFBQSxFQUtBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUxKLENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQVMsSUFOVCxDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFJckIsd0JBQUEsYUFBQSxHQUFlLENBQ2IsTUFEYSxFQUViLFNBRmEsRUFHYixTQUhhLEVBSWIsR0FKYSxFQUtiLGNBTGEsRUFNYixZQU5hLEVBT2IsS0FQYSxFQVFiLFNBUmEsRUFTYixLQVRhLEVBVWIsS0FWYSxFQVdiLEdBWGEsRUFZYixLQVphLEVBYWIsS0FiYSxFQWNiLEtBZGEsRUFlYixRQWZhLEVBZ0JiLFNBaEJhLEVBaUJiLElBakJhLEVBa0JiLFNBbEJhLEVBbUJiLFlBbkJhLEVBb0JiLFNBcEJhLEVBcUJiLE1BckJhLEVBc0JiLE1BdEJhLEVBdUJiLE1BdkJhLEVBd0JiLFlBeEJhLEVBeUJiLE1BekJhLEVBMEJiLEtBMUJhLEVBMkJiLE9BM0JhLEVBNEJiLE1BNUJhLEVBNkJiLFVBN0JhLEVBOEJiLE9BOUJhLEVBK0JiLFVBL0JhLEVBZ0NiLGFBaENhLEVBaUNiLE9BakNhLEVBa0NiLE1BbENhLEVBbUNiLE1BbkNhLEVBb0NiLEtBcENhLEVBcUNiLFFBckNhLEVBc0NiLFFBdENhLEVBdUNiLFFBdkNhLEVBd0NiLE1BeENhLEVBeUNiLE1BekNhLEVBMENiLE1BMUNhLEVBMkNiLE1BM0NhLEVBNENiLFdBNUNhLEVBNkNiLEtBN0NhLEVBOENiLEtBOUNhLEVBK0NiLE1BL0NhLEVBZ0RiLEtBaERhLEVBaURiLE1BakRhLEVBa0RiLFlBbERhLEVBbURiLE1BbkRhLEVBb0RiLGFBcERhLEVBcURiLEtBckRhLEVBc0RiLFdBdERhLENBQWYsQ0FBQTs7QUF5REE7QUFBQTs7T0F6REE7O0FBQUEsd0JBNERBLFNBQUEsR0FBVyxJQTVEWCxDQUFBOztBQThEQTtBQUFBOztPQTlEQTs7QUFBQSx3QkFpRUEsVUFBQSxHQUFZLElBakVaLENBQUE7O0FBbUVBO0FBQUE7O09BbkVBOztBQXNFYSxJQUFBLG1CQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxJQUFDLENBQUEsYUFBUCxFQUFzQixTQUFDLElBQUQsR0FBQTtlQUNqQyxPQUFBLENBQVMsSUFBQSxHQUFJLElBQWIsRUFEaUM7TUFBQSxDQUF0QixDQUFiLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxVQUFELEdBQWMsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxJQUFDLENBQUEsU0FBUCxFQUFrQixTQUFDLFFBQUQsR0FBQTtlQUFjLFFBQVEsQ0FBQyxVQUF2QjtNQUFBLENBQWxCLENBSGQsQ0FEVztJQUFBLENBdEViOztBQTRFQTtBQUFBOztPQTVFQTs7QUFBQSx3QkErRUEsWUFBQSxHQUFjLFNBQUMsSUFBRCxHQUFBO0FBRVosVUFBQSxtQ0FBQTtBQUFBLE1BRmMsWUFBQSxNQUFNLGlCQUFBLFdBQVcsZUFBQSxTQUFTLGlCQUFBLFNBRXhDLENBQUE7YUFBQSxDQUFDLENBQUMsS0FBRixDQUNFLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLFNBQVYsRUFBcUIsU0FBQyxRQUFELEdBQUE7ZUFBYyxDQUFDLENBQUMsT0FBRixDQUFVLFFBQVEsQ0FBQyxJQUFuQixFQUF5QixJQUF6QixFQUFkO01BQUEsQ0FBckIsQ0FERixFQUVFLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLFNBQVYsRUFBcUIsU0FBQyxRQUFELEdBQUE7ZUFBYyxDQUFDLENBQUMsT0FBRixDQUFVLFFBQVEsQ0FBQyxTQUFuQixFQUE4QixTQUE5QixFQUFkO01BQUEsQ0FBckIsQ0FGRixFQUdFLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLFNBQVYsRUFBcUIsU0FBQyxRQUFELEdBQUE7ZUFBYyxDQUFDLENBQUMsUUFBRixDQUFXLFFBQVEsQ0FBQyxRQUFwQixFQUE4QixPQUE5QixFQUFkO01BQUEsQ0FBckIsQ0FIRixFQUlFLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLFNBQVYsRUFBcUIsU0FBQyxRQUFELEdBQUE7ZUFBYyxDQUFDLENBQUMsUUFBRixDQUFXLFFBQVEsQ0FBQyxVQUFwQixFQUFnQyxTQUFoQyxFQUFkO01BQUEsQ0FBckIsQ0FKRixFQUZZO0lBQUEsQ0EvRWQsQ0FBQTs7cUJBQUE7O01BYkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/languages/index.coffee

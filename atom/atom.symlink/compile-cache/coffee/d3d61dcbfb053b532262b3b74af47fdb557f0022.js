(function() {
  var defaultIndentChar, defaultIndentSize, defaultIndentWithTabs, scope, softTabs, tabLength, _ref, _ref1;

  scope = ['text.marko'];

  tabLength = (_ref = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.tabLength', {
    scope: scope
  }) : void 0) != null ? _ref : 4;

  softTabs = (_ref1 = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.softTabs', {
    scope: scope
  }) : void 0) != null ? _ref1 : true;

  defaultIndentSize = (softTabs ? tabLength : 4);

  defaultIndentChar = (softTabs ? " " : "\t");

  defaultIndentWithTabs = !softTabs;

  module.exports = {
    name: "Marko",
    namespace: "marko",
    fallback: ['html'],

    /*
    Supported Grammars
     */
    grammars: ["Marko"],

    /*
    Supported extensions
     */
    extensions: ["marko"],
    options: {
      indent_size: {
        type: 'integer',
        "default": defaultIndentSize,
        minimum: 0,
        description: "Indentation size/length"
      },
      indent_char: {
        type: 'string',
        "default": defaultIndentChar,
        description: "Indentation character"
      },
      syntax: {
        type: 'string',
        "default": "html",
        "enum": ["html", "concise"],
        description: "[html|concise]"
      }
    },
    defaultBeautifier: "Marko Beautifier"
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2xhbmd1YWdlcy9tYXJrby5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsb0dBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsQ0FBQyxZQUFELENBQVIsQ0FBQTs7QUFBQSxFQUNBLFNBQUE7O2dDQUFpRSxDQURqRSxDQUFBOztBQUFBLEVBRUEsUUFBQTs7aUNBQStELElBRi9ELENBQUE7O0FBQUEsRUFHQSxpQkFBQSxHQUFvQixDQUFJLFFBQUgsR0FBaUIsU0FBakIsR0FBZ0MsQ0FBakMsQ0FIcEIsQ0FBQTs7QUFBQSxFQUlBLGlCQUFBLEdBQW9CLENBQUksUUFBSCxHQUFpQixHQUFqQixHQUEwQixJQUEzQixDQUpwQixDQUFBOztBQUFBLEVBS0EscUJBQUEsR0FBd0IsQ0FBQSxRQUx4QixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUVmLElBQUEsRUFBTSxPQUZTO0FBQUEsSUFHZixTQUFBLEVBQVcsT0FISTtBQUFBLElBSWYsUUFBQSxFQUFVLENBQUMsTUFBRCxDQUpLO0FBTWY7QUFBQTs7T0FOZTtBQUFBLElBU2YsUUFBQSxFQUFVLENBQ1IsT0FEUSxDQVRLO0FBYWY7QUFBQTs7T0FiZTtBQUFBLElBZ0JmLFVBQUEsRUFBWSxDQUNWLE9BRFUsQ0FoQkc7QUFBQSxJQW9CZixPQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxpQkFEVDtBQUFBLFFBRUEsT0FBQSxFQUFTLENBRlQ7QUFBQSxRQUdBLFdBQUEsRUFBYSx5QkFIYjtPQURGO0FBQUEsTUFLQSxXQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsaUJBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSx1QkFGYjtPQU5GO0FBQUEsTUFTQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsTUFEVDtBQUFBLFFBRUEsTUFBQSxFQUFNLENBQUMsTUFBRCxFQUFTLFNBQVQsQ0FGTjtBQUFBLFFBR0EsV0FBQSxFQUFhLGdCQUhiO09BVkY7S0FyQmE7QUFBQSxJQW9DZixpQkFBQSxFQUFtQixrQkFwQ0o7R0FQakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/languages/marko.coffee

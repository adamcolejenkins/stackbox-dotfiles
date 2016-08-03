(function() {
  module.exports = {
    name: "Fortran",
    namespace: "fortran",

    /*
    Supported Grammars
     */
    grammars: ["Fortran - Modern"],

    /*
    Supported extensions
     */
    extensions: ["f90"],

    /*
     */
    options: {
      emacs_path: {
        type: 'string',
        "default": "",
        description: "Path to the `emacs` executable"
      },
      emacs_script_path: {
        type: 'string',
        "default": "",
        description: "Path to the emacs script"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2xhbmd1YWdlcy9mb3J0cmFuLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLElBRWYsSUFBQSxFQUFNLFNBRlM7QUFBQSxJQUdmLFNBQUEsRUFBVyxTQUhJO0FBS2Y7QUFBQTs7T0FMZTtBQUFBLElBUWYsUUFBQSxFQUFVLENBQ1Isa0JBRFEsQ0FSSztBQVlmO0FBQUE7O09BWmU7QUFBQSxJQWVmLFVBQUEsRUFBWSxDQUNWLEtBRFUsQ0FmRztBQW1CZjtBQUFBO09BbkJlO0FBQUEsSUFzQmYsT0FBQSxFQUVFO0FBQUEsTUFBQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLGdDQUZiO09BREY7QUFBQSxNQUlBLGlCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDBCQUZiO09BTEY7S0F4QmE7R0FBakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/languages/fortran.coffee

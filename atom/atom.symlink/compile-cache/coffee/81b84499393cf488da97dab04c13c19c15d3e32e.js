(function() {
  module.exports = {
    name: "Rust",
    namespace: "rust",

    /*
    Supported Grammars
     */
    grammars: ["Rust"],

    /*
    Supported extensions
     */
    extensions: ["rs", "rlib"],
    options: {
      rustfmt_path: {
        type: 'string',
        "default": "",
        description: "Path to rustfmt program"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2xhbmd1YWdlcy9ydXN0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLElBRWYsSUFBQSxFQUFNLE1BRlM7QUFBQSxJQUdmLFNBQUEsRUFBVyxNQUhJO0FBS2Y7QUFBQTs7T0FMZTtBQUFBLElBUWYsUUFBQSxFQUFVLENBQ1IsTUFEUSxDQVJLO0FBWWY7QUFBQTs7T0FaZTtBQUFBLElBZWYsVUFBQSxFQUFZLENBQ1YsSUFEVSxFQUVWLE1BRlUsQ0FmRztBQUFBLElBb0JmLE9BQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSx5QkFGYjtPQURGO0tBckJhO0dBQWpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/languages/rust.coffee

(function() {
  module.exports = {
    ignoreWhitespace: {
      title: 'Ignore Whitespace',
      description: 'Will not diff whitespace when this box is checked.',
      type: 'boolean',
      "default": false
    },
    diffWords: {
      title: 'Show Word Diff',
      description: 'Diffs the words between each line when this box is checked.',
      type: 'boolean',
      "default": true
    },
    syncHorizontalScroll: {
      title: 'Sync Horizontal Scroll',
      description: 'Syncs the horizontal scrolling of the editors.',
      type: 'boolean',
      "default": false
    },
    leftEditorColor: {
      title: 'Left Editor Color',
      description: 'Specifies the highlight color for the left editor.',
      type: 'string',
      "default": 'green',
      "enum": ['green', 'red']
    },
    rightEditorColor: {
      title: 'Right Editor Color',
      description: 'Specifies the highlight color for the right editor.',
      type: 'string',
      "default": 'red',
      "enum": ['green', 'red']
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvZ2l0LXRpbWUtbWFjaGluZS9ub2RlX21vZHVsZXMvc3BsaXQtZGlmZi9saWIvY29uZmlnLXNjaGVtYS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsZ0JBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLG1CQUFQO0FBQUEsTUFDQSxXQUFBLEVBQWEsb0RBRGI7QUFBQSxNQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsTUFHQSxTQUFBLEVBQVMsS0FIVDtLQURGO0FBQUEsSUFLQSxTQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxnQkFBUDtBQUFBLE1BQ0EsV0FBQSxFQUFhLDZEQURiO0FBQUEsTUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLE1BR0EsU0FBQSxFQUFTLElBSFQ7S0FORjtBQUFBLElBVUEsb0JBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLHdCQUFQO0FBQUEsTUFDQSxXQUFBLEVBQWEsZ0RBRGI7QUFBQSxNQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsTUFHQSxTQUFBLEVBQVMsS0FIVDtLQVhGO0FBQUEsSUFlQSxlQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxtQkFBUDtBQUFBLE1BQ0EsV0FBQSxFQUFhLG9EQURiO0FBQUEsTUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLE1BR0EsU0FBQSxFQUFTLE9BSFQ7QUFBQSxNQUlBLE1BQUEsRUFBTSxDQUFDLE9BQUQsRUFBVSxLQUFWLENBSk47S0FoQkY7QUFBQSxJQXFCQSxnQkFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sb0JBQVA7QUFBQSxNQUNBLFdBQUEsRUFBYSxxREFEYjtBQUFBLE1BRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxNQUdBLFNBQUEsRUFBUyxLQUhUO0FBQUEsTUFJQSxNQUFBLEVBQU0sQ0FBQyxPQUFELEVBQVUsS0FBVixDQUpOO0tBdEJGO0dBREYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/git-time-machine/node_modules/split-diff/lib/config-schema.coffee

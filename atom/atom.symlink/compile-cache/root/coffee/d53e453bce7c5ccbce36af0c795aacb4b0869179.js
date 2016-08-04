(function() {
  var _ref;

  module.exports = {
    cliStatusView: null,
    activate: function(state) {
      return atom.packages.onDidActivateInitialPackages((function(_this) {
        return function() {
          var CliStatusView, createStatusEntry;
          CliStatusView = require('./cli-status-view');
          createStatusEntry = function() {
            return _this.cliStatusView = new CliStatusView(state.cliStatusViewState);
          };
          return createStatusEntry();
        };
      })(this));
    },
    deactivate: function() {
      return this.cliStatusView.destroy();
    },
    config: {
      'windowHeight': {
        type: 'integer',
        "default": 30,
        minimum: 0,
        maximum: 80
      },
      'clearCommandInput': {
        type: 'boolean',
        "default": true
      },
      'logConsole': {
        type: 'boolean',
        "default": false
      },
      'overrideLs': {
        title: 'Override ls',
        type: 'boolean',
        "default": true
      },
      'shell': {
        type: 'string',
        "default": process.platform === 'win32' ? 'cmd.exe' : (_ref = process.env.SHELL) != null ? _ref : '/bin/bash'
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvdGVybWluYWwtcGFuZWwvbGliL2NsaS1zdGF0dXMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxhQUFBLEVBQWUsSUFBZjtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyw0QkFBZCxDQUEyQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3pDLGNBQUEsZ0NBQUE7QUFBQSxVQUFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSLENBQWhCLENBQUE7QUFBQSxVQUNBLGlCQUFBLEdBQW9CLFNBQUEsR0FBQTttQkFDbEIsS0FBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxhQUFBLENBQWMsS0FBSyxDQUFDLGtCQUFwQixFQURIO1VBQUEsQ0FEcEIsQ0FBQTtpQkFHQSxpQkFBQSxDQUFBLEVBSnlDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0MsRUFEUTtJQUFBLENBRlY7QUFBQSxJQVNBLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxFQURVO0lBQUEsQ0FUWjtBQUFBLElBWUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsT0FBQSxFQUFTLENBRlQ7QUFBQSxRQUdBLE9BQUEsRUFBUyxFQUhUO09BREY7QUFBQSxNQUtBLG1CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQU5GO0FBQUEsTUFRQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtPQVRGO0FBQUEsTUFXQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxhQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLElBRlQ7T0FaRjtBQUFBLE1BZUEsT0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFZLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLE9BQXZCLEdBQ0wsU0FESywrQ0FHZSxXQUp4QjtPQWhCRjtLQWJGO0dBREYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/terminal-panel/lib/cli-status.coffee

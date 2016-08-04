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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL3Rlcm1pbmFsLXBhbmVsL2xpYi9jbGktc3RhdHVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxJQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsYUFBQSxFQUFlLElBQWY7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsNEJBQWQsQ0FBMkMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN6QyxjQUFBLGdDQUFBO0FBQUEsVUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxtQkFBUixDQUFoQixDQUFBO0FBQUEsVUFDQSxpQkFBQSxHQUFvQixTQUFBLEdBQUE7bUJBQ2xCLEtBQUMsQ0FBQSxhQUFELEdBQXFCLElBQUEsYUFBQSxDQUFjLEtBQUssQ0FBQyxrQkFBcEIsRUFESDtVQUFBLENBRHBCLENBQUE7aUJBR0EsaUJBQUEsQ0FBQSxFQUp5QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNDLEVBRFE7SUFBQSxDQUZWO0FBQUEsSUFTQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsRUFEVTtJQUFBLENBVFo7QUFBQSxJQVlBLE1BQUEsRUFDRTtBQUFBLE1BQUEsY0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLE9BQUEsRUFBUyxDQUZUO0FBQUEsUUFHQSxPQUFBLEVBQVMsRUFIVDtPQURGO0FBQUEsTUFLQSxtQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FORjtBQUFBLE1BUUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FURjtBQUFBLE1BV0EsWUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sYUFBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxJQUZUO09BWkY7QUFBQSxNQWVBLE9BQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBWSxPQUFPLENBQUMsUUFBUixLQUFvQixPQUF2QixHQUNMLFNBREssK0NBR2UsV0FKeEI7T0FoQkY7S0FiRjtHQURGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ajenkins/.atom/packages/terminal-panel/lib/cli-status.coffee

(function() {
  module.exports = {
    general: {
      title: 'General',
      type: 'object',
      collapsed: true,
      order: -1,
      description: 'General options for Atom Beautify',
      properties: {
        analytics: {
          title: 'Anonymous Analytics',
          type: 'boolean',
          "default": true,
          description: "There is [Segment.io](https://segment.io/) which forwards data to [Google Analytics](http://www.google.com/analytics/) to track what languages are being used the most, as well as other stats. Everything is anonymized and no personal information, such as source code, is sent. See https://github.com/Glavin001/atom-beautify/issues/47 for more details."
        },
        _analyticsUserId: {
          title: 'Analytics User Id',
          type: 'string',
          "default": "",
          description: "Unique identifier for this user for tracking usage analytics"
        },
        loggerLevel: {
          title: "Logger Level",
          type: 'string',
          "default": 'warn',
          description: 'Set the level for the logger',
          "enum": ['verbose', 'debug', 'info', 'warn', 'error']
        },
        beautifyEntireFileOnSave: {
          title: "Beautify Entire File On Save",
          type: 'boolean',
          "default": true,
          description: "When beautifying on save, use the entire file, even if there is selected text in the editor. Important: The `beautify on save` option for the specific language must be enabled for this to be applicable. This option is not `beautify on save`."
        },
        muteUnsupportedLanguageErrors: {
          title: "Mute Unsupported Language Errors",
          type: 'boolean',
          "default": false,
          description: "Do not show \"Unsupported Language\" errors when they occur"
        },
        muteAllErrors: {
          title: "Mute All Errors",
          type: 'boolean',
          "default": false,
          description: "Do not show any/all errors when they occur"
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2NvbmZpZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUNmLE9BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLFNBQVA7QUFBQSxNQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsTUFFQSxTQUFBLEVBQVcsSUFGWDtBQUFBLE1BR0EsS0FBQSxFQUFPLENBQUEsQ0FIUDtBQUFBLE1BSUEsV0FBQSxFQUFhLG1DQUpiO0FBQUEsTUFLQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLFNBQUEsRUFDRTtBQUFBLFVBQUEsS0FBQSxFQUFPLHFCQUFQO0FBQUEsVUFDQSxJQUFBLEVBQU8sU0FEUDtBQUFBLFVBRUEsU0FBQSxFQUFVLElBRlY7QUFBQSxVQUdBLFdBQUEsRUFBYyxnV0FIZDtTQURGO0FBQUEsUUFTQSxnQkFBQSxFQUNFO0FBQUEsVUFBQSxLQUFBLEVBQU8sbUJBQVA7QUFBQSxVQUNBLElBQUEsRUFBTyxRQURQO0FBQUEsVUFFQSxTQUFBLEVBQVUsRUFGVjtBQUFBLFVBR0EsV0FBQSxFQUFjLDhEQUhkO1NBVkY7QUFBQSxRQWNBLFdBQUEsRUFDRTtBQUFBLFVBQUEsS0FBQSxFQUFPLGNBQVA7QUFBQSxVQUNBLElBQUEsRUFBTyxRQURQO0FBQUEsVUFFQSxTQUFBLEVBQVUsTUFGVjtBQUFBLFVBR0EsV0FBQSxFQUFjLDhCQUhkO0FBQUEsVUFJQSxNQUFBLEVBQU8sQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixNQUFyQixFQUE2QixNQUE3QixFQUFxQyxPQUFyQyxDQUpQO1NBZkY7QUFBQSxRQW9CQSx3QkFBQSxFQUNFO0FBQUEsVUFBQSxLQUFBLEVBQU8sOEJBQVA7QUFBQSxVQUNBLElBQUEsRUFBTyxTQURQO0FBQUEsVUFFQSxTQUFBLEVBQVUsSUFGVjtBQUFBLFVBR0EsV0FBQSxFQUFjLG1QQUhkO1NBckJGO0FBQUEsUUF5QkEsNkJBQUEsRUFDRTtBQUFBLFVBQUEsS0FBQSxFQUFPLGtDQUFQO0FBQUEsVUFDQSxJQUFBLEVBQU8sU0FEUDtBQUFBLFVBRUEsU0FBQSxFQUFVLEtBRlY7QUFBQSxVQUdBLFdBQUEsRUFBYyw2REFIZDtTQTFCRjtBQUFBLFFBOEJBLGFBQUEsRUFDRTtBQUFBLFVBQUEsS0FBQSxFQUFPLGlCQUFQO0FBQUEsVUFDQSxJQUFBLEVBQU8sU0FEUDtBQUFBLFVBRUEsU0FBQSxFQUFVLEtBRlY7QUFBQSxVQUdBLFdBQUEsRUFBYyw0Q0FIZDtTQS9CRjtPQU5GO0tBRmE7R0FBakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/config.coffee

(function() {
  var basename;

  basename = require("path").basename;

  module.exports = {
    config: {
      coloured: {
        type: 'boolean',
        "default": true,
        description: 'Untick this for colourless icons'
      },
      forceShow: {
        type: 'boolean',
        "default": false,
        description: 'Force show icons - for themes that hide icons'
      },
      onChanges: {
        type: 'boolean',
        "default": false,
        description: 'Only colour icons when file is modified'
      },
      tabPaneIcon: {
        type: 'boolean',
        "default": true,
        description: 'Show file icons on tab pane'
      }
    },
    activate: function(state) {
      var colouredIcons;
      this.disableSetiIcons(true);
      colouredIcons = "file-icons.coloured";
      atom.config.onDidChange(colouredIcons, (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.colour(newValue);
        };
      })(this));
      this.colour(atom.config.get(colouredIcons));
      atom.commands.add('body', 'file-icons:toggle-colours', function(event) {
        return atom.config.set(colouredIcons, !(atom.config.get(colouredIcons)));
      });
      this.observe(true);
      atom.config.onDidChange('file-icons.forceShow', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.forceShow(newValue);
        };
      })(this));
      this.forceShow(atom.config.get('file-icons.forceShow'));
      atom.config.onDidChange('file-icons.onChanges', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.onChanges(newValue);
        };
      })(this));
      this.onChanges(atom.config.get('file-icons.onChanges'));
      atom.config.onDidChange('file-icons.tabPaneIcon', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.tabPaneIcon(newValue);
        };
      })(this));
      return this.tabPaneIcon(atom.config.get('file-icons.tabPaneIcon'));
    },
    deactivate: function() {
      this.disableSetiIcons(false);
      this.forceShow(false);
      this.onChanges(false);
      this.colour(true);
      this.tabPaneIcon(false);
      return this.observe(false);
    },
    observe: function(enabled) {
      if (enabled) {
        return this.observer = atom.workspace.observeTextEditors(function(editor) {
          var fixAfterLoading, onSave, openedFile, workspace;
          workspace = atom.views.getView(atom.workspace);
          openedFile = editor.getPath();
          fixAfterLoading = function() {
            var onDone;
            return onDone = editor.onDidStopChanging(function() {
              var fileTabs, tabs;
              tabs = workspace != null ? workspace.querySelectorAll(".pane > .tab-bar > .tab") : void 0;
              fileTabs = [].filter.call(tabs, function(tab) {
                return (tab != null ? tab.item : void 0) === editor;
              });
              editor.onDidChangePath((function(_this) {
                return function(path) {
                  var tab, title, _i, _len, _results;
                  _results = [];
                  for (_i = 0, _len = fileTabs.length; _i < _len; _i++) {
                    tab = fileTabs[_i];
                    title = tab.itemTitle;
                    title.dataset.path = path;
                    _results.push(title.dataset.name = basename(path));
                  }
                  return _results;
                };
              })(this));
              return onDone.dispose();
            });
          };
          if (!openedFile) {
            return onSave = editor.onDidSave(function(file) {
              var fixIcon, onTerminate, tab;
              tab = workspace != null ? workspace.querySelector(".tab-bar > .active.tab > .title") : void 0;
              fixIcon = function() {
                var path;
                if (!(tab != null ? tab.dataset.path : void 0)) {
                  path = file.path;
                  tab.dataset.path = path;
                  tab.dataset.name = basename(path);
                  return fixAfterLoading();
                }
              };
              if (tab) {
                fixIcon();
              } else {
                onTerminate = editor.onDidTerminatePendingState(function() {
                  setTimeout((function() {
                    tab = workspace != null ? workspace.querySelector(".tab-bar > .active.tab > .title") : void 0;
                    return fixIcon();
                  }), 10);
                  return onTerminate.dispose();
                });
              }
              return onSave.dispose();
            });
          } else {
            return fixAfterLoading();
          }
        });
      } else if (this.observer != null) {
        return this.observer.dispose();
      }
    },
    serialize: function() {},
    colour: function(enable) {
      var body;
      body = document.querySelector('body');
      return body.classList.toggle('file-icons-colourless', !enable);
    },
    forceShow: function(enable) {
      var body;
      body = document.querySelector('body');
      return body.classList.toggle('file-icons-force-show-icons', enable);
    },
    onChanges: function(enable) {
      var body;
      body = document.querySelector('body');
      return body.classList.toggle('file-icons-on-changes', enable);
    },
    tabPaneIcon: function(enable) {
      var body;
      body = document.querySelector('body');
      return body.classList.toggle('file-icons-tab-pane-icon', enable);
    },
    disableSetiIcons: function(disable) {
      var workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      return workspaceElement.classList.toggle('seti-ui-no-icons', disable);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2ZpbGUtaWNvbnMvaW5kZXguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQyxXQUFZLE9BQUEsQ0FBUSxNQUFSLEVBQVosUUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLGtDQUZiO09BREY7QUFBQSxNQUlBLFNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsK0NBRmI7T0FMRjtBQUFBLE1BUUEsU0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSx5Q0FGYjtPQVRGO0FBQUEsTUFZQSxXQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDZCQUZiO09BYkY7S0FERjtBQUFBLElBa0JBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLFVBQUEsYUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGdCQUFELENBQWtCLElBQWxCLENBQUEsQ0FBQTtBQUFBLE1BRUEsYUFBQSxHQUFnQixxQkFGaEIsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLGFBQXhCLEVBQXVDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxT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

//# sourceURL=/Users/ajenkins/.atom/packages/file-icons/index.coffee

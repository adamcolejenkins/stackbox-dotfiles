(function() {
  var CompositeDisposable, ScrollView, ShowTodoView, TextBuffer, TextEditorView, TodoOptions, TodoTable, deprecatedTextEditor, fs, path, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, TextBuffer = _ref.TextBuffer;

  _ref1 = require('atom-space-pen-views'), ScrollView = _ref1.ScrollView, TextEditorView = _ref1.TextEditorView;

  path = require('path');

  fs = require('fs-plus');

  TodoTable = require('./todo-table-view');

  TodoOptions = require('./todo-options-view');

  deprecatedTextEditor = function(params) {
    var TextEditor;
    if (atom.workspace.buildTextEditor != null) {
      return atom.workspace.buildTextEditor(params);
    } else {
      TextEditor = require('atom').TextEditor;
      return new TextEditor(params);
    }
  };

  module.exports = ShowTodoView = (function(_super) {
    __extends(ShowTodoView, _super);

    ShowTodoView.content = function(collection, filterBuffer) {
      var filterEditor;
      filterEditor = deprecatedTextEditor({
        mini: true,
        tabLength: 2,
        softTabs: true,
        softWrapped: false,
        buffer: filterBuffer,
        placeholderText: 'Search Todos'
      });
      return this.div({
        "class": 'show-todo-preview',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'input-block'
          }, function() {
            _this.div({
              "class": 'input-block-item input-block-item--flex'
            }, function() {
              return _this.subview('filterEditorView', new TextEditorView({
                editor: filterEditor
              }));
            });
            return _this.div({
              "class": 'input-block-item'
            }, function() {
              return _this.div({
                "class": 'btn-group'
              }, function() {
                _this.button({
                  outlet: 'scopeButton',
                  "class": 'btn'
                });
                _this.button({
                  outlet: 'optionsButton',
                  "class": 'btn icon-gear'
                });
                _this.button({
                  outlet: 'saveAsButton',
                  "class": 'btn icon-cloud-download'
                });
                return _this.button({
                  outlet: 'refreshButton',
                  "class": 'btn icon-sync'
                });
              });
            });
          });
          _this.div({
            "class": 'input-block todo-info-block'
          }, function() {
            return _this.div({
              "class": 'input-block-item'
            }, function() {
              return _this.span({
                outlet: 'todoInfo'
              });
            });
          });
          _this.div({
            outlet: 'optionsView'
          });
          _this.div({
            outlet: 'todoLoading',
            "class": 'todo-loading'
          }, function() {
            _this.div({
              "class": 'markdown-spinner'
            });
            return _this.h5({
              outlet: 'searchCount',
              "class": 'text-center'
            }, "Loading Todos...");
          });
          return _this.subview('todoTable', new TodoTable(collection));
        };
      })(this));
    };

    function ShowTodoView(collection, uri) {
      this.collection = collection;
      this.uri = uri;
      this.toggleOptions = __bind(this.toggleOptions, this);
      this.setScopeButtonState = __bind(this.setScopeButtonState, this);
      this.toggleSearchScope = __bind(this.toggleSearchScope, this);
      this.saveAs = __bind(this.saveAs, this);
      this.stopLoading = __bind(this.stopLoading, this);
      this.startLoading = __bind(this.startLoading, this);
      ShowTodoView.__super__.constructor.call(this, this.collection, this.filterBuffer = new TextBuffer);
    }

    ShowTodoView.prototype.initialize = function() {
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      this.collection.search();
      this.setScopeButtonState(this.collection.getSearchScope());
      this.notificationOptions = {
        detail: 'Atom todo-show package',
        dismissable: true,
        icon: this.getIconName()
      };
      this.checkDeprecation();
      this.disposables.add(atom.tooltips.add(this.scopeButton, {
        title: "What to Search"
      }));
      this.disposables.add(atom.tooltips.add(this.optionsButton, {
        title: "Show Todo Options"
      }));
      this.disposables.add(atom.tooltips.add(this.saveAsButton, {
        title: "Save Todos to File"
      }));
      return this.disposables.add(atom.tooltips.add(this.refreshButton, {
        title: "Refresh Todos"
      }));
    };

    ShowTodoView.prototype.handleEvents = function() {
      var pane;
      this.disposables.add(atom.commands.add(this.element, {
        'core:save-as': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.saveAs();
          };
        })(this),
        'core:refresh': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.collection.search();
          };
        })(this)
      }));
      pane = atom.workspace.getActivePane();
      if (atom.config.get('todo-show.rememberViewSize')) {
        this.restorePaneFlex(pane);
      }
      this.disposables.add(pane.observeFlexScale((function(_this) {
        return function(flexScale) {
          return _this.savePaneFlex(flexScale);
        };
      })(this)));
      this.disposables.add(this.collection.onDidStartSearch(this.startLoading));
      this.disposables.add(this.collection.onDidFinishSearch(this.stopLoading));
      this.disposables.add(this.collection.onDidFailSearch((function(_this) {
        return function(err) {
          _this.searchCount.text("Search Failed");
          if (err) {
            console.error(err);
          }
          if (err) {
            return _this.showError(err);
          }
        };
      })(this)));
      this.disposables.add(this.collection.onDidChangeSearchScope((function(_this) {
        return function(scope) {
          _this.setScopeButtonState(scope);
          return _this.collection.search();
        };
      })(this)));
      this.disposables.add(this.collection.onDidSearchPaths((function(_this) {
        return function(nPaths) {
          return _this.searchCount.text("" + nPaths + " paths searched...");
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          if (_this.collection.setActiveProject(item != null ? typeof item.getPath === "function" ? item.getPath() : void 0 : void 0) || ((item != null ? item.constructor.name : void 0) === 'TextEditor' && _this.collection.scope === 'active')) {
            return _this.collection.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidAddTextEditor((function(_this) {
        return function(_arg) {
          var textEditor;
          textEditor = _arg.textEditor;
          if (_this.collection.scope === 'open') {
            return _this.collection.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
        return function(_arg) {
          var item;
          item = _arg.item;
          if (_this.collection.scope === 'open') {
            return _this.collection.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.disposables.add(editor.onDidSave(function() {
            return _this.collection.search();
          }));
        };
      })(this)));
      this.filterEditorView.getModel().onDidStopChanging((function(_this) {
        return function() {
          if (_this.firstTimeFilter) {
            _this.filter();
          }
          return _this.firstTimeFilter = true;
        };
      })(this));
      this.scopeButton.on('click', this.toggleSearchScope);
      this.optionsButton.on('click', this.toggleOptions);
      this.saveAsButton.on('click', this.saveAs);
      return this.refreshButton.on('click', (function(_this) {
        return function() {
          return _this.collection.search();
        };
      })(this));
    };

    ShowTodoView.prototype.destroy = function() {
      this.collection.cancelSearch();
      this.disposables.dispose();
      return this.detach();
    };

    ShowTodoView.prototype.savePaneFlex = function(flex) {
      return localStorage.setItem('todo-show.flex', flex);
    };

    ShowTodoView.prototype.restorePaneFlex = function(pane) {
      var flex;
      flex = localStorage.getItem('todo-show.flex');
      if (flex) {
        return pane.setFlexScale(parseFloat(flex));
      }
    };

    ShowTodoView.prototype.getTitle = function() {
      return "Todo Show";
    };

    ShowTodoView.prototype.getIconName = function() {
      return "checklist";
    };

    ShowTodoView.prototype.getURI = function() {
      return this.uri;
    };

    ShowTodoView.prototype.getProjectName = function() {
      return this.collection.getActiveProjectName();
    };

    ShowTodoView.prototype.getProjectPath = function() {
      return this.collection.getActiveProject();
    };

    ShowTodoView.prototype.getTodos = function() {
      return this.collection.getTodos();
    };

    ShowTodoView.prototype.getTodosCount = function() {
      return this.collection.getTodosCount();
    };

    ShowTodoView.prototype.isSearching = function() {
      return this.collection.getState();
    };

    ShowTodoView.prototype.startLoading = function() {
      this.todoLoading.show();
      return this.updateInfo();
    };

    ShowTodoView.prototype.stopLoading = function() {
      this.todoLoading.hide();
      return this.updateInfo();
    };

    ShowTodoView.prototype.updateInfo = function() {
      return this.todoInfo.html("" + (this.getInfoText()) + " " + (this.getScopeText()));
    };

    ShowTodoView.prototype.getInfoText = function() {
      var count;
      if (this.isSearching()) {
        return "Found ... results";
      }
      switch (count = this.getTodosCount()) {
        case 1:
          return "Found " + count + " result";
        default:
          return "Found " + count + " results";
      }
    };

    ShowTodoView.prototype.getScopeText = function() {
      switch (this.collection.scope) {
        case 'active':
          return "in active file";
        case 'open':
          return "in open files";
        case 'project':
          return "in project <code>" + (this.getProjectName()) + "</code>";
        default:
          return "in workspace";
      }
    };

    ShowTodoView.prototype.showError = function(message) {
      if (message == null) {
        message = '';
      }
      return atom.notifications.addError(message, this.notificationOptions);
    };

    ShowTodoView.prototype.showWarning = function(message) {
      if (message == null) {
        message = '';
      }
      return atom.notifications.addWarning(message, this.notificationOptions);
    };

    ShowTodoView.prototype.saveAs = function() {
      var filePath, outputFilePath, projectPath;
      if (this.isSearching()) {
        return;
      }
      filePath = "" + (this.getProjectName() || 'todos') + ".md";
      if (projectPath = this.getProjectPath()) {
        filePath = path.join(projectPath, filePath);
      }
      if (outputFilePath = atom.showSaveDialogSync(filePath.toLowerCase())) {
        fs.writeFileSync(outputFilePath, this.collection.getMarkdown());
        return atom.workspace.open(outputFilePath);
      }
    };

    ShowTodoView.prototype.toggleSearchScope = function() {
      var scope;
      scope = this.collection.toggleSearchScope();
      return this.setScopeButtonState(scope);
    };

    ShowTodoView.prototype.setScopeButtonState = function(state) {
      switch (state) {
        case 'workspace':
          return this.scopeButton.text('Workspace');
        case 'project':
          return this.scopeButton.text('Project');
        case 'open':
          return this.scopeButton.text('Open Files');
        case 'active':
          return this.scopeButton.text('Active File');
      }
    };

    ShowTodoView.prototype.toggleOptions = function() {
      if (!this.todoOptions) {
        this.optionsView.hide();
        this.todoOptions = new TodoOptions(this.collection);
        this.optionsView.html(this.todoOptions);
      }
      return this.optionsView.slideToggle();
    };

    ShowTodoView.prototype.filter = function() {
      return this.collection.filterTodos(this.filterBuffer.getText());
    };

    ShowTodoView.prototype.checkDeprecation = function() {
      if (atom.config.get('todo-show.findTheseRegexes')) {
        return this.showWarning('Deprecation Warning:\n\n`findTheseRegexes` config is deprecated, please use `findTheseTodos` and `findUsingRegex` for custom behaviour.\nSee https://github.com/mrodalgaard/atom-todo-show#config for more information.');
      }
    };

    return ShowTodoView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhJQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixrQkFBQSxVQUF0QixDQUFBOztBQUFBLEVBQ0EsUUFBK0IsT0FBQSxDQUFRLHNCQUFSLENBQS9CLEVBQUMsbUJBQUEsVUFBRCxFQUFhLHVCQUFBLGNBRGIsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FITCxDQUFBOztBQUFBLEVBS0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxtQkFBUixDQUxaLENBQUE7O0FBQUEsRUFNQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHFCQUFSLENBTmQsQ0FBQTs7QUFBQSxFQVFBLG9CQUFBLEdBQXVCLFNBQUMsTUFBRCxHQUFBO0FBQ3JCLFFBQUEsVUFBQTtBQUFBLElBQUEsSUFBRyxzQ0FBSDthQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUErQixNQUEvQixFQURGO0tBQUEsTUFBQTtBQUdFLE1BQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxVQUE3QixDQUFBO2FBQ0ksSUFBQSxVQUFBLENBQVcsTUFBWCxFQUpOO0tBRHFCO0VBQUEsQ0FSdkIsQ0FBQTs7QUFBQSxFQWVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixtQ0FBQSxDQUFBOztBQUFBLElBQUEsWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLFVBQUQsRUFBYSxZQUFiLEdB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

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/todo-show/lib/todo-view.coffee

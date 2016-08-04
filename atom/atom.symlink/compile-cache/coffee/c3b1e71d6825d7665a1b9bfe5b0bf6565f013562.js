(function() {
  var Emitter, TodoCollection, TodoModel, TodoRegex, TodosMarkdown, path;

  path = require('path');

  Emitter = require('atom').Emitter;

  TodoModel = require('./todo-model');

  TodosMarkdown = require('./todo-markdown');

  TodoRegex = require('./todo-regex');

  module.exports = TodoCollection = (function() {
    function TodoCollection() {
      this.emitter = new Emitter;
      this.defaultKey = 'Text';
      this.scope = 'workspace';
      this.todos = [];
    }

    TodoCollection.prototype.onDidAddTodo = function(cb) {
      return this.emitter.on('did-add-todo', cb);
    };

    TodoCollection.prototype.onDidRemoveTodo = function(cb) {
      return this.emitter.on('did-remove-todo', cb);
    };

    TodoCollection.prototype.onDidClear = function(cb) {
      return this.emitter.on('did-clear-todos', cb);
    };

    TodoCollection.prototype.onDidStartSearch = function(cb) {
      return this.emitter.on('did-start-search', cb);
    };

    TodoCollection.prototype.onDidSearchPaths = function(cb) {
      return this.emitter.on('did-search-paths', cb);
    };

    TodoCollection.prototype.onDidFinishSearch = function(cb) {
      return this.emitter.on('did-finish-search', cb);
    };

    TodoCollection.prototype.onDidCancelSearch = function(cb) {
      return this.emitter.on('did-cancel-search', cb);
    };

    TodoCollection.prototype.onDidFailSearch = function(cb) {
      return this.emitter.on('did-fail-search', cb);
    };

    TodoCollection.prototype.onDidSortTodos = function(cb) {
      return this.emitter.on('did-sort-todos', cb);
    };

    TodoCollection.prototype.onDidFilterTodos = function(cb) {
      return this.emitter.on('did-filter-todos', cb);
    };

    TodoCollection.prototype.onDidChangeSearchScope = function(cb) {
      return this.emitter.on('did-change-scope', cb);
    };

    TodoCollection.prototype.clear = function() {
      this.cancelSearch();
      this.todos = [];
      return this.emitter.emit('did-clear-todos');
    };

    TodoCollection.prototype.addTodo = function(todo) {
      if (this.alreadyExists(todo)) {
        return;
      }
      this.todos.push(todo);
      return this.emitter.emit('did-add-todo', todo);
    };

    TodoCollection.prototype.getTodos = function() {
      return this.todos;
    };

    TodoCollection.prototype.getTodosCount = function() {
      return this.todos.length;
    };

    TodoCollection.prototype.getState = function() {
      return this.searching;
    };

    TodoCollection.prototype.sortTodos = function(_arg) {
      var sortAsc, sortBy, _ref;
      _ref = _arg != null ? _arg : {}, sortBy = _ref.sortBy, sortAsc = _ref.sortAsc;
      if (sortBy == null) {
        sortBy = this.defaultKey;
      }
      this.todos = this.todos.sort(function(a, b) {
        var aVal, bVal, comp, _ref1;
        aVal = a.get(sortBy);
        bVal = b.get(sortBy);
        if (aVal === bVal) {
          _ref1 = [a.get(this.defaultKey), b.get(this.defaultKey)], aVal = _ref1[0], bVal = _ref1[1];
        }
        if (a.keyIsNumber(sortBy)) {
          comp = parseInt(aVal) - parseInt(bVal);
        } else {
          comp = aVal.localeCompare(bVal);
        }
        if (sortAsc) {
          return comp;
        } else {
          return -comp;
        }
      });
      if (this.filter) {
        return this.filterTodos(this.filter);
      }
      return this.emitter.emit('did-sort-todos', this.todos);
    };

    TodoCollection.prototype.filterTodos = function(filter) {
      var result;
      this.filter = filter;
      if (filter) {
        result = this.todos.filter(function(todo) {
          return todo.contains(filter);
        });
      } else {
        result = this.todos;
      }
      return this.emitter.emit('did-filter-todos', result);
    };

    TodoCollection.prototype.getAvailableTableItems = function() {
      return this.availableItems;
    };

    TodoCollection.prototype.setAvailableTableItems = function(availableItems) {
      this.availableItems = availableItems;
    };

    TodoCollection.prototype.getSearchScope = function() {
      return this.scope;
    };

    TodoCollection.prototype.setSearchScope = function(scope) {
      return this.emitter.emit('did-change-scope', this.scope = scope);
    };

    TodoCollection.prototype.toggleSearchScope = function() {
      var scope;
      scope = (function() {
        switch (this.scope) {
          case 'workspace':
            return 'project';
          case 'project':
            return 'open';
          case 'open':
            return 'active';
          default:
            return 'workspace';
        }
      }).call(this);
      this.setSearchScope(scope);
      return scope;
    };

    TodoCollection.prototype.alreadyExists = function(newTodo) {
      var properties;
      properties = ['range', 'path'];
      return this.todos.some(function(todo) {
        return properties.every(function(prop) {
          if (todo[prop] === newTodo[prop]) {
            return true;
          }
        });
      });
    };

    TodoCollection.prototype.fetchRegexItem = function(todoRegex, activeProjectOnly) {
      var options;
      options = {
        paths: this.getSearchPaths(),
        onPathsSearched: (function(_this) {
          return function(nPaths) {
            if (_this.searching) {
              return _this.emitter.emit('did-search-paths', nPaths);
            }
          };
        })(this)
      };
      return atom.workspace.scan(todoRegex.regexp, options, (function(_this) {
        return function(result, error) {
          var match, _i, _len, _ref, _results;
          if (error) {
            console.debug(error.message);
          }
          if (!result) {
            return;
          }
          if (activeProjectOnly && !_this.activeProjectHas(result.filePath)) {
            return;
          }
          _ref = result.matches;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            match = _ref[_i];
            _results.push(_this.addTodo(new TodoModel({
              all: match.lineText,
              text: match.matchText,
              loc: result.filePath,
              position: match.range,
              regex: todoRegex.regex,
              regexp: todoRegex.regexp
            })));
          }
          return _results;
        };
      })(this));
    };

    TodoCollection.prototype.fetchOpenRegexItem = function(todoRegex, activeEditorOnly) {
      var editor, editors, _i, _len, _ref;
      editors = [];
      if (activeEditorOnly) {
        if (editor = (_ref = atom.workspace.getPanes()[0]) != null ? _ref.getActiveEditor() : void 0) {
          editors = [editor];
        }
      } else {
        editors = atom.workspace.getTextEditors();
      }
      for (_i = 0, _len = editors.length; _i < _len; _i++) {
        editor = editors[_i];
        editor.scan(todoRegex.regexp, (function(_this) {
          return function(match, error) {
            var range;
            if (error) {
              console.debug(error.message);
            }
            if (!match) {
              return;
            }
            range = [[match.computedRange.start.row, match.computedRange.start.column], [match.computedRange.end.row, match.computedRange.end.column]];
            return _this.addTodo(new TodoModel({
              all: match.lineText,
              text: match.matchText,
              loc: editor.getPath(),
              position: range,
              regex: todoRegex.regex,
              regexp: todoRegex.regexp
            }));
          };
        })(this));
      }
      return Promise.resolve();
    };

    TodoCollection.prototype.search = function() {
      var todoRegex;
      this.clear();
      this.searching = true;
      this.emitter.emit('did-start-search');
      todoRegex = new TodoRegex(atom.config.get('todo-show.findUsingRegex'), atom.config.get('todo-show.findTheseTodos'));
      if (todoRegex.error) {
        this.emitter.emit('did-fail-search', "Invalid todo search regex");
        return;
      }
      this.searchPromise = (function() {
        switch (this.scope) {
          case 'open':
            return this.fetchOpenRegexItem(todoRegex, false);
          case 'active':
            return this.fetchOpenRegexItem(todoRegex, true);
          case 'project':
            return this.fetchRegexItem(todoRegex, true);
          default:
            return this.fetchRegexItem(todoRegex);
        }
      }).call(this);
      return this.searchPromise.then((function(_this) {
        return function(result) {
          _this.searching = false;
          if (result === 'cancelled') {
            return _this.emitter.emit('did-cancel-search');
          } else {
            return _this.emitter.emit('did-finish-search');
          }
        };
      })(this))["catch"]((function(_this) {
        return function(reason) {
          _this.searching = false;
          return _this.emitter.emit('did-fail-search', reason);
        };
      })(this));
    };

    TodoCollection.prototype.getSearchPaths = function() {
      var ignore, ignores, _i, _len, _results;
      ignores = atom.config.get('todo-show.ignoreThesePaths');
      if (ignores == null) {
        return ['*'];
      }
      if (Object.prototype.toString.call(ignores) !== '[object Array]') {
        this.emitter.emit('did-fail-search', "ignoreThesePaths must be an array");
        return ['*'];
      }
      _results = [];
      for (_i = 0, _len = ignores.length; _i < _len; _i++) {
        ignore = ignores[_i];
        _results.push("!" + ignore);
      }
      return _results;
    };

    TodoCollection.prototype.activeProjectHas = function(filePath) {
      var project;
      if (filePath == null) {
        filePath = '';
      }
      if (!(project = this.getActiveProject())) {
        return;
      }
      return filePath.indexOf(project) === 0;
    };

    TodoCollection.prototype.getActiveProject = function() {
      var project;
      if (this.activeProject) {
        return this.activeProject;
      }
      if (project = this.getFallbackProject()) {
        return this.activeProject = project;
      }
    };

    TodoCollection.prototype.getFallbackProject = function() {
      var item, project, _i, _len, _ref;
      _ref = atom.workspace.getPaneItems();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (project = this.projectForFile(typeof item.getPath === "function" ? item.getPath() : void 0)) {
          return project;
        }
      }
      if (project = atom.project.getPaths()[0]) {
        return project;
      }
    };

    TodoCollection.prototype.getActiveProjectName = function() {
      var projectName;
      projectName = path.basename(this.getActiveProject());
      if (projectName === 'undefined') {
        return "no active project";
      } else {
        return projectName;
      }
    };

    TodoCollection.prototype.setActiveProject = function(filePath) {
      var lastProject, project;
      lastProject = this.activeProject;
      if (project = this.projectForFile(filePath)) {
        this.activeProject = project;
      }
      if (!lastProject) {
        return false;
      }
      return lastProject !== this.activeProject;
    };

    TodoCollection.prototype.projectForFile = function(filePath) {
      var project;
      if (typeof filePath !== 'string') {
        return;
      }
      if (project = atom.project.relativizePath(filePath)[0]) {
        return project;
      }
    };

    TodoCollection.prototype.getMarkdown = function() {
      var todosMarkdown;
      todosMarkdown = new TodosMarkdown;
      return todosMarkdown.markdown(this.getTodos());
    };

    TodoCollection.prototype.cancelSearch = function() {
      var _ref;
      return (_ref = this.searchPromise) != null ? typeof _ref.cancel === "function" ? _ref.cancel() : void 0 : void 0;
    };

    return TodoCollection;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLWNvbGxlY3Rpb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtFQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQURELENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FIWixDQUFBOztBQUFBLEVBSUEsYUFBQSxHQUFnQixPQUFBLENBQVEsaUJBQVIsQ0FKaEIsQ0FBQTs7QUFBQSxFQUtBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUxaLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSx3QkFBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsTUFEZCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsS0FBRCxHQUFTLFdBRlQsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxFQUhULENBRFc7SUFBQSxDQUFiOztBQUFBLDZCQU1BLFlBQUEsR0FBYyxTQUFDLEVBQUQsR0FBQTthQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGNBQVosRUFBNEIsRUFBNUIsRUFBUjtJQUFBLENBTmQsQ0FBQTs7QUFBQSw2QkFPQSxlQUFBLEdBQWlCLFNBQUMsRUFBRCxHQUFBO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksaUJBQVosRUFBK0IsRUFBL0IsRUFBUjtJQUFBLENBUGpCLENBQUE7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

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/todo-show/lib/todo-collection.coffee

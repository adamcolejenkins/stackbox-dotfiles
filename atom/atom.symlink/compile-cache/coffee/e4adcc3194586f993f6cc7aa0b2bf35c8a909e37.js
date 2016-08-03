(function() {
  var $, CompositeDisposable, ShowTodoView, TableHeaderView, TodoEmptyView, TodoView, View, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), View = _ref.View, $ = _ref.$;

  _ref1 = require('./todo-item-view'), TableHeaderView = _ref1.TableHeaderView, TodoView = _ref1.TodoView, TodoEmptyView = _ref1.TodoEmptyView;

  module.exports = ShowTodoView = (function(_super) {
    __extends(ShowTodoView, _super);

    function ShowTodoView() {
      this.renderTable = __bind(this.renderTable, this);
      this.clearTodos = __bind(this.clearTodos, this);
      this.renderTodo = __bind(this.renderTodo, this);
      this.tableHeaderClicked = __bind(this.tableHeaderClicked, this);
      this.initTable = __bind(this.initTable, this);
      return ShowTodoView.__super__.constructor.apply(this, arguments);
    }

    ShowTodoView.content = function() {
      return this.div({
        "class": 'todo-table',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.table({
            outlet: 'table'
          });
        };
      })(this));
    };

    ShowTodoView.prototype.initialize = function(collection) {
      this.collection = collection;
      this.disposables = new CompositeDisposable;
      this.handleConfigChanges();
      return this.handleEvents();
    };

    ShowTodoView.prototype.handleEvents = function() {
      this.disposables.add(this.collection.onDidFinishSearch(this.initTable));
      this.disposables.add(this.collection.onDidRemoveTodo(this.removeTodo));
      this.disposables.add(this.collection.onDidClear(this.clearTodos));
      this.disposables.add(this.collection.onDidSortTodos((function(_this) {
        return function(todos) {
          return _this.renderTable(todos);
        };
      })(this)));
      this.disposables.add(this.collection.onDidFilterTodos((function(_this) {
        return function(todos) {
          return _this.renderTable(todos);
        };
      })(this)));
      return this.on('click', 'th', this.tableHeaderClicked);
    };

    ShowTodoView.prototype.handleConfigChanges = function() {
      this.disposables.add(atom.config.onDidChange('todo-show.showInTable', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          _this.showInTable = newValue;
          return _this.renderTable(_this.collection.getTodos());
        };
      })(this)));
      this.disposables.add(atom.config.onDidChange('todo-show.sortBy', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.sort(_this.sortBy = newValue, _this.sortAsc);
        };
      })(this)));
      return this.disposables.add(atom.config.onDidChange('todo-show.sortAscending', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.sort(_this.sortBy, _this.sortAsc = newValue);
        };
      })(this)));
    };

    ShowTodoView.prototype.destroy = function() {
      this.disposables.dispose();
      return this.empty();
    };

    ShowTodoView.prototype.initTable = function() {
      this.showInTable = atom.config.get('todo-show.showInTable');
      this.sortBy = atom.config.get('todo-show.sortBy');
      this.sortAsc = atom.config.get('todo-show.sortAscending');
      return this.sort(this.sortBy, this.sortAsc);
    };

    ShowTodoView.prototype.renderTableHeader = function() {
      return this.table.append(new TableHeaderView(this.showInTable, {
        sortBy: this.sortBy,
        sortAsc: this.sortAsc
      }));
    };

    ShowTodoView.prototype.tableHeaderClicked = function(e) {
      var item, sortAsc;
      item = e.target.innerText;
      sortAsc = this.sortBy === item ? !this.sortAsc : true;
      atom.config.set('todo-show.sortBy', item);
      return atom.config.set('todo-show.sortAscending', sortAsc);
    };

    ShowTodoView.prototype.renderTodo = function(todo) {
      return this.table.append(new TodoView(this.showInTable, todo));
    };

    ShowTodoView.prototype.removeTodo = function(todo) {
      return console.log('removeTodo');
    };

    ShowTodoView.prototype.clearTodos = function() {
      return this.table.empty();
    };

    ShowTodoView.prototype.renderTable = function(todos) {
      var todo, _i, _len, _ref2;
      this.clearTodos();
      this.renderTableHeader();
      _ref2 = todos = todos;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        todo = _ref2[_i];
        this.renderTodo(todo);
      }
      if (!todos.length) {
        return this.table.append(new TodoEmptyView(this.showInTable));
      }
    };

    ShowTodoView.prototype.sort = function(sortBy, sortAsc) {
      return this.collection.sortTodos({
        sortBy: sortBy,
        sortAsc: sortAsc
      });
    };

    return ShowTodoView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLXRhYmxlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlHQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxPQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsWUFBQSxJQUFELEVBQU8sU0FBQSxDQURQLENBQUE7O0FBQUEsRUFHQSxRQUE2QyxPQUFBLENBQVEsa0JBQVIsQ0FBN0MsRUFBQyx3QkFBQSxlQUFELEVBQWtCLGlCQUFBLFFBQWxCLEVBQTRCLHNCQUFBLGFBSDVCLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osbUNBQUEsQ0FBQTs7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxZQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxZQUFQO0FBQUEsUUFBcUIsUUFBQSxFQUFVLENBQUEsQ0FBL0I7T0FBTCxFQUF3QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUN0QyxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsWUFBQSxNQUFBLEVBQVEsT0FBUjtXQUFQLEVBRHNDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEMsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSwyQkFJQSxVQUFBLEdBQVksU0FBRSxVQUFGLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxhQUFBLFVBQ1osQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxH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

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/todo-show/lib/todo-table-view.coffee

(function() {
  var TableHeaderView, TodoEmptyView, TodoView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  View = require('atom-space-pen-views').View;

  TableHeaderView = (function(_super) {
    __extends(TableHeaderView, _super);

    function TableHeaderView() {
      return TableHeaderView.__super__.constructor.apply(this, arguments);
    }

    TableHeaderView.content = function(showInTable, _arg) {
      var sortAsc, sortBy;
      if (showInTable == null) {
        showInTable = [];
      }
      sortBy = _arg.sortBy, sortAsc = _arg.sortAsc;
      return this.tr((function(_this) {
        return function() {
          var item, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = showInTable.length; _i < _len; _i++) {
            item = showInTable[_i];
            _results.push(_this.th(item, function() {
              if (item === sortBy && sortAsc) {
                _this.div({
                  "class": 'sort-asc icon-triangle-down active'
                });
              } else {
                _this.div({
                  "class": 'sort-asc icon-triangle-down'
                });
              }
              if (item === sortBy && !sortAsc) {
                return _this.div({
                  "class": 'sort-desc icon-triangle-up active'
                });
              } else {
                return _this.div({
                  "class": 'sort-desc icon-triangle-up'
                });
              }
            }));
          }
          return _results;
        };
      })(this));
    };

    return TableHeaderView;

  })(View);

  TodoView = (function(_super) {
    __extends(TodoView, _super);

    function TodoView() {
      this.openPath = __bind(this.openPath, this);
      return TodoView.__super__.constructor.apply(this, arguments);
    }

    TodoView.content = function(showInTable, todo) {
      if (showInTable == null) {
        showInTable = [];
      }
      return this.tr((function(_this) {
        return function() {
          var item, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = showInTable.length; _i < _len; _i++) {
            item = showInTable[_i];
            _results.push(_this.td(function() {
              switch (item) {
                case 'All':
                  return _this.span(todo.all);
                case 'Text':
                  return _this.span(todo.text);
                case 'Type':
                  return _this.i(todo.type);
                case 'Range':
                  return _this.i(todo.range);
                case 'Line':
                  return _this.i(todo.line);
                case 'Regex':
                  return _this.code(todo.regex);
                case 'Path':
                  return _this.a(todo.path);
                case 'File':
                  return _this.a(todo.file);
                case 'Tags':
                  return _this.i(todo.tags);
                case 'Id':
                  return _this.i(todo.id);
                case 'Project':
                  return _this.a(todo.project);
              }
            }));
          }
          return _results;
        };
      })(this));
    };

    TodoView.prototype.initialize = function(showInTable, todo) {
      this.todo = todo;
      return this.handleEvents();
    };

    TodoView.prototype.destroy = function() {
      return this.detach();
    };

    TodoView.prototype.handleEvents = function() {
      return this.on('click', 'td', this.openPath);
    };

    TodoView.prototype.openPath = function() {
      var pending, position;
      if (!(this.todo && this.todo.loc)) {
        return;
      }
      position = [this.todo.position[0][0], this.todo.position[0][1]];
      pending = atom.config.get('core.allowPendingPaneItems') || false;
      return atom.workspace.open(this.todo.loc, {
        split: 'left',
        pending: pending
      }).then(function() {
        var textEditor;
        if (textEditor = atom.workspace.getActiveTextEditor()) {
          textEditor.setCursorBufferPosition(position, {
            autoscroll: false
          });
          return textEditor.scrollToCursorPosition({
            center: true
          });
        }
      });
    };

    return TodoView;

  })(View);

  TodoEmptyView = (function(_super) {
    __extends(TodoEmptyView, _super);

    function TodoEmptyView() {
      return TodoEmptyView.__super__.constructor.apply(this, arguments);
    }

    TodoEmptyView.content = function(showInTable) {
      if (showInTable == null) {
        showInTable = [];
      }
      return this.tr((function(_this) {
        return function() {
          return _this.td({
            colspan: showInTable.length
          }, function() {
            return _this.p("No results...");
          });
        };
      })(this));
    };

    return TodoEmptyView;

  })(View);

  module.exports = {
    TableHeaderView: TableHeaderView,
    TodoView: TodoView,
    TodoEmptyView: TodoEmptyView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLWl0ZW0tdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOENBQUE7SUFBQTs7c0ZBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUVNO0FBQ0osc0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsZUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLFdBQUQsRUFBbUIsSUFBbkIsR0FBQTtBQUNSLFVBQUEsZUFBQTs7UUFEUyxjQUFjO09BQ3ZCO0FBQUEsTUFENEIsY0FBQSxRQUFRLGVBQUEsT0FDcEMsQ0FBQTthQUFBLElBQUMsQ0FBQSxFQUFELENBQUksQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNGLGNBQUEsd0JBQUE7QUFBQTtlQUFBLGtEQUFBO21DQUFBO0FBQ0UsMEJBQUEsS0FBQyxDQUFBLEVBQUQsQ0FBSSxJQUFKLEVBQVUsU0FBQSxHQUFBO0FBQ1IsY0FBQSxJQUFHLElBQUEsS0FBUSxNQUFSLElBQW1CLE9BQXRCO0FBQ0UsZ0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyxvQ0FBUDtpQkFBTCxDQUFBLENBREY7ZUFBQSxNQUFBO0FBR0UsZ0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyw2QkFBUDtpQkFBTCxDQUFBLENBSEY7ZUFBQTtBQUlBLGNBQUEsSUFBRyxJQUFBLEtBQVEsTUFBUixJQUFtQixDQUFBLE9BQXRCO3VCQUNFLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxrQkFBQSxPQUFBLEVBQU8sbUNBQVA7aUJBQUwsRUFERjtl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

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/todo-show/lib/todo-item-view.coffee

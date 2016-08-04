(function() {
  var TodosMarkdown;

  module.exports = TodosMarkdown = (function() {
    function TodosMarkdown() {
      this.showInTable = atom.config.get('todo-show.showInTable');
    }

    TodosMarkdown.prototype.getTable = function(todos) {
      var key, md, out, todo;
      md = "| " + (((function() {
        var _i, _len, _ref, _results;
        _ref = this.showInTable;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          _results.push(key);
        }
        return _results;
      }).call(this)).join(' | ')) + " |\n";
      md += "|" + (Array(md.length - 2).join('-')) + "|\n";
      return md + ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = todos.length; _i < _len; _i++) {
          todo = todos[_i];
          out = '|' + todo.getMarkdownArray(this.showInTable).join(' |');
          _results.push("" + out + " |\n");
        }
        return _results;
      }).call(this)).join('');
    };

    TodosMarkdown.prototype.getList = function(todos) {
      var out, todo;
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = todos.length; _i < _len; _i++) {
          todo = todos[_i];
          out = '-' + todo.getMarkdownArray(this.showInTable).join('');
          if (out === '-') {
            out = "- No details";
          }
          _results.push("" + out + "\n");
        }
        return _results;
      }).call(this)).join('');
    };

    TodosMarkdown.prototype.markdown = function(todos) {
      if (atom.config.get('todo-show.saveOutputAs') === 'Table') {
        return this.getTable(todos);
      } else {
        return this.getList(todos);
      }
    };

    return TodosMarkdown;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLW1hcmtkb3duLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxhQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsdUJBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLENBQWYsQ0FEVztJQUFBLENBQWI7O0FBQUEsNEJBR0EsUUFBQSxHQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsVUFBQSxrQkFBQTtBQUFBLE1BQUEsRUFBQSxHQUFPLElBQUEsR0FBRyxDQUFDOztBQUFDO0FBQUE7YUFBQSwyQ0FBQTt5QkFBQTtBQUE2Qix3QkFBQSxJQUFBLENBQTdCO0FBQUE7O21CQUFELENBQWtDLENBQUMsSUFBbkMsQ0FBd0MsS0FBeEMsQ0FBRCxDQUFILEdBQW1ELE1BQTFELENBQUE7QUFBQSxNQUNBLEVBQUEsSUFBTyxHQUFBLEdBQUUsQ0FBQyxLQUFBLENBQU0sRUFBRSxDQUFDLE1BQUgsR0FBVSxDQUFoQixDQUFrQixDQUFDLElBQW5CLENBQXdCLEdBQXhCLENBQUQsQ0FBRixHQUFnQyxLQUR2QyxDQUFBO2FBRUEsRUFBQSxHQUFLOztBQUFDO2FBQUEsNENBQUE7MkJBQUE7QUFDSixVQUFBLEdBQUEsR0FBTSxHQUFBLEdBQU0sSUFBSSxDQUFDLGdCQUFMLENBQXNCLElBQUMsQ0FBQSxXQUF2QixDQUFtQyxDQUFDLElBQXBDLENBQXlDLElBQXpDLENBQVosQ0FBQTtBQUFBLHdCQUNBLEVBQUEsR0FBRyxHQUFILEdBQU8sT0FEUCxDQURJO0FBQUE7O21CQUFELENBR0osQ0FBQyxJQUhHLENBR0UsRUFIRixFQUhHO0lBQUEsQ0FIVixDQUFBOztBQUFBLDRCQVdBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTtBQUNQLFVBQUEsU0FBQTthQUFBOztBQUFDO2FBQUEsNENBQUE7MkJBQUE7QUFDQyxVQUFBLEdBQUEsR0FBTSxHQUFBLEdBQU0sSUFBSSxDQUFDLGdCQUFMLENBQXNCLElBQUMsQ0FBQSxXQUF2QixDQUFtQyxDQUFDLElBQXBDLENBQXlDLEVBQXpDLENBQVosQ0FBQTtBQUNBLFVBQUEsSUFBd0IsR0FBQSxLQUFPLEdBQS9CO0FBQUEsWUFBQSxHQUFBLEdBQU0sY0FBTixDQUFBO1dBREE7QUFBQSx3QkFFQSxFQUFBLEdBQUcsR0FBSCxHQUFPLEtBRlAsQ0FERDtBQUFBOzttQkFBRCxDQUlDLENBQUMsSUFKRixDQUlPLEVBSlAsRUFETztJQUFBLENBWFQsQ0FBQTs7QUFBQSw0QkFrQkEsUUFBQSxHQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsQ0FBQSxLQUE2QyxPQUFoRDtlQUNFLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVixFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxPQUFELENBQVMsS0FBVCxFQUhGO09BRFE7SUFBQSxDQWxCVixDQUFBOzt5QkFBQTs7TUFGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/todo-show/lib/todo-markdown.coffee

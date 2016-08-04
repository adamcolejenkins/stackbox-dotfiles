(function() {
  var ShowTodo, TodoCollection, TodoModel, TodoRegex, fixturesPath, path, sample1Path, sample2Path;

  path = require('path');

  TodoCollection = require('../lib/todo-collection');

  ShowTodo = require('../lib/show-todo');

  TodoModel = require('../lib/todo-model');

  TodoRegex = require('../lib/todo-regex');

  sample1Path = path.join(__dirname, 'fixtures/sample1');

  sample2Path = path.join(__dirname, 'fixtures/sample2');

  fixturesPath = path.join(__dirname, 'fixtures');

  describe('Todo Collection', function() {
    var addTestTodos, collection, defaultShowInTable, todoRegex, _ref;
    _ref = [], collection = _ref[0], todoRegex = _ref[1], defaultShowInTable = _ref[2];
    addTestTodos = function() {
      collection.addTodo(new TodoModel({
        all: '#FIXME: fixme 1',
        loc: 'file1.txt',
        position: [[3, 6], [3, 10]],
        regex: todoRegex.regex,
        regexp: todoRegex.regexp
      }));
      collection.addTodo(new TodoModel({
        all: '#TODO: todo 1',
        loc: 'file1.txt',
        position: [[4, 5], [4, 9]],
        regex: todoRegex.regex,
        regexp: todoRegex.regexp
      }));
      return collection.addTodo(new TodoModel({
        all: '#FIXME: fixme 2',
        loc: 'file2.txt',
        position: [[5, 7], [5, 11]],
        regex: todoRegex.regex,
        regexp: todoRegex.regexp
      }));
    };
    beforeEach(function() {
      todoRegex = new TodoRegex(ShowTodo.config.findUsingRegex["default"], ['FIXME', 'TODO']);
      defaultShowInTable = ['Text', 'Type', 'File'];
      collection = new TodoCollection;
      return atom.project.setPaths([sample1Path]);
    });
    describe('fetchRegexItem(todoRegex)', function() {
      it('scans project for regex', function() {
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(4);
          expect(collection.todos[0].text).toBe('Comment in C');
          expect(collection.todos[1].text).toBe('This is the first todo');
          expect(collection.todos[2].text).toBe('This is the second todo');
          return expect(collection.todos[3].text).toBe('Add more annnotations :)');
        });
      });
      it('scans full workspace', function() {
        atom.project.addPath(sample2Path);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(10);
        });
      });
      it('should handle other regexes', function() {
        waitsForPromise(function() {
          todoRegex.regexp = /#include(.+)/g;
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('<stdio.h>');
        });
      });
      it('should handle special character regexes', function() {
        waitsForPromise(function() {
          todoRegex.regexp = /This is the (?:first|second) todo/g;
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(2);
          expect(collection.todos[0].text).toBe('This is the first todo');
          return expect(collection.todos[1].text).toBe('This is the second todo');
        });
      });
      it('should handle regex without capture group', function() {
        var lookup;
        lookup = {
          title: 'This is Code',
          regex: ''
        };
        waitsForPromise(function() {
          todoRegex.regexp = /[\w\s]+code[\w\s]*/g;
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('Sample quicksort code');
        });
      });
      it('should handle post-annotations with special regex', function() {
        waitsForPromise(function() {
          todoRegex.regexp = /(.+).{3}DEBUG\s*$/g;
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should handle post-annotations with non-capturing group', function() {
        waitsForPromise(function() {
          todoRegex.regexp = /(.+?(?=.{3}DEBUG\s*$))/;
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should truncate todos longer than the defined max length of 120', function() {
        waitsForPromise(function() {
          todoRegex.regexp = /LOONG:?(.+$)/g;
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          var text, text2;
          text = 'Lorem ipsum dolor sit amet, dapibus rhoncus. Scelerisque quam,';
          text += ' id ante molestias, ipsum lorem magnis et. A eleifend i...';
          text2 = '_SpgLE84Ms1K4DSumtJDoNn8ZECZLL+VR0DoGydy54vUoSpgLE84Ms1K4DSum';
          text2 += 'tJDoNn8ZECZLLVR0DoGydy54vUonRClXwLbFhX2gMwZgjx250ay+V0lF...';
          expect(collection.todos[0].text).toHaveLength(120);
          expect(collection.todos[0].text).toBe(text);
          expect(collection.todos[1].text).toHaveLength(120);
          return expect(collection.todos[1].text).toBe(text2);
        });
      });
      return it('should strip common block comment endings', function() {
        atom.project.setPaths([sample2Path]);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(6);
          expect(collection.todos[0].text).toBe('C block comment');
          expect(collection.todos[1].text).toBe('HTML comment');
          expect(collection.todos[2].text).toBe('PowerShell comment');
          expect(collection.todos[3].text).toBe('Haskell comment');
          expect(collection.todos[4].text).toBe('Lua comment');
          return expect(collection.todos[5].text).toBe('PHP comment');
        });
      });
    });
    describe('fetchRegexItem(todoRegex, activeProjectOnly)', function() {
      beforeEach(function() {
        return atom.project.addPath(sample2Path);
      });
      it('scans active project for regex', function() {
        collection.setActiveProject(sample1Path);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex, true);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(4);
          expect(collection.todos[0].text).toBe('Comment in C');
          expect(collection.todos[1].text).toBe('This is the first todo');
          expect(collection.todos[2].text).toBe('This is the second todo');
          return expect(collection.todos[3].text).toBe('Add more annnotations :)');
        });
      });
      it('changes active project', function() {
        collection.setActiveProject(sample2Path);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex, true);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(6);
          collection.clear();
          collection.setActiveProject(sample1Path);
          waitsForPromise(function() {
            return collection.fetchRegexItem(todoRegex, true);
          });
          return runs(function() {
            return expect(collection.todos).toHaveLength(4);
          });
        });
      });
      it('still respects ignored paths', function() {
        atom.config.set('todo-show.ignoreThesePaths', ['sample.js']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex, true);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('Comment in C');
        });
      });
      return it('handles no project situations', function() {
        expect(collection.activeProject).not.toBeDefined();
        expect(path.basename(collection.getActiveProject())).toBe('sample1');
        atom.project.setPaths([]);
        collection.activeProject = void 0;
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex, true);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(0);
        });
      });
    });
    describe('ignore path rules', function() {
      it('works with no paths added', function() {
        atom.config.set('todo-show.ignoreThesePaths', []);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(4);
        });
      });
      it('must be an array', function() {
        var notificationSpy;
        collection.onDidFailSearch(notificationSpy = jasmine.createSpy());
        atom.config.set('todo-show.ignoreThesePaths', '123');
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          var notification;
          expect(collection.todos).toHaveLength(4);
          notification = notificationSpy.mostRecentCall.args[0];
          expect(notificationSpy).toHaveBeenCalled();
          return expect(notification.indexOf('ignoreThesePaths')).not.toBe(-1);
        });
      });
      it('respects ignored files', function() {
        atom.config.set('todo-show.ignoreThesePaths', ['sample.js']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('Comment in C');
        });
      });
      it('respects ignored directories and filetypes', function() {
        atom.project.setPaths([fixturesPath]);
        atom.config.set('todo-show.ignoreThesePaths', ['sample1', '*.md']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(6);
          return expect(collection.todos[0].text).toBe('C block comment');
        });
      });
      it('respects ignored wildcard directories', function() {
        atom.project.setPaths([fixturesPath]);
        atom.config.set('todo-show.ignoreThesePaths', ['**/sample.js', '**/sample.txt', '*.md']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('Comment in C');
        });
      });
      return it('respects more advanced ignores', function() {
        atom.project.setPaths([fixturesPath]);
        atom.config.set('todo-show.ignoreThesePaths', ['output(-grouped)?\\.*', '*1/**']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(6);
          return expect(collection.todos[0].text).toBe('C block comment');
        });
      });
    });
    describe('fetchOpenRegexItem(lookupObj)', function() {
      var editor;
      editor = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        return runs(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
      });
      it('scans open files for the regex that is passed and fill lookup results', function() {
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          expect(collection.todos.length).toBe(1);
          return expect(collection.todos[0].text).toBe('Comment in C');
        });
      });
      it('works with files outside of workspace', function() {
        waitsForPromise(function() {
          return atom.workspace.open('../sample2/sample.txt');
        });
        return runs(function() {
          waitsForPromise(function() {
            return collection.fetchOpenRegexItem(todoRegex);
          });
          return runs(function() {
            expect(collection.todos).toHaveLength(7);
            expect(collection.todos[0].text).toBe('Comment in C');
            expect(collection.todos[1].text).toBe('C block comment');
            return expect(collection.todos[6].text).toBe('PHP comment');
          });
        });
      });
      it('handles unsaved documents', function() {
        editor.setText('TODO: New todo');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          expect(collection.todos[0].type).toBe('TODO');
          return expect(collection.todos[0].text).toBe('New todo');
        });
      });
      it('ignores todo without leading space', function() {
        editor.setText('A line // TODO:text');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(todoRegex);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(0);
        });
      });
      it('ignores todo with unwanted characters', function() {
        editor.setText('define("_JS_TODO_ALERT_", "js:alert(&quot;TODO&quot;);");');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(todoRegex);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(0);
        });
      });
      it('ignores binary data', function() {
        editor.setText('// TODOe�d��RPPP0�');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(todoRegex);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(0);
        });
      });
      return it('does not add duplicates', function() {
        addTestTodos();
        expect(collection.todos).toHaveLength(3);
        addTestTodos();
        return expect(collection.todos).toHaveLength(3);
      });
    });
    describe('getActiveProject', function() {
      beforeEach(function() {
        return atom.project.addPath(sample2Path);
      });
      it('returns active project', function() {
        collection.activeProject = sample2Path;
        return expect(collection.getActiveProject()).toBe(sample2Path);
      });
      it('falls back to first project', function() {
        return expect(collection.getActiveProject()).toBe(sample1Path);
      });
      it('falls back to first open item', function() {
        waitsForPromise(function() {
          return atom.workspace.open(path.join(sample2Path, 'sample.txt'));
        });
        return runs(function() {
          return expect(collection.getActiveProject()).toBe(sample2Path);
        });
      });
      return it('handles no project paths', function() {
        atom.project.setPaths([]);
        expect(collection.getActiveProject()).toBeFalsy();
        return expect(collection.activeProject).not.toBeDefined();
      });
    });
    describe('setActiveProject', function() {
      it('sets active project from file path and returns true if changed', function() {
        var res;
        atom.project.addPath(sample2Path);
        expect(collection.getActiveProject()).toBe(sample1Path);
        res = collection.setActiveProject(path.join(sample2Path, 'sample.txt'));
        expect(res).toBe(true);
        expect(collection.getActiveProject()).toBe(sample2Path);
        res = collection.setActiveProject(path.join(sample2Path, 'sample.txt'));
        return expect(res).toBe(false);
      });
      it('ignores if file is not in project', function() {
        var res;
        res = collection.setActiveProject(path.join(sample2Path, 'sample.txt'));
        expect(res).toBe(false);
        return expect(collection.getActiveProject()).toBe(sample1Path);
      });
      return it('handles invalid arguments', function() {
        expect(collection.setActiveProject()).toBe(false);
        expect(collection.activeProject).not.toBeDefined();
        expect(collection.setActiveProject(false)).toBe(false);
        expect(collection.activeProject).not.toBeDefined();
        expect(collection.setActiveProject({})).toBe(false);
        return expect(collection.activeProject).not.toBeDefined();
      });
    });
    describe('Sort todos', function() {
      var sortSpy;
      sortSpy = [].sortSpy;
      beforeEach(function() {
        addTestTodos();
        sortSpy = jasmine.createSpy();
        return collection.onDidSortTodos(sortSpy);
      });
      it('can sort simple todos', function() {
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: false
        });
        expect(collection.todos[0].text).toBe('todo 1');
        expect(collection.todos[2].text).toBe('fixme 1');
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('fixme 1');
        expect(collection.todos[2].text).toBe('todo 1');
        collection.sortTodos({
          sortBy: 'Text'
        });
        expect(collection.todos[0].text).toBe('todo 1');
        expect(collection.todos[2].text).toBe('fixme 1');
        collection.sortTodos({
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('fixme 1');
        expect(collection.todos[2].text).toBe('todo 1');
        collection.sortTodos();
        expect(collection.todos[0].text).toBe('todo 1');
        return expect(collection.todos[2].text).toBe('fixme 1');
      });
      it('sort by other values', function() {
        collection.sortTodos({
          sortBy: 'Range',
          sortAsc: true
        });
        expect(collection.todos[0].range).toBe('3,6,3,10');
        expect(collection.todos[2].range).toBe('5,7,5,11');
        collection.sortTodos({
          sortBy: 'File',
          sortAsc: false
        });
        expect(collection.todos[0].path).toBe('file2.txt');
        return expect(collection.todos[2].path).toBe('file1.txt');
      });
      return it('sort line as number', function() {
        collection.addTodo(new TodoModel({
          all: '#FIXME: fixme 3',
          loc: 'file3.txt',
          position: [[12, 14], [12, 16]],
          regex: todoRegex.regex,
          regexp: todoRegex.regexp
        }));
        collection.sortTodos({
          sortBy: 'Line',
          sortAsc: true
        });
        expect(collection.todos[0].line).toBe('4');
        expect(collection.todos[1].line).toBe('5');
        expect(collection.todos[2].line).toBe('6');
        expect(collection.todos[3].line).toBe('13');
        collection.sortTodos({
          sortBy: 'Range',
          sortAsc: true
        });
        expect(collection.todos[0].range).toBe('3,6,3,10');
        expect(collection.todos[1].range).toBe('4,5,4,9');
        expect(collection.todos[2].range).toBe('5,7,5,11');
        return expect(collection.todos[3].range).toBe('12,14,12,16');
      });
    });
    describe('Filter todos', function() {
      var filterSpy;
      filterSpy = [].filterSpy;
      beforeEach(function() {
        atom.config.set('todo-show.showInTable', defaultShowInTable);
        addTestTodos();
        filterSpy = jasmine.createSpy();
        return collection.onDidFilterTodos(filterSpy);
      });
      it('can filter simple todos', function() {
        collection.filterTodos('TODO');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(1);
      });
      it('can filter todos with multiple results', function() {
        collection.filterTodos('file1');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(2);
      });
      it('handles no results', function() {
        collection.filterTodos('XYZ');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(0);
      });
      it('handles empty filter', function() {
        collection.filterTodos('');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(3);
      });
      return it('case insensitive filter', function() {
        var result;
        collection.addTodo(new TodoModel({
          all: '#FIXME: THIS IS WITH CAPS',
          loc: 'file2.txt',
          position: [[6, 7], [6, 11]],
          regex: todoRegex.regex,
          regexp: todoRegex.regexp
        }));
        collection.filterTodos('FIXME 1');
        result = filterSpy.calls[0].args[0];
        expect(filterSpy.callCount).toBe(1);
        expect(result).toHaveLength(1);
        expect(result[0].text).toBe('fixme 1');
        collection.filterTodos('caps');
        result = filterSpy.calls[1].args[0];
        expect(filterSpy.callCount).toBe(2);
        expect(result).toHaveLength(1);
        expect(result[0].text).toBe('THIS IS WITH CAPS');
        collection.filterTodos('NONEXISTING');
        result = filterSpy.calls[2].args[0];
        expect(filterSpy.callCount).toBe(3);
        return expect(result).toHaveLength(0);
      });
    });
    return describe('Markdown', function() {
      beforeEach(function() {
        atom.config.set('todo-show.findTheseTodos', ['FIXME', 'TODO']);
        return atom.config.set('todo-show.showInTable', defaultShowInTable);
      });
      it('creates a markdown string from regexes', function() {
        addTestTodos();
        return expect(collection.getMarkdown()).toEqual("- fixme 1 __FIXME__ [file1.txt](file1.txt)\n- todo 1 __TODO__ [file1.txt](file1.txt)\n- fixme 2 __FIXME__ [file2.txt](file2.txt)\n");
      });
      it('creates markdown with sorting', function() {
        addTestTodos();
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: true
        });
        return expect(collection.getMarkdown()).toEqual("- fixme 1 __FIXME__ [file1.txt](file1.txt)\n- fixme 2 __FIXME__ [file2.txt](file2.txt)\n- todo 1 __TODO__ [file1.txt](file1.txt)\n");
      });
      it('creates markdown with inverse sorting', function() {
        addTestTodos();
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: false
        });
        return expect(collection.getMarkdown()).toEqual("- todo 1 __TODO__ [file1.txt](file1.txt)\n- fixme 2 __FIXME__ [file2.txt](file2.txt)\n- fixme 1 __FIXME__ [file1.txt](file1.txt)\n");
      });
      it('creates markdown with different items', function() {
        addTestTodos();
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range']);
        return expect(collection.getMarkdown()).toEqual("- __FIXME__ [file1.txt](file1.txt) _:3,6,3,10_\n- __TODO__ [file1.txt](file1.txt) _:4,5,4,9_\n- __FIXME__ [file2.txt](file2.txt) _:5,7,5,11_\n");
      });
      it('creates markdown as table', function() {
        addTestTodos();
        atom.config.set('todo-show.saveOutputAs', 'Table');
        return expect(collection.getMarkdown()).toEqual("| Text | Type | File |\n|--------------------|\n| fixme 1 | __FIXME__ | [file1.txt](file1.txt) |\n| todo 1 | __TODO__ | [file1.txt](file1.txt) |\n| fixme 2 | __FIXME__ | [file2.txt](file2.txt) |\n");
      });
      it('creates markdown as table with different items', function() {
        addTestTodos();
        atom.config.set('todo-show.saveOutputAs', 'Table');
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range']);
        return expect(collection.getMarkdown()).toEqual("| Type | File | Range |\n|---------------------|\n| __FIXME__ | [file1.txt](file1.txt) | _:3,6,3,10_ |\n| __TODO__ | [file1.txt](file1.txt) | _:4,5,4,9_ |\n| __FIXME__ | [file2.txt](file2.txt) | _:5,7,5,11_ |\n");
      });
      it('accepts missing ranges and paths in regexes', function() {
        var markdown;
        collection.addTodo(new TodoModel({
          text: 'fixme 1',
          type: 'FIXME'
        }, {
          plain: true
        }));
        expect(collection.getMarkdown()).toEqual("- fixme 1 __FIXME__\n");
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range', 'Text']);
        markdown = '\n## Unknown File\n\n- fixme 1 `FIXMEs`\n';
        return expect(collection.getMarkdown()).toEqual("- __FIXME__ fixme 1\n");
      });
      it('accepts missing title in regexes', function() {
        collection.addTodo(new TodoModel({
          text: 'fixme 1',
          file: 'file1.txt'
        }, {
          plain: true
        }));
        expect(collection.getMarkdown()).toEqual("- fixme 1 [file1.txt](file1.txt)\n");
        atom.config.set('todo-show.showInTable', ['Title']);
        return expect(collection.getMarkdown()).toEqual("- No details\n");
      });
      return it('accepts missing items in table output', function() {
        collection.addTodo(new TodoModel({
          text: 'fixme 1',
          type: 'FIXME'
        }, {
          plain: true
        }));
        atom.config.set('todo-show.saveOutputAs', 'Table');
        expect(collection.getMarkdown()).toEqual("| Text | Type | File |\n|--------------------|\n| fixme 1 | __FIXME__ | |\n");
        atom.config.set('todo-show.showInTable', ['Line']);
        return expect(collection.getMarkdown()).toEqual("| Line |\n|------|\n| |\n");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvdG9kby1zaG93L3NwZWMvdG9kby1jb2xsZWN0aW9uLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRGQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHdCQUFSLENBRmpCLENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGtCQUFSLENBSFgsQ0FBQTs7QUFBQSxFQUlBLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVIsQ0FKWixDQUFBOztBQUFBLEVBS0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxtQkFBUixDQUxaLENBQUE7O0FBQUEsRUFPQSxXQUFBLEdBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGtCQUFyQixDQVBkLENBQUE7O0FBQUEsRUFRQSxXQUFBLEdBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGtCQUFyQixDQVJkLENBQUE7O0FBQUEsRUFTQSxZQUFBLEdBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFVBQXJCLENBVGYsQ0FBQTs7QUFBQSxFQVdBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsUUFBQSw2REFBQTtBQUFBLElBQUEsT0FBOEMsRUFBOUMsRUFBQyxvQkFBRCxFQUFhLG1CQUFiLEVBQXdCLDRCQUF4QixDQUFBO0FBQUEsSUFFQSxZQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsTUFBQSxVQUFVLENBQUMsT0FBWCxDQUNNLElBQUEsU0FBQSxDQUNGO0FBQUEsUUFBQSxHQUFBLEVBQUssaUJBQUw7QUFBQSxRQUNBLEdBQUEs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

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/todo-show/spec/todo-collection-spec.coffee

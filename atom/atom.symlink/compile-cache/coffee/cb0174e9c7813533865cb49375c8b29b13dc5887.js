(function() {
  var fs, path, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  describe('ShowTodo opening panes and executing commands', function() {
    var activationPromise, executeCommand, showTodoModule, showTodoPane, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1], showTodoModule = _ref[2], showTodoPane = _ref[3];
    executeCommand = function(callback) {
      var wasVisible;
      wasVisible = showTodoModule != null ? showTodoModule.showTodoView.isVisible() : void 0;
      atom.commands.dispatch(workspaceElement, 'todo-show:find-in-workspace');
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(function() {
        waitsFor(function() {
          if (wasVisible) {
            return !showTodoModule.showTodoView.isVisible();
          }
          return !showTodoModule.showTodoView.isSearching() && showTodoModule.showTodoView.isVisible();
        });
        return runs(function() {
          showTodoPane = atom.workspace.paneForItem(showTodoModule.showTodoView);
          return callback();
        });
      });
    };
    beforeEach(function() {
      atom.project.setPaths([path.join(__dirname, 'fixtures/sample1')]);
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      return activationPromise = atom.packages.activatePackage('todo-show').then(function(opts) {
        return showTodoModule = opts.mainModule;
      });
    });
    describe('when the show-todo:find-in-workspace event is triggered', function() {
      it('attaches and then detaches the pane view', function() {
        expect(atom.packages.loadedPackages['todo-show']).toBeDefined();
        expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
        return executeCommand(function() {
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          expect(showTodoPane.parent.orientation).toBe('horizontal');
          return executeCommand(function() {
            return expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
          });
        });
      });
      it('can open in vertical split', function() {
        atom.config.set('todo-show.openListInDirection', 'down');
        return executeCommand(function() {
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          return expect(showTodoPane.parent.orientation).toBe('vertical');
        });
      });
      it('can open ontop of current view', function() {
        atom.config.set('todo-show.openListInDirection', 'ontop');
        return executeCommand(function() {
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          return expect(showTodoPane.parent.orientation).not.toExist();
        });
      });
      it('has visible elements in view', function() {
        return executeCommand(function() {
          var element;
          element = showTodoModule.showTodoView.find('td').last();
          expect(element.text()).toEqual('sample.js');
          return expect(element.isVisible()).toBe(true);
        });
      });
      it('persists pane width', function() {
        return executeCommand(function() {
          var newFlex, originalFlex;
          originalFlex = showTodoPane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          expect(showTodoModule.showTodoView).toBeVisible();
          showTodoPane.setFlexScale(newFlex);
          return executeCommand(function() {
            expect(showTodoPane).not.toExist();
            expect(showTodoModule.showTodoView).not.toBeVisible();
            return executeCommand(function() {
              expect(showTodoPane.getFlexScale()).toEqual(newFlex);
              return showTodoPane.setFlexScale(originalFlex);
            });
          });
        });
      });
      it('does not persist pane width if asked not to', function() {
        atom.config.set('todo-show.rememberViewSize', false);
        return executeCommand(function() {
          var newFlex, originalFlex;
          originalFlex = showTodoPane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          showTodoPane.setFlexScale(newFlex);
          return executeCommand(function() {
            return executeCommand(function() {
              expect(showTodoPane.getFlexScale()).not.toEqual(newFlex);
              return expect(showTodoPane.getFlexScale()).toEqual(originalFlex);
            });
          });
        });
      });
      return it('persists horizontal pane height', function() {
        atom.config.set('todo-show.openListInDirection', 'down');
        return executeCommand(function() {
          var newFlex, originalFlex;
          originalFlex = showTodoPane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          showTodoPane.setFlexScale(newFlex);
          return executeCommand(function() {
            expect(showTodoPane).not.toExist();
            return executeCommand(function() {
              expect(showTodoPane.getFlexScale()).toEqual(newFlex);
              return showTodoPane.setFlexScale(originalFlex);
            });
          });
        });
      });
    });
    describe('when the show-todo:find-in-workspace event is triggered', function() {
      return it('activates', function() {
        expect(atom.packages.loadedPackages['todo-show']).toBeDefined();
        return expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
      });
    });
    describe('when todo item is clicked', function() {
      it('opens the file', function() {
        return executeCommand(function() {
          var element, item;
          element = showTodoModule.showTodoView.find('td').last();
          item = atom.workspace.getActivePaneItem();
          expect(item).not.toBeDefined();
          element.click();
          waitsFor(function() {
            return item = atom.workspace.getActivePaneItem();
          });
          return runs(function() {
            return expect(item.getTitle()).toBe('sample.js');
          });
        });
      });
      return it('opens file other project', function() {
        atom.project.addPath(path.join(__dirname, 'fixtures/sample2'));
        return executeCommand(function() {
          var element, item;
          element = showTodoModule.showTodoView.find('td')[3];
          item = atom.workspace.getActivePaneItem();
          expect(item).not.toBeDefined();
          element.click();
          waitsFor(function() {
            return item = atom.workspace.getActivePaneItem();
          });
          return runs(function() {
            return expect(item.getTitle()).toBe('sample.txt');
          });
        });
      });
    });
    describe('when save-as button is clicked', function() {
      it('saves the list in markdown and opens it', function() {
        var expectedFilePath, expectedOutput, outputPath;
        outputPath = temp.path({
          suffix: '.md'
        });
        expectedFilePath = atom.project.getDirectories()[0].resolve('../saved-output.md');
        expectedOutput = fs.readFileSync(expectedFilePath).toString();
        atom.config.set('todo-show.sortBy', 'Type');
        expect(fs.isFileSync(outputPath)).toBe(false);
        executeCommand(function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(outputPath);
          return showTodoModule.showTodoView.saveAs();
        });
        waitsFor(function() {
          var _ref1;
          return fs.existsSync(outputPath) && ((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0) === fs.realpathSync(outputPath);
        });
        return runs(function() {
          expect(fs.isFileSync(outputPath)).toBe(true);
          return expect(atom.workspace.getActiveTextEditor().getText()).toBe(expectedOutput);
        });
      });
      return it('saves another list sorted differently in markdown', function() {
        var outputPath;
        outputPath = temp.path({
          suffix: '.md'
        });
        atom.config.set('todo-show.findTheseTodos', ['TODO']);
        atom.config.set('todo-show.showInTable', ['Text', 'Type', 'File', 'Line']);
        atom.config.set('todo-show.sortBy', 'File');
        expect(fs.isFileSync(outputPath)).toBe(false);
        executeCommand(function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(outputPath);
          return showTodoModule.showTodoView.saveAs();
        });
        waitsFor(function() {
          var _ref1;
          return fs.existsSync(outputPath) && ((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0) === fs.realpathSync(outputPath);
        });
        return runs(function() {
          expect(fs.isFileSync(outputPath)).toBe(true);
          return expect(atom.workspace.getActiveTextEditor().getText()).toBe("- Comment in C __TODO__ [sample.c](sample.c) _:5_\n- This is the first todo __TODO__ [sample.js](sample.js) _:3_\n- This is the second todo __TODO__ [sample.js](sample.js) _:20_\n");
        });
      });
    });
    describe('when core:refresh is triggered', function() {
      return it('refreshes the list', function() {
        return executeCommand(function() {
          atom.commands.dispatch(workspaceElement.querySelector('.show-todo-preview'), 'core:refresh');
          expect(showTodoModule.showTodoView.isSearching()).toBe(true);
          expect(showTodoModule.showTodoView.find('.markdown-spinner')).toBeVisible();
          waitsFor(function() {
            return !showTodoModule.showTodoView.isSearching();
          });
          return runs(function() {
            expect(showTodoModule.showTodoView.find('.markdown-spinner')).not.toBeVisible();
            return expect(showTodoModule.showTodoView.isSearching()).toBe(false);
          });
        });
      });
    });
    describe('when the show-todo:find-in-open-files event is triggered', function() {
      beforeEach(function() {
        atom.commands.dispatch(workspaceElement, 'todo-show:find-in-open-files');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return waitsFor(function() {
            return !showTodoModule.showTodoView.isSearching() && showTodoModule.showTodoView.isVisible();
          });
        });
      });
      it('does not show any results with no open files', function() {
        var element;
        element = showTodoModule.showTodoView.find('p').last();
        expect(showTodoModule.showTodoView.getTodos()).toHaveLength(0);
        expect(element.text()).toContain('No results...');
        return expect(element.isVisible()).toBe(true);
      });
      return it('only shows todos from open files', function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        waitsFor(function() {
          return !showTodoModule.showTodoView.isSearching();
        });
        return runs(function() {
          var todos;
          todos = showTodoModule.showTodoView.getTodos();
          expect(todos).toHaveLength(1);
          expect(todos[0].type).toBe('TODO');
          expect(todos[0].text).toBe('Comment in C');
          return expect(todos[0].file).toBe('sample.c');
        });
      });
    });
    return describe('status bar indicator', function() {
      var todoIndicatorClass;
      todoIndicatorClass = '.status-bar .todo-status-bar-indicator';
      return it('shows the current number of todos', function() {
        atom.packages.activatePackage('status-bar');
        return executeCommand(function() {
          var indicatorElement, nTodos;
          expect(workspaceElement.querySelector(todoIndicatorClass)).not.toExist();
          atom.config.set('todo-show.statusBarIndicator', true);
          expect(workspaceElement.querySelector(todoIndicatorClass)).toExist();
          nTodos = showTodoModule.showTodoView.getTodosCount();
          expect(nTodos).not.toBe(0);
          indicatorElement = workspaceElement.querySelector(todoIndicatorClass);
          return expect(indicatorElement.innerText).toBe(nTodos.toString());
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvdG9kby1zaG93L3NwZWMvc2hvdy10b2RvLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsK0NBQVQsRUFBMEQsU0FBQSxHQUFBO0FBQ3hELFFBQUEsdUZBQUE7QUFBQSxJQUFBLE9BQXNFLEVBQXRFLEVBQUMsMEJBQUQsRUFBbUIsMkJBQW5CLEVBQXNDLHdCQUF0QyxFQUFzRCxzQkFBdEQsQ0FBQTtBQUFBLElBSUEsY0FBQSxHQUFpQixTQUFDLFFBQUQsR0FBQTtBQUNmLFVBQUEsVUFBQTtBQUFBLE1BQUEsVUFBQSw0QkFBYSxjQUFjLENBQUUsWUFBWSxDQUFDLFNBQTdCLENBQUEsVUFBYixDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDZCQUF6QyxDQURBLENBQUE7QUFBQSxNQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsa0JBQUg7TUFBQSxDQUFoQixDQUZBLENBQUE7YUFHQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsUUFBQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxJQUFtRCxVQUFuRDtBQUFBLG1CQUFPLENBQUEsY0FBZSxDQUFDLFlBQVksQ0FBQyxTQUE1QixDQUFBLENBQVIsQ0FBQTtXQUFBO2lCQUNBLENBQUEsY0FBZSxDQUFDLFlBQVks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

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/todo-show/spec/show-todo-spec.coffee

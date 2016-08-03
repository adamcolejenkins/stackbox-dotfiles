function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('./helpers/workspace');

var _libMinimap = require('../lib/minimap');

var _libMinimap2 = _interopRequireDefault(_libMinimap);

var _libMinimapElement = require('../lib/minimap-element');

var _libMinimapElement2 = _interopRequireDefault(_libMinimapElement);

'use babel';

describe('Minimap package', function () {
  var _ref = [];
  var editor = _ref[0];
  var minimap = _ref[1];
  var editorElement = _ref[2];
  var minimapElement = _ref[3];
  var workspaceElement = _ref[4];
  var minimapPackage = _ref[5];

  beforeEach(function () {
    atom.config.set('minimap.autoToggle', true);

    workspaceElement = atom.views.getView(atom.workspace);
    jasmine.attachToDOM(workspaceElement);

    _libMinimapElement2['default'].registerViewProvider(_libMinimap2['default']);

    waitsForPromise(function () {
      return atom.workspace.open('sample.coffee');
    });

    waitsForPromise(function () {
      return atom.packages.activatePackage('minimap').then(function (pkg) {
        minimapPackage = pkg.mainModule;
      });
    });

    waitsFor(function () {
      return workspaceElement.querySelector('atom-text-editor');
    });

    runs(function () {
      editor = atom.workspace.getActiveTextEditor();
      editorElement = atom.views.getView(editor);
    });

    waitsFor(function () {
      return workspaceElement.querySelector('atom-text-editor::shadow atom-text-editor-minimap');
    });
  });

  it('registers the minimap views provider', function () {
    var textEditor = atom.workspace.buildTextEditor({});
    minimap = new _libMinimap2['default']({ textEditor: textEditor });
    minimapElement = atom.views.getView(minimap);

    expect(minimapElement).toExist();
  });

  describe('when an editor is opened', function () {
    it('creates a minimap model for the editor', function () {
      expect(minimapPackage.minimapForEditor(editor)).toBeDefined();
    });

    it('attaches a minimap element to the editor view', function () {
      expect(editorElement.shadowRoot.querySelector('atom-text-editor-minimap')).toExist();
    });

    describe('when the package is deactivated', function () {
      beforeEach(function () {
        atom.packages.deactivatePackage('minimap');
      });
      it('removes the minimap from their editor parent', function () {
        expect(editorElement.shadowRoot.querySelector('atom-text-editor-minimap')).not.toExist();
      });

      describe('and reactivated with a remaining minimap in the DOM', function () {
        beforeEach(function () {
          var m = new _libMinimap2['default']({ textEditor: editor });
          var v = atom.views.getView(m);
          editorElement.shadowRoot.appendChild(v);
          waitsForPromise(function () {
            return atom.packages.activatePackage('minimap');
          });
        });

        it('removes the remaining minimap', function () {
          expect(editorElement.shadowRoot.querySelectorAll('atom-text-editor-minimap').length).toEqual(1);
        });
      });
    });
  });

  describe('::observeMinimaps', function () {
    var _ref2 = [];
    var spy = _ref2[0];

    beforeEach(function () {
      spy = jasmine.createSpy('observeMinimaps');
      minimapPackage.observeMinimaps(spy);
    });

    it('calls the callback with the existing minimaps', function () {
      expect(spy).toHaveBeenCalled();
    });

    it('calls the callback when a new editor is opened', function () {
      waitsForPromise(function () {
        return atom.workspace.open('other-sample.js');
      });

      runs(function () {
        expect(spy.calls.length).toEqual(2);
      });
    });
  });

  describe('::deactivate', function () {
    beforeEach(function () {
      minimapPackage.deactivate();
    });

    it('destroys all the minimap models', function () {
      expect(minimapPackage.editorsMinimaps).toBeUndefined();
    });

    it('destroys all the minimap elements', function () {
      expect(editorElement.shadowRoot.querySelector('atom-text-editor-minimap')).not.toExist();
    });
  });

  describe('service', function () {
    it('returns the minimap main module', function () {
      expect(minimapPackage.provideMinimapServiceV1()).toEqual(minimapPackage);
    });

    it('creates standalone minimap with provided text editor', function () {
      var textEditor = atom.workspace.buildTextEditor({});
      var standaloneMinimap = minimapPackage.standAloneMinimapForEditor(textEditor);
      expect(standaloneMinimap.getTextEditor()).toEqual(textEditor);
    });
  });

  //    ########  ##       ##     ##  ######   #### ##    ##  ######
  //    ##     ## ##       ##     ## ##    ##   ##  ###   ## ##    ##
  //    ##     ## ##       ##     ## ##         ##  ####  ## ##
  //    ########  ##       ##     ## ##   ####  ##  ## ## ##  ######
  //    ##        ##       ##     ## ##    ##   ##  ##  ####       ##
  //    ##        ##       ##     ## ##    ##   ##  ##   ### ##    ##
  //    ##        ########  #######   ######   #### ##    ##  ######

  describe('plugins', function () {
    var _ref3 = [];
    var registerHandler = _ref3[0];
    var unregisterHandler = _ref3[1];
    var plugin = _ref3[2];

    describe('when the displayPluginsControls setting is enabled', function () {
      beforeEach(function () {
        atom.config.set('minimap.displayPluginsControls', true);
        atom.config.set('minimap.plugins.dummy', undefined);

        plugin = {
          active: false,
          activatePlugin: function activatePlugin() {
            this.active = true;
          },
          deactivatePlugin: function deactivatePlugin() {
            this.active = false;
          },
          isActive: function isActive() {
            return this.active;
          }
        };

        spyOn(plugin, 'activatePlugin').andCallThrough();
        spyOn(plugin, 'deactivatePlugin').andCallThrough();

        registerHandler = jasmine.createSpy('register handler');
        unregisterHandler = jasmine.createSpy('unregister handler');
      });

      describe('when registered', function () {
        beforeEach(function () {
          minimapPackage.onDidAddPlugin(registerHandler);
          minimapPackage.onDidRemovePlugin(unregisterHandler);
          minimapPackage.registerPlugin('dummy', plugin);
        });

        it('makes the plugin available in the minimap', function () {
          expect(minimapPackage.plugins['dummy']).toBe(plugin);
        });

        it('emits an event', function () {
          expect(registerHandler).toHaveBeenCalled();
        });

        it('creates a default config for the plugin', function () {
          expect(minimapPackage.config.plugins.properties.dummy).toBeDefined();
          expect(minimapPackage.config.plugins.properties.dummyDecorationsZIndex).toBeDefined();
        });

        it('sets the corresponding config', function () {
          expect(atom.config.get('minimap.plugins.dummy')).toBeTruthy();
          expect(atom.config.get('minimap.plugins.dummyDecorationsZIndex')).toEqual(0);
        });

        describe('triggering the corresponding plugin command', function () {
          beforeEach(function () {
            atom.commands.dispatch(workspaceElement, 'minimap:toggle-dummy');
          });

          it('receives a deactivation call', function () {
            expect(plugin.deactivatePlugin).toHaveBeenCalled();
          });
        });

        describe('and then unregistered', function () {
          beforeEach(function () {
            minimapPackage.unregisterPlugin('dummy');
          });

          it('has been unregistered', function () {
            expect(minimapPackage.plugins['dummy']).toBeUndefined();
          });

          it('emits an event', function () {
            expect(unregisterHandler).toHaveBeenCalled();
          });

          describe('when the config is modified', function () {
            beforeEach(function () {
              atom.config.set('minimap.plugins.dummy', false);
            });

            it('does not activates the plugin', function () {
              expect(plugin.deactivatePlugin).not.toHaveBeenCalled();
            });
          });
        });

        describe('on minimap deactivation', function () {
          beforeEach(function () {
            expect(plugin.active).toBeTruthy();
            minimapPackage.deactivate();
          });

          it('deactivates all the plugins', function () {
            expect(plugin.active).toBeFalsy();
          });
        });
      });

      describe('when the config for it is false', function () {
        beforeEach(function () {
          atom.config.set('minimap.plugins.dummy', false);
          minimapPackage.registerPlugin('dummy', plugin);
        });

        it('does not receive an activation call', function () {
          expect(plugin.activatePlugin).not.toHaveBeenCalled();
        });
      });

      describe('the registered plugin', function () {
        beforeEach(function () {
          minimapPackage.registerPlugin('dummy', plugin);
        });

        it('receives an activation call', function () {
          expect(plugin.activatePlugin).toHaveBeenCalled();
        });

        it('activates the plugin', function () {
          expect(plugin.active).toBeTruthy();
        });

        describe('when the config is modified after registration', function () {
          beforeEach(function () {
            atom.config.set('minimap.plugins.dummy', false);
          });

          it('receives a deactivation call', function () {
            expect(plugin.deactivatePlugin).toHaveBeenCalled();
          });
        });
      });
    });

    describe('when the displayPluginsControls setting is disabled', function () {
      beforeEach(function () {
        atom.config.set('minimap.displayPluginsControls', false);
        atom.config.set('minimap.plugins.dummy', undefined);

        plugin = {
          active: false,
          activatePlugin: function activatePlugin() {
            this.active = true;
          },
          deactivatePlugin: function deactivatePlugin() {
            this.active = false;
          },
          isActive: function isActive() {
            return this.active;
          }
        };

        spyOn(plugin, 'activatePlugin').andCallThrough();
        spyOn(plugin, 'deactivatePlugin').andCallThrough();

        registerHandler = jasmine.createSpy('register handler');
        unregisterHandler = jasmine.createSpy('unregister handler');
      });

      describe('when registered', function () {
        beforeEach(function () {
          minimapPackage.onDidAddPlugin(registerHandler);
          minimapPackage.onDidRemovePlugin(unregisterHandler);
          minimapPackage.registerPlugin('dummy', plugin);
        });

        it('makes the plugin available in the minimap', function () {
          expect(minimapPackage.plugins['dummy']).toBe(plugin);
        });

        it('emits an event', function () {
          expect(registerHandler).toHaveBeenCalled();
        });

        it('still activates the package', function () {
          expect(plugin.isActive()).toBeTruthy();
        });

        describe('and then unregistered', function () {
          beforeEach(function () {
            minimapPackage.unregisterPlugin('dummy');
          });

          it('has been unregistered', function () {
            expect(minimapPackage.plugins['dummy']).toBeUndefined();
          });

          it('emits an event', function () {
            expect(unregisterHandler).toHaveBeenCalled();
          });
        });

        describe('on minimap deactivation', function () {
          beforeEach(function () {
            expect(plugin.active).toBeTruthy();
            minimapPackage.deactivate();
          });

          it('deactivates all the plugins', function () {
            expect(plugin.active).toBeFalsy();
          });
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL3NwZWMvbWluaW1hcC1tYWluLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7UUFFTyxxQkFBcUI7OzBCQUNSLGdCQUFnQjs7OztpQ0FDVCx3QkFBd0I7Ozs7QUFKbkQsV0FBVyxDQUFBOztBQU1YLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxZQUFNO2FBQ3lELEVBQUU7TUFBdEYsTUFBTTtNQUFFLE9BQU87TUFBRSxhQUFhO01BQUUsY0FBYztNQUFFLGdCQUFnQjtNQUFFLGNBQWM7O0FBRXJGLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUE7O0FBRTNDLG9CQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNyRCxXQUFPLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7O0FBRXJDLG1DQUFlLG9CQUFvQix5QkFBUyxDQUFBOztBQUU1QyxtQkFBZSxDQUFDLFlBQU07QUFDcEIsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtLQUM1QyxDQUFDLENBQUE7O0FBRUYsbUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQzVELHNCQUFjLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQTtPQUNoQyxDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7O0FBRUYsWUFBUSxDQUFDLFlBQU07QUFDYixhQUFPLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0tBQzFELENBQUMsQ0FBQTs7QUFFRixRQUFJLENBQUMsWUFBTTtBQUNULFlBQU0s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RCxDQUFDLENBQUE7O0FBRUYsWUFBRSxDQUFDLGdCQUFnQixFQUFFLFlBQU07QUFDekIsa0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7V0FDN0MsQ0FBQyxDQUFBO1NBQ0gsQ0FBQyxDQUFBOztBQUVGLGdCQUFRLENBQUMseUJBQXlCLEVBQUUsWUFBTTtBQUN4QyxvQkFBVSxDQUFDLFlBQU07QUFDZixrQkFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUNsQywwQkFBYyxDQUFDLFVBQVUsRUFBRSxDQUFBO1dBQzVCLENBQUMsQ0FBQTs7QUFFRixZQUFFLENBQUMsNkJBQTZCLEVBQUUsWUFBTTtBQUN0QyxrQkFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtXQUNsQyxDQUFDLENBQUE7U0FDSCxDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvc3BlYy9taW5pbWFwLW1haW4tc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCAnLi9oZWxwZXJzL3dvcmtzcGFjZSdcbmltcG9ydCBNaW5pbWFwIGZyb20gJy4uL2xpYi9taW5pbWFwJ1xuaW1wb3J0IE1pbmltYXBFbGVtZW50IGZyb20gJy4uL2xpYi9taW5pbWFwLWVsZW1lbnQnXG5cbmRlc2NyaWJlKCdNaW5pbWFwIHBhY2thZ2UnLCAoKSA9PiB7XG4gIGxldCBbZWRpdG9yLCBtaW5pbWFwLCBlZGl0b3JFbGVtZW50LCBtaW5pbWFwRWxlbWVudCwgd29ya3NwYWNlRWxlbWVudCwgbWluaW1hcFBhY2thZ2VdID0gW11cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuYXV0b1RvZ2dsZScsIHRydWUpXG5cbiAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudClcblxuICAgIE1pbmltYXBFbGVtZW50LnJlZ2lzdGVyVmlld1Byb3ZpZGVyKE1pbmltYXApXG5cbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS5jb2ZmZWUnKVxuICAgIH0pXG5cbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdtaW5pbWFwJykudGhlbigocGtnKSA9PiB7XG4gICAgICAgIG1pbmltYXBQYWNrYWdlID0gcGtnLm1haW5Nb2R1bGVcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHdhaXRzRm9yKCgpID0+IHtcbiAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2F0b20tdGV4dC1lZGl0b3InKVxuICAgIH0pXG5cbiAgICBydW5zKCgpID0+IHtcbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgfSlcblxuICAgIHdhaXRzRm9yKCgpID0+IHtcbiAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2F0b20tdGV4dC1lZGl0b3I6OnNoYWRvdyBhdG9tLXRleHQtZWRpdG9yLW1pbmltYXAnKVxuICAgIH0pXG4gIH0pXG5cbiAgaXQoJ3JlZ2lzdGVycyB0aGUgbWluaW1hcCB2aWV3cyBwcm92aWRlcicsICgpID0+IHtcbiAgICBsZXQgdGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmJ1aWxkVGV4dEVkaXRvcih7fSlcbiAgICBtaW5pbWFwID0gbmV3IE1pbmltYXAoe3RleHRFZGl0b3J9KVxuICAgIG1pbmltYXBFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KG1pbmltYXApXG5cbiAgICBleHBlY3QobWluaW1hcEVsZW1lbnQpLnRvRXhpc3QoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIGFuIGVkaXRvciBpcyBvcGVuZWQnLCAoKSA9PiB7XG4gICAgaXQoJ2NyZWF0ZXMgYSBtaW5pbWFwIG1vZGVsIGZvciB0aGUgZWRpdG9yJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG1pbmltYXBQYWNrYWdlLm1pbmltYXBGb3JFZGl0b3IoZWRpdG9yKSkudG9CZURlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnYXR0YWNoZXMgYSBtaW5pbWFwIGVsZW1lbnQgdG8gdGhlIGVkaXRvciB2aWV3JywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdhdG9tLXRleHQtZWRpdG9yLW1pbmltYXAnKSkudG9FeGlzdCgpXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd3aGVuIHRoZSBwYWNrYWdlIGlzIGRlYWN0aXZhdGVkJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIGF0b20ucGFja2FnZXMuZGVhY3RpdmF0ZVBhY2thZ2UoJ21pbmltYXAnKVxuICAgICAgfSlcbiAgICAgIGl0KCdyZW1vdmVzIHRoZSBtaW5pbWFwIGZyb20gdGhlaXIgZWRpdG9yIHBhcmVudCcsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdhdG9tLXRleHQtZWRpdG9yLW1pbmltYXAnKSkubm90LnRvRXhpc3QoKVxuICAgICAgfSlcblxuICAgICAgZGVzY3JpYmUoJ2FuZCByZWFjdGl2YXRlZCB3aXRoIGEgcmVtYWluaW5nIG1pbmltYXAgaW4gdGhlIERPTScsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgbSA9IG5ldyBNaW5pbWFwKHt0ZXh0RWRpdG9yOiBlZGl0b3J9KVxuICAgICAgICAgIGNvbnN0IHYgPSBhdG9tLnZpZXdzLmdldFZpZXcobSlcbiAgICAgICAgICBlZGl0b3JFbGVtZW50LnNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQodilcbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ21pbmltYXAnKSlcbiAgICAgICAgfSlcblxuICAgICAgICBpdCgncmVtb3ZlcyB0aGUgcmVtYWluaW5nIG1pbmltYXAnLCAoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yQWxsKCdhdG9tLXRleHQtZWRpdG9yLW1pbmltYXAnKS5sZW5ndGgpLnRvRXF1YWwoMSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnOjpvYnNlcnZlTWluaW1hcHMnLCAoKSA9PiB7XG4gICAgbGV0IFtzcHldID0gW11cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdvYnNlcnZlTWluaW1hcHMnKVxuICAgICAgbWluaW1hcFBhY2thZ2Uub2JzZXJ2ZU1pbmltYXBzKHNweSlcbiAgICB9KVxuXG4gICAgaXQoJ2NhbGxzIHRoZSBjYWxsYmFjayB3aXRoIHRoZSBleGlzdGluZyBtaW5pbWFwcycsICgpID0+IHtcbiAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnY2FsbHMgdGhlIGNhbGxiYWNrIHdoZW4gYSBuZXcgZWRpdG9yIGlzIG9wZW5lZCcsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7IHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKCdvdGhlci1zYW1wbGUuanMnKSB9KVxuXG4gICAgICBydW5zKCgpID0+IHsgZXhwZWN0KHNweS5jYWxscy5sZW5ndGgpLnRvRXF1YWwoMikgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCc6OmRlYWN0aXZhdGUnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBtaW5pbWFwUGFja2FnZS5kZWFjdGl2YXRlKClcbiAgICB9KVxuXG4gICAgaXQoJ2Rlc3Ryb3lzIGFsbCB0aGUgbWluaW1hcCBtb2RlbHMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QobWluaW1hcFBhY2thZ2UuZWRpdG9yc01pbmltYXBzKS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ2Rlc3Ryb3lzIGFsbCB0aGUgbWluaW1hcCBlbGVtZW50cycsICgpID0+IHtcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignYXRvbS10ZXh0LWVkaXRvci1taW5pbWFwJykpLm5vdC50b0V4aXN0KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdzZXJ2aWNlJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIHRoZSBtaW5pbWFwIG1haW4gbW9kdWxlJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG1pbmltYXBQYWNrYWdlLnByb3ZpZGVNaW5pbWFwU2VydmljZVYxKCkpLnRvRXF1YWwobWluaW1hcFBhY2thZ2UpXG4gICAgfSlcblxuICAgIGl0KCdjcmVhdGVzIHN0YW5kYWxvbmUgbWluaW1hcCB3aXRoIHByb3ZpZGVkIHRleHQgZWRpdG9yJywgKCkgPT4ge1xuICAgICAgbGV0IHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3Ioe30pXG4gICAgICBsZXQgc3RhbmRhbG9uZU1pbmltYXAgPSBtaW5pbWFwUGFja2FnZS5zdGFuZEFsb25lTWluaW1hcEZvckVkaXRvcih0ZXh0RWRpdG9yKVxuICAgICAgZXhwZWN0KHN0YW5kYWxvbmVNaW5pbWFwLmdldFRleHRFZGl0b3IoKSkudG9FcXVhbCh0ZXh0RWRpdG9yKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gICAgIyMjIyMjIyMgICMjICAgICAgICMjICAgICAjIyAgIyMjIyMjICAgIyMjIyAjIyAgICAjIyAgIyMjIyMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgIyMgICAjIyAgIyMjICAgIyMgIyMgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAjIyAjIyAgICAgICAgICMjICAjIyMjICAjIyAjI1xuICAvLyAgICAjIyMjIyMjIyAgIyMgICAgICAgIyMgICAgICMjICMjICAgIyMjIyAgIyMgICMjICMjICMjICAjIyMjIyNcbiAgLy8gICAgIyMgICAgICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAjIyAgICMjICAjIyAgIyMjIyAgICAgICAjI1xuICAvLyAgICAjIyAgICAgICAgIyMgICAgICAgIyMgICAgICMjICMjICAgICMjICAgIyMgICMjICAgIyMjICMjICAgICMjXG4gIC8vICAgICMjICAgICAgICAjIyMjIyMjIyAgIyMjIyMjIyAgICMjIyMjIyAgICMjIyMgIyMgICAgIyMgICMjIyMjI1xuXG4gIGRlc2NyaWJlKCdwbHVnaW5zJywgKCkgPT4ge1xuICAgIGxldCBbcmVnaXN0ZXJIYW5kbGVyLCB1bnJlZ2lzdGVySGFuZGxlciwgcGx1Z2luXSA9IFtdXG5cbiAgICBkZXNjcmliZSgnd2hlbiB0aGUgZGlzcGxheVBsdWdpbnNDb250cm9scyBzZXR0aW5nIGlzIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmRpc3BsYXlQbHVnaW5zQ29udHJvbHMnLCB0cnVlKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAucGx1Z2lucy5kdW1teScsIHVuZGVmaW5lZClcblxuICAgICAgICBwbHVnaW4gPSB7XG4gICAgICAgICAgYWN0aXZlOiBmYWxzZSxcbiAgICAgICAgICBhY3RpdmF0ZVBsdWdpbiAoKSB7IHRoaXMuYWN0aXZlID0gdHJ1ZSB9LFxuICAgICAgICAgIGRlYWN0aXZhdGVQbHVnaW4gKCkgeyB0aGlzLmFjdGl2ZSA9IGZhbHNlIH0sXG4gICAgICAgICAgaXNBY3RpdmUgKCkgeyByZXR1cm4gdGhpcy5hY3RpdmUgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3B5T24ocGx1Z2luLCAnYWN0aXZhdGVQbHVnaW4nKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICAgIHNweU9uKHBsdWdpbiwgJ2RlYWN0aXZhdGVQbHVnaW4nKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgICAgcmVnaXN0ZXJIYW5kbGVyID0gamFzbWluZS5jcmVhdGVTcHkoJ3JlZ2lzdGVyIGhhbmRsZXInKVxuICAgICAgICB1bnJlZ2lzdGVySGFuZGxlciA9IGphc21pbmUuY3JlYXRlU3B5KCd1bnJlZ2lzdGVyIGhhbmRsZXInKVxuICAgICAgfSlcblxuICAgICAgZGVzY3JpYmUoJ3doZW4gcmVnaXN0ZXJlZCcsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgbWluaW1hcFBhY2thZ2Uub25EaWRBZGRQbHVnaW4ocmVnaXN0ZXJIYW5kbGVyKVxuICAgICAgICAgIG1pbmltYXBQYWNrYWdlLm9uRGlkUmVtb3ZlUGx1Z2luKHVucmVnaXN0ZXJIYW5kbGVyKVxuICAgICAgICAgIG1pbmltYXBQYWNrYWdlLnJlZ2lzdGVyUGx1Z2luKCdkdW1teScsIHBsdWdpbilcbiAgICAgICAgfSlcblxuICAgICAgICBpdCgnbWFrZXMgdGhlIHBsdWdpbiBhdmFpbGFibGUgaW4gdGhlIG1pbmltYXAnLCAoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KG1pbmltYXBQYWNrYWdlLnBsdWdpbnNbJ2R1bW15J10pLnRvQmUocGx1Z2luKVxuICAgICAgICB9KVxuXG4gICAgICAgIGl0KCdlbWl0cyBhbiBldmVudCcsICgpID0+IHtcbiAgICAgICAgICBleHBlY3QocmVnaXN0ZXJIYW5kbGVyKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgfSlcblxuICAgICAgICBpdCgnY3JlYXRlcyBhIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgcGx1Z2luJywgKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChtaW5pbWFwUGFja2FnZS5jb25maWcucGx1Z2lucy5wcm9wZXJ0aWVzLmR1bW15KS50b0JlRGVmaW5lZCgpXG4gICAgICAgICAgZXhwZWN0KG1pbmltYXBQYWNrYWdlLmNvbmZpZy5wbHVnaW5zLnByb3BlcnRpZXMuZHVtbXlEZWNvcmF0aW9uc1pJbmRleCkudG9CZURlZmluZWQoKVxuICAgICAgICB9KVxuXG4gICAgICAgIGl0KCdzZXRzIHRoZSBjb3JyZXNwb25kaW5nIGNvbmZpZycsICgpID0+IHtcbiAgICAgICAgICBleHBlY3QoYXRvbS5jb25maWcuZ2V0KCdtaW5pbWFwLnBsdWdpbnMuZHVtbXknKSkudG9CZVRydXRoeSgpXG4gICAgICAgICAgZXhwZWN0KGF0b20uY29uZmlnLmdldCgnbWluaW1hcC5wbHVnaW5zLmR1bW15RGVjb3JhdGlvbnNaSW5kZXgnKSkudG9FcXVhbCgwKVxuICAgICAgICB9KVxuXG4gICAgICAgIGRlc2NyaWJlKCd0cmlnZ2VyaW5nIHRoZSBjb3JyZXNwb25kaW5nIHBsdWdpbiBjb21tYW5kJywgKCkgPT4ge1xuICAgICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnbWluaW1hcDp0b2dnbGUtZHVtbXknKVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBpdCgncmVjZWl2ZXMgYSBkZWFjdGl2YXRpb24gY2FsbCcsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChwbHVnaW4uZGVhY3RpdmF0ZVBsdWdpbikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICBkZXNjcmliZSgnYW5kIHRoZW4gdW5yZWdpc3RlcmVkJywgKCkgPT4ge1xuICAgICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgbWluaW1hcFBhY2thZ2UudW5yZWdpc3RlclBsdWdpbignZHVtbXknKVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBpdCgnaGFzIGJlZW4gdW5yZWdpc3RlcmVkJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KG1pbmltYXBQYWNrYWdlLnBsdWdpbnNbJ2R1bW15J10pLnRvQmVVbmRlZmluZWQoKVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBpdCgnZW1pdHMgYW4gZXZlbnQnLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QodW5yZWdpc3RlckhhbmRsZXIpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBkZXNjcmliZSgnd2hlbiB0aGUgY29uZmlnIGlzIG1vZGlmaWVkJywgKCkgPT4ge1xuICAgICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5wbHVnaW5zLmR1bW15JywgZmFsc2UpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBpdCgnZG9lcyBub3QgYWN0aXZhdGVzIHRoZSBwbHVnaW4nLCAoKSA9PiB7XG4gICAgICAgICAgICAgIGV4cGVjdChwbHVnaW4uZGVhY3RpdmF0ZVBsdWdpbikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIGRlc2NyaWJlKCdvbiBtaW5pbWFwIGRlYWN0aXZhdGlvbicsICgpID0+IHtcbiAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChwbHVnaW4uYWN0aXZlKS50b0JlVHJ1dGh5KClcbiAgICAgICAgICAgIG1pbmltYXBQYWNrYWdlLmRlYWN0aXZhdGUoKVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBpdCgnZGVhY3RpdmF0ZXMgYWxsIHRoZSBwbHVnaW5zJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KHBsdWdpbi5hY3RpdmUpLnRvQmVGYWxzeSgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlKCd3aGVuIHRoZSBjb25maWcgZm9yIGl0IGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAucGx1Z2lucy5kdW1teScsIGZhbHNlKVxuICAgICAgICAgIG1pbmltYXBQYWNrYWdlLnJlZ2lzdGVyUGx1Z2luKCdkdW1teScsIHBsdWdpbilcbiAgICAgICAgfSlcblxuICAgICAgICBpdCgnZG9lcyBub3QgcmVjZWl2ZSBhbiBhY3RpdmF0aW9uIGNhbGwnLCAoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHBsdWdpbi5hY3RpdmF0ZVBsdWdpbikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgZGVzY3JpYmUoJ3RoZSByZWdpc3RlcmVkIHBsdWdpbicsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgbWluaW1hcFBhY2thZ2UucmVnaXN0ZXJQbHVnaW4oJ2R1bW15JywgcGx1Z2luKVxuICAgICAgICB9KVxuXG4gICAgICAgIGl0KCdyZWNlaXZlcyBhbiBhY3RpdmF0aW9uIGNhbGwnLCAoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHBsdWdpbi5hY3RpdmF0ZVBsdWdpbikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgaXQoJ2FjdGl2YXRlcyB0aGUgcGx1Z2luJywgKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChwbHVnaW4uYWN0aXZlKS50b0JlVHJ1dGh5KClcbiAgICAgICAgfSlcblxuICAgICAgICBkZXNjcmliZSgnd2hlbiB0aGUgY29uZmlnIGlzIG1vZGlmaWVkIGFmdGVyIHJlZ2lzdHJhdGlvbicsICgpID0+IHtcbiAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5wbHVnaW5zLmR1bW15JywgZmFsc2UpXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGl0KCdyZWNlaXZlcyBhIGRlYWN0aXZhdGlvbiBjYWxsJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KHBsdWdpbi5kZWFjdGl2YXRlUGx1Z2luKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3doZW4gdGhlIGRpc3BsYXlQbHVnaW5zQ29udHJvbHMgc2V0dGluZyBpcyBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuZGlzcGxheVBsdWdpbnNDb250cm9scycsIGZhbHNlKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAucGx1Z2lucy5kdW1teScsIHVuZGVmaW5lZClcblxuICAgICAgICBwbHVnaW4gPSB7XG4gICAgICAgICAgYWN0aXZlOiBmYWxzZSxcbiAgICAgICAgICBhY3RpdmF0ZVBsdWdpbiAoKSB7IHRoaXMuYWN0aXZlID0gdHJ1ZSB9LFxuICAgICAgICAgIGRlYWN0aXZhdGVQbHVnaW4gKCkgeyB0aGlzLmFjdGl2ZSA9IGZhbHNlIH0sXG4gICAgICAgICAgaXNBY3RpdmUgKCkgeyByZXR1cm4gdGhpcy5hY3RpdmUgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3B5T24ocGx1Z2luLCAnYWN0aXZhdGVQbHVnaW4nKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICAgIHNweU9uKHBsdWdpbiwgJ2RlYWN0aXZhdGVQbHVnaW4nKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgICAgcmVnaXN0ZXJIYW5kbGVyID0gamFzbWluZS5jcmVhdGVTcHkoJ3JlZ2lzdGVyIGhhbmRsZXInKVxuICAgICAgICB1bnJlZ2lzdGVySGFuZGxlciA9IGphc21pbmUuY3JlYXRlU3B5KCd1bnJlZ2lzdGVyIGhhbmRsZXInKVxuICAgICAgfSlcblxuICAgICAgZGVzY3JpYmUoJ3doZW4gcmVnaXN0ZXJlZCcsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgbWluaW1hcFBhY2thZ2Uub25EaWRBZGRQbHVnaW4ocmVnaXN0ZXJIYW5kbGVyKVxuICAgICAgICAgIG1pbmltYXBQYWNrYWdlLm9uRGlkUmVtb3ZlUGx1Z2luKHVucmVnaXN0ZXJIYW5kbGVyKVxuICAgICAgICAgIG1pbmltYXBQYWNrYWdlLnJlZ2lzdGVyUGx1Z2luKCdkdW1teScsIHBsdWdpbilcbiAgICAgICAgfSlcblxuICAgICAgICBpdCgnbWFrZXMgdGhlIHBsdWdpbiBhdmFpbGFibGUgaW4gdGhlIG1pbmltYXAnLCAoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KG1pbmltYXBQYWNrYWdlLnBsdWdpbnNbJ2R1bW15J10pLnRvQmUocGx1Z2luKVxuICAgICAgICB9KVxuXG4gICAgICAgIGl0KCdlbWl0cyBhbiBldmVudCcsICgpID0+IHtcbiAgICAgICAgICBleHBlY3QocmVnaXN0ZXJIYW5kbGVyKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgfSlcblxuICAgICAgICBpdCgnc3RpbGwgYWN0aXZhdGVzIHRoZSBwYWNrYWdlJywgKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChwbHVnaW4uaXNBY3RpdmUoKSkudG9CZVRydXRoeSgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgZGVzY3JpYmUoJ2FuZCB0aGVuIHVucmVnaXN0ZXJlZCcsICgpID0+IHtcbiAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIG1pbmltYXBQYWNrYWdlLnVucmVnaXN0ZXJQbHVnaW4oJ2R1bW15JylcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgaXQoJ2hhcyBiZWVuIHVucmVnaXN0ZXJlZCcsICgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChtaW5pbWFwUGFja2FnZS5wbHVnaW5zWydkdW1teSddKS50b0JlVW5kZWZpbmVkKClcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgaXQoJ2VtaXRzIGFuIGV2ZW50JywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KHVucmVnaXN0ZXJIYW5kbGVyKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIGRlc2NyaWJlKCdvbiBtaW5pbWFwIGRlYWN0aXZhdGlvbicsICgpID0+IHtcbiAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChwbHVnaW4uYWN0aXZlKS50b0JlVHJ1dGh5KClcbiAgICAgICAgICAgIG1pbmltYXBQYWNrYWdlLmRlYWN0aXZhdGUoKVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBpdCgnZGVhY3RpdmF0ZXMgYWxsIHRoZSBwbHVnaW5zJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KHBsdWdpbi5hY3RpdmUpLnRvQmVGYWxzeSgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=
//# sourceURL=/Users/ajenkins/.atom/packages/minimap/spec/minimap-main-spec.js

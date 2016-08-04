Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/*
  The following hack clears the require cache of all the paths to the minimap when this file is laoded. It should prevents errors of partial reloading after an update.
 */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _decoratorsInclude = require('./decorators/include');

var _decoratorsInclude2 = _interopRequireDefault(_decoratorsInclude);

var _mixinsPluginManagement = require('./mixins/plugin-management');

var _mixinsPluginManagement2 = _interopRequireDefault(_mixinsPluginManagement);

'use babel';

if (!atom.inSpecMode()) {
  Object.keys(require.cache).filter(function (p) {
    return p !== __filename && p.indexOf(_path2['default'].resolve(__dirname, '..') + _path2['default'].sep) > -1;
  }).forEach(function (p) {
    delete require.cache[p];
  });
}

var Minimap = undefined,
    MinimapElement = undefined,
    MinimapPluginGeneratorElement = undefined;

/**
 * The `Minimap` package provides an eagle-eye view of text buffers.
 *
 * It also provides API for plugin packages that want to interact with the
 * minimap and be available to the user through the minimap settings.
 */

var Main = (function () {
  /**
   * Used only at export time.
   *
   * @access private
   */

  function Main() {
    _classCallCheck(this, _Main);

    /**
     * The activation state of the package.
     *
     * @type {boolean}
     * @access private
     */
    this.active = false;
    /**
     * The toggle state of the package.
     *
     * @type {boolean}
     * @access private
     */
    this.toggled = false;
    /**
     * The `Map` where Minimap instances are stored with the text editor they
     * target as key.
     *
     * @type {Map}
     * @access private
     */
    this.editorsMinimaps = null;
    /**
     * The composite disposable that stores the package's subscriptions.
     *
     * @type {CompositeDisposable}
     * @access private
     */
    this.subscriptions = null;
    /**
     * The disposable that stores the package's commands subscription.
     *
     * @type {Disposable}
     * @access private
     */
    this.subscriptionsOfCommands = null;
    /**
     * The package's config object.
     *
     * @type {Object}
     * @access private
     */
    this.config = require('./config-schema.json');
    /**
     * The package's events emitter.
     *
     * @type {Emitter}
     * @access private
     */
    this.emitter = new _atom.Emitter();

    this.initializePlugins();
  }

  /**
   * The exposed instance of the `Main` class.
   *
   * @access private
   */

  /**
   * Activates the minimap package.
   */

  _createClass(Main, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      if (this.active) {
        return;
      }

      if (!Minimap) {
        Minimap = require('./minimap');
      }
      if (!MinimapElement) {
        MinimapElement = require('./minimap-element');
      }

      MinimapElement.registerViewProvider(Minimap);

      this.subscriptionsOfCommands = atom.commands.add('atom-workspace', {
        'minimap:toggle': function minimapToggle() {
          _this.toggle();
        },
        'minimap:generate-coffee-plugin': function minimapGenerateCoffeePlugin() {
          _this.generatePlugin('coffee');
        },
        'minimap:generate-javascript-plugin': function minimapGenerateJavascriptPlugin() {
          _this.generatePlugin('javascript');
        },
        'minimap:generate-babel-plugin': function minimapGenerateBabelPlugin() {
          _this.generatePlugin('babel');
        }
      });

      this.editorsMinimaps = new Map();
      this.subscriptions = new _atom.CompositeDisposable();
      this.active = true;

      if (atom.config.get('minimap.autoToggle')) {
        this.toggle();
      }
    }

    /**
     * Deactivates the minimap package.
     */
  }, {
    key: 'deactivate',
    value: function deactivate() {
      var _this2 = this;

      if (!this.active) {
        return;
      }

      this.deactivateAllPlugins();

      if (this.editorsMinimaps) {
        this.editorsMinimaps.forEach(function (value, key) {
          value.destroy();
          _this2.editorsMinimaps['delete'](key);
        });
      }

      this.subscriptions.dispose();
      this.subscriptions = null;
      this.subscriptionsOfCommands.dispose();
      this.subscriptionsOfCommands = null;
      this.editorsMinimaps = undefined;
      this.toggled = false;
      this.active = false;
    }

    /**
     * Toggles the minimap display.
     */
  }, {
    key: 'toggle',
    value: function toggle() {
      var _this3 = this;

      if (!this.active) {
        return;
      }

      if (this.toggled) {
        this.toggled = false;

        if (this.editorsMinimaps) {
          this.editorsMinimaps.forEach(function (value, key) {
            value.destroy();
            _this3.editorsMinimaps['delete'](key);
          });
        }
        this.subscriptions.dispose();
      } else {
        this.toggled = true;
        this.initSubscriptions();
      }
    }

    /**
     * Opens the plugin generation view.
     *
     * @param  {string} template the name of the template to use
     */
  }, {
    key: 'generatePlugin',
    value: function generatePlugin(template) {
      if (!MinimapPluginGeneratorElement) {
        MinimapPluginGeneratorElement = require('./minimap-plugin-generator-element');
      }
      var view = new MinimapPluginGeneratorElement();
      view.template = template;
      view.attach();
    }

    /**
     * Registers a callback to listen to the `did-activate` event of the package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidActivate',
    value: function onDidActivate(callback) {
      return this.emitter.on('did-activate', callback);
    }

    /**
     * Registers a callback to listen to the `did-deactivate` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidDeactivate',
    value: function onDidDeactivate(callback) {
      return this.emitter.on('did-deactivate', callback);
    }

    /**
     * Registers a callback to listen to the `did-create-minimap` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidCreateMinimap',
    value: function onDidCreateMinimap(callback) {
      return this.emitter.on('did-create-minimap', callback);
    }

    /**
     * Registers a callback to listen to the `did-add-plugin` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidAddPlugin',
    value: function onDidAddPlugin(callback) {
      return this.emitter.on('did-add-plugin', callback);
    }

    /**
     * Registers a callback to listen to the `did-remove-plugin` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidRemovePlugin',
    value: function onDidRemovePlugin(callback) {
      return this.emitter.on('did-remove-plugin', callback);
    }

    /**
     * Registers a callback to listen to the `did-activate-plugin` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidActivatePlugin',
    value: function onDidActivatePlugin(callback) {
      return this.emitter.on('did-activate-plugin', callback);
    }

    /**
     * Registers a callback to listen to the `did-deactivate-plugin` event of the
     * package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidDeactivatePlugin',
    value: function onDidDeactivatePlugin(callback) {
      return this.emitter.on('did-deactivate-plugin', callback);
    }

    /**
     * Registers a callback to listen to the `did-change-plugin-order` event of
     * the package.
     *
     * @param  {function(event:Object):void} callback the callback function
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangePluginOrder',
    value: function onDidChangePluginOrder(callback) {
      return this.emitter.on('did-change-plugin-order', callback);
    }

    /**
     * Returns the `Minimap` class
     *
     * @return {Function} the `Minimap` class constructor
     */
  }, {
    key: 'minimapClass',
    value: function minimapClass() {
      return Minimap;
    }

    /**
     * Returns the `Minimap` object associated to the passed-in
     * `TextEditorElement`.
     *
     * @param  {TextEditorElement} editorElement a text editor element
     * @return {Minimap} the associated minimap
     */
  }, {
    key: 'minimapForEditorElement',
    value: function minimapForEditorElement(editorElement) {
      if (!editorElement) {
        return;
      }
      return this.minimapForEditor(editorElement.getModel());
    }

    /**
     * Returns the `Minimap` object associated to the passed-in
     * `TextEditor`.
     *
     * @param  {TextEditor} textEditor a text editor
     * @return {Minimap} the associated minimap
     */
  }, {
    key: 'minimapForEditor',
    value: function minimapForEditor(textEditor) {
      var _this4 = this;

      if (!textEditor) {
        return;
      }

      var minimap = this.editorsMinimaps.get(textEditor);

      if (!minimap) {
        minimap = new Minimap({ textEditor: textEditor });
        this.editorsMinimaps.set(textEditor, minimap);

        var editorSubscription = textEditor.onDidDestroy(function () {
          var minimaps = _this4.editorsMinimaps;
          if (minimaps) {
            minimaps['delete'](textEditor);
          }
          editorSubscription.dispose();
        });
      }

      return minimap;
    }

    /**
     * Returns a new stand-alone {Minimap} for the passed-in `TextEditor`.
     *
     * @param  {TextEditor} textEditor a text editor instance to create
     *                                 a minimap for
     * @return {Minimap} a new stand-alone Minimap for the passed-in editor
     */
  }, {
    key: 'standAloneMinimapForEditor',
    value: function standAloneMinimapForEditor(textEditor) {
      if (!textEditor) {
        return;
      }

      return new Minimap({
        textEditor: textEditor,
        standAlone: true
      });
    }

    /**
     * Returns the `Minimap` associated to the active `TextEditor`.
     *
     * @return {Minimap} the active Minimap
     */
  }, {
    key: 'getActiveMinimap',
    value: function getActiveMinimap() {
      return this.minimapForEditor(atom.workspace.getActiveTextEditor());
    }

    /**
     * Calls a function for each present and future minimaps.
     *
     * @param  {function(minimap:Minimap):void} iterator a function to call with
     *                                                   the existing and future
     *                                                   minimaps
     * @return {Disposable} a disposable to unregister the observer
     */
  }, {
    key: 'observeMinimaps',
    value: function observeMinimaps(iterator) {
      if (!iterator) {
        return;
      }

      if (this.editorsMinimaps) {
        this.editorsMinimaps.forEach(function (minimap) {
          iterator(minimap);
        });
      }
      return this.onDidCreateMinimap(function (minimap) {
        iterator(minimap);
      });
    }

    /**
     * Registers to the `observeTextEditors` method.
     *
     * @access private
     */
  }, {
    key: 'initSubscriptions',
    value: function initSubscriptions() {
      var _this5 = this;

      this.subscriptions.add(atom.workspace.observeTextEditors(function (textEditor) {
        var minimap = _this5.minimapForEditor(textEditor);
        var minimapElement = atom.views.getView(minimap);

        _this5.emitter.emit('did-create-minimap', minimap);

        minimapElement.attach();
      }));
    }
  }]);

  var _Main = Main;
  Main = (0, _decoratorsInclude2['default'])(_mixinsPluginManagement2['default'])(Main) || Main;
  return Main;
})();

exports['default'] = new Main();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUtpQixNQUFNOzs7O29CQVVvQixNQUFNOztpQ0FDN0Isc0JBQXNCOzs7O3NDQUNiLDRCQUE0Qjs7OztBQWpCekQsV0FBVyxDQUFBOztBQU9YLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7QUFDdEIsUUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ3ZDLFdBQU8sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFLLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsa0JBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7R0FDcEYsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsRUFBSztBQUNoQixXQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7R0FDeEIsQ0FBQyxDQUFBO0NBQ0g7O0FBTUQsSUFBSSxPQUFPLFlBQUE7SUFBRSxjQUFjLFlBQUE7SUFBRSw2QkFBNkIsWUFBQSxDQUFBOzs7Ozs7Ozs7SUFTcEQsSUFBSTs7Ozs7OztBQU1JLFdBTlIsSUFBSSxHQU1POzs7Ozs7Ozs7QUFPYixRQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTs7Ozs7OztBQU9uQixRQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTs7Ozs7Ozs7QUFRcEIsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUE7Ozs7Ozs7QUFPM0IsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7Ozs7Ozs7QUFPekIsUUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQTs7Ozs7OztBQU9uQyxRQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8s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LENBQUMsT0FBTyxDQUFDLENBQUE7O0FBRWhELGVBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsQ0FBQTs7QUFFaEQsc0JBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtPQUN4QixDQUFDLENBQUMsQ0FBQTtLQUNKOzs7Y0F0VkcsSUFBSTtBQUFKLE1BQUksR0FEVCx3RUFBeUIsQ0FDcEIsSUFBSSxLQUFKLElBQUk7U0FBSixJQUFJOzs7cUJBOFZLLElBQUksSUFBSSxFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuLypcbiAgVGhlIGZvbGxvd2luZyBoYWNrIGNsZWFycyB0aGUgcmVxdWlyZSBjYWNoZSBvZiBhbGwgdGhlIHBhdGhzIHRvIHRoZSBtaW5pbWFwIHdoZW4gdGhpcyBmaWxlIGlzIGxhb2RlZC4gSXQgc2hvdWxkIHByZXZlbnRzIGVycm9ycyBvZiBwYXJ0aWFsIHJlbG9hZGluZyBhZnRlciBhbiB1cGRhdGUuXG4gKi9cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmlmICghYXRvbS5pblNwZWNNb2RlKCkpIHtcbiAgT2JqZWN0LmtleXMocmVxdWlyZS5jYWNoZSkuZmlsdGVyKChwKSA9PiB7XG4gICAgcmV0dXJuIHAgIT09IF9fZmlsZW5hbWUgJiYgcC5pbmRleE9mKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLicpICsgcGF0aC5zZXApID4gLTFcbiAgfSkuZm9yRWFjaCgocCkgPT4ge1xuICAgIGRlbGV0ZSByZXF1aXJlLmNhY2hlW3BdXG4gIH0pXG59XG5cbmltcG9ydCB7RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCBpbmNsdWRlIGZyb20gJy4vZGVjb3JhdG9ycy9pbmNsdWRlJ1xuaW1wb3J0IFBsdWdpbk1hbmFnZW1lbnQgZnJvbSAnLi9taXhpbnMvcGx1Z2luLW1hbmFnZW1lbnQnXG5cbmxldCBNaW5pbWFwLCBNaW5pbWFwRWxlbWVudCwgTWluaW1hcFBsdWdpbkdlbmVyYXRvckVsZW1lbnRcblxuLyoqXG4gKiBUaGUgYE1pbmltYXBgIHBhY2thZ2UgcHJvdmlkZXMgYW4gZWFnbGUtZXllIHZpZXcgb2YgdGV4dCBidWZmZXJzLlxuICpcbiAqIEl0IGFsc28gcHJvdmlkZXMgQVBJIGZvciBwbHVnaW4gcGFja2FnZXMgdGhhdCB3YW50IHRvIGludGVyYWN0IHdpdGggdGhlXG4gKiBtaW5pbWFwIGFuZCBiZSBhdmFpbGFibGUgdG8gdGhlIHVzZXIgdGhyb3VnaCB0aGUgbWluaW1hcCBzZXR0aW5ncy5cbiAqL1xuQGluY2x1ZGUoUGx1Z2luTWFuYWdlbWVudClcbmNsYXNzIE1haW4ge1xuICAvKipcbiAgICogVXNlZCBvbmx5IGF0IGV4cG9ydCB0aW1lLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICAvKipcbiAgICAgKiBUaGUgYWN0aXZhdGlvbiBzdGF0ZSBvZiB0aGUgcGFja2FnZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICAvKipcbiAgICAgKiBUaGUgdG9nZ2xlIHN0YXRlIG9mIHRoZSBwYWNrYWdlLlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy50b2dnbGVkID0gZmFsc2VcbiAgICAvKipcbiAgICAgKiBUaGUgYE1hcGAgd2hlcmUgTWluaW1hcCBpbnN0YW5jZXMgYXJlIHN0b3JlZCB3aXRoIHRoZSB0ZXh0IGVkaXRvciB0aGV5XG4gICAgICogdGFyZ2V0IGFzIGtleS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtNYXB9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5lZGl0b3JzTWluaW1hcHMgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGNvbXBvc2l0ZSBkaXNwb3NhYmxlIHRoYXQgc3RvcmVzIHRoZSBwYWNrYWdlJ3Mgc3Vic2NyaXB0aW9ucy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtDb21wb3NpdGVEaXNwb3NhYmxlfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgZGlzcG9zYWJsZSB0aGF0IHN0b3JlcyB0aGUgcGFja2FnZSdzIGNvbW1hbmRzIHN1YnNjcmlwdGlvbi5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtEaXNwb3NhYmxlfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uc09mQ29tbWFuZHMgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIHBhY2thZ2UncyBjb25maWcgb2JqZWN0LlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnLXNjaGVtYS5qc29uJylcbiAgICAvKipcbiAgICAgKiBUaGUgcGFja2FnZSdzIGV2ZW50cyBlbWl0dGVyLlxuICAgICAqXG4gICAgICogQHR5cGUge0VtaXR0ZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuXG4gICAgdGhpcy5pbml0aWFsaXplUGx1Z2lucygpXG4gIH1cblxuICAvKipcbiAgICogQWN0aXZhdGVzIHRoZSBtaW5pbWFwIHBhY2thZ2UuXG4gICAqL1xuICBhY3RpdmF0ZSAoKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlKSB7IHJldHVybiB9XG5cbiAgICBpZiAoIU1pbmltYXApIHsgTWluaW1hcCA9IHJlcXVpcmUoJy4vbWluaW1hcCcpIH1cbiAgICBpZiAoIU1pbmltYXBFbGVtZW50KSB7IE1pbmltYXBFbGVtZW50ID0gcmVxdWlyZSgnLi9taW5pbWFwLWVsZW1lbnQnKSB9XG5cbiAgICBNaW5pbWFwRWxlbWVudC5yZWdpc3RlclZpZXdQcm92aWRlcihNaW5pbWFwKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zT2ZDb21tYW5kcyA9IGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdtaW5pbWFwOnRvZ2dsZSc6ICgpID0+IHtcbiAgICAgICAgdGhpcy50b2dnbGUoKVxuICAgICAgfSxcbiAgICAgICdtaW5pbWFwOmdlbmVyYXRlLWNvZmZlZS1wbHVnaW4nOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVQbHVnaW4oJ2NvZmZlZScpXG4gICAgICB9LFxuICAgICAgJ21pbmltYXA6Z2VuZXJhdGUtamF2YXNjcmlwdC1wbHVnaW4nOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVQbHVnaW4oJ2phdmFzY3JpcHQnKVxuICAgICAgfSxcbiAgICAgICdtaW5pbWFwOmdlbmVyYXRlLWJhYmVsLXBsdWdpbic6ICgpID0+IHtcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVBsdWdpbignYmFiZWwnKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmVkaXRvcnNNaW5pbWFwcyA9IG5ldyBNYXAoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWVcblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ21pbmltYXAuYXV0b1RvZ2dsZScpKSB7IHRoaXMudG9nZ2xlKCkgfVxuICB9XG5cbiAgLyoqXG4gICAqIERlYWN0aXZhdGVzIHRoZSBtaW5pbWFwIHBhY2thZ2UuXG4gICAqL1xuICBkZWFjdGl2YXRlICgpIHtcbiAgICBpZiAoIXRoaXMuYWN0aXZlKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLmRlYWN0aXZhdGVBbGxQbHVnaW5zKClcblxuICAgIGlmICh0aGlzLmVkaXRvcnNNaW5pbWFwcykge1xuICAgICAgdGhpcy5lZGl0b3JzTWluaW1hcHMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICB2YWx1ZS5kZXN0cm95KClcbiAgICAgICAgdGhpcy5lZGl0b3JzTWluaW1hcHMuZGVsZXRlKGtleSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnNPZkNvbW1hbmRzLmRpc3Bvc2UoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9uc09mQ29tbWFuZHMgPSBudWxsXG4gICAgdGhpcy5lZGl0b3JzTWluaW1hcHMgPSB1bmRlZmluZWRcbiAgICB0aGlzLnRvZ2dsZWQgPSBmYWxzZVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBtaW5pbWFwIGRpc3BsYXkuXG4gICAqL1xuICB0b2dnbGUgKCkge1xuICAgIGlmICghdGhpcy5hY3RpdmUpIHsgcmV0dXJuIH1cblxuICAgIGlmICh0aGlzLnRvZ2dsZWQpIHtcbiAgICAgIHRoaXMudG9nZ2xlZCA9IGZhbHNlXG5cbiAgICAgIGlmICh0aGlzLmVkaXRvcnNNaW5pbWFwcykge1xuICAgICAgICB0aGlzLmVkaXRvcnNNaW5pbWFwcy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgdmFsdWUuZGVzdHJveSgpXG4gICAgICAgICAgdGhpcy5lZGl0b3JzTWluaW1hcHMuZGVsZXRlKGtleSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50b2dnbGVkID0gdHJ1ZVxuICAgICAgdGhpcy5pbml0U3Vic2NyaXB0aW9ucygpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIHRoZSBwbHVnaW4gZ2VuZXJhdGlvbiB2aWV3LlxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRlbXBsYXRlIHRoZSBuYW1lIG9mIHRoZSB0ZW1wbGF0ZSB0byB1c2VcbiAgICovXG4gIGdlbmVyYXRlUGx1Z2luICh0ZW1wbGF0ZSkge1xuICAgIGlmICghTWluaW1hcFBsdWdpbkdlbmVyYXRvckVsZW1lbnQpIHtcbiAgICAgIE1pbmltYXBQbHVnaW5HZW5lcmF0b3JFbGVtZW50ID0gcmVxdWlyZSgnLi9taW5pbWFwLXBsdWdpbi1nZW5lcmF0b3ItZWxlbWVudCcpXG4gICAgfVxuICAgIHZhciB2aWV3ID0gbmV3IE1pbmltYXBQbHVnaW5HZW5lcmF0b3JFbGVtZW50KClcbiAgICB2aWV3LnRlbXBsYXRlID0gdGVtcGxhdGVcbiAgICB2aWV3LmF0dGFjaCgpXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gbGlzdGVuIHRvIHRoZSBgZGlkLWFjdGl2YXRlYCBldmVudCBvZiB0aGUgcGFja2FnZS5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRBY3RpdmF0ZSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtYWN0aXZhdGUnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBsaXN0ZW4gdG8gdGhlIGBkaWQtZGVhY3RpdmF0ZWAgZXZlbnQgb2YgdGhlXG4gICAqIHBhY2thZ2UuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKGV2ZW50Ok9iamVjdCk6dm9pZH0gY2FsbGJhY2sgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkRGVhY3RpdmF0ZSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVhY3RpdmF0ZScsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGxpc3RlbiB0byB0aGUgYGRpZC1jcmVhdGUtbWluaW1hcGAgZXZlbnQgb2YgdGhlXG4gICAqIHBhY2thZ2UuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKGV2ZW50Ok9iamVjdCk6dm9pZH0gY2FsbGJhY2sgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQ3JlYXRlTWluaW1hcCAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY3JlYXRlLW1pbmltYXAnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBsaXN0ZW4gdG8gdGhlIGBkaWQtYWRkLXBsdWdpbmAgZXZlbnQgb2YgdGhlXG4gICAqIHBhY2thZ2UuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKGV2ZW50Ok9iamVjdCk6dm9pZH0gY2FsbGJhY2sgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQWRkUGx1Z2luIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1hZGQtcGx1Z2luJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gbGlzdGVuIHRvIHRoZSBgZGlkLXJlbW92ZS1wbHVnaW5gIGV2ZW50IG9mIHRoZVxuICAgKiBwYWNrYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZFJlbW92ZVBsdWdpbiAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtcmVtb3ZlLXBsdWdpbicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGxpc3RlbiB0byB0aGUgYGRpZC1hY3RpdmF0ZS1wbHVnaW5gIGV2ZW50IG9mIHRoZVxuICAgKiBwYWNrYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZEFjdGl2YXRlUGx1Z2luIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1hY3RpdmF0ZS1wbHVnaW4nLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBsaXN0ZW4gdG8gdGhlIGBkaWQtZGVhY3RpdmF0ZS1wbHVnaW5gIGV2ZW50IG9mIHRoZVxuICAgKiBwYWNrYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZERlYWN0aXZhdGVQbHVnaW4gKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRlYWN0aXZhdGUtcGx1Z2luJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gbGlzdGVuIHRvIHRoZSBgZGlkLWNoYW5nZS1wbHVnaW4tb3JkZXJgIGV2ZW50IG9mXG4gICAqIHRoZSBwYWNrYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENoYW5nZVBsdWdpbk9yZGVyIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2UtcGx1Z2luLW9yZGVyJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYE1pbmltYXBgIGNsYXNzXG4gICAqXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aGUgYE1pbmltYXBgIGNsYXNzIGNvbnN0cnVjdG9yXG4gICAqL1xuICBtaW5pbWFwQ2xhc3MgKCkgeyByZXR1cm4gTWluaW1hcCB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBNaW5pbWFwYCBvYmplY3QgYXNzb2NpYXRlZCB0byB0aGUgcGFzc2VkLWluXG4gICAqIGBUZXh0RWRpdG9yRWxlbWVudGAuXG4gICAqXG4gICAqIEBwYXJhbSAge1RleHRFZGl0b3JFbGVtZW50fSBlZGl0b3JFbGVtZW50IGEgdGV4dCBlZGl0b3IgZWxlbWVudFxuICAgKiBAcmV0dXJuIHtNaW5pbWFwfSB0aGUgYXNzb2NpYXRlZCBtaW5pbWFwXG4gICAqL1xuICBtaW5pbWFwRm9yRWRpdG9yRWxlbWVudCAoZWRpdG9yRWxlbWVudCkge1xuICAgIGlmICghZWRpdG9yRWxlbWVudCkgeyByZXR1cm4gfVxuICAgIHJldHVybiB0aGlzLm1pbmltYXBGb3JFZGl0b3IoZWRpdG9yRWxlbWVudC5nZXRNb2RlbCgpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBNaW5pbWFwYCBvYmplY3QgYXNzb2NpYXRlZCB0byB0aGUgcGFzc2VkLWluXG4gICAqIGBUZXh0RWRpdG9yYC5cbiAgICpcbiAgICogQHBhcmFtICB7VGV4dEVkaXRvcn0gdGV4dEVkaXRvciBhIHRleHQgZWRpdG9yXG4gICAqIEByZXR1cm4ge01pbmltYXB9IHRoZSBhc3NvY2lhdGVkIG1pbmltYXBcbiAgICovXG4gIG1pbmltYXBGb3JFZGl0b3IgKHRleHRFZGl0b3IpIHtcbiAgICBpZiAoIXRleHRFZGl0b3IpIHsgcmV0dXJuIH1cblxuICAgIGxldCBtaW5pbWFwID0gdGhpcy5lZGl0b3JzTWluaW1hcHMuZ2V0KHRleHRFZGl0b3IpXG5cbiAgICBpZiAoIW1pbmltYXApIHtcbiAgICAgIG1pbmltYXAgPSBuZXcgTWluaW1hcCh7dGV4dEVkaXRvcn0pXG4gICAgICB0aGlzLmVkaXRvcnNNaW5pbWFwcy5zZXQodGV4dEVkaXRvciwgbWluaW1hcClcblxuICAgICAgdmFyIGVkaXRvclN1YnNjcmlwdGlvbiA9IHRleHRFZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgbGV0IG1pbmltYXBzID0gdGhpcy5lZGl0b3JzTWluaW1hcHNcbiAgICAgICAgaWYgKG1pbmltYXBzKSB7IG1pbmltYXBzLmRlbGV0ZSh0ZXh0RWRpdG9yKSB9XG4gICAgICAgIGVkaXRvclN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIG1pbmltYXBcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbmV3IHN0YW5kLWFsb25lIHtNaW5pbWFwfSBmb3IgdGhlIHBhc3NlZC1pbiBgVGV4dEVkaXRvcmAuXG4gICAqXG4gICAqIEBwYXJhbSAge1RleHRFZGl0b3J9IHRleHRFZGl0b3IgYSB0ZXh0IGVkaXRvciBpbnN0YW5jZSB0byBjcmVhdGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhIG1pbmltYXAgZm9yXG4gICAqIEByZXR1cm4ge01pbmltYXB9IGEgbmV3IHN0YW5kLWFsb25lIE1pbmltYXAgZm9yIHRoZSBwYXNzZWQtaW4gZWRpdG9yXG4gICAqL1xuICBzdGFuZEFsb25lTWluaW1hcEZvckVkaXRvciAodGV4dEVkaXRvcikge1xuICAgIGlmICghdGV4dEVkaXRvcikgeyByZXR1cm4gfVxuXG4gICAgcmV0dXJuIG5ldyBNaW5pbWFwKHtcbiAgICAgIHRleHRFZGl0b3I6IHRleHRFZGl0b3IsXG4gICAgICBzdGFuZEFsb25lOiB0cnVlXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgTWluaW1hcGAgYXNzb2NpYXRlZCB0byB0aGUgYWN0aXZlIGBUZXh0RWRpdG9yYC5cbiAgICpcbiAgICogQHJldHVybiB7TWluaW1hcH0gdGhlIGFjdGl2ZSBNaW5pbWFwXG4gICAqL1xuICBnZXRBY3RpdmVNaW5pbWFwICgpIHtcbiAgICByZXR1cm4gdGhpcy5taW5pbWFwRm9yRWRpdG9yKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyBhIGZ1bmN0aW9uIGZvciBlYWNoIHByZXNlbnQgYW5kIGZ1dHVyZSBtaW5pbWFwcy5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24obWluaW1hcDpNaW5pbWFwKTp2b2lkfSBpdGVyYXRvciBhIGZ1bmN0aW9uIHRvIGNhbGwgd2l0aFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBleGlzdGluZyBhbmQgZnV0dXJlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaW1hcHNcbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHVucmVnaXN0ZXIgdGhlIG9ic2VydmVyXG4gICAqL1xuICBvYnNlcnZlTWluaW1hcHMgKGl0ZXJhdG9yKSB7XG4gICAgaWYgKCFpdGVyYXRvcikgeyByZXR1cm4gfVxuXG4gICAgaWYgKHRoaXMuZWRpdG9yc01pbmltYXBzKSB7XG4gICAgICB0aGlzLmVkaXRvcnNNaW5pbWFwcy5mb3JFYWNoKChtaW5pbWFwKSA9PiB7IGl0ZXJhdG9yKG1pbmltYXApIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLm9uRGlkQ3JlYXRlTWluaW1hcCgobWluaW1hcCkgPT4geyBpdGVyYXRvcihtaW5pbWFwKSB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyB0byB0aGUgYG9ic2VydmVUZXh0RWRpdG9yc2AgbWV0aG9kLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGluaXRTdWJzY3JpcHRpb25zICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygodGV4dEVkaXRvcikgPT4ge1xuICAgICAgbGV0IG1pbmltYXAgPSB0aGlzLm1pbmltYXBGb3JFZGl0b3IodGV4dEVkaXRvcilcbiAgICAgIGxldCBtaW5pbWFwRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhtaW5pbWFwKVxuXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNyZWF0ZS1taW5pbWFwJywgbWluaW1hcClcblxuICAgICAgbWluaW1hcEVsZW1lbnQuYXR0YWNoKClcbiAgICB9KSlcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBleHBvc2VkIGluc3RhbmNlIG9mIHRoZSBgTWFpbmAgY2xhc3MuXG4gKlxuICogQGFjY2VzcyBwcml2YXRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IG5ldyBNYWluKClcbiJdfQ==
//# sourceURL=/Users/ajenkins/.atom/packages/minimap/lib/main.js

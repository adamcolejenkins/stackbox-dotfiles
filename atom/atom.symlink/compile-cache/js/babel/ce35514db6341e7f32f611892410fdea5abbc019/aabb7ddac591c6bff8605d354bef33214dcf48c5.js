Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _mixto = require('mixto');

var _mixto2 = _interopRequireDefault(_mixto);

var _atom = require('atom');

/**
 * Provides methods to manage minimap plugins.
 * Minimap plugins are Atom packages that will augment the minimap.
 * They have a secondary activation cycle going on constrained by the minimap
 * package activation. A minimap plugin life cycle will generally look
 * like this:
 *
 * 1. The plugin module is activated by Atom through the `activate` method
 * 2. The plugin then register itself as a minimap plugin using `registerPlugin`
 * 3. The plugin is activated/deactivated according to the minimap settings.
 * 4. On the plugin module deactivation, the plugin must unregisters itself
 *    from the minimap using the `unregisterPlugin`.
 *
 * @access public
 */
'use babel';

var PluginManagement = (function (_Mixin) {
  _inherits(PluginManagement, _Mixin);

  function PluginManagement() {
    _classCallCheck(this, PluginManagement);

    _get(Object.getPrototypeOf(PluginManagement.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(PluginManagement, [{
    key: 'provideMinimapServiceV1',

    /**
     * Returns the Minimap main module instance.
     *
     * @return {Main} The Minimap main module instance.
     */
    value: function provideMinimapServiceV1() {
      return this;
    }

    /**
     * Initializes the properties for plugins' management.
     *
     * @access private
     */
  }, {
    key: 'initializePlugins',
    value: function initializePlugins() {
      /**
       * The registered Minimap plugins stored using their name as key.
       *
       * @type {Object}
       * @access private
       */
      this.plugins = {};
      /**
       * The plugins' subscriptions stored using the plugin names as keys.
       *
       * @type {Object}
       * @access private
       */
      this.pluginsSubscriptions = {};

      /**
       * A map that stores the display order for each plugin
       *
       * @type {Object}
       * @access private
       */
      this.pluginsOrderMap = {};
    }

    /**
     * Registers a minimap `plugin` with the given `name`.
     *
     * @param {string} name The identifying name of the plugin.
     *                      It will be used as activation settings name
     *                      as well as the key to unregister the module.
     * @param {MinimapPlugin} plugin The plugin to register.
     * @emits {did-add-plugin} with the name and a reference to the added plugin.
     * @emits {did-activate-plugin} if the plugin was activated during
     *                              the registration.
     */
  }, {
    key: 'registerPlugin',
    value: function registerPlugin(name, plugin) {
      this.plugins[name] = plugin;
      this.pluginsSubscriptions[name] = new _atom.CompositeDisposable();

      var event = { name: name, plugin: plugin };
      this.emitter.emit('did-add-plugin', event);

      if (atom.config.get('minimap.displayPluginsControls')) {
        this.registerPluginControls(name, plugin);
      }

      this.updatesPluginActivationState(name);
    }

    /**
     * Unregisters a plugin from the minimap.
     *
     * @param {string} name The identifying name of the plugin to unregister.
     * @emits {did-remove-plugin} with the name and a reference
     *        to the added plugin.
     */
  }, {
    key: 'unregisterPlugin',
    value: function unregisterPlugin(name) {
      var plugin = this.plugins[name];

      if (atom.config.get('minimap.displayPluginsControls')) {
        this.unregisterPluginControls(name);
      }

      delete this.plugins[name];

      var event = { name: name, plugin: plugin };
      this.emitter.emit('did-remove-plugin', event);
    }

    /**
     * Toggles the specified plugin activation state.
     *
     * @param  {string} name     The name of the plugin.
     * @param  {boolean} boolean An optional boolean to set the activation
     *                           state of the plugin. If ommitted the new plugin
     *                           state will be the the inverse of its current
     *                           state.
     * @emits {did-activate-plugin} if the plugin was activated by the call.
     * @emits {did-deactivate-plugin} if the plugin was deactivated by the call.
     */
  }, {
    key: 'togglePluginActivation',
    value: function togglePluginActivation(name, boolean) {
      var settingsKey = 'minimap.plugins.' + name;

      if (boolean !== undefined && boolean !== null) {
        atom.config.set(settingsKey, boolean);
      } else {
        atom.config.set(settingsKey, !atom.config.get(settingsKey));
      }

      this.updatesPluginActivationState(name);
    }

    /**
     * Deactivates all the plugins registered in the minimap package so far.
     *
     * @emits {did-deactivate-plugin} for each plugin deactivated by the call.
     */
  }, {
    key: 'deactivateAllPlugins',
    value: function deactivateAllPlugins() {
      for (var _ref3 of this.eachPlugin()) {
        var _ref2 = _slicedToArray(_ref3, 2);

        var _name = _ref2[0];
        var plugin = _ref2[1];

        plugin.deactivatePlugin();
        this.emitter.emit('did-deactivate-plugin', { name: _name, plugin: plugin });
      }
    }

    /**
     * A generator function to iterate over registered plugins.
     *
     * @return An iterable that yield the name and reference to every plugin
     *         as an array in each iteration.
     */
  }, {
    key: 'eachPlugin',
    value: function* eachPlugin() {
      for (var _name2 in this.plugins) {
        yield [_name2, this.plugins[_name2]];
      }
    }

    /**
     * Updates the plugin activation state according to the current config.
     *
     * @param {string} name The identifying name of the plugin to update.
     * @emits {did-activate-plugin} if the plugin was activated by the call.
     * @emits {did-deactivate-plugin} if the plugin was deactivated by the call.
     * @access private
     */
  }, {
    key: 'updatesPluginActivationState',
    value: function updatesPluginActivationState(name) {
      var plugin = this.plugins[name];
      var pluginActive = plugin.isActive();
      var settingActive = atom.config.get('minimap.plugins.' + name);

      if (atom.config.get('minimap.displayPluginsControls')) {
        if (settingActive && !pluginActive) {
          this.activatePlugin(name, plugin);
        } else if (pluginActive && !settingActive) {
          this.deactivatePlugin(name, plugin);
        }
      } else {
        if (!pluginActive) {
          this.activatePlugin(name, plugin);
        } else if (pluginActive) {
          this.deactivatePlugin(name, plugin);
        }
      }
    }
  }, {
    key: 'activatePlugin',
    value: function activatePlugin(name, plugin) {
      var event = { name: name, plugin: plugin };

      plugin.activatePlugin();
      this.emitter.emit('did-activate-plugin', event);
    }
  }, {
    key: 'deactivatePlugin',
    value: function deactivatePlugin(name, plugin) {
      var event = { name: name, plugin: plugin };

      plugin.deactivatePlugin();
      this.emitter.emit('did-deactivate-plugin', event);
    }

    /**
     * When the `minimap.displayPluginsControls` setting is toggled,
     * this function will register the commands and setting to manage the plugin
     * activation from the minimap settings.
     *
     * @param {string} name The identifying name of the plugin.
     * @param {MinimapPlugin} plugin The plugin instance to register
     *        controls for.
     * @listens {minimap.plugins.${name}} listen to the setting to update
     *          the plugin state accordingly.
     * @listens {minimap:toggle-${name}} listen to the command on `atom-workspace`
     *          to toggle the plugin state.
     * @access private
     */
  }, {
    key: 'registerPluginControls',
    value: function registerPluginControls(name, plugin) {
      var _this = this;

      var settingsKey = 'minimap.plugins.' + name;
      var orderSettingsKey = 'minimap.plugins.' + name + 'DecorationsZIndex';

      this.config.plugins.properties[name] = {
        type: 'boolean',
        title: name,
        description: 'Whether the ' + name + ' plugin is activated and displayed in the Minimap.',
        'default': true
      };

      this.config.plugins.properties[name + 'DecorationsZIndex'] = {
        type: 'integer',
        title: name + ' decorations order',
        description: 'The relative order of the ' + name + ' plugin\'s decorations in the layer into which they are drawn. Note that this order only apply inside a layer, so highlight-over decorations will always be displayed above line decorations as they are rendered in different layers.',
        'default': 0
      };

      if (atom.config.get(settingsKey) === undefined) {
        atom.config.set(settingsKey, true);
      }

      if (atom.config.get(orderSettingsKey) === undefined) {
        atom.config.set(orderSettingsKey, 0);
      }

      this.pluginsSubscriptions[name].add(atom.config.observe(settingsKey, function () {
        _this.updatesPluginActivationState(name);
      }));

      this.pluginsSubscriptions[name].add(atom.config.observe(orderSettingsKey, function (order) {
        _this.updatePluginsOrderMap(name);
        var event = { name: name, plugin: plugin, order: order };
        _this.emitter.emit('did-change-plugin-order', event);
      }));

      this.pluginsSubscriptions[name].add(atom.commands.add('atom-workspace', _defineProperty({}, 'minimap:toggle-' + name, function () {
        _this.togglePluginActivation(name);
      })));

      this.updatePluginsOrderMap(name);
    }

    /**
     * Updates the display order in the map for the passed-in plugin name.
     *
     * @param  {string} name the name of the plugin to update
     * @access private
     */
  }, {
    key: 'updatePluginsOrderMap',
    value: function updatePluginsOrderMap(name) {
      var orderSettingsKey = 'minimap.plugins.' + name + 'DecorationsZIndex';

      this.pluginsOrderMap[name] = atom.config.get(orderSettingsKey);
    }

    /**
     * Returns the plugins display order mapped by name.
     *
     * @return {Object} The plugins order by name
     */
  }, {
    key: 'getPluginsOrder',
    value: function getPluginsOrder() {
      return this.pluginsOrderMap;
    }

    /**
     * When the `minimap.displayPluginsControls` setting is toggled,
     * this function will unregister the commands and setting that
     * was created previously.
     *
     * @param {string} name The identifying name of the plugin.
     * @access private
     */
  }, {
    key: 'unregisterPluginControls',
    value: function unregisterPluginControls(name) {
      this.pluginsSubscriptions[name].dispose();
      delete this.pluginsSubscriptions[name];
      delete this.config.plugins.properties[name];
    }
  }]);

  return PluginManagement;
})(_mixto2['default']);

exports['default'] = PluginManagement;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taXhpbnMvcGx1Z2luLW1hbmFnZW1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQUVrQixPQUFPOzs7O29CQUNXLE1BQU07Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSDFDLFdBQVcsQ0FBQTs7SUFvQlUsZ0JBQWdCO1lBQWhCLGdCQUFnQjs7V0FBaEIsZ0JBQWdCOzBCQUFoQixnQkFBZ0I7OytCQUFoQixnQkFBZ0I7OztlQUFoQixnQkFBZ0I7Ozs7Ozs7O1dBTVgsbUNBQUc7QUFBRSxhQUFPLElBQUksQ0FBQTtLQUFFOzs7Ozs7Ozs7V0FPeEIsNkJBQUc7Ozs7Ozs7QUFPbkIsVUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUE7Ozs7Ozs7QUFPakIsVUFBSSxDQUFDLG9CQUFvQixHQUFHLEVBQUUsQ0FBQTs7Ozs7Ozs7QUFROUIsVUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUE7S0FDMUI7Ozs7Ozs7Ozs7Ozs7OztXQWFjLHdCQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7QUFDNUIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUE7QUFDM0IsVUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxHQUFHLCtCQUF5QixDQUFBOztBQUUzRCxVQUFJLEtBQUssR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFBO0FBQzFDLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxDQUFBOztBQUUxQyxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLEVBQUU7QUFDckQsWUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQTtPQUMxQzs7QUFFRCxVQUFJLENBQUMs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QUksQ0FBQyxDQUFBO0tBQ2pDOzs7Ozs7Ozs7O1dBUXFCLCtCQUFDLElBQUksRUFBRTtBQUMzQixVQUFNLGdCQUFnQix3QkFBc0IsSUFBSSxzQkFBbUIsQ0FBQTs7QUFFbkUsVUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0tBQy9EOzs7Ozs7Ozs7V0FPZSwyQkFBRztBQUFFLGFBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQTtLQUFFOzs7Ozs7Ozs7Ozs7V0FVekIsa0NBQUMsSUFBSSxFQUFFO0FBQzlCLFVBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUN6QyxhQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUN0QyxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUM1Qzs7O1NBdFFrQixnQkFBZ0I7OztxQkFBaEIsZ0JBQWdCIiwiZmlsZSI6Ii9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taXhpbnMvcGx1Z2luLW1hbmFnZW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgTWl4aW4gZnJvbSAnbWl4dG8nXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuLyoqXG4gKiBQcm92aWRlcyBtZXRob2RzIHRvIG1hbmFnZSBtaW5pbWFwIHBsdWdpbnMuXG4gKiBNaW5pbWFwIHBsdWdpbnMgYXJlIEF0b20gcGFja2FnZXMgdGhhdCB3aWxsIGF1Z21lbnQgdGhlIG1pbmltYXAuXG4gKiBUaGV5IGhhdmUgYSBzZWNvbmRhcnkgYWN0aXZhdGlvbiBjeWNsZSBnb2luZyBvbiBjb25zdHJhaW5lZCBieSB0aGUgbWluaW1hcFxuICogcGFja2FnZSBhY3RpdmF0aW9uLiBBIG1pbmltYXAgcGx1Z2luIGxpZmUgY3ljbGUgd2lsbCBnZW5lcmFsbHkgbG9va1xuICogbGlrZSB0aGlzOlxuICpcbiAqIDEuIFRoZSBwbHVnaW4gbW9kdWxlIGlzIGFjdGl2YXRlZCBieSBBdG9tIHRocm91Z2ggdGhlIGBhY3RpdmF0ZWAgbWV0aG9kXG4gKiAyLiBUaGUgcGx1Z2luIHRoZW4gcmVnaXN0ZXIgaXRzZWxmIGFzIGEgbWluaW1hcCBwbHVnaW4gdXNpbmcgYHJlZ2lzdGVyUGx1Z2luYFxuICogMy4gVGhlIHBsdWdpbiBpcyBhY3RpdmF0ZWQvZGVhY3RpdmF0ZWQgYWNjb3JkaW5nIHRvIHRoZSBtaW5pbWFwIHNldHRpbmdzLlxuICogNC4gT24gdGhlIHBsdWdpbiBtb2R1bGUgZGVhY3RpdmF0aW9uLCB0aGUgcGx1Z2luIG11c3QgdW5yZWdpc3RlcnMgaXRzZWxmXG4gKiAgICBmcm9tIHRoZSBtaW5pbWFwIHVzaW5nIHRoZSBgdW5yZWdpc3RlclBsdWdpbmAuXG4gKlxuICogQGFjY2VzcyBwdWJsaWNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGx1Z2luTWFuYWdlbWVudCBleHRlbmRzIE1peGluIHtcbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIE1pbmltYXAgbWFpbiBtb2R1bGUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEByZXR1cm4ge01haW59IFRoZSBNaW5pbWFwIG1haW4gbW9kdWxlIGluc3RhbmNlLlxuICAgKi9cbiAgcHJvdmlkZU1pbmltYXBTZXJ2aWNlVjEgKCkgeyByZXR1cm4gdGhpcyB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBwcm9wZXJ0aWVzIGZvciBwbHVnaW5zJyBtYW5hZ2VtZW50LlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGluaXRpYWxpemVQbHVnaW5zICgpIHtcbiAgICAvKipcbiAgICAgKiBUaGUgcmVnaXN0ZXJlZCBNaW5pbWFwIHBsdWdpbnMgc3RvcmVkIHVzaW5nIHRoZWlyIG5hbWUgYXMga2V5LlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnBsdWdpbnMgPSB7fVxuICAgIC8qKlxuICAgICAqIFRoZSBwbHVnaW5zJyBzdWJzY3JpcHRpb25zIHN0b3JlZCB1c2luZyB0aGUgcGx1Z2luIG5hbWVzIGFzIGtleXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucGx1Z2luc1N1YnNjcmlwdGlvbnMgPSB7fVxuXG4gICAgLyoqXG4gICAgICogQSBtYXAgdGhhdCBzdG9yZXMgdGhlIGRpc3BsYXkgb3JkZXIgZm9yIGVhY2ggcGx1Z2luXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucGx1Z2luc09yZGVyTWFwID0ge31cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBtaW5pbWFwIGBwbHVnaW5gIHdpdGggdGhlIGdpdmVuIGBuYW1lYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIGlkZW50aWZ5aW5nIG5hbWUgb2YgdGhlIHBsdWdpbi5cbiAgICogICAgICAgICAgICAgICAgICAgICAgSXQgd2lsbCBiZSB1c2VkIGFzIGFjdGl2YXRpb24gc2V0dGluZ3MgbmFtZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICBhcyB3ZWxsIGFzIHRoZSBrZXkgdG8gdW5yZWdpc3RlciB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge01pbmltYXBQbHVnaW59IHBsdWdpbiBUaGUgcGx1Z2luIHRvIHJlZ2lzdGVyLlxuICAgKiBAZW1pdHMge2RpZC1hZGQtcGx1Z2lufSB3aXRoIHRoZSBuYW1lIGFuZCBhIHJlZmVyZW5jZSB0byB0aGUgYWRkZWQgcGx1Z2luLlxuICAgKiBAZW1pdHMge2RpZC1hY3RpdmF0ZS1wbHVnaW59IGlmIHRoZSBwbHVnaW4gd2FzIGFjdGl2YXRlZCBkdXJpbmdcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgcmVnaXN0cmF0aW9uLlxuICAgKi9cbiAgcmVnaXN0ZXJQbHVnaW4gKG5hbWUsIHBsdWdpbikge1xuICAgIHRoaXMucGx1Z2luc1tuYW1lXSA9IHBsdWdpblxuICAgIHRoaXMucGx1Z2luc1N1YnNjcmlwdGlvbnNbbmFtZV0gPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICBsZXQgZXZlbnQgPSB7IG5hbWU6IG5hbWUsIHBsdWdpbjogcGx1Z2luIH1cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWFkZC1wbHVnaW4nLCBldmVudClcblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ21pbmltYXAuZGlzcGxheVBsdWdpbnNDb250cm9scycpKSB7XG4gICAgICB0aGlzLnJlZ2lzdGVyUGx1Z2luQ29udHJvbHMobmFtZSwgcGx1Z2luKVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlc1BsdWdpbkFjdGl2YXRpb25TdGF0ZShuYW1lKVxuICB9XG5cbiAgLyoqXG4gICAqIFVucmVnaXN0ZXJzIGEgcGx1Z2luIGZyb20gdGhlIG1pbmltYXAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBpZGVudGlmeWluZyBuYW1lIG9mIHRoZSBwbHVnaW4gdG8gdW5yZWdpc3Rlci5cbiAgICogQGVtaXRzIHtkaWQtcmVtb3ZlLXBsdWdpbn0gd2l0aCB0aGUgbmFtZSBhbmQgYSByZWZlcmVuY2VcbiAgICogICAgICAgIHRvIHRoZSBhZGRlZCBwbHVnaW4uXG4gICAqL1xuICB1bnJlZ2lzdGVyUGx1Z2luIChuYW1lKSB7XG4gICAgbGV0IHBsdWdpbiA9IHRoaXMucGx1Z2luc1tuYW1lXVxuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnbWluaW1hcC5kaXNwbGF5UGx1Z2luc0NvbnRyb2xzJykpIHtcbiAgICAgIHRoaXMudW5yZWdpc3RlclBsdWdpbkNvbnRyb2xzKG5hbWUpXG4gICAgfVxuXG4gICAgZGVsZXRlIHRoaXMucGx1Z2luc1tuYW1lXVxuXG4gICAgbGV0IGV2ZW50ID0geyBuYW1lOiBuYW1lLCBwbHVnaW46IHBsdWdpbiB9XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1yZW1vdmUtcGx1Z2luJywgZXZlbnQpXG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgc3BlY2lmaWVkIHBsdWdpbiBhY3RpdmF0aW9uIHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IG5hbWUgICAgIFRoZSBuYW1lIG9mIHRoZSBwbHVnaW4uXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGJvb2xlYW4gQW4gb3B0aW9uYWwgYm9vbGVhbiB0byBzZXQgdGhlIGFjdGl2YXRpb25cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSBvZiB0aGUgcGx1Z2luLiBJZiBvbW1pdHRlZCB0aGUgbmV3IHBsdWdpblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlIHdpbGwgYmUgdGhlIHRoZSBpbnZlcnNlIG9mIGl0cyBjdXJyZW50XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuXG4gICAqIEBlbWl0cyB7ZGlkLWFjdGl2YXRlLXBsdWdpbn0gaWYgdGhlIHBsdWdpbiB3YXMgYWN0aXZhdGVkIGJ5IHRoZSBjYWxsLlxuICAgKiBAZW1pdHMge2RpZC1kZWFjdGl2YXRlLXBsdWdpbn0gaWYgdGhlIHBsdWdpbiB3YXMgZGVhY3RpdmF0ZWQgYnkgdGhlIGNhbGwuXG4gICAqL1xuICB0b2dnbGVQbHVnaW5BY3RpdmF0aW9uIChuYW1lLCBib29sZWFuKSB7XG4gICAgbGV0IHNldHRpbmdzS2V5ID0gYG1pbmltYXAucGx1Z2lucy4ke25hbWV9YFxuXG4gICAgaWYgKGJvb2xlYW4gIT09IHVuZGVmaW5lZCAmJiBib29sZWFuICE9PSBudWxsKSB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoc2V0dGluZ3NLZXksIGJvb2xlYW4pXG4gICAgfSBlbHNlIHtcbiAgICAgIGF0b20uY29uZmlnLnNldChzZXR0aW5nc0tleSwgIWF0b20uY29uZmlnLmdldChzZXR0aW5nc0tleSkpXG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVzUGx1Z2luQWN0aXZhdGlvblN0YXRlKG5hbWUpXG4gIH1cblxuICAvKipcbiAgICogRGVhY3RpdmF0ZXMgYWxsIHRoZSBwbHVnaW5zIHJlZ2lzdGVyZWQgaW4gdGhlIG1pbmltYXAgcGFja2FnZSBzbyBmYXIuXG4gICAqXG4gICAqIEBlbWl0cyB7ZGlkLWRlYWN0aXZhdGUtcGx1Z2lufSBmb3IgZWFjaCBwbHVnaW4gZGVhY3RpdmF0ZWQgYnkgdGhlIGNhbGwuXG4gICAqL1xuICBkZWFjdGl2YXRlQWxsUGx1Z2lucyAoKSB7XG4gICAgZm9yIChsZXQgW25hbWUsIHBsdWdpbl0gb2YgdGhpcy5lYWNoUGx1Z2luKCkpIHtcbiAgICAgIHBsdWdpbi5kZWFjdGl2YXRlUGx1Z2luKClcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGVhY3RpdmF0ZS1wbHVnaW4nLCB7IG5hbWU6IG5hbWUsIHBsdWdpbjogcGx1Z2luIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEEgZ2VuZXJhdG9yIGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciByZWdpc3RlcmVkIHBsdWdpbnMuXG4gICAqXG4gICAqIEByZXR1cm4gQW4gaXRlcmFibGUgdGhhdCB5aWVsZCB0aGUgbmFtZSBhbmQgcmVmZXJlbmNlIHRvIGV2ZXJ5IHBsdWdpblxuICAgKiAgICAgICAgIGFzIGFuIGFycmF5IGluIGVhY2ggaXRlcmF0aW9uLlxuICAgKi9cbiAgKiBlYWNoUGx1Z2luICgpIHtcbiAgICBmb3IgKGxldCBuYW1lIGluIHRoaXMucGx1Z2lucykge1xuICAgICAgeWllbGQgW25hbWUsIHRoaXMucGx1Z2luc1tuYW1lXV1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcGx1Z2luIGFjdGl2YXRpb24gc3RhdGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IGNvbmZpZy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIGlkZW50aWZ5aW5nIG5hbWUgb2YgdGhlIHBsdWdpbiB0byB1cGRhdGUuXG4gICAqIEBlbWl0cyB7ZGlkLWFjdGl2YXRlLXBsdWdpbn0gaWYgdGhlIHBsdWdpbiB3YXMgYWN0aXZhdGVkIGJ5IHRoZSBjYWxsLlxuICAgKiBAZW1pdHMge2RpZC1kZWFjdGl2YXRlLXBsdWdpbn0gaWYgdGhlIHBsdWdpbiB3YXMgZGVhY3RpdmF0ZWQgYnkgdGhlIGNhbGwuXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgdXBkYXRlc1BsdWdpbkFjdGl2YXRpb25TdGF0ZSAobmFtZSkge1xuICAgIGNvbnN0IHBsdWdpbiA9IHRoaXMucGx1Z2luc1tuYW1lXVxuICAgIGNvbnN0IHBsdWdpbkFjdGl2ZSA9IHBsdWdpbi5pc0FjdGl2ZSgpXG4gICAgY29uc3Qgc2V0dGluZ0FjdGl2ZSA9IGF0b20uY29uZmlnLmdldChgbWluaW1hcC5wbHVnaW5zLiR7bmFtZX1gKVxuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnbWluaW1hcC5kaXNwbGF5UGx1Z2luc0NvbnRyb2xzJykpIHtcbiAgICAgIGlmIChzZXR0aW5nQWN0aXZlICYmICFwbHVnaW5BY3RpdmUpIHtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZVBsdWdpbihuYW1lLCBwbHVnaW4pXG4gICAgICB9IGVsc2UgaWYgKHBsdWdpbkFjdGl2ZSAmJiAhc2V0dGluZ0FjdGl2ZSkge1xuICAgICAgICB0aGlzLmRlYWN0aXZhdGVQbHVnaW4obmFtZSwgcGx1Z2luKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXBsdWdpbkFjdGl2ZSkge1xuICAgICAgICB0aGlzLmFjdGl2YXRlUGx1Z2luKG5hbWUsIHBsdWdpbilcbiAgICAgIH0gZWxzZSBpZiAocGx1Z2luQWN0aXZlKSB7XG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZVBsdWdpbihuYW1lLCBwbHVnaW4pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWN0aXZhdGVQbHVnaW4gKG5hbWUsIHBsdWdpbikge1xuICAgIGNvbnN0IGV2ZW50ID0geyBuYW1lOiBuYW1lLCBwbHVnaW46IHBsdWdpbiB9XG5cbiAgICBwbHVnaW4uYWN0aXZhdGVQbHVnaW4oKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtYWN0aXZhdGUtcGx1Z2luJywgZXZlbnQpXG4gIH1cblxuICBkZWFjdGl2YXRlUGx1Z2luIChuYW1lLCBwbHVnaW4pIHtcbiAgICBjb25zdCBldmVudCA9IHsgbmFtZTogbmFtZSwgcGx1Z2luOiBwbHVnaW4gfVxuXG4gICAgcGx1Z2luLmRlYWN0aXZhdGVQbHVnaW4oKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGVhY3RpdmF0ZS1wbHVnaW4nLCBldmVudClcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIHRoZSBgbWluaW1hcC5kaXNwbGF5UGx1Z2luc0NvbnRyb2xzYCBzZXR0aW5nIGlzIHRvZ2dsZWQsXG4gICAqIHRoaXMgZnVuY3Rpb24gd2lsbCByZWdpc3RlciB0aGUgY29tbWFuZHMgYW5kIHNldHRpbmcgdG8gbWFuYWdlIHRoZSBwbHVnaW5cbiAgICogYWN0aXZhdGlvbiBmcm9tIHRoZSBtaW5pbWFwIHNldHRpbmdzLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgaWRlbnRpZnlpbmcgbmFtZSBvZiB0aGUgcGx1Z2luLlxuICAgKiBAcGFyYW0ge01pbmltYXBQbHVnaW59IHBsdWdpbiBUaGUgcGx1Z2luIGluc3RhbmNlIHRvIHJlZ2lzdGVyXG4gICAqICAgICAgICBjb250cm9scyBmb3IuXG4gICAqIEBsaXN0ZW5zIHttaW5pbWFwLnBsdWdpbnMuJHtuYW1lfX0gbGlzdGVuIHRvIHRoZSBzZXR0aW5nIHRvIHVwZGF0ZVxuICAgKiAgICAgICAgICB0aGUgcGx1Z2luIHN0YXRlIGFjY29yZGluZ2x5LlxuICAgKiBAbGlzdGVucyB7bWluaW1hcDp0b2dnbGUtJHtuYW1lfX0gbGlzdGVuIHRvIHRoZSBjb21tYW5kIG9uIGBhdG9tLXdvcmtzcGFjZWBcbiAgICogICAgICAgICAgdG8gdG9nZ2xlIHRoZSBwbHVnaW4gc3RhdGUuXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgcmVnaXN0ZXJQbHVnaW5Db250cm9scyAobmFtZSwgcGx1Z2luKSB7XG4gICAgY29uc3Qgc2V0dGluZ3NLZXkgPSBgbWluaW1hcC5wbHVnaW5zLiR7bmFtZX1gXG4gICAgY29uc3Qgb3JkZXJTZXR0aW5nc0tleSA9IGBtaW5pbWFwLnBsdWdpbnMuJHtuYW1lfURlY29yYXRpb25zWkluZGV4YFxuXG4gICAgdGhpcy5jb25maWcucGx1Z2lucy5wcm9wZXJ0aWVzW25hbWVdID0ge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgdGl0bGU6IG5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogYFdoZXRoZXIgdGhlICR7bmFtZX0gcGx1Z2luIGlzIGFjdGl2YXRlZCBhbmQgZGlzcGxheWVkIGluIHRoZSBNaW5pbWFwLmAsXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfVxuXG4gICAgdGhpcy5jb25maWcucGx1Z2lucy5wcm9wZXJ0aWVzW2Ake25hbWV9RGVjb3JhdGlvbnNaSW5kZXhgXSA9IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIHRpdGxlOiBgJHtuYW1lfSBkZWNvcmF0aW9ucyBvcmRlcmAsXG4gICAgICBkZXNjcmlwdGlvbjogYFRoZSByZWxhdGl2ZSBvcmRlciBvZiB0aGUgJHtuYW1lfSBwbHVnaW4ncyBkZWNvcmF0aW9ucyBpbiB0aGUgbGF5ZXIgaW50byB3aGljaCB0aGV5IGFyZSBkcmF3bi4gTm90ZSB0aGF0IHRoaXMgb3JkZXIgb25seSBhcHBseSBpbnNpZGUgYSBsYXllciwgc28gaGlnaGxpZ2h0LW92ZXIgZGVjb3JhdGlvbnMgd2lsbCBhbHdheXMgYmUgZGlzcGxheWVkIGFib3ZlIGxpbmUgZGVjb3JhdGlvbnMgYXMgdGhleSBhcmUgcmVuZGVyZWQgaW4gZGlmZmVyZW50IGxheWVycy5gLFxuICAgICAgZGVmYXVsdDogMFxuICAgIH1cblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoc2V0dGluZ3NLZXkpID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGF0b20uY29uZmlnLnNldChzZXR0aW5nc0tleSwgdHJ1ZSlcbiAgICB9XG5cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KG9yZGVyU2V0dGluZ3NLZXkpID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGF0b20uY29uZmlnLnNldChvcmRlclNldHRpbmdzS2V5LCAwKVxuICAgIH1cblxuICAgIHRoaXMucGx1Z2luc1N1YnNjcmlwdGlvbnNbbmFtZV0uYWRkKGF0b20uY29uZmlnLm9ic2VydmUoc2V0dGluZ3NLZXksICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlc1BsdWdpbkFjdGl2YXRpb25TdGF0ZShuYW1lKVxuICAgIH0pKVxuXG4gICAgdGhpcy5wbHVnaW5zU3Vic2NyaXB0aW9uc1tuYW1lXS5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZShvcmRlclNldHRpbmdzS2V5LCAob3JkZXIpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlUGx1Z2luc09yZGVyTWFwKG5hbWUpXG4gICAgICBjb25zdCBldmVudCA9IHsgbmFtZTogbmFtZSwgcGx1Z2luOiBwbHVnaW4sIG9yZGVyOiBvcmRlciB9XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1wbHVnaW4tb3JkZXInLCBldmVudClcbiAgICB9KSlcblxuICAgIHRoaXMucGx1Z2luc1N1YnNjcmlwdGlvbnNbbmFtZV0uYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgIFtgbWluaW1hcDp0b2dnbGUtJHtuYW1lfWBdOiAoKSA9PiB7XG4gICAgICAgIHRoaXMudG9nZ2xlUGx1Z2luQWN0aXZhdGlvbihuYW1lKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgdGhpcy51cGRhdGVQbHVnaW5zT3JkZXJNYXAobmFtZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBkaXNwbGF5IG9yZGVyIGluIHRoZSBtYXAgZm9yIHRoZSBwYXNzZWQtaW4gcGx1Z2luIG5hbWUuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gbmFtZSB0aGUgbmFtZSBvZiB0aGUgcGx1Z2luIHRvIHVwZGF0ZVxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIHVwZGF0ZVBsdWdpbnNPcmRlck1hcCAobmFtZSkge1xuICAgIGNvbnN0IG9yZGVyU2V0dGluZ3NLZXkgPSBgbWluaW1hcC5wbHVnaW5zLiR7bmFtZX1EZWNvcmF0aW9uc1pJbmRleGBcblxuICAgIHRoaXMucGx1Z2luc09yZGVyTWFwW25hbWVdID0gYXRvbS5jb25maWcuZ2V0KG9yZGVyU2V0dGluZ3NLZXkpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcGx1Z2lucyBkaXNwbGF5IG9yZGVyIG1hcHBlZCBieSBuYW1lLlxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBwbHVnaW5zIG9yZGVyIGJ5IG5hbWVcbiAgICovXG4gIGdldFBsdWdpbnNPcmRlciAoKSB7IHJldHVybiB0aGlzLnBsdWdpbnNPcmRlck1hcCB9XG5cbiAgLyoqXG4gICAqIFdoZW4gdGhlIGBtaW5pbWFwLmRpc3BsYXlQbHVnaW5zQ29udHJvbHNgIHNldHRpbmcgaXMgdG9nZ2xlZCxcbiAgICogdGhpcyBmdW5jdGlvbiB3aWxsIHVucmVnaXN0ZXIgdGhlIGNvbW1hbmRzIGFuZCBzZXR0aW5nIHRoYXRcbiAgICogd2FzIGNyZWF0ZWQgcHJldmlvdXNseS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIGlkZW50aWZ5aW5nIG5hbWUgb2YgdGhlIHBsdWdpbi5cbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICB1bnJlZ2lzdGVyUGx1Z2luQ29udHJvbHMgKG5hbWUpIHtcbiAgICB0aGlzLnBsdWdpbnNTdWJzY3JpcHRpb25zW25hbWVdLmRpc3Bvc2UoKVxuICAgIGRlbGV0ZSB0aGlzLnBsdWdpbnNTdWJzY3JpcHRpb25zW25hbWVdXG4gICAgZGVsZXRlIHRoaXMuY29uZmlnLnBsdWdpbnMucHJvcGVydGllc1tuYW1lXVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/ajenkins/.atom/packages/minimap/lib/mixins/plugin-management.js

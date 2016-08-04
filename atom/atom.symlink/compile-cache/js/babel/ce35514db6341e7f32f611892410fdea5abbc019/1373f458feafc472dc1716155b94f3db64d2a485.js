Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _atomUtils = require('atom-utils');

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var _decoratorsElement = require('./decorators/element');

var _decoratorsElement2 = _interopRequireDefault(_decoratorsElement);

var _decoratorsInclude = require('./decorators/include');

var _decoratorsInclude2 = _interopRequireDefault(_decoratorsInclude);

/**
 * @access private
 */
'use babel';

var MinimapQuickSettingsElement = (function () {
  function MinimapQuickSettingsElement() {
    _classCallCheck(this, _MinimapQuickSettingsElement);
  }

  _createClass(MinimapQuickSettingsElement, [{
    key: 'createdCallback',
    value: function createdCallback() {
      this.buildContent();
    }
  }, {
    key: 'setModel',
    value: function setModel(minimap) {
      var _this = this;

      this.selectedItem = null;
      this.minimap = minimap;
      this.emitter = new _atom.Emitter();
      this.subscriptions = new _atom.CompositeDisposable();
      this.plugins = {};
      this.itemsActions = new WeakMap();

      var subs = this.subscriptions;

      subs.add(_main2['default'].onDidAddPlugin(function (_ref) {
        var name = _ref.name;
        var plugin = _ref.plugin;

        return _this.addItemFor(name, plugin);
      }));
      subs.add(_main2['default'].onDidRemovePlugin(function (_ref2) {
        var name = _ref2.name;
        var plugin = _ref2.plugin;

        return _this.removeItemFor(name, plugin);
      }));
      subs.add(_main2['default'].onDidActivatePlugin(function (_ref3) {
        var name = _ref3.name;
        var plugin = _ref3.plugin;

        return _this.activateItem(name, plugin);
      }));
      subs.add(_main2['default'].onDidDeactivatePlugin(function (_ref4) {
        var name = _ref4.name;
        var plugin = _ref4.plugin;

        return _this.deactivateItem(name, plugin);
      }));

      subs.add(atom.commands.add('minimap-quick-settings', {
        'core:move-up': function coreMoveUp() {
          _this.selectPreviousItem();
        },
        'core:move-down': function coreMoveDown() {
          _this.selectNextItem();
        },
        'core:move-left': function coreMoveLeft() {
          atom.config.set('minimap.displayMinimapOnLeft', true);
        },
        'core:move-right': function coreMoveRight() {
          atom.config.set('minimap.displayMinimapOnLeft', false);
        },
        'core:cancel': function coreCancel() {
          _this.destroy();
        },
        'core:confirm': function coreConfirm() {
          _this.toggleSelectedItem();
        }
      }));

      this.codeHighlights.classList.toggle('active', this.minimap.displayCodeHighlights);

      subs.add(this.subscribeTo(this.codeHighlights, {
        'mousedown': function mousedown(e) {
          e.preventDefault();
          atom.config.set('minimap.displayCodeHighlights', !_this.minimap.displayCodeHighlights);
        }
      }));

      this.itemsActions.set(this.codeHighlights, function () {
        atom.config.set('minimap.displayCodeHighlights', !_this.minimap.displayCodeHighlights);
      });

      subs.add(this.subscribeTo(this.absoluteMode, {
        'mousedown': function mousedown(e) {
          e.preventDefault();
          atom.config.set('minimap.absoluteMode', !atom.config.get('minimap.absoluteMode'));
        }
      }));

      this.itemsActions.set(this.absoluteMode, function () {
        atom.config.set('minimap.absoluteMode', !atom.config.get('minimap.absoluteMode'));
      });

      subs.add(this.subscribeTo(this.adjustAbsoluteModeHeight, {
        'mousedown': function mousedown(e) {
          e.preventDefault();
          atom.config.set('minimap.adjustAbsoluteModeHeight', !atom.config.get('minimap.adjustAbsoluteModeHeight'));
        }
      }));

      this.itemsActions.set(this.adjustAbsoluteModeHeight, function () {
        atom.config.set('minimap.adjustAbsoluteModeHeight', !atom.config.get('minimap.adjustAbsoluteModeHeight'));
      });

      subs.add(this.subscribeTo(this.hiddenInput, {
        'focusout': function focusout(e) {
          _this.destroy();
        }
      }));

      subs.add(this.subscribeTo(this.onLeftButton, {
        'mousedown': function mousedown(e) {
          e.preventDefault();
          atom.config.set('minimap.displayMinimapOnLeft', true);
        }
      }));

      subs.add(this.subscribeTo(this.onRightButton, {
        'mousedown': function mousedown(e) {
          e.preventDefault();
          atom.config.set('minimap.displayMinimapOnLeft', false);
        }
      }));

      subs.add(atom.config.observe('minimap.displayCodeHighlights', function (bool) {
        _this.codeHighlights.classList.toggle('active', bool);
      }));

      subs.add(atom.config.observe('minimap.absoluteMode', function (bool) {
        _this.absoluteMode.classList.toggle('active', bool);
      }));

      subs.add(atom.config.observe('minimap.adjustAbsoluteModeHeight', function (bool) {
        _this.adjustAbsoluteModeHeight.classList.toggle('active', bool);
      }));

      subs.add(atom.config.observe('minimap.displayMinimapOnLeft', function (bool) {
        _this.onLeftButton.classList.toggle('selected', bool);
        _this.onRightButton.classList.toggle('selected', !bool);
      }));

      this.initList();
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'attach',
    value: function attach() {
      var workspaceElement = atom.views.getView(atom.workspace);
      workspaceElement.appendChild(this);
      this.hiddenInput.focus();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
      this.parentNode.removeChild(this);
    }
  }, {
    key: 'initList',
    value: function initList() {
      this.itemsDisposables = new WeakMap();
      for (var _name in _main2['default'].plugins) {
        this.addItemFor(_name, _main2['default'].plugins[_name]);
      }
    }
  }, {
    key: 'toggleSelectedItem',
    value: function toggleSelectedItem() {
      var fn = this.itemsActions.get(this.selectedItem);
      if (typeof fn === 'function') {
        fn();
      }
    }
  }, {
    key: 'selectNextItem',
    value: function selectNextItem() {
      this.selectedItem.classList.remove('selected');
      if (this.selectedItem.nextSibling != null) {
        this.selectedItem = this.selectedItem.nextSibling;
        if (this.selectedItem.matches('.separator')) {
          this.selectedItem = this.selectedItem.nextSibling;
        }
      } else {
        this.selectedItem = this.list.firstChild;
      }
      this.selectedItem.classList.add('selected');
    }
  }, {
    key: 'selectPreviousItem',
    value: function selectPreviousItem() {
      this.selectedItem.classList.remove('selected');
      if (this.selectedItem.previousSibling != null) {
        this.selectedItem = this.selectedItem.previousSibling;
        if (this.selectedItem.matches('.separator')) {
          this.selectedItem = this.selectedItem.previousSibling;
        }
      } else {
        this.selectedItem = this.list.lastChild;
      }
      this.selectedItem.classList.add('selected');
    }
  }, {
    key: 'addItemFor',
    value: function addItemFor(name, plugin) {
      var item = document.createElement('li');
      var action = function action() {
        _main2['default'].togglePluginActivation(name);
      };

      if (plugin.isActive()) {
        item.classList.add('active');
      }

      item.textContent = name;

      this.itemsActions.set(item, action);
      this.itemsDisposables.set(item, this.addDisposableEventListener(item, 'mousedown', function (e) {
        e.preventDefault();
        action();
      }));

      this.plugins[name] = item;
      this.list.insertBefore(item, this.separator);

      if (!(this.selectedItem != null)) {
        this.selectedItem = item;
        this.selectedItem.classList.add('selected');
      }
    }
  }, {
    key: 'removeItemFor',
    value: function removeItemFor(name, plugin) {
      try {
        this.list.removeChild(this.plugins[name]);
      } catch (error) {}

      delete this.plugins[name];
    }
  }, {
    key: 'activateItem',
    value: function activateItem(name, plugin) {
      this.plugins[name].classList.add('active');
    }
  }, {
    key: 'deactivateItem',
    value: function deactivateItem(name, plugin) {
      this.plugins[name].classList.remove('active');
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this2 = this;

      this.div({ 'class': 'select-list popover-list minimap-quick-settings' }, function () {
        _this2.input({ type: 'text', 'class': 'hidden-input', outlet: 'hiddenInput' });
        _this2.ol({ 'class': 'list-group mark-active', outlet: 'list' }, function () {
          _this2.li({ 'class': 'separator', outlet: 'separator' });
          _this2.li({ 'class': 'code-highlights', outlet: 'codeHighlights' }, 'code-highlights');
          _this2.li({ 'class': 'absolute-mode', outlet: 'absoluteMode' }, 'absolute-mode');
          _this2.li({ 'class': 'adjust-absolute-mode-height', outlet: 'adjustAbsoluteModeHeight' }, 'adjust-absolute-mode-height');
        });
        _this2.div({ 'class': 'btn-group' }, function () {
          _this2.button({ 'class': 'btn btn-default', outlet: 'onLeftButton' }, 'On Left');
          _this2.button({ 'class': 'btn btn-default', outlet: 'onRightButton' }, 'On Right');
        });
      });
    }
  }]);

  var _MinimapQuickSettingsElement = MinimapQuickSettingsElement;
  MinimapQuickSettingsElement = (0, _decoratorsInclude2['default'])(_atomUtils.EventsDelegation, _atomUtils.SpacePenDSL.Babel)(MinimapQuickSettingsElement) || MinimapQuickSettingsElement;
  MinimapQuickSettingsElement = (0, _decoratorsElement2['default'])('minimap-quick-settings')(MinimapQuickSettingsElement) || MinimapQuickSettingsElement;
  return MinimapQuickSettingsElement;
})();

exports['default'] = MinimapQuickSettingsElement;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taW5pbWFwLXF1aWNrLXNldHRpbmdzLWVsZW1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFMkMsTUFBTTs7eUJBQ0wsWUFBWTs7b0JBRXZDLFFBQVE7Ozs7aUNBQ0wsc0JBQXNCOzs7O2lDQUN0QixzQkFBc0I7Ozs7Ozs7QUFQMUMsV0FBVyxDQUFBOztJQWNVLDJCQUEyQjtXQUEzQiwyQkFBMkI7Ozs7ZUFBM0IsMkJBQTJCOztXQWtCOUIsMkJBQUc7QUFDakIsVUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO0tBQ3BCOzs7V0FFUSxrQkFBQyxPQUFPLEVBQUU7OztBQUNqQixVQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQTtBQUN4QixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtBQUN0QixVQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsVUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxVQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQTtBQUNqQixVQUFJLENBQUMsWUFBWSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUE7O0FBRWpDLFVBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUE7O0FBRTdCLFVBQUksQ0FBQyxHQUFHLENBQUMsa0JBQUssY0FBYyxDQUFDLFVBQUMsSUFBYyxFQUFLO1lBQWxCLElBQUksR0FBTCxJQUFjLENBQWIsSUFBSTtZQUFFLE1BQU0sR0FBYixJQUFjLENBQVAsTUFBTTs7QUFDekMsZUFBTyxNQUFLLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUE7T0FDckMsQ0FBQyxDQUFDLENBQUE7QUFDSCxVQUFJLENBQUMsR0FBRyxDQUFDLGtCQUFLLGlCQUFpQixDQUFDLFVBQUMsS0FBYyxFQUFLO1lBQWxCLElBQUksR0FBTCxLQUFjLENBQWIsSUFBSTtZ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QixFQUFDLEVBQUUsNkJBQTZCLENBQUMsQ0FBQTtTQUNuSCxDQUFDLENBQUE7QUFDRixlQUFLLEdBQUcsQ0FBQyxFQUFDLFNBQU8sV0FBVyxFQUFDLEVBQUUsWUFBTTtBQUNuQyxpQkFBSyxNQUFNLENBQUMsRUFBQyxTQUFPLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQTtBQUMxRSxpQkFBSyxNQUFNLENBQUMsRUFBQyxTQUFPLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQTtTQUM3RSxDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7S0FDSDs7O3FDQWhCa0IsMkJBQTJCO0FBQTNCLDZCQUEyQixHQUQvQyxpRUFBMEIsdUJBQVksS0FBSyxDQUFDLENBQ3hCLDJCQUEyQixLQUEzQiwyQkFBMkI7QUFBM0IsNkJBQTJCLEdBRi9DLG9DQUFRLHdCQUF3QixDQUFDLENBRWIsMkJBQTJCLEtBQTNCLDJCQUEyQjtTQUEzQiwyQkFBMkI7OztxQkFBM0IsMkJBQTJCIiwiZmlsZSI6Ii9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taW5pbWFwLXF1aWNrLXNldHRpbmdzLWVsZW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXJ9IGZyb20gJ2F0b20nXG5pbXBvcnQge0V2ZW50c0RlbGVnYXRpb24sIFNwYWNlUGVuRFNMfSBmcm9tICdhdG9tLXV0aWxzJ1xuXG5pbXBvcnQgTWFpbiBmcm9tICcuL21haW4nXG5pbXBvcnQgZWxlbWVudCBmcm9tICcuL2RlY29yYXRvcnMvZWxlbWVudCdcbmltcG9ydCBpbmNsdWRlIGZyb20gJy4vZGVjb3JhdG9ycy9pbmNsdWRlJ1xuXG4vKipcbiAqIEBhY2Nlc3MgcHJpdmF0ZVxuICovXG5AZWxlbWVudCgnbWluaW1hcC1xdWljay1zZXR0aW5ncycpXG5AaW5jbHVkZShFdmVudHNEZWxlZ2F0aW9uLCBTcGFjZVBlbkRTTC5CYWJlbClcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pbmltYXBRdWlja1NldHRpbmdzRWxlbWVudCB7XG5cbiAgc3RhdGljIGNvbnRlbnQgKCkge1xuICAgIHRoaXMuZGl2KHtjbGFzczogJ3NlbGVjdC1saXN0IHBvcG92ZXItbGlzdCBtaW5pbWFwLXF1aWNrLXNldHRpbmdzJ30sICgpID0+IHtcbiAgICAgIHRoaXMuaW5wdXQoe3R5cGU6ICd0ZXh0JywgY2xhc3M6ICdoaWRkZW4taW5wdXQnLCBvdXRsZXQ6ICdoaWRkZW5JbnB1dCd9KVxuICAgICAgdGhpcy5vbCh7Y2xhc3M6ICdsaXN0LWdyb3VwIG1hcmstYWN0aXZlJywgb3V0bGV0OiAnbGlzdCd9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMubGkoe2NsYXNzOiAnc2VwYXJhdG9yJywgb3V0bGV0OiAnc2VwYXJhdG9yJ30pXG4gICAgICAgIHRoaXMubGkoe2NsYXNzOiAnY29kZS1oaWdobGlnaHRzJywgb3V0bGV0OiAnY29kZUhpZ2hsaWdodHMnfSwgJ2NvZGUtaGlnaGxpZ2h0cycpXG4gICAgICAgIHRoaXMubGkoe2NsYXNzOiAnYWJzb2x1dGUtbW9kZScsIG91dGxldDogJ2Fic29sdXRlTW9kZSd9LCAnYWJzb2x1dGUtbW9kZScpXG4gICAgICAgIHRoaXMubGkoe2NsYXNzOiAnYWRqdXN0LWFic29sdXRlLW1vZGUtaGVpZ2h0Jywgb3V0bGV0OiAnYWRqdXN0QWJzb2x1dGVNb2RlSGVpZ2h0J30sICdhZGp1c3QtYWJzb2x1dGUtbW9kZS1oZWlnaHQnKVxuICAgICAgfSlcbiAgICAgIHRoaXMuZGl2KHtjbGFzczogJ2J0bi1ncm91cCd9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuYnV0dG9uKHtjbGFzczogJ2J0biBidG4tZGVmYXVsdCcsIG91dGxldDogJ29uTGVmdEJ1dHRvbid9LCAnT24gTGVmdCcpXG4gICAgICAgIHRoaXMuYnV0dG9uKHtjbGFzczogJ2J0biBidG4tZGVmYXVsdCcsIG91dGxldDogJ29uUmlnaHRCdXR0b24nfSwgJ09uIFJpZ2h0JylcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGNyZWF0ZWRDYWxsYmFjayAoKSB7XG4gICAgdGhpcy5idWlsZENvbnRlbnQoKVxuICB9XG5cbiAgc2V0TW9kZWwgKG1pbmltYXApIHtcbiAgICB0aGlzLnNlbGVjdGVkSXRlbSA9IG51bGxcbiAgICB0aGlzLm1pbmltYXAgPSBtaW5pbWFwXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnBsdWdpbnMgPSB7fVxuICAgIHRoaXMuaXRlbXNBY3Rpb25zID0gbmV3IFdlYWtNYXAoKVxuXG4gICAgbGV0IHN1YnMgPSB0aGlzLnN1YnNjcmlwdGlvbnNcblxuICAgIHN1YnMuYWRkKE1haW4ub25EaWRBZGRQbHVnaW4oKHtuYW1lLCBwbHVnaW59KSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRJdGVtRm9yKG5hbWUsIHBsdWdpbilcbiAgICB9KSlcbiAgICBzdWJzLmFkZChNYWluLm9uRGlkUmVtb3ZlUGx1Z2luKCh7bmFtZSwgcGx1Z2lufSkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlSXRlbUZvcihuYW1lLCBwbHVnaW4pXG4gICAgfSkpXG4gICAgc3Vicy5hZGQoTWFpbi5vbkRpZEFjdGl2YXRlUGx1Z2luKCh7bmFtZSwgcGx1Z2lufSkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYWN0aXZhdGVJdGVtKG5hbWUsIHBsdWdpbilcbiAgICB9KSlcbiAgICBzdWJzLmFkZChNYWluLm9uRGlkRGVhY3RpdmF0ZVBsdWdpbigoe25hbWUsIHBsdWdpbn0pID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmRlYWN0aXZhdGVJdGVtKG5hbWUsIHBsdWdpbilcbiAgICB9KSlcblxuICAgIHN1YnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdtaW5pbWFwLXF1aWNrLXNldHRpbmdzJywge1xuICAgICAgJ2NvcmU6bW92ZS11cCc6ICgpID0+IHtcbiAgICAgICAgdGhpcy5zZWxlY3RQcmV2aW91c0l0ZW0oKVxuICAgICAgfSxcbiAgICAgICdjb3JlOm1vdmUtZG93bic6ICgpID0+IHtcbiAgICAgICAgdGhpcy5zZWxlY3ROZXh0SXRlbSgpXG4gICAgICB9LFxuICAgICAgJ2NvcmU6bW92ZS1sZWZ0JzogKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuZGlzcGxheU1pbmltYXBPbkxlZnQnLCB0cnVlKVxuICAgICAgfSxcbiAgICAgICdjb3JlOm1vdmUtcmlnaHQnOiAoKSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5kaXNwbGF5TWluaW1hcE9uTGVmdCcsIGZhbHNlKVxuICAgICAgfSxcbiAgICAgICdjb3JlOmNhbmNlbCc6ICgpID0+IHtcbiAgICAgICAgdGhpcy5kZXN0cm95KClcbiAgICAgIH0sXG4gICAgICAnY29yZTpjb25maXJtJzogKCkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZVNlbGVjdGVkSXRlbSgpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICB0aGlzLmNvZGVIaWdobGlnaHRzLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScsIHRoaXMubWluaW1hcC5kaXNwbGF5Q29kZUhpZ2hsaWdodHMpXG5cbiAgICBzdWJzLmFkZCh0aGlzLnN1YnNjcmliZVRvKHRoaXMuY29kZUhpZ2hsaWdodHMsIHtcbiAgICAgICdtb3VzZWRvd24nOiAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmRpc3BsYXlDb2RlSGlnaGxpZ2h0cycsICF0aGlzLm1pbmltYXAuZGlzcGxheUNvZGVIaWdobGlnaHRzKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgdGhpcy5pdGVtc0FjdGlvbnMuc2V0KHRoaXMuY29kZUhpZ2hsaWdodHMsICgpID0+IHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5kaXNwbGF5Q29kZUhpZ2hsaWdodHMnLCAhdGhpcy5taW5pbWFwLmRpc3BsYXlDb2RlSGlnaGxpZ2h0cylcbiAgICB9KVxuXG4gICAgc3Vicy5hZGQodGhpcy5zdWJzY3JpYmVUbyh0aGlzLmFic29sdXRlTW9kZSwge1xuICAgICAgJ21vdXNlZG93bic6IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuYWJzb2x1dGVNb2RlJywgIWF0b20uY29uZmlnLmdldCgnbWluaW1hcC5hYnNvbHV0ZU1vZGUnKSlcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIHRoaXMuaXRlbXNBY3Rpb25zLnNldCh0aGlzLmFic29sdXRlTW9kZSwgKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmFic29sdXRlTW9kZScsICFhdG9tLmNvbmZpZy5nZXQoJ21pbmltYXAuYWJzb2x1dGVNb2RlJykpXG4gICAgfSlcblxuICAgIHN1YnMuYWRkKHRoaXMuc3Vic2NyaWJlVG8odGhpcy5hZGp1c3RBYnNvbHV0ZU1vZGVIZWlnaHQsIHtcbiAgICAgICdtb3VzZWRvd24nOiAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmFkanVzdEFic29sdXRlTW9kZUhlaWdodCcsICFhdG9tLmNvbmZpZy5nZXQoJ21pbmltYXAuYWRqdXN0QWJzb2x1dGVNb2RlSGVpZ2h0JykpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICB0aGlzLml0ZW1zQWN0aW9ucy5zZXQodGhpcy5hZGp1c3RBYnNvbHV0ZU1vZGVIZWlnaHQsICgpID0+IHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5hZGp1c3RBYnNvbHV0ZU1vZGVIZWlnaHQnLCAhYXRvbS5jb25maWcuZ2V0KCdtaW5pbWFwLmFkanVzdEFic29sdXRlTW9kZUhlaWdodCcpKVxuICAgIH0pXG5cbiAgICBzdWJzLmFkZCh0aGlzLnN1YnNjcmliZVRvKHRoaXMuaGlkZGVuSW5wdXQsIHtcbiAgICAgICdmb2N1c291dCc6IChlKSA9PiB7IHRoaXMuZGVzdHJveSgpIH1cbiAgICB9KSlcblxuICAgIHN1YnMuYWRkKHRoaXMuc3Vic2NyaWJlVG8odGhpcy5vbkxlZnRCdXR0b24sIHtcbiAgICAgICdtb3VzZWRvd24nOiAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmRpc3BsYXlNaW5pbWFwT25MZWZ0JywgdHJ1ZSlcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIHN1YnMuYWRkKHRoaXMuc3Vic2NyaWJlVG8odGhpcy5vblJpZ2h0QnV0dG9uLCB7XG4gICAgICAnbW91c2Vkb3duJzogKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5kaXNwbGF5TWluaW1hcE9uTGVmdCcsIGZhbHNlKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbWluaW1hcC5kaXNwbGF5Q29kZUhpZ2hsaWdodHMnLCAoYm9vbCkgPT4ge1xuICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0cy5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnLCBib29sKVxuICAgIH0pKVxuXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbWluaW1hcC5hYnNvbHV0ZU1vZGUnLCAoYm9vbCkgPT4ge1xuICAgICAgdGhpcy5hYnNvbHV0ZU1vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJywgYm9vbClcbiAgICB9KSlcblxuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ21pbmltYXAuYWRqdXN0QWJzb2x1dGVNb2RlSGVpZ2h0JywgKGJvb2wpID0+IHtcbiAgICAgIHRoaXMuYWRqdXN0QWJzb2x1dGVNb2RlSGVpZ2h0LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScsIGJvb2wpXG4gICAgfSkpXG5cbiAgICBzdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdtaW5pbWFwLmRpc3BsYXlNaW5pbWFwT25MZWZ0JywgKGJvb2wpID0+IHtcbiAgICAgIHRoaXMub25MZWZ0QnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoJ3NlbGVjdGVkJywgYm9vbClcbiAgICAgIHRoaXMub25SaWdodEJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKCdzZWxlY3RlZCcsICFib29sKVxuICAgIH0pKVxuXG4gICAgdGhpcy5pbml0TGlzdCgpXG4gIH1cblxuICBvbkRpZERlc3Ryb3kgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRlc3Ryb3knLCBjYWxsYmFjaylcbiAgfVxuXG4gIGF0dGFjaCAoKSB7XG4gICAgbGV0IHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgd29ya3NwYWNlRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzKVxuICAgIHRoaXMuaGlkZGVuSW5wdXQuZm9jdXMoKVxuICB9XG5cbiAgZGVzdHJveSAoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95JylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMpXG4gIH1cblxuICBpbml0TGlzdCAoKSB7XG4gICAgdGhpcy5pdGVtc0Rpc3Bvc2FibGVzID0gbmV3IFdlYWtNYXAoKVxuICAgIGZvciAobGV0IG5hbWUgaW4gTWFpbi5wbHVnaW5zKSB7XG4gICAgICB0aGlzLmFkZEl0ZW1Gb3IobmFtZSwgTWFpbi5wbHVnaW5zW25hbWVdKVxuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZVNlbGVjdGVkSXRlbSAoKSB7XG4gICAgbGV0IGZuID0gdGhpcy5pdGVtc0FjdGlvbnMuZ2V0KHRoaXMuc2VsZWN0ZWRJdGVtKVxuICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHsgZm4oKSB9XG4gIH1cblxuICBzZWxlY3ROZXh0SXRlbSAoKSB7XG4gICAgdGhpcy5zZWxlY3RlZEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxuICAgIGlmICgodGhpcy5zZWxlY3RlZEl0ZW0ubmV4dFNpYmxpbmcgIT0gbnVsbCkpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtID0gdGhpcy5zZWxlY3RlZEl0ZW0ubmV4dFNpYmxpbmdcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkSXRlbS5tYXRjaGVzKCcuc2VwYXJhdG9yJykpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW0gPSB0aGlzLnNlbGVjdGVkSXRlbS5uZXh0U2libGluZ1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGVkSXRlbSA9IHRoaXMubGlzdC5maXJzdENoaWxkXG4gICAgfVxuICAgIHRoaXMuc2VsZWN0ZWRJdGVtLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcbiAgfVxuXG4gIHNlbGVjdFByZXZpb3VzSXRlbSAoKSB7XG4gICAgdGhpcy5zZWxlY3RlZEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxuICAgIGlmICgodGhpcy5zZWxlY3RlZEl0ZW0ucHJldmlvdXNTaWJsaW5nICE9IG51bGwpKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkSXRlbSA9IHRoaXMuc2VsZWN0ZWRJdGVtLnByZXZpb3VzU2libGluZ1xuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJdGVtLm1hdGNoZXMoJy5zZXBhcmF0b3InKSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbSA9IHRoaXMuc2VsZWN0ZWRJdGVtLnByZXZpb3VzU2libGluZ1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGVkSXRlbSA9IHRoaXMubGlzdC5sYXN0Q2hpbGRcbiAgICB9XG4gICAgdGhpcy5zZWxlY3RlZEl0ZW0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICB9XG5cbiAgYWRkSXRlbUZvciAobmFtZSwgcGx1Z2luKSB7XG4gICAgbGV0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpXG4gICAgbGV0IGFjdGlvbiA9ICgpID0+IHsgTWFpbi50b2dnbGVQbHVnaW5BY3RpdmF0aW9uKG5hbWUpIH1cblxuICAgIGlmIChwbHVnaW4uaXNBY3RpdmUoKSkgeyBpdGVtLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpIH1cblxuICAgIGl0ZW0udGV4dENvbnRlbnQgPSBuYW1lXG5cbiAgICB0aGlzLml0ZW1zQWN0aW9ucy5zZXQoaXRlbSwgYWN0aW9uKVxuICAgIHRoaXMuaXRlbXNEaXNwb3NhYmxlcy5zZXQoaXRlbSwgdGhpcy5hZGREaXNwb3NhYmxlRXZlbnRMaXN0ZW5lcihpdGVtLCAnbW91c2Vkb3duJywgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgYWN0aW9uKClcbiAgICB9KSlcblxuICAgIHRoaXMucGx1Z2luc1tuYW1lXSA9IGl0ZW1cbiAgICB0aGlzLmxpc3QuaW5zZXJ0QmVmb3JlKGl0ZW0sIHRoaXMuc2VwYXJhdG9yKVxuXG4gICAgaWYgKCEodGhpcy5zZWxlY3RlZEl0ZW0gIT0gbnVsbCkpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtID0gaXRlbVxuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUl0ZW1Gb3IgKG5hbWUsIHBsdWdpbikge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmxpc3QucmVtb3ZlQ2hpbGQodGhpcy5wbHVnaW5zW25hbWVdKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxuXG4gICAgZGVsZXRlIHRoaXMucGx1Z2luc1tuYW1lXVxuICB9XG5cbiAgYWN0aXZhdGVJdGVtIChuYW1lLCBwbHVnaW4pIHtcbiAgICB0aGlzLnBsdWdpbnNbbmFtZV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgfVxuXG4gIGRlYWN0aXZhdGVJdGVtIChuYW1lLCBwbHVnaW4pIHtcbiAgICB0aGlzLnBsdWdpbnNbbmFtZV0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgfVxufVxuIl19
//# sourceURL=/Users/ajenkins/.atom/packages/minimap/lib/minimap-quick-settings-element.js

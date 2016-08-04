(function() {
  var CliStatusView, CompositeDisposable, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('atom-space-pen-views').View;

  module.exports = CliStatusView = (function(_super) {
    __extends(CliStatusView, _super);

    function CliStatusView() {
      return CliStatusView.__super__.constructor.apply(this, arguments);
    }

    CliStatusView.content = function() {
      return this.div({
        "class": 'cli-status inline-block'
      }, (function(_this) {
        return function() {
          return _this.span({
            outlet: 'termStatusContainer'
          }, function() {
            return _this.span({
              click: 'newTermClick',
              outlet: 'termStatusAdd',
              "class": "cli-status icon icon-plus"
            });
          });
        };
      })(this));
    };

    CliStatusView.prototype.commandViews = [];

    CliStatusView.prototype.activeIndex = 0;

    CliStatusView.prototype.toolTipDisposable = null;

    CliStatusView.prototype.initialize = function(serializeState) {
      var _ref;
      atom.commands.add('atom-workspace', {
        'terminal-panel:new': (function(_this) {
          return function() {
            return _this.newTermClick();
          };
        })(this),
        'terminal-panel:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'terminal-panel:next': (function(_this) {
          return function() {
            return _this.activeNextCommandView();
          };
        })(this),
        'terminal-panel:prev': (function(_this) {
          return function() {
            return _this.activePrevCommandView();
          };
        })(this),
        'terminal-panel:destroy': (function(_this) {
          return function() {
            return _this.destroyActiveTerm();
          };
        })(this)
      });
      atom.commands.add('.cli-status', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      });
      this.attach();
      if ((_ref = this.toolTipDisposable) != null) {
        _ref.dispose();
      }
      return this.toolTipDisposable = atom.tooltips.add(this.termStatusAdd, {
        title: "Add a terminal panel"
      });
    };

    CliStatusView.prototype.createCommandView = function() {
      var CommandOutputView, commandOutputView, domify, termStatus;
      domify = require('domify');
      CommandOutputView = require('./command-output-view');
      termStatus = domify('<span class="cli-status icon icon-terminal"></span>');
      commandOutputView = new CommandOutputView;
      commandOutputView.statusIcon = termStatus;
      commandOutputView.statusView = this;
      this.commandViews.push(commandOutputView);
      termStatus.addEventListener('click', function() {
        return commandOutputView.toggle();
      });
      this.termStatusContainer.append(termStatus);
      return commandOutputView;
    };

    CliStatusView.prototype.activeNextCommandView = function() {
      return this.activeCommandView(this.activeIndex + 1);
    };

    CliStatusView.prototype.activePrevCommandView = function() {
      return this.activeCommandView(this.activeIndex - 1);
    };

    CliStatusView.prototype.activeCommandView = function(index) {
      if (index >= this.commandViews.length) {
        index = 0;
      }
      if (index < 0) {
        index = this.commandViews.length - 1;
      }
      return this.commandViews[index] && this.commandViews[index].open();
    };

    CliStatusView.prototype.setActiveCommandView = function(commandView) {
      return this.activeIndex = this.commandViews.indexOf(commandView);
    };

    CliStatusView.prototype.removeCommandView = function(commandView) {
      var index;
      index = this.commandViews.indexOf(commandView);
      return index >= 0 && this.commandViews.splice(index, 1);
    };

    CliStatusView.prototype.newTermClick = function() {
      return this.createCommandView().toggle();
    };

    CliStatusView.prototype.attach = function() {
      return document.querySelector("status-bar").addLeftTile({
        item: this,
        priority: 100
      });
    };

    CliStatusView.prototype.destroyActiveTerm = function() {
      var _ref;
      return (_ref = this.commandViews[this.activeIndex]) != null ? _ref.destroy() : void 0;
    };

    CliStatusView.prototype.destroy = function() {
      var index, _i, _ref;
      for (index = _i = _ref = this.commandViews.length; _ref <= 0 ? _i <= 0 : _i >= 0; index = _ref <= 0 ? ++_i : --_i) {
        this.removeCommandView(this.commandViews[index]);
      }
      return this.detach();
    };

    CliStatusView.prototype.toggle = function() {
      if (this.commandViews[this.activeIndex] == null) {
        this.createCommandView();
      }
      return this.commandViews[this.activeIndex].toggle();
    };

    return CliStatusView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL3Rlcm1pbmFsLXBhbmVsL2xpYi9jbGktc3RhdHVzLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLG9DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHlCQUFQO09BQUwsRUFBdUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDckMsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLFlBQUEsTUFBQSxFQUFRLHFCQUFSO1dBQU4sRUFBcUMsU0FBQSxHQUFBO21CQUNuQyxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsY0FBQSxLQUFBLEVBQU8sY0FBUDtBQUFBLGNBQXVCLE1BQUEsRUFBUSxlQUEvQjtBQUFBLGNBQWdELE9BQUEsRUFBTywyQkFBdkQ7YUFBTixFQURtQztVQUFBLENBQXJDLEVBRHFDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkMsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSw0QkFLQSxZQUFBLEdBQWMsRUFMZCxDQUFBOztBQUFBLDRCQU1BLFdBQUEsR0FBYSxDQU5iLENBQUE7O0FBQUEsNEJBT0EsaUJBQUEsR0FBbUIsSUFQbkIsQ0FBQTs7QUFBQSw0QkFTQSxVQUFBLEdBQVksU0FBQyxj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

//# sourceURL=/Users/ajenkins/.atom/packages/terminal-panel/lib/cli-status-view.coffee

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvdGVybWluYWwtcGFuZWwvbGliL2NsaS1zdGF0dXMtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0NBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osb0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsYUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8seUJBQVA7T0FBTCxFQUF1QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNyQyxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsWUFBQSxNQUFBLEVBQVEscUJBQVI7V0FBTixFQUFxQyxTQUFBLEdBQUE7bUJBQ25DLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxjQUFBLEtBQUEsRUFBTyxjQUFQO0FBQUEsY0FBdUIsTUFBQSxFQUFRLGVBQS9CO0FBQUEsY0FBZ0QsT0FBQSxFQUFPLDJCQUF2RDthQUFOLEVBRG1DO1VBQUEsQ0FBckMsRUFEcUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2QyxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLDRCQUtBLFlBQUEsR0FBYyxFQUxkLENBQUE7O0FBQUEsNEJBTUEsV0FBQSxHQUFhLENBTmIsQ0FBQTs7QUFBQSw0QkFPQSxpQkFBQSxHQUFtQixJQVBuQixDQUFBOztBQUFBLDRCQVNBLFVBQUEsR0FBWSxTQUFDLGNBQUQsR0FBQTtBQUNWLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNFO0FBQUEsUUFBQSxvQkFBQSxFQUFzQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsWUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QjtBQUFBLFFBQ0EsdUJBQUEsRUFBeUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEekI7QUFBQSxRQUVBLHFCQUFBLEVBQXVCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxxQkFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZ2QjtBQUFBLFFBR0EscUJBQUEsRUFBdUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLHFCQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSHZCO0FBQUEsUUFJQSx3QkFBQSxFQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsaUJBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKMUI7T0FERixDQUFBLENBQUE7QUFBQSxNQU9BLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixhQUFsQixFQUNFO0FBQUEsUUFBQSxhQUFBLEVBQWUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZjtPQURGLENBUEEsQ0FBQTtBQUFBLE1BVUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQVZBLENBQUE7O1lBV2tCLENBQUUsT0FBcEIsQ0FBQTtPQVhBO2FBWUEsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsYUFBbkIsRUFBa0M7QUFBQSxRQUFBLEtBQUEsRUFBTyxzQkFBUDtPQUFsQyxFQWJYO0lBQUEsQ0FUWixDQUFBOztBQUFBLDRCQXdCQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsVUFBQSx3REFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBQVQsQ0FBQTtBQUFBLE1BQ0EsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHVCQUFSLENBRHBCLENBQUE7QUFBQSxNQUVBLFVBQUEsR0FBYSxNQUFBLENBQU8scURBQVAsQ0FGYixDQUFBO0FBQUEsTUFHQSxpQkFBQSxHQUFvQixHQUFBLENBQUEsaUJBSHBCLENBQUE7QUFBQSxNQUlBLGlCQUFpQixDQUFDLFVBQWxCLEdBQStCLFVBSi9CLENBQUE7QUFBQSxNQUtBLGlCQUFpQixDQUFDLFVBQWxCLEdBQStCLElBTC9CLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxZQUFZLENBQUMsSUFBZCxDQUFtQixpQkFBbkIsQ0FOQSxDQUFBO0FBQUEsTUFPQSxVQUFVLENBQUMsZ0JBQVgsQ0FBNEIsT0FBNUIsRUFBcUMsU0FBQSxHQUFBO2VBQ25DLGlCQUFpQixDQUFDLE1BQWxCLENBQUEsRUFEbUM7TUFBQSxDQUFyQyxDQVBBLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxNQUFyQixDQUE0QixVQUE1QixDQVRBLENBQUE7QUFVQSxhQUFPLGlCQUFQLENBWGlCO0lBQUEsQ0F4Qm5CLENBQUE7O0FBQUEsNEJBcUNBLHFCQUFBLEdBQXVCLFNBQUEsR0FBQTthQUNyQixJQUFDLENBQUEsaUJBQUQsQ0FBbUIsSUFBQyxDQUFBLFdBQUQsR0FBZSxDQUFsQyxFQURxQjtJQUFBLENBckN2QixDQUFBOztBQUFBLDRCQXdDQSxxQkFBQSxHQUF1QixTQUFBLEdBQUE7YUFDckIsSUFBQyxDQUFBLGlCQUFELENBQW1CLElBQUMsQ0FBQSxXQUFELEdBQWUsQ0FBbEMsRUFEcUI7SUFBQSxDQXhDdkIsQ0FBQTs7QUFBQSw0QkEyQ0EsaUJBQUEsR0FBbUIsU0FBQyxLQUFELEdBQUE7QUFDakIsTUFBQSxJQUFHLEtBQUEsSUFBUyxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQTFCO0FBQ0UsUUFBQSxLQUFBLEdBQVEsQ0FBUixDQURGO09BQUE7QUFFQSxNQUFBLElBQUcsS0FBQSxHQUFRLENBQVg7QUFDRSxRQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsR0FBdUIsQ0FBL0IsQ0FERjtPQUZBO2FBSUEsSUFBQyxDQUFBLFlBQWEsQ0FBQSxLQUFBLENBQWQsSUFBeUIsSUFBQyxDQUFBLFlBQWEsQ0FBQSxLQUFBLENBQU0sQ0FBQyxJQUFyQixDQUFBLEVBTFI7SUFBQSxDQTNDbkIsQ0FBQTs7QUFBQSw0QkFrREEsb0JBQUEsR0FBc0IsU0FBQyxXQUFELEdBQUE7YUFDcEIsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBc0IsV0FBdEIsRUFESztJQUFBLENBbER0QixDQUFBOztBQUFBLDRCQXFEQSxpQkFBQSxHQUFtQixTQUFDLFdBQUQsR0FBQTtBQUNqQixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBc0IsV0FBdEIsQ0FBUixDQUFBO2FBQ0EsS0FBQSxJQUFRLENBQVIsSUFBYyxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBcUIsS0FBckIsRUFBNEIsQ0FBNUIsRUFGRztJQUFBLENBckRuQixDQUFBOztBQUFBLDRCQXlEQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQ1osSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FBb0IsQ0FBQyxNQUFyQixDQUFBLEVBRFk7SUFBQSxDQXpEZCxDQUFBOztBQUFBLDRCQTREQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsWUFBdkIsQ0FBb0MsQ0FBQyxXQUFyQyxDQUFpRDtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxRQUFZLFFBQUEsRUFBVSxHQUF0QjtPQUFqRCxFQURNO0lBQUEsQ0E1RFIsQ0FBQTs7QUFBQSw0QkErREEsaUJBQUEsR0FBbUIsU0FBQSxHQUFBO0FBQ2hCLFVBQUEsSUFBQTt3RUFBMkIsQ0FBRSxPQUE3QixDQUFBLFdBRGdCO0lBQUEsQ0EvRG5CLENBQUE7O0FBQUEsNEJBbUVBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLGVBQUE7QUFBQSxXQUFhLDRHQUFiLEdBQUE7QUFDRSxRQUFBLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixJQUFDLENBQUEsWUFBYSxDQUFBLEtBQUEsQ0FBakMsQ0FBQSxDQURGO0FBQUEsT0FBQTthQUVBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFITztJQUFBLENBbkVULENBQUE7O0FBQUEsNEJBd0VBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQTRCLDJDQUE1QjtBQUFBLFFBQUEsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FBQSxDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsWUFBYSxDQUFBLElBQUMsQ0FBQSxXQUFELENBQWEsQ0FBQyxNQUE1QixDQUFBLEVBRk07SUFBQSxDQXhFUixDQUFBOzt5QkFBQTs7S0FEMEIsS0FKNUIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/terminal-panel/lib/cli-status-view.coffee

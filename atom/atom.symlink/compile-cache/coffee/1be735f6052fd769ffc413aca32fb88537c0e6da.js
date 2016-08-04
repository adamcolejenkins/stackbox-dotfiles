(function() {
  var $, $$, $$$, MessageView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, $$ = _ref.$$, $$$ = _ref.$$$, View = _ref.View;

  module.exports = MessageView = (function(_super) {
    __extends(MessageView, _super);

    MessageView.prototype.messages = [];

    MessageView.content = function() {
      return this.div({
        "class": 'atom-beautify message-panel'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'overlay from-top'
          }, function() {
            return _this.div({
              "class": "tool-panel panel-bottom"
            }, function() {
              return _this.div({
                "class": "inset-panel"
              }, function() {
                _this.div({
                  "class": "panel-heading"
                }, function() {
                  _this.div({
                    "class": 'btn-toolbar pull-right'
                  }, function() {
                    return _this.button({
                      "class": 'btn',
                      click: 'clearMessages'
                    }, 'Clear');
                  });
                  return _this.span({
                    "class": '',
                    outlet: 'title'
                  }, 'Atom Beautify Message');
                });
                return _this.div({
                  "class": "panel-body padded select-list",
                  outlet: 'body'
                }, function() {
                  return _this.ol({
                    "class": 'list-group',
                    outlet: 'messageItems'
                  }, function() {
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'This is the title');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'This is the title Currently there is no way to display a message to the user, such as errors or warnings or deprecation notices (see #40). Let\'s put a little overlay on the top for displaying such information.');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'This is the title Currently there is no way to display a message to the user, such as errors or warnings or deprecation notices (see #40). Let\'s put a little overlay on the top for displaying such information.');
                    });
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'test');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'This is the title');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'This is the title');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                    return _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-added icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-file-text'
                      }, 'Primary line');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                  });
                });
              });
            });
          });
        };
      })(this));
    };

    function MessageView() {
      this.refresh = __bind(this.refresh, this);
      this.show = __bind(this.show, this);
      this.close = __bind(this.close, this);
      this.clearMessages = __bind(this.clearMessages, this);
      this.addMessage = __bind(this.addMessage, this);
      MessageView.__super__.constructor.apply(this, arguments);
    }

    MessageView.prototype.destroy = function() {};

    MessageView.prototype.addMessage = function(message) {
      this.messages.push(message);
      return this.refresh();
    };

    MessageView.prototype.clearMessages = function() {
      this.messages = [];
      return this.refresh();
    };

    MessageView.prototype.close = function(event, element) {
      return this.detach();
    };

    MessageView.prototype.show = function() {
      if (!this.hasParent()) {
        return atom.workspaceView.appendToTop(this);
      }
    };

    MessageView.prototype.refresh = function() {
      if (this.messages.length === 0) {
        return this.close();
      } else {
        return this.show();
      }
    };

    return MessageView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL3ZpZXdzL21lc3NhZ2Utdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUNBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxPQUFxQixPQUFBLENBQVEsc0JBQVIsQ0FBckIsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBQUosRUFBUSxXQUFBLEdBQVIsRUFBYSxZQUFBLElBQWIsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixrQ0FBQSxDQUFBOztBQUFBLDBCQUFBLFFBQUEsR0FBVSxFQUFWLENBQUE7O0FBQUEsSUFDQSxXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQ0U7QUFBQSxRQUFBLE9BQUEsRUFBTyw2QkFBUDtPQURGLEVBQ3dDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3BDLEtBQUMsQ0FBQSxHQUFELENBQ0U7QUFBQSxZQUFBLE9BQUEsRUFBTyxrQkFBUDtXQURGLEVBQzZCLFNBQUEsR0FBQTttQkFDekIsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLHlCQUFQO2FBQUwsRUFBdUMsU0FBQSxHQUFBO3FCQUNyQyxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLGFBQVA7ZUFBTCxFQUEyQixTQUFBLEdBQUE7QUFDekIsZ0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyxlQUFQO2lCQUFMLEVBQTZCLFNBQUEsR0FBQTtBQUMzQixrQkFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsb0JBQUEsT0FBQSxFQUFPLHdCQUFQO21C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

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/views/message-view.coffee

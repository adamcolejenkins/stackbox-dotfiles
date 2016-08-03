(function() {
  var LoadingView, TextEditorView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, TextEditorView = _ref.TextEditorView;

  module.exports = LoadingView = (function(_super) {
    __extends(LoadingView, _super);

    function LoadingView() {
      this.show = __bind(this.show, this);
      this.hide = __bind(this.hide, this);
      return LoadingView.__super__.constructor.apply(this, arguments);
    }

    LoadingView.content = function() {
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
                      click: 'hide'
                    }, 'Hide');
                  });
                  return _this.span({
                    "class": 'text-primary',
                    outlet: 'title'
                  }, 'Atom Beautify');
                });
                return _this.div({
                  "class": "panel-body padded select-list text-center",
                  outlet: 'body'
                }, function() {
                  return _this.div(function() {
                    _this.span({
                      "class": 'text-center loading loading-spinner-large inline-block'
                    });
                    return _this.div({
                      "class": ''
                    }, 'Beautification in progress.');
                  });
                });
              });
            });
          });
        };
      })(this));
    };

    LoadingView.prototype.hide = function(event, element) {
      return this.detach();
    };

    LoadingView.prototype.show = function() {
      if (!this.hasParent()) {
        return atom.workspace.addTopPanel({
          item: this
        });
      }
    };

    return LoadingView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL3ZpZXdzL2xvYWRpbmctdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUNBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxPQUF5QixPQUFBLENBQVEsc0JBQVIsQ0FBekIsRUFBQyxZQUFBLElBQUQsRUFBTyxzQkFBQSxjQUFQLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osa0NBQUEsQ0FBQTs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQ0U7QUFBQSxRQUFBLE9BQUEsRUFBTyw2QkFBUDtPQURGLEVBQ3dDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3BDLEtBQUMsQ0FBQSxHQUFELENBQ0U7QUFBQSxZQUFBLE9BQUEsRUFBTyxrQkFBUDtXQURGLEVBQzZCLFNBQUEsR0FBQTttQkFDekIsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLHlCQUFQO2FBQUwsRUFBdUMsU0FBQSxHQUFBO3FCQUNyQyxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLGFBQVA7ZUFBTCxFQUEyQixTQUFBLEdBQUE7QUFDekIsZ0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyxlQUFQO2lCQUFMLEVBQTZCLFNBQUEsR0FBQTtBQUMzQixrQkFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsb0JBQUEsT0FBQSxFQUFPLHdCQUFQO21CQUFMLEVBQXNDLFNBQUEsR0FBQTsyQkFDcEMsS0FBQyxDQUFBLE1BQUQsQ0FDRTtBQUFBLHNCQUFBLE9BQUEsRUFBTyxLQUFQO0FBQUEsc0JBQ0EsS0FBQSxFQUFPLE1BRFA7cUJBREYsRUFHRSxNQUhGLEVBRG9DO2tCQUFBLENBQXRDLENBQUEsQ0FBQTt5QkFLQSxLQUFDLENBQUEsSUFBRCxDQUNFO0FBQUEsb0JBQUEsT0FBQSxFQUFPLGNBQVA7QUFBQSxvQkFDQSxNQUFBLEVBQVEsT0FEUjttQkFERixFQUdFLGVBSEYsRUFOMkI7Z0JBQUEsQ0FBN0IsQ0FBQSxDQUFBO3VCQVVBLEtBQUMsQ0FBQSxHQUFELENBQ0U7QUFBQSxrQkFBQSxPQUFBLEVBQU8sMkNBQVA7QUFBQSxrQkFDQSxNQUFBLEVBQVEsTUFEUjtpQkFERixFQUdFLFNBQUEsR0FBQTt5QkFDRSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUEsR0FBQTtBQUNILG9CQUFBLEtBQUMsQ0FBQSxJQUFELENBQ0U7QUFBQSxzQkFBQSxPQUFBLEVBQU8sd0RBQVA7cUJBREYsQ0FBQSxDQUFBOzJCQUVBLEtBQUMsQ0FBQSxHQUFELENBQ0U7QUFBQSxzQkFBQSxPQUFBLEVBQU8sRUFBUDtxQkFERixFQUVFLDZCQUZGLEVBSEc7a0JBQUEsQ0FBTCxFQURGO2dCQUFBLENBSEYsRUFYeUI7Y0FBQSxDQUEzQixFQURxQztZQUFBLENBQXZDLEVBRHlCO1VBQUEsQ0FEN0IsRUFEb0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUR4QyxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLDBCQTRCQSxJQUFBLEdBQU0sU0FBQyxLQUFELEVBQVEsT0FBUixHQUFBO2FBQ0osSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURJO0lBQUEsQ0E1Qk4sQ0FBQTs7QUFBQSwwQkErQkEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLE1BQUEsSUFBRyxDQUFBLElBQUssQ0FBQyxTQUFGLENBQUEsQ0FBUDtlQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBZixDQUEyQjtBQUFBLFVBQUEsSUFBQSxFQUFNLElBQU47U0FBM0IsRUFERjtPQURJO0lBQUEsQ0EvQk4sQ0FBQTs7dUJBQUE7O0tBRHdCLEtBSDFCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/src/views/loading-view.coffee

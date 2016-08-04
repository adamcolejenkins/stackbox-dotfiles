(function() {
  var $, GitTimeplotPopup, RevisionView, View, moment, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  moment = require('moment');

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View;

  RevisionView = require('./git-revision-view');

  module.exports = GitTimeplotPopup = (function(_super) {
    __extends(GitTimeplotPopup, _super);

    function GitTimeplotPopup() {
      this._onShowRevision = __bind(this._onShowRevision, this);
      this._onMouseLeave = __bind(this._onMouseLeave, this);
      this._onMouseEnter = __bind(this._onMouseEnter, this);
      this.isMouseInPopup = __bind(this.isMouseInPopup, this);
      this.remove = __bind(this.remove, this);
      this.hide = __bind(this.hide, this);
      return GitTimeplotPopup.__super__.constructor.apply(this, arguments);
    }

    GitTimeplotPopup.content = function(commitData, editor, start, end) {
      var dateFormat;
      dateFormat = "MMM DD YYYY ha";
      return this.div({
        "class": "select-list popover-list git-timemachine-popup"
      }, (function(_this) {
        return function() {
          _this.h5("There were " + commitData.length + " commits between");
          _this.h6("" + (start.format(dateFormat)) + " and " + (end.format(dateFormat)));
          return _this.ul(function() {
            var authorDate, commit, linesAdded, linesDeleted, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = commitData.length; _i < _len; _i++) {
              commit = commitData[_i];
              authorDate = moment.unix(commit.authorDate);
              linesAdded = commit.linesAdded || 0;
              linesDeleted = commit.linesDeleted || 0;
              _results.push(_this.li({
                "data-rev": commit.hash,
                click: '_onShowRevision'
              }, function() {
                return _this.div({
                  "class": "commit"
                }, function() {
                  _this.div({
                    "class": "header"
                  }, function() {
                    _this.div("" + (authorDate.format(dateFormat)));
                    _this.div("" + commit.hash);
                    return _this.div(function() {
                      _this.span({
                        "class": 'added-count'
                      }, "+" + linesAdded + " ");
                      return _this.span({
                        "class": 'removed-count'
                      }, "-" + linesDeleted + " ");
                    });
                  });
                  _this.div(function() {
                    return _this.strong("" + commit.message);
                  });
                  return _this.div("Authored by " + commit.authorName + " " + (authorDate.fromNow()));
                });
              }));
            }
            return _results;
          });
        };
      })(this));
    };

    GitTimeplotPopup.prototype.initialize = function(commitData, editor) {
      this.editor = editor;
      this.file = this.editor.getPath();
      this.appendTo(atom.views.getView(atom.workspace));
      this.mouseenter(this._onMouseEnter);
      return this.mouseleave(this._onMouseLeave);
    };

    GitTimeplotPopup.prototype.hide = function() {
      this._mouseInPopup = false;
      return GitTimeplotPopup.__super__.hide.apply(this, arguments);
    };

    GitTimeplotPopup.prototype.remove = function() {
      if (!this._mouseInPopup) {
        return GitTimeplotPopup.__super__.remove.apply(this, arguments);
      }
    };

    GitTimeplotPopup.prototype.isMouseInPopup = function() {
      return this._mouseInPopup === true;
    };

    GitTimeplotPopup.prototype._onMouseEnter = function(evt) {
      this._mouseInPopup = true;
    };

    GitTimeplotPopup.prototype._onMouseLeave = function(evt) {
      this.hide();
    };

    GitTimeplotPopup.prototype._onShowRevision = function(evt) {
      var revHash;
      revHash = $(evt.target).closest('li').data('rev');
      return RevisionView.showRevision(this.editor, revHash);
    };

    return GitTimeplotPopup;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvZ2l0LXRpbWUtbWFjaGluZS9saWIvZ2l0LXRpbWVwbG90LXBvcHVwLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxREFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUFULENBQUE7O0FBQUEsRUFDQSxPQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQURKLENBQUE7O0FBQUEsRUFHQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHFCQUFSLENBSGYsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBRXJCLHVDQUFBLENBQUE7Ozs7Ozs7Ozs7S0FBQTs7QUFBQSxJQUFBLGdCQUFDLENBQUEsT0FBRCxHQUFXLFNBQUMsVUFBRCxFQUFhLE1BQWIsRUFBcUIsS0FBckIsRUFBNEIsR0FBNUIsR0FBQTtBQUNULFVBQUEsVUFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLGdCQUFiLENBQUE7YUFDQSxJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sZ0RBQVA7T0FBTCxFQUE4RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzVELFVBQUEsS0FBQyxDQUFBLEVBQUQsQ0FBSyxhQUFBLEdBQWEsVUFBVSxDQUFDLE1BQXhCLEdBQStCLGtCQUFwQyxDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxFQUFELENBQUksRUFBQSxHQUFFLENBQUMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxVQUFiLENBQUQsQ0FBRixHQUE0QixPQUE1QixHQUFrQyxDQUFDLEdBQUcsQ0FBQyxNQUFKLENBQVcsVUFBWCxDQUFE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

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/git-time-machine/lib/git-timeplot-popup.coffee

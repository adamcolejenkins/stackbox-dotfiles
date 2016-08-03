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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2dpdC10aW1lLW1hY2hpbmUvbGliL2dpdC10aW1lcGxvdC1wb3B1cC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscURBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsT0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFESixDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxxQkFBUixDQUhmLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUVyQix1Q0FBQSxDQUFBOzs7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxnQkFBQyxDQUFBLE9BQUQsR0FBVyxTQUFDLFVBQUQsRUFBYSxNQUFiLEVBQXFCLEtBQXJCLEVBQTRCLEdBQTVCLEdBQUE7QUFDVCxVQUFBLFVBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxnQkFBYixDQUFBO2FBQ0EsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGdEQUFQO09BQUwsRUFBOEQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUM1RCxVQUFBLEtBQUMsQ0FBQSxFQUFELENBQUssYUFBQSxHQUFhLFVBQVUsQ0FBQyxNQUF4QixHQUErQixrQkFBcEMsQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsRUFBRCxDQUFJLEVBQUEsR0FBRSxDQUFDLEtBQUssQ0FBQyxNQUFOLENBQWEsVUFBYixDQUFELENBQUYsR0FBNEIsT0FBNUIsR0FBa0MsQ0FBQyxHQUFHLENBQUMsTUFBSixDQUFXLFVBQVgsQ0FBRCxDQUF0QyxDQURBLENBQUE7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

//# sourceURL=/Users/ajenkins/.atom/packages/git-time-machine/lib/git-timeplot-popup.coffee

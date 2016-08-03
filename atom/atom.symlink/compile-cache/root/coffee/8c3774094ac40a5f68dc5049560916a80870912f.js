(function() {
  var $, GitLog, GitRevisionView, GitTimeMachineView, GitTimeplot, NOT_GIT_ERRORS, View, moment, path, str, _, _ref;

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View;

  path = require('path');

  _ = require('underscore-plus');

  str = require('bumble-strings');

  moment = require('moment');

  GitLog = require('git-log-utils');

  GitTimeplot = require('./git-timeplot');

  GitRevisionView = require('./git-revision-view');

  NOT_GIT_ERRORS = ['File not a git repository', 'is outside repository', "Not a git repository"];

  module.exports = GitTimeMachineView = (function() {
    function GitTimeMachineView(serializedState, options) {
      if (options == null) {
        options = {};
      }
      if (!this.$element) {
        this.$element = $("<div class='git-time-machine'>");
      }
      if (options.editor != null) {
        this.setEditor(options.editor);
        this.render();
      }
    }

    GitTimeMachineView.prototype.setEditor = function(editor) {
      var file, _ref1;
      if (editor === this.editor) {
        return;
      }
      file = editor != null ? editor.getPath() : void 0;
      if (!((file != null) && !str.startsWith(path.basename(file), GitRevisionView.FILE_PREFIX))) {
        return;
      }
      _ref1 = [editor, file], this.editor = _ref1[0], this.file = _ref1[1];
      return this.render();
    };

    GitTimeMachineView.prototype.render = function() {
      var commits;
      commits = this.gitCommitHistory();
      if (!((this.file != null) && (commits != null))) {
        this._renderPlaceholder();
      } else {
        this.$element.text("");
        this._renderCloseHandle();
        this._renderStats(commits);
        this._renderTimeline(commits);
      }
      return this.$element;
    };

    GitTimeMachineView.prototype.serialize = function() {
      return null;
    };

    GitTimeMachineView.prototype.destroy = function() {
      return this.$element.remove();
    };

    GitTimeMachineView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.timeplot) != null ? _ref1.hide() : void 0;
    };

    GitTimeMachineView.prototype.show = function() {
      var _ref1;
      return (_ref1 = this.timeplot) != null ? _ref1.show() : void 0;
    };

    GitTimeMachineView.prototype.getElement = function() {
      return this.$element.get(0);
    };

    GitTimeMachineView.prototype.gitCommitHistory = function(file) {
      var commits, e;
      if (file == null) {
        file = this.file;
      }
      if (file == null) {
        return null;
      }
      try {
        commits = GitLog.getCommitHistory(file);
      } catch (_error) {
        e = _error;
        if (e.message != null) {
          if (str.weaklyHas(e.message, NOT_GIT_ERRORS)) {
            console.warn("" + file + " not in a git repository");
            return null;
          }
        }
        atom.notifications.addError(String(e));
        console.error(e);
        return null;
      }
      return commits;
    };

    GitTimeMachineView.prototype._renderPlaceholder = function() {
      this.$element.html("<div class='placeholder'>Select a file in the git repo to see timeline</div>");
    };

    GitTimeMachineView.prototype._renderCloseHandle = function() {
      var $closeHandle;
      $closeHandle = $("<div class='close-handle'>X</div>");
      this.$element.append($closeHandle);
      return $closeHandle.on('mousedown', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        return atom.commands.dispatch(atom.views.getView(atom.workspace), "git-time-machine:toggle");
      });
    };

    GitTimeMachineView.prototype._renderTimeline = function(commits) {
      this.timeplot || (this.timeplot = new GitTimeplot(this.$element));
      this.timeplot.render(this.editor, commits);
    };

    GitTimeMachineView.prototype._renderStats = function(commits) {
      var authorCount, byAuthor, content, durationInMs, timeSpan;
      content = "";
      if (commits.length > 0) {
        byAuthor = _.indexBy(commits, 'authorName');
        authorCount = _.keys(byAuthor).length;
        durationInMs = moment.unix(commits[commits.length - 1].authorDate).diff(moment.unix(commits[0].authorDate));
        timeSpan = moment.duration(durationInMs).humanize();
        content = "<span class='total-commits'>" + commits.length + "</span> commits by " + authorCount + " authors spanning " + timeSpan;
      }
      this.$element.append("<div class='stats'>\n  " + content + "\n</div>");
    };

    return GitTimeMachineView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvZ2l0LXRpbWUtbWFjaGluZS9saWIvZ2l0LXRpbWUtbWFjaGluZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2R0FBQTs7QUFBQSxFQUFBLE9BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBRkosQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsZ0JBQVIsQ0FITixDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBSlQsQ0FBQTs7QUFBQSxFQU1BLE1BQUEsR0FBUyxPQUFBLENBQVEsZUFBUixDQU5ULENBQUE7O0FBQUEsRUFPQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBUGQsQ0FBQTs7QUFBQSxFQVFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBUmxCLENBQUE7O0FBQUEsRUFVQSxjQUFBLEdBQWlCLENBQUMsMkJBQUQsRUFBOEIsdUJBQTlCLEVBQXVELHNCQUF2RCxDQVZqQixDQUFBOztBQUFBLEVBWUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsNEJBQUMsZUFBRCxFQUFrQixPQUFsQixHQUFBOztRQUFrQixVQUFRO09BQ3JDO0FBQUEsTUFBQSxJQUFBLENBQUEsSUFBd0QsQ0FBQSxRQUF4RDtBQUFBLFFBQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxDQUFBLENBQUUsZ0NBQUYsQ0FBWixDQUFBO09BQUE7QUFDQSxNQUFBLElBQUcsc0JB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

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/git-time-machine/lib/git-time-machine-view.coffee

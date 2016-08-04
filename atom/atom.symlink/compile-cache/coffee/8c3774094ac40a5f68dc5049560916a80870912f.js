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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2dpdC10aW1lLW1hY2hpbmUvbGliL2dpdC10aW1lLW1hY2hpbmUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkdBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGdCQUFSLENBSE4sQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUpULENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVIsQ0FOVCxDQUFBOztBQUFBLEVBT0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQVBkLENBQUE7O0FBQUEsRUFRQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUixDQVJsQixDQUFBOztBQUFBLEVBVUEsY0FBQSxHQUFpQixDQUFDLDJCQUFELEVBQThCLHVCQUE5QixFQUF1RCxzQkFBdkQsQ0FWakIsQ0FBQTs7QUFBQSxFQVlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLDRCQUFDLGVBQUQsRUFBa0IsT0FBbEIsR0FBQTs7UUFBa0IsVUFBUTtPQUNyQztBQUFBLE1BQUEsSUFBQSxDQUFBLElBQXdELENBQUEsUUFBeEQ7QUFBQSxRQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksQ0FBQSxDQUFFLGdDQUFGLENBQVosQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFHLHNCQUFIO0FBQ0UsUUFBQSxJQUFD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

//# sourceURL=/Users/ajenkins/.atom/packages/git-time-machine/lib/git-time-machine-view.coffee

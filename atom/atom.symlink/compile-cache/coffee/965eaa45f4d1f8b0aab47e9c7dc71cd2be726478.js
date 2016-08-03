(function() {
  var Emitter, TodoModel, maxLength, path, _;

  path = require('path');

  Emitter = require('atom').Emitter;

  _ = require('underscore-plus');

  maxLength = 120;

  module.exports = TodoModel = (function() {
    function TodoModel(match, _arg) {
      var plain;
      plain = (_arg != null ? _arg : []).plain;
      if (plain) {
        return _.extend(this, match);
      }
      this.handleScanMatch(match);
    }

    TodoModel.prototype.getAllKeys = function() {
      return atom.config.get('todo-show.showInTable') || ['Text'];
    };

    TodoModel.prototype.get = function(key) {
      var value;
      if (key == null) {
        key = '';
      }
      if ((value = this[key.toLowerCase()]) || value === '') {
        return value;
      }
      return this.text || 'No details';
    };

    TodoModel.prototype.getMarkdown = function(key) {
      var value;
      if (key == null) {
        key = '';
      }
      if (!(value = this[key.toLowerCase()])) {
        return '';
      }
      switch (key) {
        case 'All':
        case 'Text':
          return " " + value;
        case 'Type':
        case 'Project':
          return " __" + value + "__";
        case 'Range':
        case 'Line':
          return " _:" + value + "_";
        case 'Regex':
          return " _'" + value + "'_";
        case 'Path':
        case 'File':
          return " [" + value + "](" + value + ")";
        case 'Tags':
        case 'Id':
          return " _" + value + "_";
      }
    };

    TodoModel.prototype.getMarkdownArray = function(keys) {
      var key, _i, _len, _ref, _results;
      _ref = keys || this.getAllKeys();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        _results.push(this.getMarkdown(key));
      }
      return _results;
    };

    TodoModel.prototype.keyIsNumber = function(key) {
      return key === 'Range' || key === 'Line';
    };

    TodoModel.prototype.contains = function(string) {
      var item, key, _i, _len, _ref;
      if (string == null) {
        string = '';
      }
      _ref = this.getAllKeys();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (!(item = this.get(key))) {
          break;
        }
        if (item.toLowerCase().indexOf(string.toLowerCase()) !== -1) {
          return true;
        }
      }
      return false;
    };

    TodoModel.prototype.handleScanMatch = function(match) {
      var loc, matchText, matches, pos, project, relativePath, tag, _matchText, _ref, _ref1, _ref2;
      matchText = match.text || match.all || '';
      while ((_matchText = (_ref = match.regexp) != null ? _ref.exec(matchText) : void 0)) {
        if (!match.type) {
          match.type = _matchText[1];
        }
        matchText = _matchText.pop();
      }
      if (matchText.indexOf('(') === 0) {
        if (matches = matchText.match(/\((.*?)\):?(.*)/)) {
          matchText = matches.pop();
          match.id = matches.pop();
        }
      }
      matchText = this.stripCommentEnd(matchText);
      match.tags = ((function() {
        var _results;
        _results = [];
        while ((tag = /\s*#(\w+)[,.]?$/.exec(matchText))) {
          if (tag.length !== 2) {
            break;
          }
          matchText = matchText.slice(0, -tag.shift().length);
          _results.push(tag.shift());
        }
        return _results;
      })()).sort().join(', ');
      if (!matchText && match.all && (pos = (_ref1 = match.position) != null ? (_ref2 = _ref1[0]) != null ? _ref2[1] : void 0 : void 0)) {
        matchText = match.all.substr(0, pos);
        matchText = this.stripCommentStart(matchText);
      }
      if (matchText.length >= maxLength) {
        matchText = "" + (matchText.substr(0, maxLength - 3)) + "...";
      }
      if (!(match.position && match.position.length > 0)) {
        match.position = [[0, 0]];
      }
      if (match.position.serialize) {
        match.range = match.position.serialize().toString();
      } else {
        match.range = match.position.toString();
      }
      relativePath = atom.project.relativizePath(match.loc);
      match.path = relativePath[1] || '';
      if ((loc = path.basename(match.loc)) !== 'undefined') {
        match.file = loc;
      } else {
        match.file = 'untitled';
      }
      if ((project = path.basename(relativePath[0])) !== 'null') {
        match.project = project;
      } else {
        match.project = '';
      }
      match.text = matchText || "No details";
      match.line = (parseInt(match.range.split(',')[0]) + 1).toString();
      match.regex = match.regex.replace('${TODOS}', match.type);
      match.id = match.id || '';
      return _.extend(this, match);
    };

    TodoModel.prototype.stripCommentStart = function(text) {
      var startRegex;
      if (text == null) {
        text = '';
      }
      startRegex = /(\/\*|<\?|<!--|<#|{-|\[\[|\/\/|#)\s*$/;
      return text.replace(startRegex, '').trim();
    };

    TodoModel.prototype.stripCommentEnd = function(text) {
      var endRegex;
      if (text == null) {
        text = '';
      }
      endRegex = /(\*\/}?|\?>|-->|#>|-}|\]\])\s*$/;
      return text.replace(endRegex, '').trim();
    };

    return TodoModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLW1vZGVsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQ0FBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFFQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FGRCxDQUFBOztBQUFBLEVBR0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUhKLENBQUE7O0FBQUEsRUFLQSxTQUFBLEdBQVksR0FMWixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsbUJBQUMsS0FBRCxFQUFRLElBQVIsR0FBQTtBQUNYLFVBQUEsS0FBQTtBQUFBLE1BRG9CLHdCQUFELE9BQVUsSUFBVCxLQUNwQixDQUFBO0FBQUEsTUFBQSxJQUFnQyxLQUFoQztBQUFBLGVBQU8sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsS0FBZixDQUFQLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsS0FBakIsQ0FEQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSx3QkFJQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixDQUFBLElBQTRDLENBQUMsTUFBRCxFQURsQztJQUFBLENBSlosQ0FBQTs7QUFBQSx3QkFPQSxHQUFBLEdBQUssU0FBQyxHQUFELEdBQUE7QUFDSCxVQUFBLEtBQUE7O1FBREksTUFBTTtPQUNWO0FBQUEsTUFBQSxJQUFnQixDQUFDLEtBQUEsR0FBUSxJQUFFLENBQUEsR0FBRyxDQUFDLFdBQUosQ0FBQSxDQUFBLENBQVgsQ0FBQSxJ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

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/todo-show/lib/todo-model.coffee

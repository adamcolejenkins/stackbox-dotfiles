(function() {
  var Dialog, SaveDialog, changeCase, path, projects,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  projects = require('./projects');

  path = require('path');

  changeCase = require('change-case');

  module.exports = SaveDialog = (function(_super) {
    __extends(SaveDialog, _super);

    SaveDialog.prototype.filePath = null;

    function SaveDialog() {
      var firstPath, title;
      firstPath = atom.project.getPaths()[0];
      title = path.basename(firstPath);
      if (atom.config.get('project-manager.prettifyTitle')) {
        title = changeCase.titleCase(title);
      }
      SaveDialog.__super__.constructor.call(this, {
        prompt: 'Enter name of project',
        input: title,
        select: true,
        iconClass: 'icon-arrow-right'
      });
      projects.getCurrent((function(_this) {
        return function(project) {
          if (project.rootPath === firstPath) {
            return _this.showError("This project is already saved as " + project.props.title);
          }
        };
      })(this));
    }

    SaveDialog.prototype.onConfirm = function(title) {
      var properties;
      if (title) {
        properties = {
          title: title,
          paths: atom.project.getPaths()
        };
        projects.addProject(properties);
        return this.close();
      } else {
        return this.showError('You need to specify a name for the project');
      }
    };

    return SaveDialog;

  })(Dialog);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvc2F2ZS1kaWFsb2cuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGFBQVIsQ0FIYixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGlDQUFBLENBQUE7O0FBQUEseUJBQUEsUUFBQSxHQUFVLElBQVYsQ0FBQTs7QUFFYSxJQUFBLG9CQUFBLEdBQUE7QUFDWCxVQUFBLGdCQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQXBDLENBQUE7QUFBQSxNQUNBLEtBQUEsR0FBUSxJQUFJLENBQUMsUUFBTCxDQUFjLFNBQWQsQ0FEUixDQUFBO0FBR0EsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwrQkFBaEIsQ0FBSDtBQUNFLFFBQUEsS0FBQSxHQUFRLFVBQVUsQ0FBQyxTQUFYLENBQXFCLEtBQXJCLENBQVIsQ0FERjtPQUhBO0FBQUEsTUFNQSw0Q0FDRTtBQUFBLFFBQUEsTUFBQSxFQUFRLHVCQUFSO0FBQUEsUUFDQSxLQUFBLEVBQU8sS0FEUDtBQUFBLFFBRUEsTUFBQSxFQUFRLElBRlI7QUFBQSxRQUdBLFNBQUEsRUFBVyxrQkFIWDtPQURGLENBTkEsQ0FBQTtBQUFBLE1BWUEsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxHQUFBO0FBQ2xCLFVBQUEsSUFBRyxPQUFPLENBQUMsUUFBUixLQUFvQixTQUF2QjttQkFDRSxLQUFDLENBQUEsU0FBRCxDQUFZLG1DQUFBLEdBQW1DLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBN0QsRUFERjtXQURrQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBCLENBWkEsQ0FEVztJQUFBLENBRmI7O0FBQUEseUJBb0JBLFNBQUEsR0FBVyxTQUFDLEtBQUQsR0FBQTtBQUNULFVBQUEsVUFBQTtBQUFBLE1BQUEsSUFBRyxLQUFIO0FBQ0UsUUFBQSxVQUFBLEdBQ0U7QUFBQSxVQUFBLEtBQUEsRUFBTyxLQUFQO0FBQUEsVUFDQSxLQUFBLEVBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FEUDtTQURGLENBQUE7QUFBQSxRQUlBLFFBQVEsQ0FBQyxVQUFULENBQW9CLFVBQXBCLENBSkEsQ0FBQTtlQU1BLElBQUMsQ0FBQSxLQUFELENBQUEsRUFQRjtPQUFBLE1BQUE7ZUFTRSxJQUFDLENBQUEsU0FBRCxDQUFXLDRDQUFYLEVBVEY7T0FEUztJQUFBLENBcEJYLENBQUE7O3NCQUFBOztLQUR1QixPQU56QixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ajenkins/.atom/packages/project-manager/lib/save-dialog.coffee

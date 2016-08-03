(function() {
  var Project, db, utils;

  Project = require('../lib/project');

  utils = require('./utils');

  db = require('../lib/db');

  db.updateFilepath(utils.dbPath());

  describe("Project", function() {
    beforeEach(function() {});
    it("recieves default properties", function() {
      var project, properties;
      properties = {
        title: "Test",
        paths: ["/Users/"]
      };
      project = new Project(properties);
      return expect(project.props.icon).toBe('icon-chevron-right');
    });
    it("does not validate without proper properties", function() {
      var project, properties;
      properties = {
        title: "Test"
      };
      project = new Project(properties);
      return expect(project.isValid()).toBe(false);
    });
    it("automatically updates it's properties", function() {
      var project, props;
      props = {
        title: "testAutomaticUpdates",
        paths: ["/Users/test-automatic-updates"]
      };
      project = new Project(props);
      project.save();
      spyOn(project, 'updateProps').andCallThrough();
      expect(project.props.icon).toBe('icon-chevron-right');
      props.icon = 'icon-test';
      db.add(props);
      return project.onUpdate(function() {
        expect(project.updateProps).toHaveBeenCalled();
        return expect(project.props.icon).toBe('icon-test');
      });
    });
    return describe("::save", function() {
      it("does not save if not valid", function() {
        var project;
        project = new Project();
        return expect(project.save()).toBe(false);
      });
      it("only saves settings that isn't default", function() {
        var project, props;
        props = {
          title: 'Test',
          paths: ['/Users/test']
        };
        project = new Project(props);
        return expect(project.getPropsToSave()).toEqual(props);
      });
      it("saves project if _id isn't set", function() {
        var project;
        project = new Project({
          title: 'saveProjectIfIDIsntSet',
          paths: ['/Test/']
        });
        spyOn(db, 'add').andCallThrough();
        spyOn(db, 'update').andCallThrough();
        project.save();
        expect(db.add).toHaveBeenCalled();
        return expect(db.update).not.toHaveBeenCalled();
      });
      return it("updates project if _id is set", function() {
        var props;
        props = {
          title: 'updateProjectIfIDIsSet',
          paths: ['/Test/']
        };
        spyOn(db, 'update').andCallThrough();
        return db.add(props, function(id) {
          var project;
          props._id = id;
          project = new Project(props);
          project.save();
          return expect(db.update).toHaveBeenCalled();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9zcGVjL3Byb2plY3Qtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0JBQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGdCQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQURSLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFdBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsRUFBRSxDQUFDLGNBQUgsQ0FBa0IsS0FBSyxDQUFDLE1BQU4sQ0FBQSxDQUFsQixDQUhBLENBQUE7O0FBQUEsRUFLQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBLEdBQUE7QUFFbEIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFFQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFVBQUEsbUJBQUE7QUFBQSxNQUFBLFVBQUEsR0FDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLE1BQVA7QUFBQSxRQUNBLEtBQUEsRUFBTyxDQUFDLFNBQUQsQ0FEUDtPQURGLENBQUE7QUFBQSxNQUdBLE9BQUEsR0FBYyxJQUFBLE9BQUEsQ0FBUSxVQUFSLENBSGQsQ0FBQTthQUtBLE1BQUEsQ0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQXJCLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0Msb0JBQWhDLEVBTmdDO0lBQUEsQ0FBbEMsQ0FGQSxDQUFBO0FBQUEsSUFVQSxFQUFBLENBQUcsNkNBQUgsRUFBa0QsU0FBQSxHQUFBO0FBQ2hELFVBQUEsbUJBQUE7QUFBQSxNQUFBLFVBQUEsR0FDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLE1BQVA7T0FE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

//# sourceURL=/Users/ajenkins/.atom/packages/project-manager/spec/project-spec.coffee

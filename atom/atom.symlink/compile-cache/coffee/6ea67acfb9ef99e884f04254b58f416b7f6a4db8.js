(function() {
  var db, os, projects, utils;

  os = require('os');

  utils = require('./utils');

  db = require('../lib/db');

  db.updateFilepath(utils.dbPath());

  projects = {
    testproject1: {
      title: "Test project 1",
      group: "Test",
      paths: ["/Users/project-1"]
    },
    testproject2: {
      _id: 'testproject2',
      title: "Test project 2",
      paths: ["/Users/project-2"]
    }
  };

  db.writeFile(projects);

  describe("DB", function() {
    describe("::addUpdater", function() {
      it("finds project from path", function() {
        var query;
        query = {
          key: 'paths',
          value: projects.testproject2.paths
        };
        db.addUpdater('noIdMatchButPathMatch', query, (function(_this) {
          return function(props) {
            return expect(props._id).toBe('testproject2');
          };
        })(this));
        return db.emitter.emit('db-updated');
      });
      it("finds project from title", function() {
        var query;
        query = {
          key: 'title',
          value: 'Test project 1'
        };
        db.addUpdater('noIdMatchButTitleMatch', query, (function(_this) {
          return function(props) {
            return expect(props.title).toBe(query.value);
          };
        })(this));
        return db.emitter.emit('db-updated');
      });
      it("finds project from id", function() {
        var query;
        query = {
          key: '_id',
          value: 'testproject1'
        };
        db.addUpdater('shouldIdMatchButNotOnThis', query, (function(_this) {
          return function(props) {
            return expect(props._id).toBe(query.value);
          };
        })(this));
        return db.emitter.emit('db-updated');
      });
      return it("finds nothing if query is wrong", function() {
        var haveBeenChanged, query;
        query = {
          key: '_id',
          value: 'IHaveNoID'
        };
        haveBeenChanged = false;
        db.addUpdater('noIdMatch', query, (function(_this) {
          return function(props) {
            return haveBeenChanged = true;
          };
        })(this));
        db.emitter.emit('db-updated');
        return expect(haveBeenChanged).toBe(false);
      });
    });
    it("can add a project", function() {
      var newProject;
      newProject = {
        title: "New Project",
        paths: ["/Users/new-project"]
      };
      return db.add(newProject, function(id) {
        expect(id).toBe('newproject');
        return db.find(function(projects) {
          var found, project, _i, _len;
          found = false;
          for (_i = 0, _len = projects.length; _i < _len; _i++) {
            project = projects[_i];
            if (project._id = 'newproject') {
              found = true;
            }
          }
          return expect(found).toBe(true);
        });
      });
    });
    return it("can remove a project", function() {
      return db["delete"]("testproject1", function() {
        return db.find(function(projects) {
          return expect(projects.length).toBe(1);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9zcGVjL2RiLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVCQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQURSLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFdBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsRUFBRSxDQUFDLGNBQUgsQ0FBa0IsS0FBSyxDQUFDLE1BQU4sQ0FBQSxDQUFsQixDQUhBLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLFlBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLGdCQUFQO0FBQUEsTUFDQSxLQUFBLEVBQU8sTUFEUDtBQUFBLE1BRUEsS0FBQSxFQUFPLENBQ0wsa0JBREssQ0FGUDtLQURGO0FBQUEsSUFNQSxZQUFBLEVBQ0U7QUFBQSxNQUFBLEdBQUEsRUFBSyxjQUFMO0FBQUEsTUFDQSxLQUFBLEVBQU8sZ0JBRFA7QUFBQSxNQUVBLEtBQUEsRUFBTyxDQUNMLGtCQURLLENBRlA7S0FQRjtHQUxGLENBQUE7O0FBQUEsRUFrQkEsRUFBRSxDQUFDLFNBQUgsQ0FBYSxRQUFiLENBbEJBLENBQUE7O0FBQUEsRUFvQkEsUUFBQSxDQUFTLElBQVQsRUFBZSxTQUFBLEdBQUE7QUFDYixJQUFBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixNQUFBLEVBQUEsQ0FBRyx5QkFBSCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsWUFBQSxLQUFBO0FBQUEsUUFBQSxLQUFBLEdBQ0U7QUFBQSxVQUFBLEdBQUEsRUFBSyxPQUFMO0FBQUEsVUFD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

//# sourceURL=/Users/ajenkins/.atom/packages/project-manager/spec/db-spec.coffee

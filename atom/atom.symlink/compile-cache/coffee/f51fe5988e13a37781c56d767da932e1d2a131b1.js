(function() {
  var Settings;

  Settings = require('../lib/settings');

  describe("Settings", function() {
    describe(".load(settings)", function() {
      it("Loads the settings provided if they are flat", function() {
        var settings;
        settings = new Settings();
        settings.load({
          "foo.bar.baz": 42
        });
        return expect(atom.config.get("foo.bar.baz")).toBe(42);
      });
      return it("Loads the settings provided if they are an object", function() {
        var settings;
        settings = new Settings();
        expect(atom.config.get('foo.bar.baz')).toBe(void 0);
        settings.load({
          foo: {
            bar: {
              baz: 42
            }
          }
        });
        return expect(atom.config.get('foo.bar.baz')).toBe(42);
      });
    });
    return describe(".load(settings) with a 'scope' option", function() {
      return it("Loads the settings for the scope", function() {
        var scopedSettings, settings;
        settings = new Settings();
        scopedSettings = {
          "*": {
            "foo.bar.baz": 42
          },
          ".source.coffee": {
            "foo.bar.baz": 84
          }
        };
        settings.load(scopedSettings);
        expect(atom.config.get("foo.bar.baz")).toBe(42);
        expect(atom.config.get("foo.bar.baz", {
          scope: [".source.coffee"]
        })).toBe(84);
        return expect(atom.config.get("foo.bar.baz", {
          scope: [".text"]
        })).toBe(42);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9zcGVjL3NldHRpbmdzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGlCQUFSLENBQVgsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUVuQixJQUFBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsTUFBQSxFQUFBLENBQUcsOENBQUgsRUFBbUQsU0FBQSxHQUFBO0FBQ2pELFlBQUEsUUFBQTtBQUFBLFFBQUEsUUFBQSxHQUFlLElBQUEsUUFBQSxDQUFBLENBQWYsQ0FBQTtBQUFBLFFBQ0EsUUFBUSxDQUFDLElBQVQsQ0FBYztBQUFBLFVBQUMsYUFBQSxFQUFlLEVBQWhCO1NBQWQsQ0FEQSxDQUFBO2VBR0EsTUFBQSxDQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixhQUFoQixDQUFQLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsRUFBNUMsRUFKaUQ7TUFBQSxDQUFuRCxDQUFBLENBQUE7YUFNQSxFQUFBLENBQUcsbURBQUgsRUFBd0QsU0FBQSxHQUFBO0FBQ3RELFlBQUEsUUFBQTtBQUFBLFFBQUEsUUFBQSxHQUFlLElBQUEsUUFBQSxDQUFBLENBQWYsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixhQUFoQixDQUFQLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsTUFBNUMsQ0FEQSxDQUFBO0FBQUEsUUFFQSxRQUFRLENBQUMsSUFBVCxDQUFjO0FBQUEsVUFDWixHQUFBLEVBQ0U7QUFBQSxZQUFBLEdBQUEsRUFDRTtBQUFBLGNBQUEsR0FBQSxFQUFLLEVBQUw7YUFERjtXQUZVO1NBQWQsQ0FGQSxDQUFBO2VBT0EsTUFBQSxDQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixhQUFoQixDQUFQLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsRUFBNUMsRUFSc0Q7TUFBQSxDQUF4RCxFQVAwQjtJQUFBLENBQTVCLENBQUEsQ0FBQTtXQWlCQSxRQUFBLENBQVMsdUNBQVQsRUFBa0QsU0FBQSxHQUFBO2FBQ2hELEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBLEdBQUE7QUFDckMsWUFBQSx3QkFBQTtBQUFBLFFBQUEsUUFBQSxHQUFlLElBQUEsUUFBQSxDQUFBLENBQWYsQ0FBQTtBQUFBLFFBQ0EsY0FBQSxHQUNFO0FBQUEsVUFBQSxHQUFBLEVBQ0U7QUFBQSxZQUFBLGFBQUEsRUFBZSxFQUFmO1dBREY7QUFBQSxVQUVBLGdCQUFBLEVBQ0U7QUFBQSxZQUFBLGFBQUEsRUFBZSxFQUFmO1dBSEY7U0FGRixDQUFBO0FBQUEsUUFNQSxRQUFRLENBQUMsSUFBVCxDQUFjLGNBQWQsQ0FOQSxDQUFBO0FBQUEsUUFRQSxNQUFBLENBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGFBQWhCLENBQVAsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxFQUE1QyxDQVJBLENBQUE7QUFBQSxRQVNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsYUFBaEIsRUFBK0I7QUFBQSxVQUFDLEtBQUEsRUFBTSxDQUFDLGdCQUFELENBQVA7U0FBL0IsQ0FBUCxDQUFrRSxDQUFDLElBQW5FLENBQXdFLEVBQXhFLENBVEEsQ0FBQTtlQVVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsYUFBaEIsRUFBK0I7QUFBQSxVQUFDLEtBQUEsRUFBTSxDQUFDLE9BQUQsQ0FBUDtTQUEvQixDQUFQLENBQXlELENBQUMsSUFBMUQsQ0FBK0QsRUFBL0QsRUFYcUM7TUFBQSxDQUF2QyxFQURnRDtJQUFBLENBQWxELEVBbkJtQjtFQUFBLENBQXJCLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.atom/packages/project-manager/spec/settings-spec.coffee

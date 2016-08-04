(function() {
  var originalPackageConfig;

  originalPackageConfig = atom.config.get('auto-update-packages');

  window.restoreEnvironment = function() {
    return atom.config.set('auto-update-packages', originalPackageConfig);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F1dG8tdXBkYXRlLXBhY2thZ2VzL3NwZWMvc3BlYy1oZWxwZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFCQUFBOztBQUFBLEVBQUEscUJBQUEsR0FBd0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFoQixDQUF4QixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLGtCQUFQLEdBQTRCLFNBQUEsR0FBQTtXQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLHFCQUF4QyxFQUQwQjtFQUFBLENBRjVCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ajenkins/.atom/packages/auto-update-packages/spec/spec-helper.coffee

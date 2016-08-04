(function() {
  var DefaultFileIcons, FileIcons;

  DefaultFileIcons = require('./default-file-icons');

  FileIcons = (function() {
    function FileIcons() {
      this.service = new DefaultFileIcons;
    }

    FileIcons.prototype.getService = function() {
      return this.service;
    };

    FileIcons.prototype.resetService = function() {
      return this.service = new DefaultFileIcons;
    };

    FileIcons.prototype.setService = function(service) {
      this.service = service;
    };

    return FileIcons;

  })();

  module.exports = new FileIcons;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9saWIvZmlsZS1pY29ucy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkJBQUE7O0FBQUEsRUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsc0JBQVIsQ0FBbkIsQ0FBQTs7QUFBQSxFQUVNO0FBQ1MsSUFBQSxtQkFBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxnQkFBWCxDQURXO0lBQUEsQ0FBYjs7QUFBQSx3QkFHQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLFFBRFM7SUFBQSxDQUhaLENBQUE7O0FBQUEsd0JBTUEsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUNaLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLGlCQURDO0lBQUEsQ0FOZCxDQUFBOztBQUFBLHdCQVNBLFVBQUEsR0FBWSxTQUFFLE9BQUYsR0FBQTtBQUFZLE1BQVgsSUFBQyxDQUFBLFVBQUEsT0FBVSxDQUFaO0lBQUEsQ0FUWixDQUFBOztxQkFBQTs7TUFIRixDQUFBOztBQUFBLEVBY0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsR0FBQSxDQUFBLFNBZGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ajenkins/.atom/packages/fuzzy-finder/lib/file-icons.coffee

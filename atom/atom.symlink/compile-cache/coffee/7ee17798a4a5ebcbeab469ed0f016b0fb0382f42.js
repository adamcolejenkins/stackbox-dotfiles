(function() {
  var Beautifiers, Handlebars, beautifier, beautifierName, beautifierOptions, beautifiers, context, exampleConfig, fs, languageOptions, linkifyTitle, lo, optionDef, optionGroup, optionGroupTemplate, optionGroupTemplatePath, optionName, optionTemplate, optionTemplatePath, optionsPath, optionsTemplate, optionsTemplatePath, packageOptions, result, sortKeysBy, sortSettings, template, _, _i, _len, _ref, _ref1;

  Handlebars = require('handlebars');

  Beautifiers = require("../src/beautifiers");

  fs = require('fs');

  _ = require('lodash');

  console.log('Generating options...');

  beautifier = new Beautifiers();

  languageOptions = beautifier.options;

  packageOptions = require('../src/config.coffee');

  beautifierOptions = {};

  for (lo in languageOptions) {
    optionGroup = languageOptions[lo];
    _ref = optionGroup.properties;
    for (optionName in _ref) {
      optionDef = _ref[optionName];
      beautifiers = (_ref1 = optionDef.beautifiers) != null ? _ref1 : [];
      for (_i = 0, _len = beautifiers.length; _i < _len; _i++) {
        beautifierName = beautifiers[_i];
        if (beautifierOptions[beautifierName] == null) {
          beautifierOptions[beautifierName] = {};
        }
        beautifierOptions[beautifierName][optionName] = optionDef;
      }
    }
  }

  console.log('Loading options template...');

  optionsTemplatePath = __dirname + '/options-template.md';

  optionTemplatePath = __dirname + '/option-template.md';

  optionGroupTemplatePath = __dirname + '/option-group-template.md';

  optionsPath = __dirname + '/options.md';

  optionsTemplate = fs.readFileSync(optionsTemplatePath).toString();

  optionGroupTemplate = fs.readFileSync(optionGroupTemplatePath).toString();

  optionTemplate = fs.readFileSync(optionTemplatePath).toString();

  console.log('Building documentation from template and options...');

  Handlebars.registerPartial('option', optionTemplate);

  Handlebars.registerPartial('option-group', optionGroupTemplate);

  template = Handlebars.compile(optionsTemplate);

  linkifyTitle = function(title) {
    var p, sep;
    title = title.toLowerCase();
    p = title.split(/[\s,+#;,\/?:@&=+$]+/);
    sep = "-";
    return p.join(sep);
  };

  Handlebars.registerHelper('linkify', function(title, options) {
    return new Handlebars.SafeString("[" + (options.fn(this)) + "](\#" + (linkifyTitle(title)) + ")");
  });

  exampleConfig = function(option) {
    var c, d, json, k, namespace, t;
    t = option.type;
    d = (function() {
      switch (false) {
        case option["default"] == null:
          return option["default"];
        case t !== "string":
          return "";
        case t !== "integer":
          return 0;
        case t !== "boolean":
          return false;
        default:
          return null;
      }
    })();
    json = {};
    namespace = option.language.namespace;
    k = option.key;
    c = {};
    c[k] = d;
    json[namespace] = c;
    return "```json\n" + (JSON.stringify(json, void 0, 4)) + "\n```";
  };

  Handlebars.registerHelper('example-config', function(key, option, options) {
    var results;
    results = exampleConfig(key, option);
    return new Handlebars.SafeString(results);
  });

  sortKeysBy = function(obj, comparator) {
    var keys;
    keys = _.sortBy(_.keys(obj), function(key) {
      if (comparator) {
        return comparator(obj[key], key);
      } else {
        return key;
      }
    });
    return _.zipObject(keys, _.map(keys, function(key) {
      return obj[key];
    }));
  };

  sortSettings = function(settings) {
    var r;
    r = _.mapValues(settings, function(op) {
      if (op.type === "object" && op.properties) {
        op.properties = sortSettings(op.properties);
      }
      return op;
    });
    r = sortKeysBy(sortKeysBy(r), function(op) {
      return op.order;
    });
    return r;
  };

  context = {
    packageOptions: sortSettings(packageOptions),
    languageOptions: sortSettings(languageOptions),
    beautifierOptions: sortSettings(beautifierOptions)
  };

  result = template(context);

  console.log('Writing documentation to file...');

  fs.writeFileSync(optionsPath, result);

  console.log('Done.');

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvZG9jcy9pbmRleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFHQTtBQUFBLE1BQUEsaVpBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FBYixDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxvQkFBUixDQURkLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBSEosQ0FBQTs7QUFBQSxFQUtBLE9BQU8sQ0FBQyxHQUFSLENBQVksdUJBQVosQ0FMQSxDQUFBOztBQUFBLEVBTUEsVUFBQSxHQUFpQixJQUFBLFdBQUEsQ0FBQSxDQU5qQixDQUFBOztBQUFBLEVBT0EsZUFBQSxHQUFrQixVQUFVLENBQUMsT0FQN0IsQ0FBQTs7QUFBQSxFQVFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHNCQUFSLENBUmpCLENBQUE7O0FBQUEsRUFVQSxpQkFBQSxHQUFvQixFQVZwQixDQUFBOztBQVdBLE9BQUEscUJBQUE7c0NBQUE7QUFDRTtBQUFBLFNBQUEsa0JBQUE7bUNBQUE7QUFDRSxNQUFBLFdBQUEscURBQXNDLEVBQXRDLENBQUE7QUFDQSxXQUFBLGtEQUFBO3lDQUFBOztVQUNFLGlCQUFrQixDQUFBLGNBQUEsSUFBbUI7U0FBckM7QUFBQSxRQUNBLGlCQUFrQixDQUFBLGNBQUEsQ0FBZ0IsQ0FBQSxVQUFBLENBQWxDLEdBQWdELFNBRGhELENBREY7QUFBQSxPQUZGO0FBQUEsS0FERjtBQUFBLEdBWEE7O0FBQUEsRUFrQkEsT0FBTyxDQUFDLEdBQVIsQ0FBWSw2QkFBWixDQWxCQSxDQUFBOztBQUFBLEVBbUJBLG1CQUFBLEdBQXNCLFNBQUEsR0FBWSxzQkFuQmxDLENBQUE7O0FBQUEsRUFvQkEsa0JBQUEsR0FBcUIsU0FBQSxHQUFZLHFCQXBCakMsQ0FBQTs7QUFBQSxFQXFCQSx1QkFBQSxHQUEwQixTQUFBLEdBQVksMkJBckJ0QyxDQUFBOztBQUFBLEVBc0JBLFdBQUEsR0FBYyxTQUFBLEdBQVksYUF0QjFCLENBQUE7O0FBQUEsRUF1QkEsZUFBQSxHQUFrQixFQUFFLENBQUMsWUFBSCxDQUFnQixtQkFBaEIsQ0FBb0MsQ0FBQyxRQUFyQyxDQUFBLENBdkJsQixDQUFBOztBQUFBLEVBd0JBLG1CQUFBLEdBQXNCLEVBQUUsQ0FBQyxZQUFILENBQWdCLHVCQUFoQixDQUF3QyxDQUFDLFFBQXpDLENBQUEsQ0F4QnRCLENBQUE7O0FBQUEsRUF5QkEsY0FBQSxHQUFpQixFQUFFLENBQUMsWUFBSCxDQUFnQixrQkFBaEIsQ0FBbUMsQ0FBQyxRQUFwQyxDQUFBLENBekJqQixDQUFBOztBQUFBLEVBMkJBLE9BQU8sQ0FBQyxHQUFSLENBQVkscURBQVosQ0EzQkEsQ0FBQTs7QUFBQSxFQTRCQSxVQUFVLENBQUMsZUFBWCxDQUEyQixRQUEzQixFQUFxQyxjQUFyQyxDQTVCQSxDQUFBOztBQUFBLEVBNkJBLFVBQVUsQ0FBQyxlQUFYLENBQTJCLGNBQTNCLEVBQTJDLG1CQUEzQyxDQTdCQSxDQUFBOztBQUFBLEVBOEJBLFFBQUEsR0FBVyxVQUFVLENBQUMsT0FBWCxDQUFtQixlQUFuQixDQTlCWCxDQUFBOztBQUFBLEVBZ0NBLFlBQUEsR0FBZSxTQUFDLEtBQUQsR0FBQTtBQUNiLFFBQUEsTUFBQTtBQUFBLElBQUEsS0FBQSxHQUFRLEtBQUssQ0FBQyxXQUFOLENBQUEsQ0FBUixDQUFBO0FBQUEsSUFDQSxDQUFBLEdBQUksS0FBSyxDQUFDLEtBQU4sQ0FBWSxxQkFBWixDQURKLENBQUE7QUFBQSxJQUVBLEdBQUEsR0FBTSxHQUZOLENBQUE7V0FHQSxDQUFDLENBQUMsSUFBRixDQUFPLEdBQVAsRUFKYTtFQUFBLENBaENmLENBQUE7O0FBQUEsRUFzQ0EsVUFBVSxDQUFDLGNBQVgsQ0FBMEIsU0FBMUIsRUFBcUMsU0FBQyxLQUFELEVBQVEsT0FBUixHQUFBO0FBQ25DLFdBQVcsSUFBQSxVQUFVLENBQUMsVUFBWCxDQUNSLEdBQUEsR0FBRSxDQUFDLE9BQU8sQ0FBQyxFQUFSLENBQVcsSUFBWCxDQUFELENBQUYsR0FBb0IsTUFBcEIsR0FBeUIsQ0FBQyxZQUFBLENBQWEsS0FBYixDQUFELENBQXpCLEdBQThDLEdBRHRDLENBQVgsQ0FEbUM7RUFBQSxDQUFyQyxDQXRDQSxDQUFBOztBQUFBLEVBNENBLGFBQUEsR0FBZ0IsU0FBQyxNQUFELEdBQUE7QUFFZCxRQUFBLDJCQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUksTUFBTSxDQUFDLElBQVgsQ0FBQTtBQUFBLElBQ0EsQ0FBQTtBQUFJLGNBQUEsS0FBQTtBQUFBLGFBQ0cseUJBREg7aUJBQ3dCLE1BQU0sQ0FBQyxTQUFELEVBRDlCO0FBQUEsYUFFRyxDQUFBLEtBQUssUUFGUjtpQkFFc0IsR0FGdEI7QUFBQSxhQUdHLENBQUEsS0FBSyxTQUhSO2lCQUd1QixFQUh2QjtBQUFBLGFBSUcsQ0FBQSxLQUFLLFNBSlI7aUJBSXVCLE1BSnZCO0FBQUE7aUJBS0csS0FMSDtBQUFBO1FBREosQ0FBQTtBQUFBLElBUUEsSUFBQSxHQUFPLEVBUlAsQ0FBQTtBQUFBLElBU0EsU0FBQSxHQUFZLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FUNUIsQ0FBQTtBQUFBLElBVUEsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxHQVZYLENBQUE7QUFBQSxJQVdBLENBQUEsR0FBSSxFQVhKLENBQUE7QUFBQSxJQVlBLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTyxDQVpQLENBQUE7QUFBQSxJQWFBLElBQUssQ0FBQSxTQUFBLENBQUwsR0FBa0IsQ0FibEIsQ0FBQTtBQWNBLFdBQVUsV0FBQSxHQUNYLENBQUMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFmLEVBQXFCLE1BQXJCLEVBQWdDLENBQWhDLENBQUQsQ0FEVyxHQUN5QixPQURuQyxDQWhCYztFQUFBLENBNUNoQixDQUFBOztBQUFBLEVBZ0VBLFVBQVUsQ0FBQyxjQUFYLENBQTBCLGdCQUExQixFQUE0QyxTQUFDLEdBQUQsRUFBTSxNQUFOLEVBQWMsT0FBZCxHQUFBO0FBQzFDLFFBQUEsT0FBQTtBQUFBLElBQUEsT0FBQSxHQUFVLGFBQUEsQ0FBYyxHQUFkLEVBQW1CLE1BQW5CLENBQVYsQ0FBQTtBQUVBLFdBQVcsSUFBQSxVQUFVLENBQUMsVUFBWCxDQUFzQixPQUF0QixDQUFYLENBSDBDO0VBQUEsQ0FBNUMsQ0FoRUEsQ0FBQTs7QUFBQSxFQXNFQSxVQUFBLEdBQWEsU0FBQyxHQUFELEVBQU0sVUFBTixHQUFBO0FBQ1gsUUFBQSxJQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxDQUFDLENBQUMsSUFBRixDQUFPLEdBQVAsQ0FBVCxFQUFzQixTQUFDLEdBQUQsR0FBQTtBQUNwQixNQUFBLElBQUcsVUFBSDtlQUFtQixVQUFBLENBQVcsR0FBSSxDQUFBLEdBQUEsQ0FBZixFQUFxQixHQUFyQixFQUFuQjtPQUFBLE1BQUE7ZUFBa0QsSUFBbEQ7T0FEb0I7SUFBQSxDQUF0QixDQUFQLENBQUE7QUFHQSxXQUFPLENBQUMsQ0FBQyxTQUFGLENBQVksSUFBWixFQUFrQixDQUFDLENBQUMsR0FBRixDQUFNLElBQU4sRUFBWSxTQUFDLEdBQUQsR0FBQTtBQUNuQyxhQUFPLEdBQUksQ0FBQSxHQUFBLENBQVgsQ0FEbUM7SUFBQSxDQUFaLENBQWxCLENBQVAsQ0FKVztFQUFBLENBdEViLENBQUE7O0FBQUEsRUE4RUEsWUFBQSxHQUFlLFNBQUMsUUFBRCxHQUFBO0FBRWIsUUFBQSxDQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUksQ0FBQyxDQUFDLFNBQUYsQ0FBWSxRQUFaLEVBQXNCLFNBQUMsRUFBRCxHQUFBO0FBQ3hCLE1BQUEsSUFBRyxFQUFFLENBQUMsSUFBSCxLQUFXLFFBQVgsSUFBd0IsRUFBRSxDQUFDLFVBQTlCO0FBQ0UsUUFBQSxFQUFFLENBQUMsVUFBSCxHQUFnQixZQUFBLENBQWEsRUFBRSxDQUFDLFVBQWhCLENBQWhCLENBREY7T0FBQTtBQUVBLGFBQU8sRUFBUCxDQUh3QjtJQUFBLENBQXRCLENBQUosQ0FBQTtBQUFBLElBTUEsQ0FBQSxHQUFJLFVBQUEsQ0FBVyxVQUFBLENBQVcsQ0FBWCxDQUFYLEVBQTBCLFNBQUMsRUFBRCxHQUFBO2FBQVEsRUFBRSxDQUFDLE1BQVg7SUFBQSxDQUExQixDQU5KLENBQUE7QUFTQSxXQUFPLENBQVAsQ0FYYTtFQUFBLENBOUVmLENBQUE7O0FBQUEsRUEyRkEsT0FBQSxHQUFVO0FBQUEsSUFDUixjQUFBLEVBQWdCLFlBQUEsQ0FBYSxjQUFiLENBRFI7QUFBQSxJQUVSLGVBQUEsRUFBaUIsWUFBQSxDQUFhLGVBQWIsQ0FGVDtBQUFBLElBR1IsaUJBQUEsRUFBbUIsWUFBQSxDQUFhLGlCQUFiLENBSFg7R0EzRlYsQ0FBQTs7QUFBQSxFQWdHQSxNQUFBLEdBQVMsUUFBQSxDQUFTLE9BQVQsQ0FoR1QsQ0FBQTs7QUFBQSxFQWtHQSxPQUFPLENBQUMsR0FBUixDQUFZLGtDQUFaLENBbEdBLENBQUE7O0FBQUEsRUFtR0EsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsV0FBakIsRUFBOEIsTUFBOUIsQ0FuR0EsQ0FBQTs7QUFBQSxFQXFHQSxPQUFPLENBQUMsR0FBUixDQUFZLE9BQVosQ0FyR0EsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ajenkins/.atom/packages/atom-beautify/docs/index.coffee

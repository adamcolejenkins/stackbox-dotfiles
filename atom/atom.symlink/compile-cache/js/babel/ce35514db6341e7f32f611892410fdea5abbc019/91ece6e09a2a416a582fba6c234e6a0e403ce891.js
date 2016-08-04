function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libLanguagesJavascript = require('../lib/languages/javascript');

var _libLanguagesJavascript2 = _interopRequireDefault(_libLanguagesJavascript);

var _libLanguagesCpp = require('../lib/languages/cpp');

var _libLanguagesCpp2 = _interopRequireDefault(_libLanguagesCpp);

var _libLanguagesRust = require('../lib/languages/rust');

var _libLanguagesRust2 = _interopRequireDefault(_libLanguagesRust);

var _libLanguagesPhp = require('../lib/languages/php');

var _libLanguagesPhp2 = _interopRequireDefault(_libLanguagesPhp);

var _libLanguagesCoffee = require('../lib/languages/coffee');

var _libLanguagesCoffee2 = _interopRequireDefault(_libLanguagesCoffee);

var _libLanguagesActionscript = require('../lib/languages/actionscript');

var _libLanguagesActionscript2 = _interopRequireDefault(_libLanguagesActionscript);

var _libLanguagesObjc = require('../lib/languages/objc');

var _libLanguagesObjc2 = _interopRequireDefault(_libLanguagesObjc);

var _libLanguagesJava = require('../lib/languages/java');

var _libLanguagesJava2 = _interopRequireDefault(_libLanguagesJava);

var _libLanguagesTypescript = require('../lib/languages/typescript');

var _libLanguagesTypescript2 = _interopRequireDefault(_libLanguagesTypescript);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

// Hack to let us call parsers by filename
"use babel";

var parsers = {
    JsParser: _libLanguagesJavascript2['default'],
    CppParser: _libLanguagesCpp2['default'],
    RustParser: _libLanguagesRust2['default'],
    PhpParser: _libLanguagesPhp2['default'],
    CoffeeParser: _libLanguagesCoffee2['default'],
    ActionscriptParser: _libLanguagesActionscript2['default'],
    ObjCParser: _libLanguagesObjc2['default'],
    JavaParser: _libLanguagesJava2['default'],
    TypescriptParser: _libLanguagesTypescript2['default']
};

var filepath = _path2['default'].resolve(_path2['default'].join(__dirname, 'dataset/languages'));
var files = _fs2['default'].readdirSync(filepath);

var _loop = function (_name) {
    var file_name = "Parser_" + _name.split('.')[0];
    describe(file_name, function () {
        var parser = undefined;
        var dataset = _jsYaml2['default'].load(_fs2['default'].readFileSync(_path2['default'].join(filepath, _name), 'utf8'));
        var parser_name = dataset['name'];
        delete dataset['name'];

        beforeEach(function () {
            return atom.packages.activatePackage('docblockr').then(function () {
                parser = new parsers[parser_name](atom.config.get('docblockr'));
            });
        });

        var _loop2 = function (key) {
            describe(key, function () {
                dataset[key].forEach(function (data) {
                    it(data[0], function () {
                        var out = parser[key](data[1]);
                        expect(out).to.deep.equal(data[2]);
                    });
                });
            });
        };

        for (var key in dataset) {
            _loop2(key);
        }
    });
};

for (var _name of files) {
    _loop(_name);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2RvY2Jsb2Nrci9zcGVjL2xhbmd1YWdlLnNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7c0NBRXFCLDZCQUE2Qjs7OzsrQkFDNUIsc0JBQXNCOzs7O2dDQUNyQix1QkFBdUI7Ozs7K0JBQ3hCLHNCQUFzQjs7OztrQ0FDbkIseUJBQXlCOzs7O3dDQUNuQiwrQkFBK0I7Ozs7Z0NBQ3ZDLHVCQUF1Qjs7OztnQ0FDdkIsdUJBQXVCOzs7O3NDQUNqQiw2QkFBNkI7Ozs7a0JBRTNDLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztzQkFDTixTQUFTOzs7OztBQWQxQixXQUFXLENBQUE7O0FBaUJYLElBQUksT0FBTyxHQUFHO0FBQ1YsWUFBUSxxQ0FBQTtBQUNSLGFBQVMsOEJBQUE7QUFDVCxjQUFVLCtCQUFBO0FBQ1YsYUFBUyw4QkFBQTtBQUNULGdCQUFZLGlDQUFBO0FBQ1osc0JBQWtCLHVDQUFBO0FBQ2xCLGNBQVUsK0JBQUE7QUFDVixjQUFVLCtCQUFBO0FBQ1Ysb0JBQWdCLHFDQUFBO0NBQ25CLENBQUM7O0FBRUYsSUFBSSxRQUFRLEdBQUcsa0JBQUssT0FBTyxDQUFDLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0FBQ3ZFLElBQUksS0FBSyxHQUFHLGdCQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7c0JBRTVCLEtBQUk7QUFDVCxRQUFJLFNBQVMsR0FBRyxTQUFTLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQyxZQUFRLENBQUMsU0FBUyxFQUFFLFlBQU07QUFDdEIsWUFBSSxNQUFNLFlBQUEsQ0FBQztBQUNYLFlBQUksT0FBTyxHQUFHLG9CQUFLLElBQUksQ0FBQyxnQkFBRyxZQUFZLENBQUMsa0JBQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzVFLFlBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNsQyxlQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFdkIsa0JBQVUsQ0FBQyxZQUFNO0FBQ2IsbUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQzVDLElBQUksQ0FBQyxZQUFNO0FBQ1Isc0JBQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2FBQ25FLENBQUMsQ0FBQztTQUNWLENBQUMsQ0FBQzs7K0JBRUssR0FBRztBQUNQLG9CQUFRLENBQUMsR0FBRyxFQUFFLFlBQU07QUFDaEIsdUJBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDM0Isc0JBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBTTtBQUNkLDRCQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakMsOEJBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdEMsQ0FBQyxDQUFDO2lCQUNOLENBQUMsQ0FBQzthQUNOLENBQUMsQ0FBQzs7O0FBUlAsYUFBSSxJQUFJLEdBQUcsSUFBSSxPQUFPLEVBQUU7bUJBQWhCLEdBQUc7U0FTVjtLQUNKLENBQUMsQ0FBQzs7O0FBekJQLEtBQUssSUFBSSxLQUFJLElBQUksS0FBSyxFQUFFO1VBQWYsS0FBSTtDQTBCWiIsImZpbGUiOiIvVXNlcnMvYWplbmtpbnMvLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9kb2NibG9ja3Ivc3BlYy9sYW5ndWFnZS5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIlxuXG5pbXBvcnQgSnNQYXJzZXIgZnJvbSAnLi4vbGliL2xhbmd1YWdlcy9qYXZhc2NyaXB0JztcbmltcG9ydCBDcHBQYXJzZXIgZnJvbSAnLi4vbGliL2xhbmd1YWdlcy9jcHAnO1xuaW1wb3J0IFJ1c3RQYXJzZXIgZnJvbSAnLi4vbGliL2xhbmd1YWdlcy9ydXN0JztcbmltcG9ydCBQaHBQYXJzZXIgZnJvbSAnLi4vbGliL2xhbmd1YWdlcy9waHAnO1xuaW1wb3J0IENvZmZlZVBhcnNlciBmcm9tICcuLi9saWIvbGFuZ3VhZ2VzL2NvZmZlZSc7XG5pbXBvcnQgQWN0aW9uc2NyaXB0UGFyc2VyIGZyb20gJy4uL2xpYi9sYW5ndWFnZXMvYWN0aW9uc2NyaXB0JztcbmltcG9ydCBPYmpDUGFyc2VyIGZyb20gJy4uL2xpYi9sYW5ndWFnZXMvb2JqYyc7XG5pbXBvcnQgSmF2YVBhcnNlciBmcm9tICcuLi9saWIvbGFuZ3VhZ2VzL2phdmEnO1xuaW1wb3J0IFR5cGVzY3JpcHRQYXJzZXIgZnJvbSAnLi4vbGliL2xhbmd1YWdlcy90eXBlc2NyaXB0JztcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHlhbWwgZnJvbSAnanMteWFtbCc7XG5cbi8vIEhhY2sgdG8gbGV0IHVzIGNhbGwgcGFyc2VycyBieSBmaWxlbmFtZVxubGV0IHBhcnNlcnMgPSB7XG4gICAgSnNQYXJzZXIsXG4gICAgQ3BwUGFyc2VyLFxuICAgIFJ1c3RQYXJzZXIsXG4gICAgUGhwUGFyc2VyLFxuICAgIENvZmZlZVBhcnNlcixcbiAgICBBY3Rpb25zY3JpcHRQYXJzZXIsXG4gICAgT2JqQ1BhcnNlcixcbiAgICBKYXZhUGFyc2VyLFxuICAgIFR5cGVzY3JpcHRQYXJzZXIsXG59O1xuXG52YXIgZmlsZXBhdGggPSBwYXRoLnJlc29sdmUocGF0aC5qb2luKF9fZGlybmFtZSwgJ2RhdGFzZXQvbGFuZ3VhZ2VzJykpO1xudmFyIGZpbGVzID0gZnMucmVhZGRpclN5bmMoZmlsZXBhdGgpO1xuXG5mb3IgKGxldCBuYW1lIG9mIGZpbGVzKSB7XG4gICAgbGV0IGZpbGVfbmFtZSA9IFwiUGFyc2VyX1wiICsgbmFtZS5zcGxpdCgnLicpWzBdO1xuICAgIGRlc2NyaWJlKGZpbGVfbmFtZSwgKCkgPT4ge1xuICAgICAgICBsZXQgcGFyc2VyO1xuICAgICAgICBsZXQgZGF0YXNldCA9IHlhbWwubG9hZChmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKGZpbGVwYXRoLCBuYW1lKSwgJ3V0ZjgnKSk7XG4gICAgICAgIGxldCBwYXJzZXJfbmFtZSA9IGRhdGFzZXRbJ25hbWUnXTtcbiAgICAgICAgZGVsZXRlIGRhdGFzZXRbJ25hbWUnXTtcblxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnZG9jYmxvY2tyJylcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlciA9IG5ldyBwYXJzZXJzW3BhcnNlcl9uYW1lXShhdG9tLmNvbmZpZy5nZXQoJ2RvY2Jsb2NrcicpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yKGxldCBrZXkgaW4gZGF0YXNldCkge1xuICAgICAgICAgICAgZGVzY3JpYmUoa2V5LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZGF0YXNldFtrZXldLmZvckVhY2goKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaXQoZGF0YVswXSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0ID0gcGFyc2VyW2tleV0oZGF0YVsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3Qob3V0KS50by5kZWVwLmVxdWFsKGRhdGFbMl0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iXX0=
//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/docblockr/spec/language.spec.js

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _mixto = require('mixto');

var _mixto2 = _interopRequireDefault(_mixto);

/**
 * This mixin is used by the `CanvasDrawer` in `MinimapElement` to
 * read the styles informations from the DOM to use when rendering
 * the `Minimap`.
 */
'use babel';

var DOMStylesReader = (function (_Mixin) {
  _inherits(DOMStylesReader, _Mixin);

  function DOMStylesReader() {
    _classCallCheck(this, DOMStylesReader);

    _get(Object.getPrototypeOf(DOMStylesReader.prototype), 'constructor', this).apply(this, arguments);
  }

  //    ##     ## ######## ##       ########  ######## ########   ######
  //    ##     ## ##       ##       ##     ## ##       ##     ## ##    ##
  //    ##     ## ##       ##       ##     ## ##       ##     ## ##
  //    ######### ######   ##       ########  ######   ########   ######
  //    ##     ## ##       ##       ##        ##       ##   ##         ##
  //    ##     ## ##       ##       ##        ##       ##    ##  ##    ##
  //    ##     ## ######## ######## ##        ######## ##     ##  ######

  /**
   * Computes the hue rotation on the provided `r`, `g` and `b` channels
   * by the amount of `angle`.
   *
   * @param  {number} r the red channel of the color to rotate
   * @param  {number} g the green channel of the color to rotate
   * @param  {number} b the blue channel of the color to rotate
   * @param  {number} angle the angle to rotate the hue with
   * @return {Array<number>} the rotated color channels
   * @access private
   */

  _createClass(DOMStylesReader, [{
    key: 'retrieveStyleFromDom',

    /**
     * Returns the computed values for the given property and scope in the DOM.
     *
     * This function insert a dummy element in the DOM to compute
     * its style, return the specified property, and clear the content of the
     * dummy element.
     *
     * @param  {Array<string>} scopes a list of classes reprensenting the scope
     *                                to build
     * @param  {string} property the name of the style property to compute
     * @param  {boolean} [shadowRoot=true] whether to compute the style inside
     *                                     a shadow DOM or not
     * @param  {boolean} [cache=true] whether to cache the computed value or not
     * @return {string} the computed property's value
     */
    value: function retrieveStyleFromDom(scopes, property) {
      var shadowRoot = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
      var cache = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

      this.ensureCache();

      var key = scopes.join(' ');
      var cachedData = this.constructor.domStylesCache[key];

      if (cache && (cachedData ? cachedData[property] : void 0) != null) {
        return cachedData[property];
      }

      this.ensureDummyNodeExistence(shadowRoot);

      if (!cachedData) {
        this.constructor.domStylesCache[key] = cachedData = {};
      }

      var parent = this.dummyNode;
      for (var i = 0, len = scopes.length; i < len; i++) {
        var scope = scopes[i];
        var node = document.createElement('span');
        node.className = scope.replace(/\.+/g, ' ');

        if (parent != null) {
          parent.appendChild(node);
        }

        parent = node;
      }

      var style = window.getComputedStyle(parent);
      var filter = style.getPropertyValue('-webkit-filter');
      var value = style.getPropertyValue(property);

      if (filter.indexOf('hue-rotate') > -1) {
        value = this.rotateHue(value, filter);
      }

      if (value !== '') {
        cachedData[property] = value;
      }

      this.dummyNode.innerHTML = '';
      return value;
    }

    /**
     * Creates a DOM node container for all the operations that need to read
     * styles properties from DOM.
     *
     * @param  {boolean} shadowRoot whether to create the dummy node in the shadow
     *                              DOM or not
     * @access private
     */
  }, {
    key: 'ensureDummyNodeExistence',
    value: function ensureDummyNodeExistence(shadowRoot) {
      if (this.dummyNode == null) {
        /**
         * @access private
         */
        this.dummyNode = document.createElement('span');
        this.dummyNode.style.visibility = 'hidden';
      }

      this.getDummyDOMRoot(shadowRoot).appendChild(this.dummyNode);
    }

    /**
     * Ensures the presence of the cache object in the class that received
     * this mixin.
     *
     * @access private
     */
  }, {
    key: 'ensureCache',
    value: function ensureCache() {
      if (!this.constructor.domStylesCache) {
        this.constructor.domStylesCache = {};
      }
    }

    /**
     * Invalidates the cache by emptying the cache object.
     */
  }, {
    key: 'invalidateDOMStylesCache',
    value: function invalidateDOMStylesCache() {
      this.constructor.domStylesCache = {};
    }

    /**
     * Invalidates the cache only for the first tokenization event.
     *
     * @access private
     */
  }, {
    key: 'invalidateIfFirstTokenization',
    value: function invalidateIfFirstTokenization() {
      if (this.constructor.hasTokenizedOnce) {
        return;
      }
      this.invalidateDOMStylesCache();
      this.constructor.hasTokenizedOnce = true;
    }

    /**
     * Computes the output color of `value` with a rotated hue defined
     * in `filter`.
     *
     * @param  {string} value the CSS color to apply the rotation on
     * @param  {string} filter the CSS hue rotate filter declaration
     * @return {string} the rotated CSS color
     * @access private
     */
  }, {
    key: 'rotateHue',
    value: function rotateHue(value, filter) {
      var match = value.match(/rgb(a?)\((\d+), (\d+), (\d+)(, (\d+(\.\d+)?))?\)/);

      var _match = _slicedToArray(match, 7);

      var r = _match[2];
      var g = _match[3];
      var b = _match[4];
      var a = _match[6];

      var _filter$match = filter.match(/hue-rotate\((\d+)deg\)/);

      var _filter$match2 = _slicedToArray(_filter$match, 2);

      var hue = _filter$match2[1];

      var _map = [r, g, b, a, hue].map(Number);

      var _map2 = _slicedToArray(_map, 5);

      r = _map2[0];
      g = _map2[1];
      b = _map2[2];
      a = _map2[3];
      hue = _map2[4];

      var _rotate = rotate(r, g, b, hue);

      var _rotate2 = _slicedToArray(_rotate, 3);

      r = _rotate2[0];
      g = _rotate2[1];
      b = _rotate2[2];

      if (isNaN(a)) {
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
      } else {
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
      }
    }
  }]);

  return DOMStylesReader;
})(_mixto2['default']);

exports['default'] = DOMStylesReader;
function rotate(r, g, b, angle) {
  var matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  var lumR = 0.2126;
  var lumG = 0.7152;
  var lumB = 0.0722;
  var hueRotateR = 0.143;
  var hueRotateG = 0.140;
  var hueRotateB = 0.283;
  var cos = Math.cos(angle * Math.PI / 180);
  var sin = Math.sin(angle * Math.PI / 180);

  matrix[0] = lumR + (1 - lumR) * cos - lumR * sin;
  matrix[1] = lumG - lumG * cos - lumG * sin;
  matrix[2] = lumB - lumB * cos + (1 - lumB) * sin;
  matrix[3] = lumR - lumR * cos + hueRotateR * sin;
  matrix[4] = lumG + (1 - lumG) * cos + hueRotateG * sin;
  matrix[5] = lumB - lumB * cos - hueRotateB * sin;
  matrix[6] = lumR - lumR * cos - (1 - lumR) * sin;
  matrix[7] = lumG - lumG * cos + lumG * sin;
  matrix[8] = lumB + (1 - lumB) * cos + lumB * sin;

  return [clamp(matrix[0] * r + matrix[1] * g + matrix[2] * b), clamp(matrix[3] * r + matrix[4] * g + matrix[5] * b), clamp(matrix[6] * r + matrix[7] * g + matrix[8] * b)];

  function clamp(num) {
    return Math.ceil(Math.max(0, Math.min(255, num)));
  }
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taXhpbnMvZG9tLXN0eWxlcy1yZWFkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztxQkFFa0IsT0FBTzs7Ozs7Ozs7O0FBRnpCLFdBQVcsQ0FBQTs7SUFTVSxlQUFlO1lBQWYsZUFBZTs7V0FBZixlQUFlOzBCQUFmLGVBQWU7OytCQUFmLGVBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2VBQWYsZUFBZTs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBZ0JiLDhCQUFDLE1BQU0sRUFBRSxRQUFRLEVBQW1DO1VBQWpDLFVBQVUseURBQUcsSUFBSTtVQUFFLEtBQUsseURBQUcsSUFBSTs7QUFDckUsVUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBOztBQUVsQixVQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQzFCLFVBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFBOztBQUVyRCxVQUFJLEtBQUssSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUEsSUFBSyxJQUFJLEVBQUU7QUFDakUsZUFBTyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDNUI7O0FBRUQsVUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFBOztBQUV6QyxVQUFJLENBQUMsVUFBVSxFQUFFO0FBQ2YsWUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxHQUFHLEVBQUUsQ0FBQTtPQUN2RDs7QUFFRCxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFBO0FBQzNCLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMs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QUFHLElBQUksR0FBSSxJQUFJLEdBQUcsR0FBRyxBQUFDLEdBQUksSUFBSSxHQUFHLEdBQUcsQUFBQyxDQUFBO0FBQzlDLFFBQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUksSUFBSSxHQUFHLEdBQUcsQUFBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQSxHQUFJLEdBQUcsQ0FBQTtBQUNsRCxRQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFJLElBQUksR0FBRyxHQUFHLEFBQUMsR0FBRyxVQUFVLEdBQUcsR0FBRyxDQUFBO0FBQ2xELFFBQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFBLEdBQUksR0FBRyxHQUFHLFVBQVUsR0FBRyxHQUFHLENBQUE7QUFDdEQsUUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBSSxJQUFJLEdBQUcsR0FBRyxBQUFDLEdBQUksVUFBVSxHQUFHLEdBQUcsQUFBQyxDQUFBO0FBQ3BELFFBQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUksSUFBSSxHQUFHLEdBQUcsQUFBQyxHQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQSxHQUFJLEdBQUcsQUFBQyxDQUFBO0FBQ3BELFFBQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUksSUFBSSxHQUFHLEdBQUcsQUFBQyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUE7QUFDNUMsUUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUEsR0FBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQTs7QUFFaEQsU0FBTyxDQUNMLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUNwRCxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFDcEQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQ3JELENBQUE7O0FBRUQsV0FBUyxLQUFLLENBQUUsR0FBRyxFQUFFO0FBQ25CLFdBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7R0FDbEQ7Q0FDRiIsImZpbGUiOiIvVXNlcnMvYWplbmtpbnMvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWl4aW5zL2RvbS1zdHlsZXMtcmVhZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IE1peGluIGZyb20gJ21peHRvJ1xuXG4vKipcbiAqIFRoaXMgbWl4aW4gaXMgdXNlZCBieSB0aGUgYENhbnZhc0RyYXdlcmAgaW4gYE1pbmltYXBFbGVtZW50YCB0b1xuICogcmVhZCB0aGUgc3R5bGVzIGluZm9ybWF0aW9ucyBmcm9tIHRoZSBET00gdG8gdXNlIHdoZW4gcmVuZGVyaW5nXG4gKiB0aGUgYE1pbmltYXBgLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBET01TdHlsZXNSZWFkZXIgZXh0ZW5kcyBNaXhpbiB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjb21wdXRlZCB2YWx1ZXMgZm9yIHRoZSBnaXZlbiBwcm9wZXJ0eSBhbmQgc2NvcGUgaW4gdGhlIERPTS5cbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbiBpbnNlcnQgYSBkdW1teSBlbGVtZW50IGluIHRoZSBET00gdG8gY29tcHV0ZVxuICAgKiBpdHMgc3R5bGUsIHJldHVybiB0aGUgc3BlY2lmaWVkIHByb3BlcnR5LCBhbmQgY2xlYXIgdGhlIGNvbnRlbnQgb2YgdGhlXG4gICAqIGR1bW15IGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSAge0FycmF5PHN0cmluZz59IHNjb3BlcyBhIGxpc3Qgb2YgY2xhc3NlcyByZXByZW5zZW50aW5nIHRoZSBzY29wZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYnVpbGRcbiAgICogQHBhcmFtICB7c3RyaW5nfSBwcm9wZXJ0eSB0aGUgbmFtZSBvZiB0aGUgc3R5bGUgcHJvcGVydHkgdG8gY29tcHV0ZVxuICAgKiBAcGFyYW0gIHtib29sZWFufSBbc2hhZG93Um9vdD10cnVlXSB3aGV0aGVyIHRvIGNvbXB1dGUgdGhlIHN0eWxlIGluc2lkZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhIHNoYWRvdyBET00gb3Igbm90XG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IFtjYWNoZT10cnVlXSB3aGV0aGVyIHRvIGNhY2hlIHRoZSBjb21wdXRlZCB2YWx1ZSBvciBub3RcbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgY29tcHV0ZWQgcHJvcGVydHkncyB2YWx1ZVxuICAgKi9cbiAgcmV0cmlldmVTdHlsZUZyb21Eb20gKHNjb3BlcywgcHJvcGVydHksIHNoYWRvd1Jvb3QgPSB0cnVlLCBjYWNoZSA9IHRydWUpIHtcbiAgICB0aGlzLmVuc3VyZUNhY2hlKClcblxuICAgIGxldCBrZXkgPSBzY29wZXMuam9pbignICcpXG4gICAgbGV0IGNhY2hlZERhdGEgPSB0aGlzLmNvbnN0cnVjdG9yLmRvbVN0eWxlc0NhY2hlW2tleV1cblxuICAgIGlmIChjYWNoZSAmJiAoY2FjaGVkRGF0YSA/IGNhY2hlZERhdGFbcHJvcGVydHldIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gY2FjaGVkRGF0YVtwcm9wZXJ0eV1cbiAgICB9XG5cbiAgICB0aGlzLmVuc3VyZUR1bW15Tm9kZUV4aXN0ZW5jZShzaGFkb3dSb290KVxuXG4gICAgaWYgKCFjYWNoZWREYXRhKSB7XG4gICAgICB0aGlzLmNvbnN0cnVjdG9yLmRvbVN0eWxlc0NhY2hlW2tleV0gPSBjYWNoZWREYXRhID0ge31cbiAgICB9XG5cbiAgICBsZXQgcGFyZW50ID0gdGhpcy5kdW1teU5vZGVcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gc2NvcGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgc2NvcGUgPSBzY29wZXNbaV1cbiAgICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICBub2RlLmNsYXNzTmFtZSA9IHNjb3BlLnJlcGxhY2UoL1xcLisvZywgJyAnKVxuXG4gICAgICBpZiAocGFyZW50ICE9IG51bGwpIHsgcGFyZW50LmFwcGVuZENoaWxkKG5vZGUpIH1cblxuICAgICAgcGFyZW50ID0gbm9kZVxuICAgIH1cblxuICAgIGxldCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHBhcmVudClcbiAgICBsZXQgZmlsdGVyID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnLXdlYmtpdC1maWx0ZXInKVxuICAgIGxldCB2YWx1ZSA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUocHJvcGVydHkpXG5cbiAgICBpZiAoZmlsdGVyLmluZGV4T2YoJ2h1ZS1yb3RhdGUnKSA+IC0xKSB7XG4gICAgICB2YWx1ZSA9IHRoaXMucm90YXRlSHVlKHZhbHVlLCBmaWx0ZXIpXG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9PSAnJykgeyBjYWNoZWREYXRhW3Byb3BlcnR5XSA9IHZhbHVlIH1cblxuICAgIHRoaXMuZHVtbXlOb2RlLmlubmVySFRNTCA9ICcnXG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIERPTSBub2RlIGNvbnRhaW5lciBmb3IgYWxsIHRoZSBvcGVyYXRpb25zIHRoYXQgbmVlZCB0byByZWFkXG4gICAqIHN0eWxlcyBwcm9wZXJ0aWVzIGZyb20gRE9NLlxuICAgKlxuICAgKiBAcGFyYW0gIHtib29sZWFufSBzaGFkb3dSb290IHdoZXRoZXIgdG8gY3JlYXRlIHRoZSBkdW1teSBub2RlIGluIHRoZSBzaGFkb3dcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBET00gb3Igbm90XG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZW5zdXJlRHVtbXlOb2RlRXhpc3RlbmNlIChzaGFkb3dSb290KSB7XG4gICAgaWYgKHRoaXMuZHVtbXlOb2RlID09IG51bGwpIHtcbiAgICAgIC8qKlxuICAgICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHRoaXMuZHVtbXlOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICB0aGlzLmR1bW15Tm9kZS5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbidcbiAgICB9XG5cbiAgICB0aGlzLmdldER1bW15RE9NUm9vdChzaGFkb3dSb290KS5hcHBlbmRDaGlsZCh0aGlzLmR1bW15Tm9kZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnN1cmVzIHRoZSBwcmVzZW5jZSBvZiB0aGUgY2FjaGUgb2JqZWN0IGluIHRoZSBjbGFzcyB0aGF0IHJlY2VpdmVkXG4gICAqIHRoaXMgbWl4aW4uXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZW5zdXJlQ2FjaGUgKCkge1xuICAgIGlmICghdGhpcy5jb25zdHJ1Y3Rvci5kb21TdHlsZXNDYWNoZSkge1xuICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5kb21TdHlsZXNDYWNoZSA9IHt9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEludmFsaWRhdGVzIHRoZSBjYWNoZSBieSBlbXB0eWluZyB0aGUgY2FjaGUgb2JqZWN0LlxuICAgKi9cbiAgaW52YWxpZGF0ZURPTVN0eWxlc0NhY2hlICgpIHtcbiAgICB0aGlzLmNvbnN0cnVjdG9yLmRvbVN0eWxlc0NhY2hlID0ge31cbiAgfVxuXG4gIC8qKlxuICAgKiBJbnZhbGlkYXRlcyB0aGUgY2FjaGUgb25seSBmb3IgdGhlIGZpcnN0IHRva2VuaXphdGlvbiBldmVudC5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBpbnZhbGlkYXRlSWZGaXJzdFRva2VuaXphdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuY29uc3RydWN0b3IuaGFzVG9rZW5pemVkT25jZSkgeyByZXR1cm4gfVxuICAgIHRoaXMuaW52YWxpZGF0ZURPTVN0eWxlc0NhY2hlKClcbiAgICB0aGlzLmNvbnN0cnVjdG9yLmhhc1Rva2VuaXplZE9uY2UgPSB0cnVlXG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZXMgdGhlIG91dHB1dCBjb2xvciBvZiBgdmFsdWVgIHdpdGggYSByb3RhdGVkIGh1ZSBkZWZpbmVkXG4gICAqIGluIGBmaWx0ZXJgLlxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHZhbHVlIHRoZSBDU1MgY29sb3IgdG8gYXBwbHkgdGhlIHJvdGF0aW9uIG9uXG4gICAqIEBwYXJhbSAge3N0cmluZ30gZmlsdGVyIHRoZSBDU1MgaHVlIHJvdGF0ZSBmaWx0ZXIgZGVjbGFyYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgcm90YXRlZCBDU1MgY29sb3JcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICByb3RhdGVIdWUgKHZhbHVlLCBmaWx0ZXIpIHtcbiAgICBsZXQgbWF0Y2ggPSB2YWx1ZS5tYXRjaCgvcmdiKGE/KVxcKChcXGQrKSwgKFxcZCspLCAoXFxkKykoLCAoXFxkKyhcXC5cXGQrKT8pKT9cXCkvKVxuICAgIGxldCBbLCAsIHIsIGcsIGIsICwgYV0gPSBtYXRjaFxuXG4gICAgbGV0IFssIGh1ZV0gPSBmaWx0ZXIubWF0Y2goL2h1ZS1yb3RhdGVcXCgoXFxkKylkZWdcXCkvKVxuXG4gICAgO1tyLCBnLCBiLCBhLCBodWVdID0gW3IsIGcsIGIsIGEsIGh1ZV0ubWFwKE51bWJlcilcbiAgICA7W3IsIGcsIGJdID0gcm90YXRlKHIsIGcsIGIsIGh1ZSlcblxuICAgIGlmIChpc05hTihhKSkge1xuICAgICAgcmV0dXJuIGByZ2IoJHtyfSwgJHtnfSwgJHtifSlgXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgcmdiYSgke3J9LCAke2d9LCAke2J9LCAke2F9KWBcbiAgICB9XG4gIH1cbn1cblxuLy8gICAgIyMgICAgICMjICMjIyMjIyMjICMjICAgICAgICMjIyMjIyMjICAjIyMjIyMjIyAjIyMjIyMjIyAgICMjIyMjI1xuLy8gICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgIyNcbi8vICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjXG4vLyAgICAjIyMjIyMjIyMgIyMjIyMjICAgIyMgICAgICAgIyMjIyMjIyMgICMjIyMjIyAgICMjIyMjIyMjICAgIyMjIyMjXG4vLyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICAgIyMgICAgICAgICMjICAgICAgICMjICAgIyMgICAgICAgICAjI1xuLy8gICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAgICAjIyAgICAgICAjIyAgICAjIyAgIyMgICAgIyNcbi8vICAgICMjICAgICAjIyAjIyMjIyMjIyAjIyMjIyMjIyAjIyAgICAgICAgIyMjIyMjIyMgIyMgICAgICMjICAjIyMjIyNcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgaHVlIHJvdGF0aW9uIG9uIHRoZSBwcm92aWRlZCBgcmAsIGBnYCBhbmQgYGJgIGNoYW5uZWxzXG4gKiBieSB0aGUgYW1vdW50IG9mIGBhbmdsZWAuXG4gKlxuICogQHBhcmFtICB7bnVtYmVyfSByIHRoZSByZWQgY2hhbm5lbCBvZiB0aGUgY29sb3IgdG8gcm90YXRlXG4gKiBAcGFyYW0gIHtudW1iZXJ9IGcgdGhlIGdyZWVuIGNoYW5uZWwgb2YgdGhlIGNvbG9yIHRvIHJvdGF0ZVxuICogQHBhcmFtICB7bnVtYmVyfSBiIHRoZSBibHVlIGNoYW5uZWwgb2YgdGhlIGNvbG9yIHRvIHJvdGF0ZVxuICogQHBhcmFtICB7bnVtYmVyfSBhbmdsZSB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBodWUgd2l0aFxuICogQHJldHVybiB7QXJyYXk8bnVtYmVyPn0gdGhlIHJvdGF0ZWQgY29sb3IgY2hhbm5lbHNcbiAqIEBhY2Nlc3MgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiByb3RhdGUgKHIsIGcsIGIsIGFuZ2xlKSB7XG4gIGxldCBtYXRyaXggPSBbMSwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMV1cbiAgY29uc3QgbHVtUiA9IDAuMjEyNlxuICBjb25zdCBsdW1HID0gMC43MTUyXG4gIGNvbnN0IGx1bUIgPSAwLjA3MjJcbiAgY29uc3QgaHVlUm90YXRlUiA9IDAuMTQzXG4gIGNvbnN0IGh1ZVJvdGF0ZUcgPSAwLjE0MFxuICBjb25zdCBodWVSb3RhdGVCID0gMC4yODNcbiAgY29uc3QgY29zID0gTWF0aC5jb3MoYW5nbGUgKiBNYXRoLlBJIC8gMTgwKVxuICBjb25zdCBzaW4gPSBNYXRoLnNpbihhbmdsZSAqIE1hdGguUEkgLyAxODApXG5cbiAgbWF0cml4WzBdID0gbHVtUiArICgxIC0gbHVtUikgKiBjb3MgLSAobHVtUiAqIHNpbilcbiAgbWF0cml4WzFdID0gbHVtRyAtIChsdW1HICogY29zKSAtIChsdW1HICogc2luKVxuICBtYXRyaXhbMl0gPSBsdW1CIC0gKGx1bUIgKiBjb3MpICsgKDEgLSBsdW1CKSAqIHNpblxuICBtYXRyaXhbM10gPSBsdW1SIC0gKGx1bVIgKiBjb3MpICsgaHVlUm90YXRlUiAqIHNpblxuICBtYXRyaXhbNF0gPSBsdW1HICsgKDEgLSBsdW1HKSAqIGNvcyArIGh1ZVJvdGF0ZUcgKiBzaW5cbiAgbWF0cml4WzVdID0gbHVtQiAtIChsdW1CICogY29zKSAtIChodWVSb3RhdGVCICogc2luKVxuICBtYXRyaXhbNl0gPSBsdW1SIC0gKGx1bVIgKiBjb3MpIC0gKCgxIC0gbHVtUikgKiBzaW4pXG4gIG1hdHJpeFs3XSA9IGx1bUcgLSAobHVtRyAqIGNvcykgKyBsdW1HICogc2luXG4gIG1hdHJpeFs4XSA9IGx1bUIgKyAoMSAtIGx1bUIpICogY29zICsgbHVtQiAqIHNpblxuXG4gIHJldHVybiBbXG4gICAgY2xhbXAobWF0cml4WzBdICogciArIG1hdHJpeFsxXSAqIGcgKyBtYXRyaXhbMl0gKiBiKSxcbiAgICBjbGFtcChtYXRyaXhbM10gKiByICsgbWF0cml4WzRdICogZyArIG1hdHJpeFs1XSAqIGIpLFxuICAgIGNsYW1wKG1hdHJpeFs2XSAqIHIgKyBtYXRyaXhbN10gKiBnICsgbWF0cml4WzhdICogYilcbiAgXVxuXG4gIGZ1bmN0aW9uIGNsYW1wIChudW0pIHtcbiAgICByZXR1cm4gTWF0aC5jZWlsKE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgbnVtKSkpXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/ajenkins/.atom/packages/minimap/lib/mixins/dom-styles-reader.js

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = element;

var _atomUtils = require('atom-utils');

/**
 * Generates a decorator function to convert a class into a custom element
 * through the `registerOrUpdateElement` method from `atom-utils`.
 *
 * The decorator will take care to return the generated element class so that
 * you can just export it directly as demonstrated below.
 *
 * As supported by the `registerOrUpdateElement` method, static member will
 * be available on the new class.
 *
 * **Note: As there's some limitations when modifying the prototype
 * of a custom element, if you need to inject element callbacks (like
 * `createdCallback`) through a mixin, the mixins should be included before
 * converting the class as a custom element. You'll be able to achieve that by
 * placing the `include` decorator after the `element` one as shown in the
 * second example.**
 *
 * @param  {string} elementName the node name of the element to register
 * @return {Function} the element class as returned by
 *                    `document.registerElement`
 * @example
 * @element('dummy-element-name')
 * export default class SomeClass {
 *   // ...
 * }
 *
 * @element('dummy-element-with-mixin')
 * @include(SomeMixin)
 * export default class SomeClass {
 *   // ...
 * }
 */
'use babel';

function element(elementName) {
  return function (cls) {
    var elementClass = (0, _atomUtils.registerOrUpdateElement)(elementName, {
      'class': cls
    });
    return elementClass;
  };
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9kZWNvcmF0b3JzL2VsZW1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O3FCQW9Dd0IsT0FBTzs7eUJBbENPLFlBQVk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFGbEQsV0FBVyxDQUFBOztBQW9DSSxTQUFTLE9BQU8sQ0FBRSxXQUFXLEVBQUU7QUFDNUMsU0FBTyxVQUFVLEdBQUcsRUFBRTtBQUNwQixRQUFJLFlBQVksR0FBRyx3Q0FBd0IsV0FBVyxFQUFFO0FBQ3RELGVBQU8sR0FBRztLQUNYLENBQUMsQ0FBQTtBQUNGLFdBQU8sWUFBWSxDQUFBO0dBQ3BCLENBQUE7Q0FDRiIsImZpbGUiOiIvVXNlcnMvYWplbmtpbnMvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvZGVjb3JhdG9ycy9lbGVtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtyZWdpc3Rlck9yVXBkYXRlRWxlbWVudH0gZnJvbSAnYXRvbS11dGlscydcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBkZWNvcmF0b3IgZnVuY3Rpb24gdG8gY29udmVydCBhIGNsYXNzIGludG8gYSBjdXN0b20gZWxlbWVudFxuICogdGhyb3VnaCB0aGUgYHJlZ2lzdGVyT3JVcGRhdGVFbGVtZW50YCBtZXRob2QgZnJvbSBgYXRvbS11dGlsc2AuXG4gKlxuICogVGhlIGRlY29yYXRvciB3aWxsIHRha2UgY2FyZSB0byByZXR1cm4gdGhlIGdlbmVyYXRlZCBlbGVtZW50IGNsYXNzIHNvIHRoYXRcbiAqIHlvdSBjYW4ganVzdCBleHBvcnQgaXQgZGlyZWN0bHkgYXMgZGVtb25zdHJhdGVkIGJlbG93LlxuICpcbiAqIEFzIHN1cHBvcnRlZCBieSB0aGUgYHJlZ2lzdGVyT3JVcGRhdGVFbGVtZW50YCBtZXRob2QsIHN0YXRpYyBtZW1iZXIgd2lsbFxuICogYmUgYXZhaWxhYmxlIG9uIHRoZSBuZXcgY2xhc3MuXG4gKlxuICogKipOb3RlOiBBcyB0aGVyZSdzIHNvbWUgbGltaXRhdGlvbnMgd2hlbiBtb2RpZnlpbmcgdGhlIHByb3RvdHlwZVxuICogb2YgYSBjdXN0b20gZWxlbWVudCwgaWYgeW91IG5lZWQgdG8gaW5qZWN0IGVsZW1lbnQgY2FsbGJhY2tzIChsaWtlXG4gKiBgY3JlYXRlZENhbGxiYWNrYCkgdGhyb3VnaCBhIG1peGluLCB0aGUgbWl4aW5zIHNob3VsZCBiZSBpbmNsdWRlZCBiZWZvcmVcbiAqIGNvbnZlcnRpbmcgdGhlIGNsYXNzIGFzIGEgY3VzdG9tIGVsZW1lbnQuIFlvdSdsbCBiZSBhYmxlIHRvIGFjaGlldmUgdGhhdCBieVxuICogcGxhY2luZyB0aGUgYGluY2x1ZGVgIGRlY29yYXRvciBhZnRlciB0aGUgYGVsZW1lbnRgIG9uZSBhcyBzaG93biBpbiB0aGVcbiAqIHNlY29uZCBleGFtcGxlLioqXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSBlbGVtZW50TmFtZSB0aGUgbm9kZSBuYW1lIG9mIHRoZSBlbGVtZW50IHRvIHJlZ2lzdGVyXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGVsZW1lbnQgY2xhc3MgYXMgcmV0dXJuZWQgYnlcbiAqICAgICAgICAgICAgICAgICAgICBgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50YFxuICogQGV4YW1wbGVcbiAqIEBlbGVtZW50KCdkdW1teS1lbGVtZW50LW5hbWUnKVxuICogZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29tZUNsYXNzIHtcbiAqICAgLy8gLi4uXG4gKiB9XG4gKlxuICogQGVsZW1lbnQoJ2R1bW15LWVsZW1lbnQtd2l0aC1taXhpbicpXG4gKiBAaW5jbHVkZShTb21lTWl4aW4pXG4gKiBleHBvcnQgZGVmYXVsdCBjbGFzcyBTb21lQ2xhc3Mge1xuICogICAvLyAuLi5cbiAqIH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZWxlbWVudCAoZWxlbWVudE5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChjbHMpIHtcbiAgICBsZXQgZWxlbWVudENsYXNzID0gcmVnaXN0ZXJPclVwZGF0ZUVsZW1lbnQoZWxlbWVudE5hbWUsIHtcbiAgICAgIGNsYXNzOiBjbHNcbiAgICB9KVxuICAgIHJldHVybiBlbGVtZW50Q2xhc3NcbiAgfVxufVxuIl19
//# sourceURL=/Users/ajenkins/.atom/packages/minimap/lib/decorators/element.js

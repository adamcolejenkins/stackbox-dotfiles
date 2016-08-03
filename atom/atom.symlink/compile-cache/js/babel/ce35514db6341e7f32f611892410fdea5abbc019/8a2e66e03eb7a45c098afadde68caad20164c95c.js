'use babel';

/**
 * Generates a decorator function to includes many `mixto` mixins into a class.
 *
 * @param  {...Mixin} mixins the mixins to include in the class
 * @return {function(cls:Function):Function} the decorator function that will
 *                                           include the specified mixins
 * @example
 * @include(SomeMixin)
 * export default class SomeClass {
 *   // ...
 * }
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = include;

function include() {
  for (var _len = arguments.length, mixins = Array(_len), _key = 0; _key < _len; _key++) {
    mixins[_key] = arguments[_key];
  }

  return function performInclusion(cls) {
    mixins.forEach(function (mixin) {
      mixin.includeInto(cls);
    });
    return cls;
  };
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9kZWNvcmF0b3JzL2luY2x1ZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztxQkFjYSxPQUFPOztBQUFoQixTQUFTLE9BQU8sR0FBYTtvQ0FBUixNQUFNO0FBQU4sVUFBTTs7O0FBQ3hDLFNBQU8sU0FBUyxnQkFBZ0IsQ0FBRSxHQUFHLEVBQUU7QUFDckMsVUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUFFLFdBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUE7S0FBRSxDQUFDLENBQUE7QUFDckQsV0FBTyxHQUFHLENBQUE7R0FDWCxDQUFBO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2FqZW5raW5zLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL2RlY29yYXRvcnMvaW5jbHVkZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbi8qKlxuICogR2VuZXJhdGVzIGEgZGVjb3JhdG9yIGZ1bmN0aW9uIHRvIGluY2x1ZGVzIG1hbnkgYG1peHRvYCBtaXhpbnMgaW50byBhIGNsYXNzLlxuICpcbiAqIEBwYXJhbSAgey4uLk1peGlufSBtaXhpbnMgdGhlIG1peGlucyB0byBpbmNsdWRlIGluIHRoZSBjbGFzc1xuICogQHJldHVybiB7ZnVuY3Rpb24oY2xzOkZ1bmN0aW9uKTpGdW5jdGlvbn0gdGhlIGRlY29yYXRvciBmdW5jdGlvbiB0aGF0IHdpbGxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGUgdGhlIHNwZWNpZmllZCBtaXhpbnNcbiAqIEBleGFtcGxlXG4gKiBAaW5jbHVkZShTb21lTWl4aW4pXG4gKiBleHBvcnQgZGVmYXVsdCBjbGFzcyBTb21lQ2xhc3Mge1xuICogICAvLyAuLi5cbiAqIH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5jbHVkZSAoLi4ubWl4aW5zKSB7XG4gIHJldHVybiBmdW5jdGlvbiBwZXJmb3JtSW5jbHVzaW9uIChjbHMpIHtcbiAgICBtaXhpbnMuZm9yRWFjaCgobWl4aW4pID0+IHsgbWl4aW4uaW5jbHVkZUludG8oY2xzKSB9KVxuICAgIHJldHVybiBjbHNcbiAgfVxufVxuIl19
//# sourceURL=/Users/ajenkins/.atom/packages/minimap/lib/decorators/include.js

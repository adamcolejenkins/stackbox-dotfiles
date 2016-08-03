Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _atom = require('atom');

'use babel';

var idCounter = 0;
var nextId = function nextId() {
  return idCounter++;
};

/**
 * The `Decoration` class represents a decoration in the Minimap.
 *
 * It has the same API than the `Decoration` class of a text editor.
 */

var Decoration = (function () {
  _createClass(Decoration, null, [{
    key: 'isType',

    /**
     * Returns `true` if the passed-in decoration properties matches the
     * specified type.
     *
     * @param  {Object} decorationProperties the decoration properties to match
     * @param  {string} type the decoration type to match
     * @return {boolean} whether the decoration properties match the type
     */
    value: function isType(decorationProperties, type) {
      if (_underscorePlus2['default'].isArray(decorationProperties.type)) {
        if (decorationProperties.type.indexOf(type) >= 0) {
          return true;
        }
        return false;
      } else {
        return type === decorationProperties.type;
      }
    }

    /**
     * Creates a new decoration.
     *
     * @param  {Marker} marker the target marker for the decoration
     * @param  {Minimap} minimap the Minimap where the decoration will
     *                           be displayed
     * @param  {Object} properties the decoration's properties
     */
  }]);

  function Decoration(marker, minimap, properties) {
    var _this = this;

    _classCallCheck(this, Decoration);

    /**
     * @access private
     */
    this.marker = marker;
    /**
     * @access private
     */
    this.minimap = minimap;
    /**
     * @access private
     */
    this.emitter = new _atom.Emitter();
    /**
     * @access private
     */
    this.id = nextId();
    /**
     * @access private
     */
    this.properties = null;
    this.setProperties(properties);
    this.properties.id = this.id;
    /**
     * @access private
     */
    this.destroyed = false;
    /**
     * @access private
     */
    this.markerDestroyDisposable = this.marker.onDidDestroy(function () {
      _this.destroy();
    });
  }

  /**
   * Destroy this marker.
   *
   * If you own the marker, you should use `Marker#destroy` which will destroy
   * this decoration.
   */

  _createClass(Decoration, [{
    key: 'destroy',
    value: function destroy() {
      if (this.destroyed) {
        return;
      }

      this.markerDestroyDisposable.dispose();
      this.markerDestroyDisposable = null;
      this.destroyed = true;
      this.emitter.emit('did-destroy');
      this.emitter.dispose();
    }

    /**
     * Returns whether this decoration is destroyed or not.
     *
     * @return {boolean} whether this decoration is destroyed or not
     */
  }, {
    key: 'isDestroyed',
    value: function isDestroyed() {
      return this.destroyed;
    }

    /**
     * Registers an event listener to the `did-change-properties` event.
     *
     * This event is triggered when the decoration update method is called.
     *
     * @param  {function(change:Object):void} callback a function to call
     *                                        when the event is triggered
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeProperties',
    value: function onDidChangeProperties(callback) {
      return this.emitter.on('did-change-properties', callback);
    }

    /**
     * Registers an event listener to the `did-destroy` event.
     *
     * @param  {function():void} callback a function to call when the event
     *                                    is triggered
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }

    /**
     * An id unique across all Decoration objects.
     *
     * @return {number} the decoration id
     */
  }, {
    key: 'getId',
    value: function getId() {
      return this.id;
    }

    /**
     * Returns the marker associated with this Decoration.
     *
     * @return {Marker} the decoration's marker
     */
  }, {
    key: 'getMarker',
    value: function getMarker() {
      return this.marker;
    }

    /**
     * Check if this decoration is of type `type`.
     *
     * @param  {string|Array} type a type like `'line-number'`, `'line'`, etc.
     *                             `type` can also be an Array of Strings, where
     *                             it will return true if the decoration's type
     *                             matches any in the array.
     * @return {boolean} whether this decoration match the passed-in type
     */
  }, {
    key: 'isType',
    value: function isType(type) {
      return Decoration.isType(this.properties, type);
    }

    /**
     * Returns the Decoration's properties.
     *
     * @return {Object} the decoration's properties
     */
  }, {
    key: 'getProperties',
    value: function getProperties() {
      return this.properties;
    }

    /**
     * Update the marker with new properties. Allows you to change the
     * decoration's class.
     *
     * @param {Object} newProperties the new properties for the decoration
     */
  }, {
    key: 'setProperties',
    value: function setProperties(newProperties) {
      if (this.destroyed) {
        return;
      }

      var oldProperties = this.properties;
      this.properties = newProperties;
      this.properties.id = this.id;

      this.emitter.emit('did-change-properties', { oldProperties: oldProperties, newProperties: newProperties });
    }
  }]);

  return Decoration;
})();

exports['default'] = Decoration;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9kZWNvcmF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OEJBRWMsaUJBQWlCOzs7O29CQUNULE1BQU07O0FBSDVCLFdBQVcsQ0FBQTs7QUFLWCxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUE7QUFDakIsSUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFNLEdBQWU7QUFBRSxTQUFPLFNBQVMsRUFBRSxDQUFBO0NBQUUsQ0FBQTs7Ozs7Ozs7SUFPMUIsVUFBVTtlQUFWLFVBQVU7Ozs7Ozs7Ozs7O1dBVWYsZ0JBQUMsb0JBQW9CLEVBQUUsSUFBSSxFQUFFO0FBQ3pDLFVBQUksNEJBQUUsT0FBTyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3hDLFlBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFBRSxpQkFBTyxJQUFJLENBQUE7U0FBRTtBQUNqRSxlQUFPLEtBQUssQ0FBQTtPQUNiLE1BQU07QUFDTCxlQUFPLElBQUksS0FBSyxvQkFBb0IsQ0FBQyxJQUFJLENBQUE7T0FDMUM7S0FDRjs7Ozs7Ozs7Ozs7O0FBVVcsV0EzQk8sVUFBVSxDQTJCaEIsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUU7OzswQkEzQnZCLFVBQVU7Ozs7O0FBK0IzQixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTs7OztBQUlwQixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTs7OztBQUl0QixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7Ozs7QUFJNUIsUUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLEVBQUUsQ0FBQTs7OztBQUlsQixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtBQUN0QixRQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUE7Ozs7QUFJNUIsUUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUE7Ozs7QUFJdEIsUUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFlBQU07QUFDNUQsWUFBSyxPQUFPLEVBQUUsQ0FBQTtLQUNmLENBQUMsQ0FBQTtHQUNIOzs7Ozs7Ozs7ZUE1RGtCLFVBQVU7O1dBb0VyQixtQkFBRztBQUNULFVBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGVBQU07T0FBRTs7QUFFOUIsVUFBSSxDQUFDLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3RDLFVBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUE7QUFDbkMsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7QUFDckIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDaEMsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUN2Qjs7Ozs7Ozs7O1dBT1csdUJBQUc7QUFBRSxhQUFPLElBQUksQ0FBQyxTQUFTLENBQUE7S0FBRTs7Ozs7Ozs7Ozs7OztXQVdsQiwrQkFBQyxRQUFRLEVBQUU7QUFDL0IsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUMxRDs7Ozs7Ozs7Ozs7V0FTWSxzQkFBQyxRQUFRLEVBQUU7QUFDdEIsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDaEQ7Ozs7Ozs7OztXQU9LLGlCQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsRUFBRSxDQUFBO0tBQUU7Ozs7Ozs7OztXQU9qQixxQkFBRztBQUFFLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtLQUFFOzs7Ozs7Ozs7Ozs7O1dBVzVCLGdCQUFDLElBQUksRUFBRTtBQUNaLGFBQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFBO0tBQ2hEOzs7Ozs7Ozs7V0FPYSx5QkFBRztBQUNmLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQTtLQUN2Qjs7Ozs7Ozs7OztXQVFhLHVCQUFDLGFBQWEsRUFBRTtBQUM1QixVQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxlQUFNO09BQUU7O0FBRTlCLFVBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUE7QUFDbkMsVUFBSSxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUE7QUFDL0IsVUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQTs7QUFFNUIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsRUFBQyxhQUFhLEVBQWIsYUFBYSxFQUFFLGFBQWEsRUFBYixhQUFhLEVBQUMsQ0FBQyxDQUFBO0tBQzNFOzs7U0EvSmtCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9kZWNvcmF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZS1wbHVzJ1xuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdhdG9tJ1xuXG52YXIgaWRDb3VudGVyID0gMFxudmFyIG5leHRJZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkQ291bnRlcisrIH1cblxuLyoqXG4gKiBUaGUgYERlY29yYXRpb25gIGNsYXNzIHJlcHJlc2VudHMgYSBkZWNvcmF0aW9uIGluIHRoZSBNaW5pbWFwLlxuICpcbiAqIEl0IGhhcyB0aGUgc2FtZSBBUEkgdGhhbiB0aGUgYERlY29yYXRpb25gIGNsYXNzIG9mIGEgdGV4dCBlZGl0b3IuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlY29yYXRpb24ge1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgcGFzc2VkLWluIGRlY29yYXRpb24gcHJvcGVydGllcyBtYXRjaGVzIHRoZVxuICAgKiBzcGVjaWZpZWQgdHlwZS5cbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSBkZWNvcmF0aW9uUHJvcGVydGllcyB0aGUgZGVjb3JhdGlvbiBwcm9wZXJ0aWVzIHRvIG1hdGNoXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdHlwZSB0aGUgZGVjb3JhdGlvbiB0eXBlIHRvIG1hdGNoXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgdGhlIGRlY29yYXRpb24gcHJvcGVydGllcyBtYXRjaCB0aGUgdHlwZVxuICAgKi9cbiAgc3RhdGljIGlzVHlwZSAoZGVjb3JhdGlvblByb3BlcnRpZXMsIHR5cGUpIHtcbiAgICBpZiAoXy5pc0FycmF5KGRlY29yYXRpb25Qcm9wZXJ0aWVzLnR5cGUpKSB7XG4gICAgICBpZiAoZGVjb3JhdGlvblByb3BlcnRpZXMudHlwZS5pbmRleE9mKHR5cGUpID49IDApIHsgcmV0dXJuIHRydWUgfVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0eXBlID09PSBkZWNvcmF0aW9uUHJvcGVydGllcy50eXBlXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgZGVjb3JhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtICB7TWFya2VyfSBtYXJrZXIgdGhlIHRhcmdldCBtYXJrZXIgZm9yIHRoZSBkZWNvcmF0aW9uXG4gICAqIEBwYXJhbSAge01pbmltYXB9IG1pbmltYXAgdGhlIE1pbmltYXAgd2hlcmUgdGhlIGRlY29yYXRpb24gd2lsbFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlIGRpc3BsYXllZFxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHByb3BlcnRpZXMgdGhlIGRlY29yYXRpb24ncyBwcm9wZXJ0aWVzXG4gICAqL1xuICBjb25zdHJ1Y3RvciAobWFya2VyLCBtaW5pbWFwLCBwcm9wZXJ0aWVzKSB7XG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5tYXJrZXIgPSBtYXJrZXJcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLm1pbmltYXAgPSBtaW5pbWFwXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuaWQgPSBuZXh0SWQoKVxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucHJvcGVydGllcyA9IG51bGxcbiAgICB0aGlzLnNldFByb3BlcnRpZXMocHJvcGVydGllcylcbiAgICB0aGlzLnByb3BlcnRpZXMuaWQgPSB0aGlzLmlkXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZVxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMubWFya2VyRGVzdHJveURpc3Bvc2FibGUgPSB0aGlzLm1hcmtlci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgdGhpcy5kZXN0cm95KClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhpcyBtYXJrZXIuXG4gICAqXG4gICAqIElmIHlvdSBvd24gdGhlIG1hcmtlciwgeW91IHNob3VsZCB1c2UgYE1hcmtlciNkZXN0cm95YCB3aGljaCB3aWxsIGRlc3Ryb3lcbiAgICogdGhpcyBkZWNvcmF0aW9uLlxuICAgKi9cbiAgZGVzdHJveSAoKSB7XG4gICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLm1hcmtlckRlc3Ryb3lEaXNwb3NhYmxlLmRpc3Bvc2UoKVxuICAgIHRoaXMubWFya2VyRGVzdHJveURpc3Bvc2FibGUgPSBudWxsXG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95JylcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIHRoaXMgZGVjb3JhdGlvbiBpcyBkZXN0cm95ZWQgb3Igbm90LlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB3aGV0aGVyIHRoaXMgZGVjb3JhdGlvbiBpcyBkZXN0cm95ZWQgb3Igbm90XG4gICAqL1xuICBpc0Rlc3Ryb3llZCAoKSB7IHJldHVybiB0aGlzLmRlc3Ryb3llZCB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1jaGFuZ2UtcHJvcGVydGllc2AgZXZlbnQuXG4gICAqXG4gICAqIFRoaXMgZXZlbnQgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIGRlY29yYXRpb24gdXBkYXRlIG1ldGhvZCBpcyBjYWxsZWQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKGNoYW5nZTpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWRcbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2VQcm9wZXJ0aWVzIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2UtcHJvcGVydGllcycsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1kZXN0cm95YCBldmVudC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oKTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgZXZlbnRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpcyB0cmlnZ2VyZWRcbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWREZXN0cm95IChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZXN0cm95JywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogQW4gaWQgdW5pcXVlIGFjcm9zcyBhbGwgRGVjb3JhdGlvbiBvYmplY3RzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBkZWNvcmF0aW9uIGlkXG4gICAqL1xuICBnZXRJZCAoKSB7IHJldHVybiB0aGlzLmlkIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWFya2VyIGFzc29jaWF0ZWQgd2l0aCB0aGlzIERlY29yYXRpb24uXG4gICAqXG4gICAqIEByZXR1cm4ge01hcmtlcn0gdGhlIGRlY29yYXRpb24ncyBtYXJrZXJcbiAgICovXG4gIGdldE1hcmtlciAoKSB7IHJldHVybiB0aGlzLm1hcmtlciB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoaXMgZGVjb3JhdGlvbiBpcyBvZiB0eXBlIGB0eXBlYC5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfEFycmF5fSB0eXBlIGEgdHlwZSBsaWtlIGAnbGluZS1udW1iZXInYCwgYCdsaW5lJ2AsIGV0Yy5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIGB0eXBlYCBjYW4gYWxzbyBiZSBhbiBBcnJheSBvZiBTdHJpbmdzLCB3aGVyZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXQgd2lsbCByZXR1cm4gdHJ1ZSBpZiB0aGUgZGVjb3JhdGlvbidzIHR5cGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZXMgYW55IGluIHRoZSBhcnJheS5cbiAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciB0aGlzIGRlY29yYXRpb24gbWF0Y2ggdGhlIHBhc3NlZC1pbiB0eXBlXG4gICAqL1xuICBpc1R5cGUgKHR5cGUpIHtcbiAgICByZXR1cm4gRGVjb3JhdGlvbi5pc1R5cGUodGhpcy5wcm9wZXJ0aWVzLCB0eXBlKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIERlY29yYXRpb24ncyBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBkZWNvcmF0aW9uJ3MgcHJvcGVydGllc1xuICAgKi9cbiAgZ2V0UHJvcGVydGllcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcGVydGllc1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgbWFya2VyIHdpdGggbmV3IHByb3BlcnRpZXMuIEFsbG93cyB5b3UgdG8gY2hhbmdlIHRoZVxuICAgKiBkZWNvcmF0aW9uJ3MgY2xhc3MuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBuZXdQcm9wZXJ0aWVzIHRoZSBuZXcgcHJvcGVydGllcyBmb3IgdGhlIGRlY29yYXRpb25cbiAgICovXG4gIHNldFByb3BlcnRpZXMgKG5ld1Byb3BlcnRpZXMpIHtcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHsgcmV0dXJuIH1cblxuICAgIGxldCBvbGRQcm9wZXJ0aWVzID0gdGhpcy5wcm9wZXJ0aWVzXG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gbmV3UHJvcGVydGllc1xuICAgIHRoaXMucHJvcGVydGllcy5pZCA9IHRoaXMuaWRcblxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXByb3BlcnRpZXMnLCB7b2xkUHJvcGVydGllcywgbmV3UHJvcGVydGllc30pXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/ajenkins/.atom/packages/minimap/lib/decoration.js

'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = (function () {
  function DiffViewEditor(editor) {
    _classCallCheck(this, DiffViewEditor);

    this._editor = editor;
    this._markers = [];
    this._currentSelection = null;
    this._oldPlaceholderText = editor.getPlaceholderText();
    editor.setPlaceholderText('Paste what you want to diff here!');
  }

  /**
   * Creates a decoration for an offset. Adds the marker to this._markers.
   *
   * @param lineNumber The line number to add the block decoration to.
   * @param numberOfLines The number of lines that the block decoration's height will be.
   * @param blockPosition Specifies whether to put the decoration before the line or after.
   */

  _createClass(DiffViewEditor, [{
    key: '_addOffsetDecoration',
    value: function _addOffsetDecoration(lineNumber, numberOfLines, blockPosition) {
      var element = document.createElement('div');
      element.className += 'split-diff-offset';
      // if no text, set height for blank lines
      element.style.minHeight = numberOfLines * this._editor.getLineHeightInPixels() + 'px';

      var marker = this._editor.markScreenPosition([lineNumber, 0], { invalidate: 'never', persistent: false });
      this._editor.decorateMarker(marker, { type: 'block', position: blockPosition, item: element });
      this._markers.push(marker);
    }

    /**
     * Adds offsets (blank lines) into the editor.
     *
     * @param lineOffsets An array of offsets (blank lines) to insert into this editor.
     */
  }, {
    key: 'setLineOffsets',
    value: function setLineOffsets(lineOffsets) {
      var offsetLineNumbers = Object.keys(lineOffsets).map(function (lineNumber) {
        return parseInt(lineNumber, 10);
      }).sort(function (x, y) {
        return x - y;
      });

      for (var offsetLineNumber of offsetLineNumbers) {
        if (offsetLineNumber == 0) {
          // add block decoration before if adding to line 0
          this._addOffsetDecoration(offsetLineNumber - 1, lineOffsets[offsetLineNumber], 'before');
        } else {
          // add block decoration after if adding to lines > 0
          this._addOffsetDecoration(offsetLineNumber - 1, lineOffsets[offsetLineNumber], 'after');
        }
      }
    }

    /**
     * Creates markers for line highlights. Adds them to this._markers. Should be
     * called before setLineOffsets since this initializes this._markers.
     *
     * @param changedLines An array of buffer line numbers that should be highlighted.
     * @param type The type of highlight to be applied to the line.
     */
  }, {
    key: 'setLineHighlights',
    value: function setLineHighlights(changedLines, highlightType) {
      if (changedLines === undefined) changedLines = [];

      var highlightClass = 'split-diff-' + highlightType;
      for (var i = 0; i < changedLines.length; i++) {
        this._markers.push(this._createLineMarker(changedLines[i][0], changedLines[i][1], highlightClass));
      }
    }

    /**
     * Creates a marker and decorates its line and line number.
     *
     * @param startLineNumber A buffer line number to start highlighting at.
     * @param endLineNumber A buffer line number to end highlighting at.
     * @param highlightClass The type of highlight to be applied to the line.
     *    Could be a value of: ['split-diff-insert', 'split-diff-delete',
     *    'split-diff-select'].
     * @return The created line marker.
     */
  }, {
    key: '_createLineMarker',
    value: function _createLineMarker(startLineNumber, endLineNumber, highlightClass) {
      var marker = this._editor.markBufferRange([[startLineNumber, 0], [endLineNumber, 0]], { invalidate: 'never', persistent: false, 'class': highlightClass });

      this._editor.decorateMarker(marker, { type: 'line-number', 'class': highlightClass });
      this._editor.decorateMarker(marker, { type: 'line', 'class': highlightClass });

      return marker;
    }

    /**
     * Highlights words in a given line.
     *
     * @param lineNumber The line number to highlight words on.
     * @param wordDiff An array of objects which look like...
     *    added: boolean (not used)
     *    count: number (not used)
     *    removed: boolean (not used)
     *    value: string
     *    changed: boolean
     * @param type The type of highlight to be applied to the words.
     */
  }, {
    key: 'setWordHighlights',
    value: function setWordHighlights(lineNumber, wordDiff, type, isWhitespaceIgnored) {
      if (wordDiff === undefined) wordDiff = [];

      var klass = 'split-diff-word-' + type;
      var count = 0;

      for (var i = 0; i < wordDiff.length; i++) {
        // if there was a change
        // AND one of these is true:
        // if the string is not spaces, highlight
        // OR
        // if the string is spaces and whitespace not ignored, highlight
        if (wordDiff[i].changed && (/\S/.test(wordDiff[i].value) || !/\S/.test(wordDiff[i].value) && !isWhitespaceIgnored)) {
          var marker = this._editor.markBufferRange([[lineNumber, count], [lineNumber, count + wordDiff[i].value.length]], { invalidate: 'never', persistent: false, 'class': klass });

          this._editor.decorateMarker(marker, { type: 'highlight', 'class': klass });
          this._markers.push(marker);
        }
        count += wordDiff[i].value.length;
      }
    }

    /**
     * Destroys all markers added to this editor by split-diff.
     */
  }, {
    key: 'destroyMarkers',
    value: function destroyMarkers() {
      for (var i = 0; i < this._markers.length; i++) {
        this._markers[i].destroy();
      }
      this._markers = [];

      this.deselectAllLines();
      this._editor.setPlaceholderText(this._oldPlaceholderText);
    }

    /**
     * Not added to this._markers because we want it to persist between updates.
     *
     * @param startLine The line number that the selection starts at.
     * @param endLine The line number that the selection ends at (non-inclusive).
     */
  }, {
    key: 'selectLines',
    value: function selectLines(startLine, endLine) {
      // don't want to highlight if they are the same (same numbers means chunk is
      // just pointing to a location to copy-to-right/copy-to-left)
      if (startLine < endLine) {
        this._currentSelection = this._createLineMarker(startLine, endLine, 'split-diff-selected');
      }
    }

    /**
     * Destroy the selection markers.
     */
  }, {
    key: 'deselectAllLines',
    value: function deselectAllLines() {
      if (this._currentSelection) {
        this._currentSelection.destroy();
        this._currentSelection = null;
      }
    }

    /**
     * Enable soft wrap for this editor.
     */
  }, {
    key: 'enableSoftWrap',
    value: function enableSoftWrap() {
      try {
        this._editor.setSoftWrapped(true);
      } catch (e) {
        //console.log('Soft wrap was enabled on a text editor that does not exist.');
      }
    }

    /**
     * Removes the text editor without prompting a save.
     */
  }, {
    key: 'cleanUp',
    value: function cleanUp() {
      this._editor.setText('');
      this._editor.destroy();
    }

    /**
     * Finds cursor-touched line ranges that are marked as different in an editor
     * view.
     *
     * @return The line ranges of diffs that are touched by a cursor.
     */
  }, {
    key: 'getCursorDiffLines',
    value: function getCursorDiffLines() {
      var cursorPositions = this._editor.getCursorBufferPositions();
      var touchedLines = [];

      for (var i = 0; i < cursorPositions.length; i++) {
        for (var j = 0; j < this._markers.length; j++) {
          var markerRange = this._markers[j].getBufferRange();

          if (cursorPositions[i].row >= markerRange.start.row && cursorPositions[i].row < markerRange.end.row) {
            touchedLines.push(markerRange);
            break;
          }
        }
      }

      // put the chunks in order so the copy function doesn't mess up
      touchedLines.sort(function (lineA, lineB) {
        return lineA.start.row - lineB.start.row;
      });

      return touchedLines;
    }

    /**
     * Used to get the Text Editor object for this view. Helpful for calling basic
     * Atom Text Editor functions.
     *
     * @return The Text Editor object for this view.
     */
  }, {
    key: 'getEditor',
    value: function getEditor() {
      return this._editor;
    }
  }]);

  return DiffViewEditor;
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2dpdC10aW1lLW1hY2hpbmUvbm9kZV9tb2R1bGVzL3NwbGl0LWRpZmYvbGliL2J1aWxkLWxpbmVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7O0FBRVgsTUFBTSxDQUFDLE9BQU87QUFLRCxXQUxVLGNBQWMsQ0FLdkIsTUFBTSxFQUFFOzBCQUxDLGNBQWM7O0FBTWpDLFFBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7QUFDOUIsUUFBSSxDQUFDLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0FBQ3ZELFVBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0dBQ2hFOzs7Ozs7Ozs7O2VBWG9CLGNBQWM7O1dBb0JmLDhCQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFRO0FBQ25FLFVBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUMsYUFBTyxDQUFDLFNBQVMsSUFBSSxtQkFBbUIsQ0FBQzs7QUFFekMsYUFBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsQUFBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxHQUFJLElBQUksQ0FBQzs7QUFFeEYsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7QUFDeEcsVUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEVB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QUFjLEVBQUUsQ0FBQzs7QUFFcEQsY0FBSSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUM5QyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO0FBQy9DLHdCQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQy9CLGtCQUFNO1dBQ1Q7U0FDRjtPQUNGOzs7QUFHRCxrQkFBWSxDQUFDLElBQUksQ0FBQyxVQUFTLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDdkMsZUFBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztPQUMxQyxDQUFDLENBQUM7O0FBRUgsYUFBTyxZQUFZLENBQUM7S0FDckI7Ozs7Ozs7Ozs7V0FRUSxxQkFBZTtBQUN0QixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDckI7OztTQW5Ob0IsY0FBYztJQW9OcEMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvYWplbmtpbnMvLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9naXQtdGltZS1tYWNoaW5lL25vZGVfbW9kdWxlcy9zcGxpdC1kaWZmL2xpYi9idWlsZC1saW5lcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRGlmZlZpZXdFZGl0b3Ige1xuICBfZWRpdG9yOiBPYmplY3Q7XG4gIF9tYXJrZXJzOiBBcnJheTxhdG9tJE1hcmtlcj47XG4gIF9jdXJyZW50U2VsZWN0aW9uOiBBcnJheTxhdG9tJE1hcmtlcj47XG5cbiAgY29uc3RydWN0b3IoZWRpdG9yKSB7XG4gICAgdGhpcy5fZWRpdG9yID0gZWRpdG9yO1xuICAgIHRoaXMuX21hcmtlcnMgPSBbXTtcbiAgICB0aGlzLl9jdXJyZW50U2VsZWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLl9vbGRQbGFjZWhvbGRlclRleHQgPSBlZGl0b3IuZ2V0UGxhY2Vob2xkZXJUZXh0KCk7XG4gICAgZWRpdG9yLnNldFBsYWNlaG9sZGVyVGV4dCgnUGFzdGUgd2hhdCB5b3Ugd2FudCB0byBkaWZmIGhlcmUhJyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGRlY29yYXRpb24gZm9yIGFuIG9mZnNldC4gQWRkcyB0aGUgbWFya2VyIHRvIHRoaXMuX21hcmtlcnMuXG4gICAqXG4gICAqIEBwYXJhbSBsaW5lTnVtYmVyIFRoZSBsaW5lIG51bWJlciB0byBhZGQgdGhlIGJsb2NrIGRlY29yYXRpb24gdG8uXG4gICAqIEBwYXJhbSBudW1iZXJPZkxpbmVzIFRoZSBudW1iZXIgb2YgbGluZXMgdGhhdCB0aGUgYmxvY2sgZGVjb3JhdGlvbidzIGhlaWdodCB3aWxsIGJlLlxuICAgKiBAcGFyYW0gYmxvY2tQb3NpdGlvbiBTcGVjaWZpZXMgd2hldGhlciB0byBwdXQgdGhlIGRlY29yYXRpb24gYmVmb3JlIHRoZSBsaW5lIG9yIGFmdGVyLlxuICAgKi9cbiAgX2FkZE9mZnNldERlY29yYXRpb24obGluZU51bWJlciwgbnVtYmVyT2ZMaW5lcywgYmxvY2tQb3NpdGlvbik6IHZvaWQge1xuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWxlbWVudC5jbGFzc05hbWUgKz0gJ3NwbGl0LWRpZmYtb2Zmc2V0JztcbiAgICAvLyBpZiBubyB0ZXh0LCBzZXQgaGVpZ2h0IGZvciBibGFuayBsaW5lc1xuICAgIGVsZW1lbnQuc3R5bGUubWluSGVpZ2h0ID0gKG51bWJlck9mTGluZXMgKiB0aGlzLl9lZGl0b3IuZ2V0TGluZUhlaWdodEluUGl4ZWxzKCkpICsgJ3B4JztcblxuICAgIHZhciBtYXJrZXIgPSB0aGlzLl9lZGl0b3IubWFya1NjcmVlblBvc2l0aW9uKFtsaW5lTnVtYmVyLCAwXSwge2ludmFsaWRhdGU6ICduZXZlcicsIHBlcnNpc3RlbnQ6IGZhbHNlfSk7XG4gICAgdGhpcy5fZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICdibG9jaycsIHBvc2l0aW9uOiBibG9ja1Bvc2l0aW9uLCBpdGVtOiBlbGVtZW50fSk7XG4gICAgdGhpcy5fbWFya2Vycy5wdXNoKG1hcmtlcik7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBvZmZzZXRzIChibGFuayBsaW5lcykgaW50byB0aGUgZWRpdG9yLlxuICAgKlxuICAgKiBAcGFyYW0gbGluZU9mZnNldHMgQW4gYXJyYXkgb2Ygb2Zmc2V0cyAoYmxhbmsgbGluZXMpIHRvIGluc2VydCBpbnRvIHRoaXMgZWRpdG9yLlxuICAgKi9cbiAgc2V0TGluZU9mZnNldHMobGluZU9mZnNldHM6IGFueSk6IHZvaWQge1xuICAgIHZhciBvZmZzZXRMaW5lTnVtYmVycyA9IE9iamVjdC5rZXlzKGxpbmVPZmZzZXRzKS5tYXAobGluZU51bWJlciA9PiBwYXJzZUludChsaW5lTnVtYmVyLCAxMCkpLnNvcnQoKHgsIHkpID0+IHggLSB5KTtcblxuICAgIGZvciAodmFyIG9mZnNldExpbmVOdW1iZXIgb2Ygb2Zmc2V0TGluZU51bWJlcnMpIHtcbiAgICAgIGlmIChvZmZzZXRMaW5lTnVtYmVyID09IDApIHtcbiAgICAgICAgLy8gYWRkIGJsb2NrIGRlY29yYXRpb24gYmVmb3JlIGlmIGFkZGluZyB0byBsaW5lIDBcbiAgICAgICAgdGhpcy5fYWRkT2Zmc2V0RGVjb3JhdGlvbihvZmZzZXRMaW5lTnVtYmVyLTEsIGxpbmVPZmZzZXRzW29mZnNldExpbmVOdW1iZXJdLCAnYmVmb3JlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBhZGQgYmxvY2sgZGVjb3JhdGlvbiBhZnRlciBpZiBhZGRpbmcgdG8gbGluZXMgPiAwXG4gICAgICAgIHRoaXMuX2FkZE9mZnNldERlY29yYXRpb24ob2Zmc2V0TGluZU51bWJlci0xLCBsaW5lT2Zmc2V0c1tvZmZzZXRMaW5lTnVtYmVyXSwgJ2FmdGVyJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgbWFya2VycyBmb3IgbGluZSBoaWdobGlnaHRzLiBBZGRzIHRoZW0gdG8gdGhpcy5fbWFya2Vycy4gU2hvdWxkIGJlXG4gICAqIGNhbGxlZCBiZWZvcmUgc2V0TGluZU9mZnNldHMgc2luY2UgdGhpcyBpbml0aWFsaXplcyB0aGlzLl9tYXJrZXJzLlxuICAgKlxuICAgKiBAcGFyYW0gY2hhbmdlZExpbmVzIEFuIGFycmF5IG9mIGJ1ZmZlciBsaW5lIG51bWJlcnMgdGhhdCBzaG91bGQgYmUgaGlnaGxpZ2h0ZWQuXG4gICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIGhpZ2hsaWdodCB0byBiZSBhcHBsaWVkIHRvIHRoZSBsaW5lLlxuICAgKi9cbiAgc2V0TGluZUhpZ2hsaWdodHMoY2hhbmdlZExpbmVzOiBBcnJheTxudW1iZXI+ID0gW10sIGhpZ2hsaWdodFR5cGU6IHN0cmluZyk6IHZvaWQge1xuICAgIHZhciBoaWdobGlnaHRDbGFzcyA9ICdzcGxpdC1kaWZmLScgKyBoaWdobGlnaHRUeXBlO1xuICAgIGZvciAodmFyIGk9MDsgaTxjaGFuZ2VkTGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuX21hcmtlcnMucHVzaCh0aGlzLl9jcmVhdGVMaW5lTWFya2VyKGNoYW5nZWRMaW5lc1tpXVswXSwgY2hhbmdlZExpbmVzW2ldWzFdLCBoaWdobGlnaHRDbGFzcykpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbWFya2VyIGFuZCBkZWNvcmF0ZXMgaXRzIGxpbmUgYW5kIGxpbmUgbnVtYmVyLlxuICAgKlxuICAgKiBAcGFyYW0gc3RhcnRMaW5lTnVtYmVyIEEgYnVmZmVyIGxpbmUgbnVtYmVyIHRvIHN0YXJ0IGhpZ2hsaWdodGluZyBhdC5cbiAgICogQHBhcmFtIGVuZExpbmVOdW1iZXIgQSBidWZmZXIgbGluZSBudW1iZXIgdG8gZW5kIGhpZ2hsaWdodGluZyBhdC5cbiAgICogQHBhcmFtIGhpZ2hsaWdodENsYXNzIFRoZSB0eXBlIG9mIGhpZ2hsaWdodCB0byBiZSBhcHBsaWVkIHRvIHRoZSBsaW5lLlxuICAgKiAgICBDb3VsZCBiZSBhIHZhbHVlIG9mOiBbJ3NwbGl0LWRpZmYtaW5zZXJ0JywgJ3NwbGl0LWRpZmYtZGVsZXRlJyxcbiAgICogICAgJ3NwbGl0LWRpZmYtc2VsZWN0J10uXG4gICAqIEByZXR1cm4gVGhlIGNyZWF0ZWQgbGluZSBtYXJrZXIuXG4gICAqL1xuICBfY3JlYXRlTGluZU1hcmtlcihzdGFydExpbmVOdW1iZXI6IG51bWJlciwgZW5kTGluZU51bWJlcjogbnVtYmVyLCBoaWdobGlnaHRDbGFzczogc3RyaW5nKTogYXRvbSRNYXJrZXIge1xuICAgIHZhciBtYXJrZXIgPSB0aGlzLl9lZGl0b3IubWFya0J1ZmZlclJhbmdlKFtbc3RhcnRMaW5lTnVtYmVyLCAwXSwgW2VuZExpbmVOdW1iZXIsIDBdXSwge2ludmFsaWRhdGU6ICduZXZlcicsIHBlcnNpc3RlbnQ6IGZhbHNlLCBjbGFzczogaGlnaGxpZ2h0Q2xhc3N9KVxuXG4gICAgdGhpcy5fZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICdsaW5lLW51bWJlcicsIGNsYXNzOiBoaWdobGlnaHRDbGFzc30pO1xuICAgIHRoaXMuX2VkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHt0eXBlOiAnbGluZScsIGNsYXNzOiBoaWdobGlnaHRDbGFzc30pO1xuXG4gICAgcmV0dXJuIG1hcmtlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWdobGlnaHRzIHdvcmRzIGluIGEgZ2l2ZW4gbGluZS5cbiAgICpcbiAgICogQHBhcmFtIGxpbmVOdW1iZXIgVGhlIGxpbmUgbnVtYmVyIHRvIGhpZ2hsaWdodCB3b3JkcyBvbi5cbiAgICogQHBhcmFtIHdvcmREaWZmIEFuIGFycmF5IG9mIG9iamVjdHMgd2hpY2ggbG9vayBsaWtlLi4uXG4gICAqICAgIGFkZGVkOiBib29sZWFuIChub3QgdXNlZClcbiAgICogICAgY291bnQ6IG51bWJlciAobm90IHVzZWQpXG4gICAqICAgIHJlbW92ZWQ6IGJvb2xlYW4gKG5vdCB1c2VkKVxuICAgKiAgICB2YWx1ZTogc3RyaW5nXG4gICAqICAgIGNoYW5nZWQ6IGJvb2xlYW5cbiAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgaGlnaGxpZ2h0IHRvIGJlIGFwcGxpZWQgdG8gdGhlIHdvcmRzLlxuICAgKi9cbiAgc2V0V29yZEhpZ2hsaWdodHMobGluZU51bWJlcjogbnVtYmVyLCB3b3JkRGlmZjogQXJyYXk8YW55PiA9IFtdLCB0eXBlOiBzdHJpbmcsIGlzV2hpdGVzcGFjZUlnbm9yZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB2YXIga2xhc3MgPSAnc3BsaXQtZGlmZi13b3JkLScgKyB0eXBlO1xuICAgIHZhciBjb3VudCA9IDA7XG5cbiAgICBmb3IgKHZhciBpPTA7IGk8d29yZERpZmYubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIGlmIHRoZXJlIHdhcyBhIGNoYW5nZVxuICAgICAgLy8gQU5EIG9uZSBvZiB0aGVzZSBpcyB0cnVlOlxuICAgICAgLy8gaWYgdGhlIHN0cmluZyBpcyBub3Qgc3BhY2VzLCBoaWdobGlnaHRcbiAgICAgIC8vIE9SXG4gICAgICAvLyBpZiB0aGUgc3RyaW5nIGlzIHNwYWNlcyBhbmQgd2hpdGVzcGFjZSBub3QgaWdub3JlZCwgaGlnaGxpZ2h0XG4gICAgICBpZiAod29yZERpZmZbaV0uY2hhbmdlZFxuICAgICAgICAmJiAoL1xcUy8udGVzdCh3b3JkRGlmZltpXS52YWx1ZSlcbiAgICAgICAgfHwgKCEvXFxTLy50ZXN0KHdvcmREaWZmW2ldLnZhbHVlKSAmJiAhaXNXaGl0ZXNwYWNlSWdub3JlZCkpKSB7XG4gICAgICAgIHZhciBtYXJrZXIgPSB0aGlzLl9lZGl0b3IubWFya0J1ZmZlclJhbmdlKFtbbGluZU51bWJlciwgY291bnRdLCBbbGluZU51bWJlciwgKGNvdW50ICsgd29yZERpZmZbaV0udmFsdWUubGVuZ3RoKV1dLCB7aW52YWxpZGF0ZTogJ25ldmVyJywgcGVyc2lzdGVudDogZmFsc2UsIGNsYXNzOiBrbGFzc30pXG5cbiAgICAgICAgdGhpcy5fZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICdoaWdobGlnaHQnLCBjbGFzczoga2xhc3N9KTtcbiAgICAgICAgdGhpcy5fbWFya2Vycy5wdXNoKG1hcmtlcik7XG4gICAgICB9XG4gICAgICBjb3VudCArPSB3b3JkRGlmZltpXS52YWx1ZS5sZW5ndGg7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIGFsbCBtYXJrZXJzIGFkZGVkIHRvIHRoaXMgZWRpdG9yIGJ5IHNwbGl0LWRpZmYuXG4gICAqL1xuICBkZXN0cm95TWFya2VycygpOiB2b2lkIHtcbiAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5fbWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5fbWFya2Vyc1tpXS5kZXN0cm95KCk7XG4gICAgfVxuICAgIHRoaXMuX21hcmtlcnMgPSBbXTtcblxuICAgIHRoaXMuZGVzZWxlY3RBbGxMaW5lcygpO1xuICAgIHRoaXMuX2VkaXRvci5zZXRQbGFjZWhvbGRlclRleHQodGhpcy5fb2xkUGxhY2Vob2xkZXJUZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3QgYWRkZWQgdG8gdGhpcy5fbWFya2VycyBiZWNhdXNlIHdlIHdhbnQgaXQgdG8gcGVyc2lzdCBiZXR3ZWVuIHVwZGF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBzdGFydExpbmUgVGhlIGxpbmUgbnVtYmVyIHRoYXQgdGhlIHNlbGVjdGlvbiBzdGFydHMgYXQuXG4gICAqIEBwYXJhbSBlbmRMaW5lIFRoZSBsaW5lIG51bWJlciB0aGF0IHRoZSBzZWxlY3Rpb24gZW5kcyBhdCAobm9uLWluY2x1c2l2ZSkuXG4gICAqL1xuICBzZWxlY3RMaW5lcyhzdGFydExpbmU6IG51bWJlciwgZW5kTGluZTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gZG9uJ3Qgd2FudCB0byBoaWdobGlnaHQgaWYgdGhleSBhcmUgdGhlIHNhbWUgKHNhbWUgbnVtYmVycyBtZWFucyBjaHVuayBpc1xuICAgIC8vIGp1c3QgcG9pbnRpbmcgdG8gYSBsb2NhdGlvbiB0byBjb3B5LXRvLXJpZ2h0L2NvcHktdG8tbGVmdClcbiAgICBpZiAoc3RhcnRMaW5lIDwgZW5kTGluZSkge1xuICAgICAgdGhpcy5fY3VycmVudFNlbGVjdGlvbiA9IHRoaXMuX2NyZWF0ZUxpbmVNYXJrZXIoc3RhcnRMaW5lLCBlbmRMaW5lLCAnc3BsaXQtZGlmZi1zZWxlY3RlZCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBzZWxlY3Rpb24gbWFya2Vycy5cbiAgICovXG4gIGRlc2VsZWN0QWxsTGluZXMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2N1cnJlbnRTZWxlY3Rpb24pIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRTZWxlY3Rpb24uZGVzdHJveSgpO1xuICAgICAgdGhpcy5fY3VycmVudFNlbGVjdGlvbiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVuYWJsZSBzb2Z0IHdyYXAgZm9yIHRoaXMgZWRpdG9yLlxuICAgKi9cbiAgZW5hYmxlU29mdFdyYXAoKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2VkaXRvci5zZXRTb2Z0V3JhcHBlZCh0cnVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKCdTb2Z0IHdyYXAgd2FzIGVuYWJsZWQgb24gYSB0ZXh0IGVkaXRvciB0aGF0IGRvZXMgbm90IGV4aXN0LicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSB0ZXh0IGVkaXRvciB3aXRob3V0IHByb21wdGluZyBhIHNhdmUuXG4gICAqL1xuICBjbGVhblVwKCk6IHZvaWQge1xuICAgIHRoaXMuX2VkaXRvci5zZXRUZXh0KCcnKTtcbiAgICB0aGlzLl9lZGl0b3IuZGVzdHJveSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGN1cnNvci10b3VjaGVkIGxpbmUgcmFuZ2VzIHRoYXQgYXJlIG1hcmtlZCBhcyBkaWZmZXJlbnQgaW4gYW4gZWRpdG9yXG4gICAqIHZpZXcuXG4gICAqXG4gICAqIEByZXR1cm4gVGhlIGxpbmUgcmFuZ2VzIG9mIGRpZmZzIHRoYXQgYXJlIHRvdWNoZWQgYnkgYSBjdXJzb3IuXG4gICAqL1xuICBnZXRDdXJzb3JEaWZmTGluZXMoKTogYm9vbGVhbiB7XG4gICAgdmFyIGN1cnNvclBvc2l0aW9ucyA9IHRoaXMuX2VkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMoKTtcbiAgICB2YXIgdG91Y2hlZExpbmVzID0gW107XG5cbiAgICBmb3IgKHZhciBpPTA7IGk8Y3Vyc29yUG9zaXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqPTA7IGo8dGhpcy5fbWFya2Vycy5sZW5ndGg7IGorKykge1xuICAgICAgICB2YXIgbWFya2VyUmFuZ2UgPSB0aGlzLl9tYXJrZXJzW2pdLmdldEJ1ZmZlclJhbmdlKCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoY3Vyc29yUG9zaXRpb25zW2ldLnJvdyA+PSBtYXJrZXJSYW5nZS5zdGFydC5yb3dcbiAgICAgICAgICAmJiBjdXJzb3JQb3NpdGlvbnNbaV0ucm93IDwgbWFya2VyUmFuZ2UuZW5kLnJvdykge1xuICAgICAgICAgICAgdG91Y2hlZExpbmVzLnB1c2gobWFya2VyUmFuZ2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBwdXQgdGhlIGNodW5rcyBpbiBvcmRlciBzbyB0aGUgY29weSBmdW5jdGlvbiBkb2Vzbid0IG1lc3MgdXBcbiAgICB0b3VjaGVkTGluZXMuc29ydChmdW5jdGlvbihsaW5lQSwgbGluZUIpIHtcbiAgICAgIHJldHVybiBsaW5lQS5zdGFydC5yb3cgLSBsaW5lQi5zdGFydC5yb3c7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdG91Y2hlZExpbmVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gZ2V0IHRoZSBUZXh0IEVkaXRvciBvYmplY3QgZm9yIHRoaXMgdmlldy4gSGVscGZ1bCBmb3IgY2FsbGluZyBiYXNpY1xuICAgKiBBdG9tIFRleHQgRWRpdG9yIGZ1bmN0aW9ucy5cbiAgICpcbiAgICogQHJldHVybiBUaGUgVGV4dCBFZGl0b3Igb2JqZWN0IGZvciB0aGlzIHZpZXcuXG4gICAqL1xuICBnZXRFZGl0b3IoKTogVGV4dEVkaXRvciB7XG4gICAgcmV0dXJuIHRoaXMuX2VkaXRvcjtcbiAgfVxufTtcbiJdfQ==
//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/git-time-machine/node_modules/split-diff/lib/build-lines.js

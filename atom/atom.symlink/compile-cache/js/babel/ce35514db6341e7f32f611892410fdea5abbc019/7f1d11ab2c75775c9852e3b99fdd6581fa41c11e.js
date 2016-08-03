function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('./helpers/workspace');

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _libMinimap = require('../lib/minimap');

var _libMinimap2 = _interopRequireDefault(_libMinimap);

'use babel';

describe('Minimap', function () {
  var _ref = [];
  var editor = _ref[0];
  var editorElement = _ref[1];
  var minimap = _ref[2];
  var largeSample = _ref[3];
  var smallSample = _ref[4];
  var minimapVerticalScaleFactor = _ref[5];
  var minimapHorizontalScaleFactor = _ref[6];

  beforeEach(function () {
    atom.config.set('minimap.charHeight', 4);
    atom.config.set('minimap.charWidth', 2);
    atom.config.set('minimap.interline', 1);

    editor = atom.workspace.buildTextEditor({});

    editorElement = atom.views.getView(editor);
    jasmine.attachToDOM(editorElement);
    editorElement.setHeight(50);
    editorElement.setWidth(200);

    minimapVerticalScaleFactor = 5 / editor.getLineHeightInPixels();
    minimapHorizontalScaleFactor = 2 / editor.getDefaultCharWidth();

    var dir = atom.project.getDirectories()[0];

    minimap = new _libMinimap2['default']({ textEditor: editor });
    largeSample = _fsPlus2['default'].readFileSync(dir.resolve('large-file.coffee')).toString();
    smallSample = _fsPlus2['default'].readFileSync(dir.resolve('sample.coffee')).toString();
  });

  it('has an associated editor', function () {
    expect(minimap.getTextEditor()).toEqual(editor);
  });

  it('returns false when asked if destroyed', function () {
    expect(minimap.isDestroyed()).toBeFalsy();
  });

  it('raise an exception if created without a text editor', function () {
    expect(function () {
      return new _libMinimap2['default']();
    }).toThrow();
  });

  it('measures the minimap size based on the current editor content', function () {
    editor.setText(smallSample);
    expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);

    editor.setText(largeSample);
    expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
  });

  it('measures the scaling factor between the editor and the minimap', function () {
    expect(minimap.getVerticalScaleFactor()).toEqual(minimapVerticalScaleFactor);
    expect(minimap.getHorizontalScaleFactor()).toEqual(minimapHorizontalScaleFactor);
  });

  it('measures the editor visible area size at minimap scale', function () {
    editor.setText(largeSample);
    expect(minimap.getTextEditorScaledHeight()).toEqual(50 * minimapVerticalScaleFactor);
  });

  it('measures the available minimap scroll', function () {
    editor.setText(largeSample);
    var largeLineCount = editor.getScreenLineCount();

    expect(minimap.getMaxScrollTop()).toEqual(largeLineCount * 5 - 50);
    expect(minimap.canScroll()).toBeTruthy();
  });

  it('computes the first visible row in the minimap', function () {
    expect(minimap.getFirstVisibleScreenRow()).toEqual(0);
  });

  it('computes the last visible row in the minimap', function () {
    expect(minimap.getLastVisibleScreenRow()).toEqual(10);
  });

  it('relays change events from the text editor', function () {
    var changeSpy = jasmine.createSpy('didChange');
    minimap.onDidChange(changeSpy);

    editor.setText('foo');

    expect(changeSpy).toHaveBeenCalled();
  });

  it('relays scroll top events from the editor', function () {
    editor.setText(largeSample);

    var scrollSpy = jasmine.createSpy('didScroll');
    minimap.onDidChangeScrollTop(scrollSpy);

    editorElement.setScrollTop(100);

    expect(scrollSpy).toHaveBeenCalled();
  });

  it('relays scroll left events from the editor', function () {
    editor.setText(largeSample);

    var scrollSpy = jasmine.createSpy('didScroll');
    minimap.onDidChangeScrollLeft(scrollSpy);

    // Seems like text without a view aren't able to scroll horizontally
    // even when its width was set.
    spyOn(editorElement, 'getScrollWidth').andReturn(10000);

    editorElement.setScrollLeft(100);

    expect(scrollSpy).toHaveBeenCalled();
  });

  describe('when scrols past end is enabled', function () {
    beforeEach(function () {
      editor.setText(largeSample);
      atom.config.set('editor.scrollPastEnd', true);
    });

    it('adjust the scrolling ratio', function () {
      editorElement.setScrollTop(editorElement.getScrollHeight());

      var maxScrollTop = editorElement.getScrollHeight() - editorElement.getHeight() - (editorElement.getHeight() - 3 * editor.getLineHeightInPixels());

      expect(minimap.getTextEditorScrollRatio()).toEqual(editorElement.getScrollTop() / maxScrollTop);
    });

    it('lock the minimap scroll top to 1', function () {
      editorElement.setScrollTop(editorElement.getScrollHeight());
      expect(minimap.getScrollTop()).toEqual(minimap.getMaxScrollTop());
    });

    describe('getTextEditorScrollRatio(), when getScrollTop() and maxScrollTop both equal 0', function () {
      beforeEach(function () {
        editor.setText(smallSample);
        editorElement.setHeight(40);
        atom.config.set('editor.scrollPastEnd', true);
      });

      it('returns 0', function () {
        editorElement.setScrollTop(0);
        expect(minimap.getTextEditorScrollRatio()).toEqual(0);
      });
    });
  });

  describe('when soft wrap is enabled', function () {
    beforeEach(function () {
      atom.config.set('editor.softWrap', true);
      atom.config.set('editor.softWrapAtPreferredLineLength', true);
      atom.config.set('editor.preferredLineLength', 2);
    });

    it('measures the minimap using screen lines', function () {
      editor.setText(smallSample);
      expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);

      editor.setText(largeSample);
      expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
    });
  });

  describe('when there is no scrolling needed to display the whole minimap', function () {
    it('returns 0 when computing the minimap scroll', function () {
      expect(minimap.getScrollTop()).toEqual(0);
    });

    it('returns 0 when measuring the available minimap scroll', function () {
      editor.setText(smallSample);

      expect(minimap.getMaxScrollTop()).toEqual(0);
      expect(minimap.canScroll()).toBeFalsy();
    });
  });

  describe('when the editor is scrolled', function () {
    var _ref2 = [];
    var largeLineCount = _ref2[0];
    var editorScrollRatio = _ref2[1];

    beforeEach(function () {
      // Same here, without a view, the getScrollWidth method always returns 1
      // and the test fails because the capped scroll left value always end up
      // to be 0, inducing errors in computations.
      spyOn(editorElement, 'getScrollWidth').andReturn(10000);

      editor.setText(largeSample);
      editorElement.setScrollTop(1000);
      editorElement.setScrollLeft(200);

      largeLineCount = editor.getScreenLineCount();
      editorScrollRatio = editorElement.getScrollTop() / (editorElement.getScrollHeight() - editorElement.getHeight());
    });

    it('scales the editor scroll based on the minimap scale factor', function () {
      expect(minimap.getTextEditorScaledScrollTop()).toEqual(1000 * minimapVerticalScaleFactor);
      expect(minimap.getTextEditorScaledScrollLeft()).toEqual(200 * minimapHorizontalScaleFactor);
    });

    it('computes the offset to apply based on the editor scroll top', function () {
      expect(minimap.getScrollTop()).toEqual(editorScrollRatio * minimap.getMaxScrollTop());
    });

    it('computes the first visible row in the minimap', function () {
      expect(minimap.getFirstVisibleScreenRow()).toEqual(58);
    });

    it('computes the last visible row in the minimap', function () {
      expect(minimap.getLastVisibleScreenRow()).toEqual(69);
    });

    describe('down to the bottom', function () {
      beforeEach(function () {
        editorElement.setScrollTop(editorElement.getScrollHeight());
        editorScrollRatio = editorElement.getScrollTop() / editorElement.getScrollHeight();
      });

      it('computes an offset that scrolls the minimap to the bottom edge', function () {
        expect(minimap.getScrollTop()).toEqual(minimap.getMaxScrollTop());
      });

      it('computes the first visible row in the minimap', function () {
        expect(minimap.getFirstVisibleScreenRow()).toEqual(largeLineCount - 10);
      });

      it('computes the last visible row in the minimap', function () {
        expect(minimap.getLastVisibleScreenRow()).toEqual(largeLineCount);
      });
    });
  });

  describe('destroying the model', function () {
    it('emits a did-destroy event', function () {
      var spy = jasmine.createSpy('destroy');
      minimap.onDidDestroy(spy);

      minimap.destroy();

      expect(spy).toHaveBeenCalled();
    });

    it('returns true when asked if destroyed', function () {
      minimap.destroy();
      expect(minimap.isDestroyed()).toBeTruthy();
    });
  });

  describe('destroying the text editor', function () {
    it('destroys the model', function () {
      spyOn(minimap, 'destroy');

      editor.destroy();

      expect(minimap.destroy).toHaveBeenCalled();
    });
  });

  describe('with scoped settings', function () {
    beforeEach(function () {
      waitsForPromise(function () {
        return atom.packages.activatePackage('language-javascript');
      });

      runs(function () {
        var opts = { scopeSelector: '.source.js' };

        atom.config.set('minimap.charHeight', 8, opts);
        atom.config.set('minimap.charWidth', 4, opts);
        atom.config.set('minimap.interline', 2, opts);

        editor.setGrammar(atom.grammars.grammarForScopeName('source.js'));
      });
    });

    it('honors the scoped settings for the current editor new grammar', function () {
      expect(minimap.getCharHeight()).toEqual(8);
      expect(minimap.getCharWidth()).toEqual(4);
      expect(minimap.getInterline()).toEqual(2);
    });
  });

  describe('when independentMinimapScroll is true', function () {
    var editorScrollRatio = undefined;
    beforeEach(function () {
      editor.setText(largeSample);
      editorElement.setScrollTop(1000);
      editorScrollRatio = editorElement.getScrollTop() / (editorElement.getScrollHeight() - editorElement.getHeight());

      atom.config.set('minimap.independentMinimapScroll', true);
    });

    it('ignores the scroll computed from the editor and return the one of the minimap instead', function () {
      expect(minimap.getScrollTop()).toEqual(editorScrollRatio * minimap.getMaxScrollTop());

      minimap.setScrollTop(200);

      expect(minimap.getScrollTop()).toEqual(200);
    });

    describe('scrolling the editor', function () {
      it('changes the minimap scroll top', function () {
        editorElement.setScrollTop(2000);

        expect(minimap.getScrollTop()).not.toEqual(editorScrollRatio * minimap.getMaxScrollTop());
      });
    });
  });

  //    ########  ########  ######   #######
  //    ##     ## ##       ##    ## ##     ##
  //    ##     ## ##       ##       ##     ##
  //    ##     ## ######   ##       ##     ##
  //    ##     ## ##       ##       ##     ##
  //    ##     ## ##       ##    ## ##     ##
  //    ########  ########  ######   #######

  describe('::decorateMarker', function () {
    var _ref3 = [];
    var marker = _ref3[0];
    var decoration = _ref3[1];
    var changeSpy = _ref3[2];

    beforeEach(function () {
      editor.setText(largeSample);

      changeSpy = jasmine.createSpy('didChange');
      minimap.onDidChangeDecorationRange(changeSpy);

      marker = minimap.markBufferRange([[0, 6], [1, 11]]);
      decoration = minimap.decorateMarker(marker, { type: 'highlight', 'class': 'dummy' });
    });

    it('creates a decoration for the given marker', function () {
      expect(minimap.decorationsByMarkerId[marker.id]).toBeDefined();
    });

    it('creates a change corresponding to the marker range', function () {
      expect(changeSpy).toHaveBeenCalled();
      expect(changeSpy.calls[0].args[0].start).toEqual(0);
      expect(changeSpy.calls[0].args[0].end).toEqual(1);
    });

    describe('when the marker range changes', function () {
      beforeEach(function () {
        var markerChangeSpy = jasmine.createSpy('marker-did-change');
        marker.onDidChange(markerChangeSpy);
        marker.setBufferRange([[0, 6], [3, 11]]);

        waitsFor(function () {
          return markerChangeSpy.calls.length > 0;
        });
      });

      it('creates a change only for the dif between the two ranges', function () {
        expect(changeSpy).toHaveBeenCalled();
        expect(changeSpy.calls[1].args[0].start).toEqual(1);
        expect(changeSpy.calls[1].args[0].end).toEqual(3);
      });
    });

    describe('destroying the marker', function () {
      beforeEach(function () {
        marker.destroy();
      });

      it('removes the decoration from the render view', function () {
        expect(minimap.decorationsByMarkerId[marker.id]).toBeUndefined();
      });

      it('creates a change corresponding to the marker range', function () {
        expect(changeSpy.calls[1].args[0].start).toEqual(0);
        expect(changeSpy.calls[1].args[0].end).toEqual(1);
      });
    });

    describe('destroying the decoration', function () {
      beforeEach(function () {
        decoration.destroy();
      });

      it('removes the decoration from the render view', function () {
        expect(minimap.decorationsByMarkerId[marker.id]).toBeUndefined();
      });

      it('creates a change corresponding to the marker range', function () {
        expect(changeSpy.calls[1].args[0].start).toEqual(0);
        expect(changeSpy.calls[1].args[0].end).toEqual(1);
      });
    });

    describe('destroying all the decorations for the marker', function () {
      beforeEach(function () {
        minimap.removeAllDecorationsForMarker(marker);
      });

      it('removes the decoration from the render view', function () {
        expect(minimap.decorationsByMarkerId[marker.id]).toBeUndefined();
      });

      it('creates a change corresponding to the marker range', function () {
        expect(changeSpy.calls[1].args[0].start).toEqual(0);
        expect(changeSpy.calls[1].args[0].end).toEqual(1);
      });
    });

    describe('destroying the minimap', function () {
      beforeEach(function () {
        minimap.destroy();
      });

      it('removes all the previously added decorations', function () {
        expect(minimap.decorationsById).toEqual({});
        expect(minimap.decorationsByMarkerId).toEqual({});
      });

      it('prevents the creation of new decorations', function () {
        marker = editor.markBufferRange([[0, 6], [0, 11]]);
        decoration = minimap.decorateMarker(marker, { type: 'highlight', 'class': 'dummy' });

        expect(decoration).toBeUndefined();
      });
    });
  });

  describe('::decorationsByTypeThenRows', function () {
    var _ref4 = [];
    var decorations = _ref4[0];

    beforeEach(function () {
      editor.setText(largeSample);

      function createDecoration(type, range) {
        var marker = minimap.markBufferRange(range);
        minimap.decorateMarker(marker, { type: type });
      }

      createDecoration('highlight', [[6, 0], [11, 0]]);
      createDecoration('highlight', [[7, 0], [8, 0]]);
      createDecoration('highlight-over', [[1, 0], [2, 0]]);
      createDecoration('line', [[3, 0], [4, 0]]);
      createDecoration('line', [[12, 0], [12, 0]]);
      createDecoration('highlight-under', [[0, 0], [10, 1]]);

      decorations = minimap.decorationsByTypeThenRows(0, 12);
    });

    it('returns an object whose keys are the decorations types', function () {
      expect(Object.keys(decorations).sort()).toEqual(['highlight-over', 'highlight-under', 'line']);
    });

    it('stores decorations by rows within each type objects', function () {
      expect(Object.keys(decorations['highlight-over']).sort()).toEqual('1 2 6 7 8 9 10 11'.split(' ').sort());

      expect(Object.keys(decorations['line']).sort()).toEqual('3 4 12'.split(' ').sort());

      expect(Object.keys(decorations['highlight-under']).sort()).toEqual('0 1 2 3 4 5 6 7 8 9 10'.split(' ').sort());
    });

    it('stores the decorations spanning a row in the corresponding row array', function () {
      expect(decorations['highlight-over']['7'].length).toEqual(2);

      expect(decorations['line']['3'].length).toEqual(1);

      expect(decorations['highlight-under']['5'].length).toEqual(1);
    });
  });
});

//     ######  ########    ###    ##    ## ########
//    ##    ##    ##      ## ##   ###   ## ##     ##
//    ##          ##     ##   ##  ####  ## ##     ##
//     ######     ##    ##     ## ## ## ## ##     ##
//          ##    ##    ######### ##  #### ##     ##
//    ##    ##    ##    ##     ## ##   ### ##     ##
//     ######     ##    ##     ## ##    ## ########
//
//       ###    ##        #######  ##    ## ########
//      ## ##   ##       ##     ## ###   ## ##
//     ##   ##  ##       ##     ## ####  ## ##
//    ##     ## ##       ##     ## ## ## ## ######
//    ######### ##       ##     ## ##  #### ##
//    ##     ## ##       ##     ## ##   ### ##
//    ##     ## ########  #######  ##    ## ########

describe('Stand alone minimap', function () {
  var _ref5 = [];
  var editor = _ref5[0];
  var editorElement = _ref5[1];
  var minimap = _ref5[2];
  var largeSample = _ref5[3];
  var smallSample = _ref5[4];

  beforeEach(function () {
    atom.config.set('minimap.charHeight', 4);
    atom.config.set('minimap.charWidth', 2);
    atom.config.set('minimap.interline', 1);

    editor = atom.workspace.buildTextEditor({});
    editorElement = atom.views.getView(editor);
    jasmine.attachToDOM(editorElement);
    editorElement.setHeight(50);
    editorElement.setWidth(200);
    editor.setLineHeightInPixels(10);

    var dir = atom.project.getDirectories()[0];

    minimap = new _libMinimap2['default']({
      textEditor: editor,
      standAlone: true
    });

    largeSample = _fsPlus2['default'].readFileSync(dir.resolve('large-file.coffee')).toString();
    smallSample = _fsPlus2['default'].readFileSync(dir.resolve('sample.coffee')).toString();
  });

  it('has an associated editor', function () {
    expect(minimap.getTextEditor()).toEqual(editor);
  });

  it('measures the minimap size based on the current editor content', function () {
    editor.setText(smallSample);
    expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);

    editor.setText(largeSample);
    expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
  });

  it('measures the scaling factor between the editor and the minimap', function () {
    expect(minimap.getVerticalScaleFactor()).toEqual(0.5);
    expect(minimap.getHorizontalScaleFactor()).toEqual(2 / editor.getDefaultCharWidth());
  });

  it('measures the editor visible area size at minimap scale', function () {
    editor.setText(largeSample);
    expect(minimap.getTextEditorScaledHeight()).toEqual(25);
  });

  it('has a visible height based on the passed-in options', function () {
    expect(minimap.getVisibleHeight()).toEqual(5);

    editor.setText(smallSample);
    expect(minimap.getVisibleHeight()).toEqual(20);

    editor.setText(largeSample);
    expect(minimap.getVisibleHeight()).toEqual(editor.getScreenLineCount() * 5);

    minimap.height = 100;
    expect(minimap.getVisibleHeight()).toEqual(100);
  });

  it('has a visible width based on the passed-in options', function () {
    expect(minimap.getVisibleWidth()).toEqual(0);

    editor.setText(smallSample);
    expect(minimap.getVisibleWidth()).toEqual(36);

    editor.setText(largeSample);
    expect(minimap.getVisibleWidth()).toEqual(editor.getMaxScreenLineLength() * 2);

    minimap.width = 50;
    expect(minimap.getVisibleWidth()).toEqual(50);
  });

  it('measures the available minimap scroll', function () {
    editor.setText(largeSample);
    var largeLineCount = editor.getScreenLineCount();

    expect(minimap.getMaxScrollTop()).toEqual(0);
    expect(minimap.canScroll()).toBeFalsy();

    minimap.height = 100;

    expect(minimap.getMaxScrollTop()).toEqual(largeLineCount * 5 - 100);
    expect(minimap.canScroll()).toBeTruthy();
  });

  it('computes the first visible row in the minimap', function () {
    expect(minimap.getFirstVisibleScreenRow()).toEqual(0);
  });

  it('computes the last visible row in the minimap', function () {
    editor.setText(largeSample);

    expect(minimap.getLastVisibleScreenRow()).toEqual(editor.getScreenLineCount());

    minimap.height = 100;
    expect(minimap.getLastVisibleScreenRow()).toEqual(20);
  });

  it('does not relay scroll top events from the editor', function () {
    editor.setText(largeSample);

    var scrollSpy = jasmine.createSpy('didScroll');
    minimap.onDidChangeScrollTop(scrollSpy);

    editorElement.setScrollTop(100);

    expect(scrollSpy).not.toHaveBeenCalled();
  });

  it('does not relay scroll left events from the editor', function () {
    editor.setText(largeSample);

    var scrollSpy = jasmine.createSpy('didScroll');
    minimap.onDidChangeScrollLeft(scrollSpy);

    // Seems like text without a view aren't able to scroll horizontally
    // even when its width was set.
    spyOn(editorElement, 'getScrollWidth').andReturn(10000);

    editorElement.setScrollLeft(100);

    expect(scrollSpy).not.toHaveBeenCalled();
  });

  it('has a scroll top that is not bound to the text editor', function () {
    var scrollSpy = jasmine.createSpy('didScroll');
    minimap.onDidChangeScrollTop(scrollSpy);
    minimap.setScreenHeightAndWidth(100, 100);

    editor.setText(largeSample);
    editorElement.setScrollTop(1000);

    expect(minimap.getScrollTop()).toEqual(0);
    expect(scrollSpy).not.toHaveBeenCalled();

    minimap.setScrollTop(10);

    expect(minimap.getScrollTop()).toEqual(10);
    expect(scrollSpy).toHaveBeenCalled();
  });

  it('has rendering properties that can overrides the config values', function () {
    minimap.setCharWidth(8.5);
    minimap.setCharHeight(10.2);
    minimap.setInterline(10.6);

    expect(minimap.getCharWidth()).toEqual(8);
    expect(minimap.getCharHeight()).toEqual(10);
    expect(minimap.getInterline()).toEqual(10);
    expect(minimap.getLineHeight()).toEqual(20);
  });

  it('emits a config change event when a value is changed', function () {
    var changeSpy = jasmine.createSpy('did-change');
    minimap.onDidChangeConfig(changeSpy);

    minimap.setCharWidth(8.5);
    minimap.setCharHeight(10.2);
    minimap.setInterline(10.6);

    expect(changeSpy.callCount).toEqual(3);
  });

  it('returns the rounding number of devicePixelRatio', function () {
    window.devicePixelRatio = 1.25;

    minimap.setDevicePixelRatioRounding(true);

    expect(minimap.getDevicePixelRatioRounding()).toEqual(true);
    expect(minimap.getDevicePixelRatio()).toEqual(1);
  });

  it('prevents the rounding number of devicePixelRatio', function () {
    window.devicePixelRatio = 1.25;

    minimap.setDevicePixelRatioRounding(false);

    expect(minimap.getDevicePixelRatioRounding()).toEqual(false);
    expect(minimap.getDevicePixelRatio()).toEqual(1.25);
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hamVua2lucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL3NwZWMvbWluaW1hcC1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O1FBRU8scUJBQXFCOztzQkFFYixTQUFTOzs7OzBCQUNKLGdCQUFnQjs7OztBQUxwQyxXQUFXLENBQUE7O0FBT1gsUUFBUSxDQUFDLFNBQVMsRUFBRSxZQUFNO2FBQ21HLEVBQUU7TUFBeEgsTUFBTTtNQUFFLGFBQWE7TUFBRSxPQUFPO01BQUUsV0FBVztNQUFFLFdBQVc7TUFBRSwwQkFBMEI7TUFBRSw0QkFBNEI7O0FBRXZILFlBQVUsQ0FBQyxZQUFNO0FBQ2YsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDeEMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDdkMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUE7O0FBRXZDLFVBQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQTs7QUFFM0MsaUJBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUMxQyxXQUFPLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2xDLGlCQUFhLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQzNCLGlCQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBOztBQUUzQiw4QkFBMEIsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUE7QUFDL0QsZ0NBQTRCLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFBOztBQUUvRCxRQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFD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LENBQUMsQ0FBQTtHQUNqRCxDQUFDLENBQUE7O0FBRUYsSUFBRSxDQUFDLGtEQUFrRCxFQUFFLFlBQU07QUFDM0QsVUFBTSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQTs7QUFFOUIsV0FBTyxDQUFDLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxDQUFBOztBQUUxQyxVQUFNLENBQUMsT0FBTyxDQUFDLDJCQUEyQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDNUQsVUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQ3BELENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWplbmtpbnMvLmF0b20vcGFja2FnZXMvbWluaW1hcC9zcGVjL21pbmltYXAtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCAnLi9oZWxwZXJzL3dvcmtzcGFjZSdcblxuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5pbXBvcnQgTWluaW1hcCBmcm9tICcuLi9saWIvbWluaW1hcCdcblxuZGVzY3JpYmUoJ01pbmltYXAnLCAoKSA9PiB7XG4gIGxldCBbZWRpdG9yLCBlZGl0b3JFbGVtZW50LCBtaW5pbWFwLCBsYXJnZVNhbXBsZSwgc21hbGxTYW1wbGUsIG1pbmltYXBWZXJ0aWNhbFNjYWxlRmFjdG9yLCBtaW5pbWFwSG9yaXpvbnRhbFNjYWxlRmFjdG9yXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmNoYXJIZWlnaHQnLCA0KVxuICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5jaGFyV2lkdGgnLCAyKVxuICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5pbnRlcmxpbmUnLCAxKVxuXG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yKHt9KVxuXG4gICAgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgamFzbWluZS5hdHRhY2hUb0RPTShlZGl0b3JFbGVtZW50KVxuICAgIGVkaXRvckVsZW1lbnQuc2V0SGVpZ2h0KDUwKVxuICAgIGVkaXRvckVsZW1lbnQuc2V0V2lkdGgoMjAwKVxuXG4gICAgbWluaW1hcFZlcnRpY2FsU2NhbGVGYWN0b3IgPSA1IC8gZWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpXG4gICAgbWluaW1hcEhvcml6b250YWxTY2FsZUZhY3RvciA9IDIgLyBlZGl0b3IuZ2V0RGVmYXVsdENoYXJXaWR0aCgpXG5cbiAgICBsZXQgZGlyID0gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClbMF1cblxuICAgIG1pbmltYXAgPSBuZXcgTWluaW1hcCh7dGV4dEVkaXRvcjogZWRpdG9yfSlcbiAgICBsYXJnZVNhbXBsZSA9IGZzLnJlYWRGaWxlU3luYyhkaXIucmVzb2x2ZSgnbGFyZ2UtZmlsZS5jb2ZmZWUnKSkudG9TdHJpbmcoKVxuICAgIHNtYWxsU2FtcGxlID0gZnMucmVhZEZpbGVTeW5jKGRpci5yZXNvbHZlKCdzYW1wbGUuY29mZmVlJykpLnRvU3RyaW5nKClcbiAgfSlcblxuICBpdCgnaGFzIGFuIGFzc29jaWF0ZWQgZWRpdG9yJywgKCkgPT4ge1xuICAgIGV4cGVjdChtaW5pbWFwLmdldFRleHRFZGl0b3IoKSkudG9FcXVhbChlZGl0b3IpXG4gIH0pXG5cbiAgaXQoJ3JldHVybnMgZmFsc2Ugd2hlbiBhc2tlZCBpZiBkZXN0cm95ZWQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KG1pbmltYXAuaXNEZXN0cm95ZWQoKSkudG9CZUZhbHN5KClcbiAgfSlcblxuICBpdCgncmFpc2UgYW4gZXhjZXB0aW9uIGlmIGNyZWF0ZWQgd2l0aG91dCBhIHRleHQgZWRpdG9yJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB7IHJldHVybiBuZXcgTWluaW1hcCgpIH0pLnRvVGhyb3coKVxuICB9KVxuXG4gIGl0KCdtZWFzdXJlcyB0aGUgbWluaW1hcCBzaXplIGJhc2VkIG9uIHRoZSBjdXJyZW50IGVkaXRvciBjb250ZW50JywgKCkgPT4ge1xuICAgIGVkaXRvci5zZXRUZXh0KHNtYWxsU2FtcGxlKVxuICAgIGV4cGVjdChtaW5pbWFwLmdldEhlaWdodCgpKS50b0VxdWFsKGVkaXRvci5nZXRTY3JlZW5MaW5lQ291bnQoKSAqIDUpXG5cbiAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcbiAgICBleHBlY3QobWluaW1hcC5nZXRIZWlnaHQoKSkudG9FcXVhbChlZGl0b3IuZ2V0U2NyZWVuTGluZUNvdW50KCkgKiA1KVxuICB9KVxuXG4gIGl0KCdtZWFzdXJlcyB0aGUgc2NhbGluZyBmYWN0b3IgYmV0d2VlbiB0aGUgZWRpdG9yIGFuZCB0aGUgbWluaW1hcCcsICgpID0+IHtcbiAgICBleHBlY3QobWluaW1hcC5nZXRWZXJ0aWNhbFNjYWxlRmFjdG9yKCkpLnRvRXF1YWwobWluaW1hcFZlcnRpY2FsU2NhbGVGYWN0b3IpXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0SG9yaXpvbnRhbFNjYWxlRmFjdG9yKCkpLnRvRXF1YWwobWluaW1hcEhvcml6b250YWxTY2FsZUZhY3RvcilcbiAgfSlcblxuICBpdCgnbWVhc3VyZXMgdGhlIGVkaXRvciB2aXNpYmxlIGFyZWEgc2l6ZSBhdCBtaW5pbWFwIHNjYWxlJywgKCkgPT4ge1xuICAgIGVkaXRvci5zZXRUZXh0KGxhcmdlU2FtcGxlKVxuICAgIGV4cGVjdChtaW5pbWFwLmdldFRleHRFZGl0b3JTY2FsZWRIZWlnaHQoKSkudG9FcXVhbCg1MCAqIG1pbmltYXBWZXJ0aWNhbFNjYWxlRmFjdG9yKVxuICB9KVxuXG4gIGl0KCdtZWFzdXJlcyB0aGUgYXZhaWxhYmxlIG1pbmltYXAgc2Nyb2xsJywgKCkgPT4ge1xuICAgIGVkaXRvci5zZXRUZXh0KGxhcmdlU2FtcGxlKVxuICAgIGxldCBsYXJnZUxpbmVDb3VudCA9IGVkaXRvci5nZXRTY3JlZW5MaW5lQ291bnQoKVxuXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0TWF4U2Nyb2xsVG9wKCkpLnRvRXF1YWwobGFyZ2VMaW5lQ291bnQgKiA1IC0gNTApXG4gICAgZXhwZWN0KG1pbmltYXAuY2FuU2Nyb2xsKCkpLnRvQmVUcnV0aHkoKVxuICB9KVxuXG4gIGl0KCdjb21wdXRlcyB0aGUgZmlyc3QgdmlzaWJsZSByb3cgaW4gdGhlIG1pbmltYXAnLCAoKSA9PiB7XG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KCkpLnRvRXF1YWwoMClcbiAgfSlcblxuICBpdCgnY29tcHV0ZXMgdGhlIGxhc3QgdmlzaWJsZSByb3cgaW4gdGhlIG1pbmltYXAnLCAoKSA9PiB7XG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3coKSkudG9FcXVhbCgxMClcbiAgfSlcblxuICBpdCgncmVsYXlzIGNoYW5nZSBldmVudHMgZnJvbSB0aGUgdGV4dCBlZGl0b3InLCAoKSA9PiB7XG4gICAgbGV0IGNoYW5nZVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWRDaGFuZ2UnKVxuICAgIG1pbmltYXAub25EaWRDaGFuZ2UoY2hhbmdlU3B5KVxuXG4gICAgZWRpdG9yLnNldFRleHQoJ2ZvbycpXG5cbiAgICBleHBlY3QoY2hhbmdlU3B5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgfSlcblxuICBpdCgncmVsYXlzIHNjcm9sbCB0b3AgZXZlbnRzIGZyb20gdGhlIGVkaXRvcicsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcblxuICAgIGxldCBzY3JvbGxTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkU2Nyb2xsJylcbiAgICBtaW5pbWFwLm9uRGlkQ2hhbmdlU2Nyb2xsVG9wKHNjcm9sbFNweSlcblxuICAgIGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKDEwMClcblxuICAgIGV4cGVjdChzY3JvbGxTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICB9KVxuXG4gIGl0KCdyZWxheXMgc2Nyb2xsIGxlZnQgZXZlbnRzIGZyb20gdGhlIGVkaXRvcicsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcblxuICAgIGxldCBzY3JvbGxTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkU2Nyb2xsJylcbiAgICBtaW5pbWFwLm9uRGlkQ2hhbmdlU2Nyb2xsTGVmdChzY3JvbGxTcHkpXG5cbiAgICAvLyBTZWVtcyBsaWtlIHRleHQgd2l0aG91dCBhIHZpZXcgYXJlbid0IGFibGUgdG8gc2Nyb2xsIGhvcml6b250YWxseVxuICAgIC8vIGV2ZW4gd2hlbiBpdHMgd2lkdGggd2FzIHNldC5cbiAgICBzcHlPbihlZGl0b3JFbGVtZW50LCAnZ2V0U2Nyb2xsV2lkdGgnKS5hbmRSZXR1cm4oMTAwMDApXG5cbiAgICBlZGl0b3JFbGVtZW50LnNldFNjcm9sbExlZnQoMTAwKVxuXG4gICAgZXhwZWN0KHNjcm9sbFNweSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gc2Nyb2xzIHBhc3QgZW5kIGlzIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcbiAgICAgIGF0b20uY29uZmlnLnNldCgnZWRpdG9yLnNjcm9sbFBhc3RFbmQnLCB0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnYWRqdXN0IHRoZSBzY3JvbGxpbmcgcmF0aW8nLCAoKSA9PiB7XG4gICAgICBlZGl0b3JFbGVtZW50LnNldFNjcm9sbFRvcChlZGl0b3JFbGVtZW50LmdldFNjcm9sbEhlaWdodCgpKVxuXG4gICAgICBsZXQgbWF4U2Nyb2xsVG9wID0gZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxIZWlnaHQoKSAtIGVkaXRvckVsZW1lbnQuZ2V0SGVpZ2h0KCkgLSAoZWRpdG9yRWxlbWVudC5nZXRIZWlnaHQoKSAtIDMgKiBlZGl0b3IuZ2V0TGluZUhlaWdodEluUGl4ZWxzKCkpXG5cbiAgICAgIGV4cGVjdChtaW5pbWFwLmdldFRleHRFZGl0b3JTY3JvbGxSYXRpbygpKS50b0VxdWFsKGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKCkgLyBtYXhTY3JvbGxUb3ApXG4gICAgfSlcblxuICAgIGl0KCdsb2NrIHRoZSBtaW5pbWFwIHNjcm9sbCB0b3AgdG8gMScsICgpID0+IHtcbiAgICAgIGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsSGVpZ2h0KCkpXG4gICAgICBleHBlY3QobWluaW1hcC5nZXRTY3JvbGxUb3AoKSkudG9FcXVhbChtaW5pbWFwLmdldE1heFNjcm9sbFRvcCgpKVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnZ2V0VGV4dEVkaXRvclNjcm9sbFJhdGlvKCksIHdoZW4gZ2V0U2Nyb2xsVG9wKCkgYW5kIG1heFNjcm9sbFRvcCBib3RoIGVxdWFsIDAnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgZWRpdG9yLnNldFRleHQoc21hbGxTYW1wbGUpXG4gICAgICAgIGVkaXRvckVsZW1lbnQuc2V0SGVpZ2h0KDQwKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2VkaXRvci5zY3JvbGxQYXN0RW5kJywgdHJ1ZSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdyZXR1cm5zIDAnLCAoKSA9PiB7XG4gICAgICAgIGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKDApXG4gICAgICAgIGV4cGVjdChtaW5pbWFwLmdldFRleHRFZGl0b3JTY3JvbGxSYXRpbygpKS50b0VxdWFsKDApXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gc29mdCB3cmFwIGlzIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2VkaXRvci5zb2Z0V3JhcCcsIHRydWUpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2VkaXRvci5zb2Z0V3JhcEF0UHJlZmVycmVkTGluZUxlbmd0aCcsIHRydWUpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2VkaXRvci5wcmVmZXJyZWRMaW5lTGVuZ3RoJywgMilcbiAgICB9KVxuXG4gICAgaXQoJ21lYXN1cmVzIHRoZSBtaW5pbWFwIHVzaW5nIHNjcmVlbiBsaW5lcycsICgpID0+IHtcbiAgICAgIGVkaXRvci5zZXRUZXh0KHNtYWxsU2FtcGxlKVxuICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0SGVpZ2h0KCkpLnRvRXF1YWwoZWRpdG9yLmdldFNjcmVlbkxpbmVDb3VudCgpICogNSlcblxuICAgICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG4gICAgICBleHBlY3QobWluaW1hcC5nZXRIZWlnaHQoKSkudG9FcXVhbChlZGl0b3IuZ2V0U2NyZWVuTGluZUNvdW50KCkgKiA1KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gdGhlcmUgaXMgbm8gc2Nyb2xsaW5nIG5lZWRlZCB0byBkaXNwbGF5IHRoZSB3aG9sZSBtaW5pbWFwJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIDAgd2hlbiBjb21wdXRpbmcgdGhlIG1pbmltYXAgc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0U2Nyb2xsVG9wKCkpLnRvRXF1YWwoMClcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgMCB3aGVuIG1lYXN1cmluZyB0aGUgYXZhaWxhYmxlIG1pbmltYXAgc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgZWRpdG9yLnNldFRleHQoc21hbGxTYW1wbGUpXG5cbiAgICAgIGV4cGVjdChtaW5pbWFwLmdldE1heFNjcm9sbFRvcCgpKS50b0VxdWFsKDApXG4gICAgICBleHBlY3QobWluaW1hcC5jYW5TY3JvbGwoKSkudG9CZUZhbHN5KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZSBlZGl0b3IgaXMgc2Nyb2xsZWQnLCAoKSA9PiB7XG4gICAgbGV0IFtsYXJnZUxpbmVDb3VudCwgZWRpdG9yU2Nyb2xsUmF0aW9dID0gW11cblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgLy8gU2FtZSBoZXJlLCB3aXRob3V0IGEgdmlldywgdGhlIGdldFNjcm9sbFdpZHRoIG1ldGhvZCBhbHdheXMgcmV0dXJucyAxXG4gICAgICAvLyBhbmQgdGhlIHRlc3QgZmFpbHMgYmVjYXVzZSB0aGUgY2FwcGVkIHNjcm9sbCBsZWZ0IHZhbHVlIGFsd2F5cyBlbmQgdXBcbiAgICAgIC8vIHRvIGJlIDAsIGluZHVjaW5nIGVycm9ycyBpbiBjb21wdXRhdGlvbnMuXG4gICAgICBzcHlPbihlZGl0b3JFbGVtZW50LCAnZ2V0U2Nyb2xsV2lkdGgnKS5hbmRSZXR1cm4oMTAwMDApXG5cbiAgICAgIGVkaXRvci5zZXRUZXh0KGxhcmdlU2FtcGxlKVxuICAgICAgZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxUb3AoMTAwMClcbiAgICAgIGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsTGVmdCgyMDApXG5cbiAgICAgIGxhcmdlTGluZUNvdW50ID0gZWRpdG9yLmdldFNjcmVlbkxpbmVDb3VudCgpXG4gICAgICBlZGl0b3JTY3JvbGxSYXRpbyA9IGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKCkgLyAoZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxIZWlnaHQoKSAtIGVkaXRvckVsZW1lbnQuZ2V0SGVpZ2h0KCkpXG4gICAgfSlcblxuICAgIGl0KCdzY2FsZXMgdGhlIGVkaXRvciBzY3JvbGwgYmFzZWQgb24gdGhlIG1pbmltYXAgc2NhbGUgZmFjdG9yJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0VGV4dEVkaXRvclNjYWxlZFNjcm9sbFRvcCgpKS50b0VxdWFsKDEwMDAgKiBtaW5pbWFwVmVydGljYWxTY2FsZUZhY3RvcilcbiAgICAgIGV4cGVjdChtaW5pbWFwLmdldFRleHRFZGl0b3JTY2FsZWRTY3JvbGxMZWZ0KCkpLnRvRXF1YWwoMjAwICogbWluaW1hcEhvcml6b250YWxTY2FsZUZhY3RvcilcbiAgICB9KVxuXG4gICAgaXQoJ2NvbXB1dGVzIHRoZSBvZmZzZXQgdG8gYXBwbHkgYmFzZWQgb24gdGhlIGVkaXRvciBzY3JvbGwgdG9wJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0U2Nyb2xsVG9wKCkpLnRvRXF1YWwoZWRpdG9yU2Nyb2xsUmF0aW8gKiBtaW5pbWFwLmdldE1heFNjcm9sbFRvcCgpKVxuICAgIH0pXG5cbiAgICBpdCgnY29tcHV0ZXMgdGhlIGZpcnN0IHZpc2libGUgcm93IGluIHRoZSBtaW5pbWFwJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KCkpLnRvRXF1YWwoNTgpXG4gICAgfSlcblxuICAgIGl0KCdjb21wdXRlcyB0aGUgbGFzdCB2aXNpYmxlIHJvdyBpbiB0aGUgbWluaW1hcCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChtaW5pbWFwLmdldExhc3RWaXNpYmxlU2NyZWVuUm93KCkpLnRvRXF1YWwoNjkpXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdkb3duIHRvIHRoZSBib3R0b20nLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxUb3AoZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxIZWlnaHQoKSlcbiAgICAgICAgZWRpdG9yU2Nyb2xsUmF0aW8gPSBlZGl0b3JFbGVtZW50LmdldFNjcm9sbFRvcCgpIC8gZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxIZWlnaHQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2NvbXB1dGVzIGFuIG9mZnNldCB0aGF0IHNjcm9sbHMgdGhlIG1pbmltYXAgdG8gdGhlIGJvdHRvbSBlZGdlJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QobWluaW1hcC5nZXRTY3JvbGxUb3AoKSkudG9FcXVhbChtaW5pbWFwLmdldE1heFNjcm9sbFRvcCgpKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2NvbXB1dGVzIHRoZSBmaXJzdCB2aXNpYmxlIHJvdyBpbiB0aGUgbWluaW1hcCcsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KCkpLnRvRXF1YWwobGFyZ2VMaW5lQ291bnQgLSAxMClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdjb21wdXRlcyB0aGUgbGFzdCB2aXNpYmxlIHJvdyBpbiB0aGUgbWluaW1hcCcsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3coKSkudG9FcXVhbChsYXJnZUxpbmVDb3VudClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZGVzdHJveWluZyB0aGUgbW9kZWwnLCAoKSA9PiB7XG4gICAgaXQoJ2VtaXRzIGEgZGlkLWRlc3Ryb3kgZXZlbnQnLCAoKSA9PiB7XG4gICAgICBsZXQgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2Rlc3Ryb3knKVxuICAgICAgbWluaW1hcC5vbkRpZERlc3Ryb3koc3B5KVxuXG4gICAgICBtaW5pbWFwLmRlc3Ryb3koKVxuXG4gICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgdHJ1ZSB3aGVuIGFza2VkIGlmIGRlc3Ryb3llZCcsICgpID0+IHtcbiAgICAgIG1pbmltYXAuZGVzdHJveSgpXG4gICAgICBleHBlY3QobWluaW1hcC5pc0Rlc3Ryb3llZCgpKS50b0JlVHJ1dGh5KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdkZXN0cm95aW5nIHRoZSB0ZXh0IGVkaXRvcicsICgpID0+IHtcbiAgICBpdCgnZGVzdHJveXMgdGhlIG1vZGVsJywgKCkgPT4ge1xuICAgICAgc3B5T24obWluaW1hcCwgJ2Rlc3Ryb3knKVxuXG4gICAgICBlZGl0b3IuZGVzdHJveSgpXG5cbiAgICAgIGV4cGVjdChtaW5pbWFwLmRlc3Ryb3kpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3dpdGggc2NvcGVkIHNldHRpbmdzJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsYW5ndWFnZS1qYXZhc2NyaXB0JylcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBjb25zdCBvcHRzID0ge3Njb3BlU2VsZWN0b3I6ICcuc291cmNlLmpzJ31cblxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuY2hhckhlaWdodCcsIDgsIG9wdHMpXG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5jaGFyV2lkdGgnLCA0LCBvcHRzKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuaW50ZXJsaW5lJywgMiwgb3B0cylcblxuICAgICAgICBlZGl0b3Iuc2V0R3JhbW1hcihhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoJ3NvdXJjZS5qcycpKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ2hvbm9ycyB0aGUgc2NvcGVkIHNldHRpbmdzIGZvciB0aGUgY3VycmVudCBlZGl0b3IgbmV3IGdyYW1tYXInLCAoKSA9PiB7XG4gICAgICBleHBlY3QobWluaW1hcC5nZXRDaGFySGVpZ2h0KCkpLnRvRXF1YWwoOClcbiAgICAgIGV4cGVjdChtaW5pbWFwLmdldENoYXJXaWR0aCgpKS50b0VxdWFsKDQpXG4gICAgICBleHBlY3QobWluaW1hcC5nZXRJbnRlcmxpbmUoKSkudG9FcXVhbCgyKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gaW5kZXBlbmRlbnRNaW5pbWFwU2Nyb2xsIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgbGV0IGVkaXRvclNjcm9sbFJhdGlvXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcbiAgICAgIGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKDEwMDApXG4gICAgICBlZGl0b3JTY3JvbGxSYXRpbyA9IGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKCkgLyAoZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxIZWlnaHQoKSAtIGVkaXRvckVsZW1lbnQuZ2V0SGVpZ2h0KCkpXG5cbiAgICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5pbmRlcGVuZGVudE1pbmltYXBTY3JvbGwnLCB0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnaWdub3JlcyB0aGUgc2Nyb2xsIGNvbXB1dGVkIGZyb20gdGhlIGVkaXRvciBhbmQgcmV0dXJuIHRoZSBvbmUgb2YgdGhlIG1pbmltYXAgaW5zdGVhZCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChtaW5pbWFwLmdldFNjcm9sbFRvcCgpKS50b0VxdWFsKGVkaXRvclNjcm9sbFJhdGlvICogbWluaW1hcC5nZXRNYXhTY3JvbGxUb3AoKSlcblxuICAgICAgbWluaW1hcC5zZXRTY3JvbGxUb3AoMjAwKVxuXG4gICAgICBleHBlY3QobWluaW1hcC5nZXRTY3JvbGxUb3AoKSkudG9FcXVhbCgyMDApXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdzY3JvbGxpbmcgdGhlIGVkaXRvcicsICgpID0+IHtcbiAgICAgIGl0KCdjaGFuZ2VzIHRoZSBtaW5pbWFwIHNjcm9sbCB0b3AnLCAoKSA9PiB7XG4gICAgICAgIGVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKDIwMDApXG5cbiAgICAgICAgZXhwZWN0KG1pbmltYXAuZ2V0U2Nyb2xsVG9wKCkpLm5vdC50b0VxdWFsKGVkaXRvclNjcm9sbFJhdGlvICogbWluaW1hcC5nZXRNYXhTY3JvbGxUb3AoKSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAgICAjIyMjIyMjIyAgIyMjIyMjIyMgICMjIyMjIyAgICMjIyMjIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAgICMjICAgICMjICMjICAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICAgIyMgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyMjIyMgICAjIyAgICAgICAjIyAgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgIyMgIyMgICAgICMjXG4gIC8vICAgICMjIyMjIyMjICAjIyMjIyMjIyAgIyMjIyMjICAgIyMjIyMjI1xuXG4gIGRlc2NyaWJlKCc6OmRlY29yYXRlTWFya2VyJywgKCkgPT4ge1xuICAgIGxldCBbbWFya2VyLCBkZWNvcmF0aW9uLCBjaGFuZ2VTcHldID0gW11cblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG5cbiAgICAgIGNoYW5nZVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWRDaGFuZ2UnKVxuICAgICAgbWluaW1hcC5vbkRpZENoYW5nZURlY29yYXRpb25SYW5nZShjaGFuZ2VTcHkpXG5cbiAgICAgIG1hcmtlciA9IG1pbmltYXAubWFya0J1ZmZlclJhbmdlKFtbMCwgNl0sIFsxLCAxMV1dKVxuICAgICAgZGVjb3JhdGlvbiA9IG1pbmltYXAuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2hpZ2hsaWdodCcsIGNsYXNzOiAnZHVtbXknfSlcbiAgICB9KVxuXG4gICAgaXQoJ2NyZWF0ZXMgYSBkZWNvcmF0aW9uIGZvciB0aGUgZ2l2ZW4gbWFya2VyJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG1pbmltYXAuZGVjb3JhdGlvbnNCeU1hcmtlcklkW21hcmtlci5pZF0pLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ2NyZWF0ZXMgYSBjaGFuZ2UgY29ycmVzcG9uZGluZyB0byB0aGUgbWFya2VyIHJhbmdlJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGNoYW5nZVNweSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QoY2hhbmdlU3B5LmNhbGxzWzBdLmFyZ3NbMF0uc3RhcnQpLnRvRXF1YWwoMClcbiAgICAgIGV4cGVjdChjaGFuZ2VTcHkuY2FsbHNbMF0uYXJnc1swXS5lbmQpLnRvRXF1YWwoMSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3doZW4gdGhlIG1hcmtlciByYW5nZSBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIGxldCBtYXJrZXJDaGFuZ2VTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnbWFya2VyLWRpZC1jaGFuZ2UnKVxuICAgICAgICBtYXJrZXIub25EaWRDaGFuZ2UobWFya2VyQ2hhbmdlU3B5KVxuICAgICAgICBtYXJrZXIuc2V0QnVmZmVyUmFuZ2UoW1swLCA2XSwgWzMsIDExXV0pXG5cbiAgICAgICAgd2FpdHNGb3IoKCkgPT4geyByZXR1cm4gbWFya2VyQ2hhbmdlU3B5LmNhbGxzLmxlbmd0aCA+IDAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdjcmVhdGVzIGEgY2hhbmdlIG9ubHkgZm9yIHRoZSBkaWYgYmV0d2VlbiB0aGUgdHdvIHJhbmdlcycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNoYW5nZVNweSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChjaGFuZ2VTcHkuY2FsbHNbMV0uYXJnc1swXS5zdGFydCkudG9FcXVhbCgxKVxuICAgICAgICBleHBlY3QoY2hhbmdlU3B5LmNhbGxzWzFdLmFyZ3NbMF0uZW5kKS50b0VxdWFsKDMpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnZGVzdHJveWluZyB0aGUgbWFya2VyJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdyZW1vdmVzIHRoZSBkZWNvcmF0aW9uIGZyb20gdGhlIHJlbmRlciB2aWV3JywgKCkgPT4ge1xuICAgICAgICBleHBlY3QobWluaW1hcC5kZWNvcmF0aW9uc0J5TWFya2VySWRbbWFya2VyLmlkXSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnY3JlYXRlcyBhIGNoYW5nZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBtYXJrZXIgcmFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChjaGFuZ2VTcHkuY2FsbHNbMV0uYXJnc1swXS5zdGFydCkudG9FcXVhbCgwKVxuICAgICAgICBleHBlY3QoY2hhbmdlU3B5LmNhbGxzWzFdLmFyZ3NbMF0uZW5kKS50b0VxdWFsKDEpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnZGVzdHJveWluZyB0aGUgZGVjb3JhdGlvbicsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBkZWNvcmF0aW9uLmRlc3Ryb3koKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3JlbW92ZXMgdGhlIGRlY29yYXRpb24gZnJvbSB0aGUgcmVuZGVyIHZpZXcnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtaW5pbWFwLmRlY29yYXRpb25zQnlNYXJrZXJJZFttYXJrZXIuaWRdKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdjcmVhdGVzIGEgY2hhbmdlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIG1hcmtlciByYW5nZScsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNoYW5nZVNweS5jYWxsc1sxXS5hcmdzWzBdLnN0YXJ0KS50b0VxdWFsKDApXG4gICAgICAgIGV4cGVjdChjaGFuZ2VTcHkuY2FsbHNbMV0uYXJnc1swXS5lbmQpLnRvRXF1YWwoMSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdkZXN0cm95aW5nIGFsbCB0aGUgZGVjb3JhdGlvbnMgZm9yIHRoZSBtYXJrZXInLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgbWluaW1hcC5yZW1vdmVBbGxEZWNvcmF0aW9uc0Zvck1hcmtlcihtYXJrZXIpXG4gICAgICB9KVxuXG4gICAgICBpdCgncmVtb3ZlcyB0aGUgZGVjb3JhdGlvbiBmcm9tIHRoZSByZW5kZXIgdmlldycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1pbmltYXAuZGVjb3JhdGlvbnNCeU1hcmtlcklkW21hcmtlci5pZF0pLnRvQmVVbmRlZmluZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2NyZWF0ZXMgYSBjaGFuZ2UgY29ycmVzcG9uZGluZyB0byB0aGUgbWFya2VyIHJhbmdlJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoY2hhbmdlU3B5LmNhbGxzWzFdLmFyZ3NbMF0uc3RhcnQpLnRvRXF1YWwoMClcbiAgICAgICAgZXhwZWN0KGNoYW5nZVNweS5jYWxsc1sxXS5hcmdzWzBdLmVuZCkudG9FcXVhbCgxKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2Rlc3Ryb3lpbmcgdGhlIG1pbmltYXAnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgbWluaW1hcC5kZXN0cm95KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdyZW1vdmVzIGFsbCB0aGUgcHJldmlvdXNseSBhZGRlZCBkZWNvcmF0aW9ucycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1pbmltYXAuZGVjb3JhdGlvbnNCeUlkKS50b0VxdWFsKHt9KVxuICAgICAgICBleHBlY3QobWluaW1hcC5kZWNvcmF0aW9uc0J5TWFya2VySWQpLnRvRXF1YWwoe30pXG4gICAgICB9KVxuXG4gICAgICBpdCgncHJldmVudHMgdGhlIGNyZWF0aW9uIG9mIG5ldyBkZWNvcmF0aW9ucycsICgpID0+IHtcbiAgICAgICAgbWFya2VyID0gZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShbWzAsIDZdLCBbMCwgMTFdXSlcbiAgICAgICAgZGVjb3JhdGlvbiA9IG1pbmltYXAuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2hpZ2hsaWdodCcsIGNsYXNzOiAnZHVtbXknfSlcblxuICAgICAgICBleHBlY3QoZGVjb3JhdGlvbikudG9CZVVuZGVmaW5lZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJzo6ZGVjb3JhdGlvbnNCeVR5cGVUaGVuUm93cycsICgpID0+IHtcbiAgICBsZXQgW2RlY29yYXRpb25zXSA9IFtdXG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGVkaXRvci5zZXRUZXh0KGxhcmdlU2FtcGxlKVxuXG4gICAgICBmdW5jdGlvbiBjcmVhdGVEZWNvcmF0aW9uICh0eXBlLCByYW5nZSkge1xuICAgICAgICBsZXQgbWFya2VyID0gbWluaW1hcC5tYXJrQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgICAgIG1pbmltYXAuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZX0pXG4gICAgICB9XG5cbiAgICAgIGNyZWF0ZURlY29yYXRpb24oJ2hpZ2hsaWdodCcsIFtbNiwgMF0sIFsxMSwgMF1dKVxuICAgICAgY3JlYXRlRGVjb3JhdGlvbignaGlnaGxpZ2h0JywgW1s3LCAwXSwgWzgsIDBdXSlcbiAgICAgIGNyZWF0ZURlY29yYXRpb24oJ2hpZ2hsaWdodC1vdmVyJywgW1sxLCAwXSwgWzIsIDBdXSlcbiAgICAgIGNyZWF0ZURlY29yYXRpb24oJ2xpbmUnLCBbWzMsIDBdLCBbNCwgMF1dKVxuICAgICAgY3JlYXRlRGVjb3JhdGlvbignbGluZScsIFtbMTIsIDBdLCBbMTIsIDBdXSlcbiAgICAgIGNyZWF0ZURlY29yYXRpb24oJ2hpZ2hsaWdodC11bmRlcicsIFtbMCwgMF0sIFsxMCwgMV1dKVxuXG4gICAgICBkZWNvcmF0aW9ucyA9IG1pbmltYXAuZGVjb3JhdGlvbnNCeVR5cGVUaGVuUm93cygwLCAxMilcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgYW4gb2JqZWN0IHdob3NlIGtleXMgYXJlIHRoZSBkZWNvcmF0aW9ucyB0eXBlcycsICgpID0+IHtcbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhkZWNvcmF0aW9ucykuc29ydCgpKS50b0VxdWFsKFsnaGlnaGxpZ2h0LW92ZXInLCAnaGlnaGxpZ2h0LXVuZGVyJywgJ2xpbmUnXSlcbiAgICB9KVxuXG4gICAgaXQoJ3N0b3JlcyBkZWNvcmF0aW9ucyBieSByb3dzIHdpdGhpbiBlYWNoIHR5cGUgb2JqZWN0cycsICgpID0+IHtcbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhkZWNvcmF0aW9uc1snaGlnaGxpZ2h0LW92ZXInXSkuc29ydCgpKVxuICAgICAgLnRvRXF1YWwoJzEgMiA2IDcgOCA5IDEwIDExJy5zcGxpdCgnICcpLnNvcnQoKSlcblxuICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKGRlY29yYXRpb25zWydsaW5lJ10pLnNvcnQoKSlcbiAgICAgIC50b0VxdWFsKCczIDQgMTInLnNwbGl0KCcgJykuc29ydCgpKVxuXG4gICAgICBleHBlY3QoT2JqZWN0LmtleXMoZGVjb3JhdGlvbnNbJ2hpZ2hsaWdodC11bmRlciddKS5zb3J0KCkpXG4gICAgICAudG9FcXVhbCgnMCAxIDIgMyA0IDUgNiA3IDggOSAxMCcuc3BsaXQoJyAnKS5zb3J0KCkpXG4gICAgfSlcblxuICAgIGl0KCdzdG9yZXMgdGhlIGRlY29yYXRpb25zIHNwYW5uaW5nIGEgcm93IGluIHRoZSBjb3JyZXNwb25kaW5nIHJvdyBhcnJheScsICgpID0+IHtcbiAgICAgIGV4cGVjdChkZWNvcmF0aW9uc1snaGlnaGxpZ2h0LW92ZXInXVsnNyddLmxlbmd0aCkudG9FcXVhbCgyKVxuXG4gICAgICBleHBlY3QoZGVjb3JhdGlvbnNbJ2xpbmUnXVsnMyddLmxlbmd0aCkudG9FcXVhbCgxKVxuXG4gICAgICBleHBlY3QoZGVjb3JhdGlvbnNbJ2hpZ2hsaWdodC11bmRlciddWyc1J10ubGVuZ3RoKS50b0VxdWFsKDEpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vICAgICAjIyMjIyMgICMjIyMjIyMjICAgICMjIyAgICAjIyAgICAjIyAjIyMjIyMjI1xuLy8gICAgIyMgICAgIyMgICAgIyMgICAgICAjIyAjIyAgICMjIyAgICMjICMjICAgICAjI1xuLy8gICAgIyMgICAgICAgICAgIyMgICAgICMjICAgIyMgICMjIyMgICMjICMjICAgICAjI1xuLy8gICAgICMjIyMjIyAgICAgIyMgICAgIyMgICAgICMjICMjICMjICMjICMjICAgICAjI1xuLy8gICAgICAgICAgIyMgICAgIyMgICAgIyMjIyMjIyMjICMjICAjIyMjICMjICAgICAjI1xuLy8gICAgIyMgICAgIyMgICAgIyMgICAgIyMgICAgICMjICMjICAgIyMjICMjICAgICAjI1xuLy8gICAgICMjIyMjIyAgICAgIyMgICAgIyMgICAgICMjICMjICAgICMjICMjIyMjIyMjXG4vL1xuLy8gICAgICAgIyMjICAgICMjICAgICAgICAjIyMjIyMjICAjIyAgICAjIyAjIyMjIyMjI1xuLy8gICAgICAjIyAjIyAgICMjICAgICAgICMjICAgICAjIyAjIyMgICAjIyAjI1xuLy8gICAgICMjICAgIyMgICMjICAgICAgICMjICAgICAjIyAjIyMjICAjIyAjI1xuLy8gICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAjIyAjIyAjIyAjIyAjIyMjIyNcbi8vICAgICMjIyMjIyMjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICMjIyMgIyNcbi8vICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAjIyMgIyNcbi8vICAgICMjICAgICAjIyAjIyMjIyMjIyAgIyMjIyMjIyAgIyMgICAgIyMgIyMjIyMjIyNcblxuZGVzY3JpYmUoJ1N0YW5kIGFsb25lIG1pbmltYXAnLCAoKSA9PiB7XG4gIGxldCBbZWRpdG9yLCBlZGl0b3JFbGVtZW50LCBtaW5pbWFwLCBsYXJnZVNhbXBsZSwgc21hbGxTYW1wbGVdID0gW11cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuY2hhckhlaWdodCcsIDQpXG4gICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmNoYXJXaWR0aCcsIDIpXG4gICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmludGVybGluZScsIDEpXG5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3Ioe30pXG4gICAgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgamFzbWluZS5hdHRhY2hUb0RPTShlZGl0b3JFbGVtZW50KVxuICAgIGVkaXRvckVsZW1lbnQuc2V0SGVpZ2h0KDUwKVxuICAgIGVkaXRvckVsZW1lbnQuc2V0V2lkdGgoMjAwKVxuICAgIGVkaXRvci5zZXRMaW5lSGVpZ2h0SW5QaXhlbHMoMTApXG5cbiAgICBsZXQgZGlyID0gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClbMF1cblxuICAgIG1pbmltYXAgPSBuZXcgTWluaW1hcCh7XG4gICAgICB0ZXh0RWRpdG9yOiBlZGl0b3IsXG4gICAgICBzdGFuZEFsb25lOiB0cnVlXG4gICAgfSlcblxuICAgIGxhcmdlU2FtcGxlID0gZnMucmVhZEZpbGVTeW5jKGRpci5yZXNvbHZlKCdsYXJnZS1maWxlLmNvZmZlZScpKS50b1N0cmluZygpXG4gICAgc21hbGxTYW1wbGUgPSBmcy5yZWFkRmlsZVN5bmMoZGlyLnJlc29sdmUoJ3NhbXBsZS5jb2ZmZWUnKSkudG9TdHJpbmcoKVxuICB9KVxuXG4gIGl0KCdoYXMgYW4gYXNzb2NpYXRlZCBlZGl0b3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0VGV4dEVkaXRvcigpKS50b0VxdWFsKGVkaXRvcilcbiAgfSlcblxuICBpdCgnbWVhc3VyZXMgdGhlIG1pbmltYXAgc2l6ZSBiYXNlZCBvbiB0aGUgY3VycmVudCBlZGl0b3IgY29udGVudCcsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dChzbWFsbFNhbXBsZSlcbiAgICBleHBlY3QobWluaW1hcC5nZXRIZWlnaHQoKSkudG9FcXVhbChlZGl0b3IuZ2V0U2NyZWVuTGluZUNvdW50KCkgKiA1KVxuXG4gICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0SGVpZ2h0KCkpLnRvRXF1YWwoZWRpdG9yLmdldFNjcmVlbkxpbmVDb3VudCgpICogNSlcbiAgfSlcblxuICBpdCgnbWVhc3VyZXMgdGhlIHNjYWxpbmcgZmFjdG9yIGJldHdlZW4gdGhlIGVkaXRvciBhbmQgdGhlIG1pbmltYXAnLCAoKSA9PiB7XG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0VmVydGljYWxTY2FsZUZhY3RvcigpKS50b0VxdWFsKDAuNSlcbiAgICBleHBlY3QobWluaW1hcC5nZXRIb3Jpem9udGFsU2NhbGVGYWN0b3IoKSkudG9FcXVhbCgyIC8gZWRpdG9yLmdldERlZmF1bHRDaGFyV2lkdGgoKSlcbiAgfSlcblxuICBpdCgnbWVhc3VyZXMgdGhlIGVkaXRvciB2aXNpYmxlIGFyZWEgc2l6ZSBhdCBtaW5pbWFwIHNjYWxlJywgKCkgPT4ge1xuICAgIGVkaXRvci5zZXRUZXh0KGxhcmdlU2FtcGxlKVxuICAgIGV4cGVjdChtaW5pbWFwLmdldFRleHRFZGl0b3JTY2FsZWRIZWlnaHQoKSkudG9FcXVhbCgyNSlcbiAgfSlcblxuICBpdCgnaGFzIGEgdmlzaWJsZSBoZWlnaHQgYmFzZWQgb24gdGhlIHBhc3NlZC1pbiBvcHRpb25zJywgKCkgPT4ge1xuICAgIGV4cGVjdChtaW5pbWFwLmdldFZpc2libGVIZWlnaHQoKSkudG9FcXVhbCg1KVxuXG4gICAgZWRpdG9yLnNldFRleHQoc21hbGxTYW1wbGUpXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0VmlzaWJsZUhlaWdodCgpKS50b0VxdWFsKDIwKVxuXG4gICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0VmlzaWJsZUhlaWdodCgpKS50b0VxdWFsKGVkaXRvci5nZXRTY3JlZW5MaW5lQ291bnQoKSAqIDUpXG5cbiAgICBtaW5pbWFwLmhlaWdodCA9IDEwMFxuICAgIGV4cGVjdChtaW5pbWFwLmdldFZpc2libGVIZWlnaHQoKSkudG9FcXVhbCgxMDApXG4gIH0pXG5cbiAgaXQoJ2hhcyBhIHZpc2libGUgd2lkdGggYmFzZWQgb24gdGhlIHBhc3NlZC1pbiBvcHRpb25zJywgKCkgPT4ge1xuICAgIGV4cGVjdChtaW5pbWFwLmdldFZpc2libGVXaWR0aCgpKS50b0VxdWFsKDApXG5cbiAgICBlZGl0b3Iuc2V0VGV4dChzbWFsbFNhbXBsZSlcbiAgICBleHBlY3QobWluaW1hcC5nZXRWaXNpYmxlV2lkdGgoKSkudG9FcXVhbCgzNilcblxuICAgIGVkaXRvci5zZXRUZXh0KGxhcmdlU2FtcGxlKVxuICAgIGV4cGVjdChtaW5pbWFwLmdldFZpc2libGVXaWR0aCgpKS50b0VxdWFsKGVkaXRvci5nZXRNYXhTY3JlZW5MaW5lTGVuZ3RoKCkgKiAyKVxuXG4gICAgbWluaW1hcC53aWR0aCA9IDUwXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0VmlzaWJsZVdpZHRoKCkpLnRvRXF1YWwoNTApXG4gIH0pXG5cbiAgaXQoJ21lYXN1cmVzIHRoZSBhdmFpbGFibGUgbWluaW1hcCBzY3JvbGwnLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG4gICAgbGV0IGxhcmdlTGluZUNvdW50ID0gZWRpdG9yLmdldFNjcmVlbkxpbmVDb3VudCgpXG5cbiAgICBleHBlY3QobWluaW1hcC5nZXRNYXhTY3JvbGxUb3AoKSkudG9FcXVhbCgwKVxuICAgIGV4cGVjdChtaW5pbWFwLmNhblNjcm9sbCgpKS50b0JlRmFsc3koKVxuXG4gICAgbWluaW1hcC5oZWlnaHQgPSAxMDBcblxuICAgIGV4cGVjdChtaW5pbWFwLmdldE1heFNjcm9sbFRvcCgpKS50b0VxdWFsKGxhcmdlTGluZUNvdW50ICogNSAtIDEwMClcbiAgICBleHBlY3QobWluaW1hcC5jYW5TY3JvbGwoKSkudG9CZVRydXRoeSgpXG4gIH0pXG5cbiAgaXQoJ2NvbXB1dGVzIHRoZSBmaXJzdCB2aXNpYmxlIHJvdyBpbiB0aGUgbWluaW1hcCcsICgpID0+IHtcbiAgICBleHBlY3QobWluaW1hcC5nZXRGaXJzdFZpc2libGVTY3JlZW5Sb3coKSkudG9FcXVhbCgwKVxuICB9KVxuXG4gIGl0KCdjb21wdXRlcyB0aGUgbGFzdCB2aXNpYmxlIHJvdyBpbiB0aGUgbWluaW1hcCcsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcblxuICAgIGV4cGVjdChtaW5pbWFwLmdldExhc3RWaXNpYmxlU2NyZWVuUm93KCkpLnRvRXF1YWwoZWRpdG9yLmdldFNjcmVlbkxpbmVDb3VudCgpKVxuXG4gICAgbWluaW1hcC5oZWlnaHQgPSAxMDBcbiAgICBleHBlY3QobWluaW1hcC5nZXRMYXN0VmlzaWJsZVNjcmVlblJvdygpKS50b0VxdWFsKDIwKVxuICB9KVxuXG4gIGl0KCdkb2VzIG5vdCByZWxheSBzY3JvbGwgdG9wIGV2ZW50cyBmcm9tIHRoZSBlZGl0b3InLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG5cbiAgICBsZXQgc2Nyb2xsU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZFNjcm9sbCcpXG4gICAgbWluaW1hcC5vbkRpZENoYW5nZVNjcm9sbFRvcChzY3JvbGxTcHkpXG5cbiAgICBlZGl0b3JFbGVtZW50LnNldFNjcm9sbFRvcCgxMDApXG5cbiAgICBleHBlY3Qoc2Nyb2xsU3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gIH0pXG5cbiAgaXQoJ2RvZXMgbm90IHJlbGF5IHNjcm9sbCBsZWZ0IGV2ZW50cyBmcm9tIHRoZSBlZGl0b3InLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQobGFyZ2VTYW1wbGUpXG5cbiAgICBsZXQgc2Nyb2xsU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2RpZFNjcm9sbCcpXG4gICAgbWluaW1hcC5vbkRpZENoYW5nZVNjcm9sbExlZnQoc2Nyb2xsU3B5KVxuXG4gICAgLy8gU2VlbXMgbGlrZSB0ZXh0IHdpdGhvdXQgYSB2aWV3IGFyZW4ndCBhYmxlIHRvIHNjcm9sbCBob3Jpem9udGFsbHlcbiAgICAvLyBldmVuIHdoZW4gaXRzIHdpZHRoIHdhcyBzZXQuXG4gICAgc3B5T24oZWRpdG9yRWxlbWVudCwgJ2dldFNjcm9sbFdpZHRoJykuYW5kUmV0dXJuKDEwMDAwKVxuXG4gICAgZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxMZWZ0KDEwMClcblxuICAgIGV4cGVjdChzY3JvbGxTcHkpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgfSlcblxuICBpdCgnaGFzIGEgc2Nyb2xsIHRvcCB0aGF0IGlzIG5vdCBib3VuZCB0byB0aGUgdGV4dCBlZGl0b3InLCAoKSA9PiB7XG4gICAgbGV0IHNjcm9sbFNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWRTY3JvbGwnKVxuICAgIG1pbmltYXAub25EaWRDaGFuZ2VTY3JvbGxUb3Aoc2Nyb2xsU3B5KVxuICAgIG1pbmltYXAuc2V0U2NyZWVuSGVpZ2h0QW5kV2lkdGgoMTAwLCAxMDApXG5cbiAgICBlZGl0b3Iuc2V0VGV4dChsYXJnZVNhbXBsZSlcbiAgICBlZGl0b3JFbGVtZW50LnNldFNjcm9sbFRvcCgxMDAwKVxuXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0U2Nyb2xsVG9wKCkpLnRvRXF1YWwoMClcbiAgICBleHBlY3Qoc2Nyb2xsU3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICBtaW5pbWFwLnNldFNjcm9sbFRvcCgxMClcblxuICAgIGV4cGVjdChtaW5pbWFwLmdldFNjcm9sbFRvcCgpKS50b0VxdWFsKDEwKVxuICAgIGV4cGVjdChzY3JvbGxTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICB9KVxuXG4gIGl0KCdoYXMgcmVuZGVyaW5nIHByb3BlcnRpZXMgdGhhdCBjYW4gb3ZlcnJpZGVzIHRoZSBjb25maWcgdmFsdWVzJywgKCkgPT4ge1xuICAgIG1pbmltYXAuc2V0Q2hhcldpZHRoKDguNSlcbiAgICBtaW5pbWFwLnNldENoYXJIZWlnaHQoMTAuMilcbiAgICBtaW5pbWFwLnNldEludGVybGluZSgxMC42KVxuXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0Q2hhcldpZHRoKCkpLnRvRXF1YWwoOClcbiAgICBleHBlY3QobWluaW1hcC5nZXRDaGFySGVpZ2h0KCkpLnRvRXF1YWwoMTApXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0SW50ZXJsaW5lKCkpLnRvRXF1YWwoMTApXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0TGluZUhlaWdodCgpKS50b0VxdWFsKDIwKVxuICB9KVxuXG4gIGl0KCdlbWl0cyBhIGNvbmZpZyBjaGFuZ2UgZXZlbnQgd2hlbiBhIHZhbHVlIGlzIGNoYW5nZWQnLCAoKSA9PiB7XG4gICAgbGV0IGNoYW5nZVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWQtY2hhbmdlJylcbiAgICBtaW5pbWFwLm9uRGlkQ2hhbmdlQ29uZmlnKGNoYW5nZVNweSlcblxuICAgIG1pbmltYXAuc2V0Q2hhcldpZHRoKDguNSlcbiAgICBtaW5pbWFwLnNldENoYXJIZWlnaHQoMTAuMilcbiAgICBtaW5pbWFwLnNldEludGVybGluZSgxMC42KVxuXG4gICAgZXhwZWN0KGNoYW5nZVNweS5jYWxsQ291bnQpLnRvRXF1YWwoMylcbiAgfSlcblxuICBpdCgncmV0dXJucyB0aGUgcm91bmRpbmcgbnVtYmVyIG9mIGRldmljZVBpeGVsUmF0aW8nLCAoKSA9PiB7XG4gICAgd2luZG93LmRldmljZVBpeGVsUmF0aW8gPSAxLjI1XG5cbiAgICBtaW5pbWFwLnNldERldmljZVBpeGVsUmF0aW9Sb3VuZGluZyh0cnVlKVxuXG4gICAgZXhwZWN0KG1pbmltYXAuZ2V0RGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nKCkpLnRvRXF1YWwodHJ1ZSlcbiAgICBleHBlY3QobWluaW1hcC5nZXREZXZpY2VQaXhlbFJhdGlvKCkpLnRvRXF1YWwoMSlcbiAgfSlcblxuICBpdCgncHJldmVudHMgdGhlIHJvdW5kaW5nIG51bWJlciBvZiBkZXZpY2VQaXhlbFJhdGlvJywgKCkgPT4ge1xuICAgIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID0gMS4yNVxuXG4gICAgbWluaW1hcC5zZXREZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcoZmFsc2UpXG5cbiAgICBleHBlY3QobWluaW1hcC5nZXREZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcoKSkudG9FcXVhbChmYWxzZSlcbiAgICBleHBlY3QobWluaW1hcC5nZXREZXZpY2VQaXhlbFJhdGlvKCkpLnRvRXF1YWwoMS4yNSlcbiAgfSlcbn0pXG4iXX0=
//# sourceURL=/Users/ajenkins/.atom/packages/minimap/spec/minimap-spec.js

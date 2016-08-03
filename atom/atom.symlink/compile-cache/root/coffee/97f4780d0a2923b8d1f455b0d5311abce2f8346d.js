
/*
  lib/sub-atom.coffee
 */

(function() {
  var $, CompositeDisposable, Disposable, SubAtom, _ref,
    __slice = [].slice;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  $ = require('jquery');

  module.exports = SubAtom = (function() {
    function SubAtom() {
      this.disposables = new CompositeDisposable;
    }

    SubAtom.prototype.addDisposable = function(disposable, disposeEventObj, disposeEventType) {
      var autoDisposables, e;
      if (disposeEventObj) {
        try {
          autoDisposables = new CompositeDisposable;
          autoDisposables.add(disposable);
          autoDisposables.add(disposeEventObj[disposeEventType]((function(_this) {
            return function() {
              autoDisposables.dispose();
              return _this.disposables.remove(autoDisposables);
            };
          })(this)));
          this.disposables.add(autoDisposables);
          return autoDisposables;
        } catch (_error) {
          e = _error;
          return console.log('SubAtom::add, invalid dispose event', disposeEventObj, disposeEventType, e);
        }
      } else {
        this.disposables.add(disposable);
        return disposable;
      }
    };

    SubAtom.prototype.addElementListener = function(ele, events, selector, disposeEventObj, disposeEventType, handler) {
      var disposable, subscription;
      if (selector) {
        subscription = $(ele).on(events, selector, handler);
      } else {
        subscription = $(ele).on(events, handler);
      }
      disposable = new Disposable(function() {
        return subscription.off(events, handler);
      });
      return this.addDisposable(disposable, disposeEventObj, disposeEventType);
    };

    SubAtom.prototype.add = function() {
      var arg, args, disposeEventObj, disposeEventType, ele, events, handler, selector, signature, _i, _len;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      signature = '';
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        switch (typeof arg) {
          case 'string':
            signature += 's';
            break;
          case 'object':
            signature += 'o';
            break;
          case 'function':
            signature += 'f';
        }
      }
      switch (signature) {
        case 'o':
        case 'oos':
          return this.addDisposable.apply(this, args);
        case 'ssf':
        case 'osf':
          ele = args[0], events = args[1], handler = args[2];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        case 'ossf':
        case 'sssf':
          ele = args[0], events = args[1], selector = args[2], handler = args[3];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        case 'ososf':
        case 'ssosf':
          ele = args[0], events = args[1], disposeEventObj = args[2], disposeEventType = args[3], handler = args[4];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        case 'ossosf':
        case 'sssosf':
          ele = args[0], events = args[1], selector = args[2], disposeEventObj = args[3], disposeEventType = args[4], handler = args[5];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        default:
          console.log('SubAtom::add, invalid call signature', args);
      }
    };

    SubAtom.prototype.remove = function() {
      var args, _ref1;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref1 = this.disposables).remove.apply(_ref1, args);
    };

    SubAtom.prototype.clear = function() {
      return this.disposables.clear();
    };

    SubAtom.prototype.dispose = function() {
      return this.disposables.dispose();
    };

    return SubAtom;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvc2ltcGxlLWRyYWctZHJvcC10ZXh0L25vZGVfbW9kdWxlcy9zdWItYXRvbS9saWIvc3ViLWF0b20uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxNQUFBLGlEQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFJQSxPQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBSnRCLENBQUE7O0FBQUEsRUFLQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FMSixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVTLElBQUEsaUJBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxHQUFBLENBQUEsbUJBQWYsQ0FEVztJQUFBLENBQWI7O0FBQUEsc0JBR0EsYUFBQSxHQUFlLFNBQUMsVUFBRCxFQUFhLGVBQWIsRUFBOEIsZ0JBQTlCLEdBQUE7QUFDYixVQUFBLGtCQUFBO0FBQUEsTUFBQSxJQUFHLGVBQUg7QUFDRTtBQUNFLFVBQUEsZUFBQSxHQUFrQixHQUFBLENBQUEsbUJBQWxCLENBQUE7QUFBQSxVQUNBLGVBQWUsQ0FBQyxHQUFoQixDQUFvQixVQUFwQixDQURBLENBQUE7QUFBQSxVQUVBLGVBQWUsQ0FBQyxHQUFoQixDQUFvQixlQUFnQixDQUFBLGdCQUFBLENBQWhCLENBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7bUJBQUEsU0FBQSxHQUFBO0FBQ3BELGNBQUEsZUFBZSxDQUFDLE9BQWhCLENBQUEsQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixDQUFvQixlQUFwQixFQUZvRDtZQUFBLEVBQUE7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQXBCLENBRkEsQ0FBQTtBQUFBLFVBS0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLGVBQWpCLENBTEEsQ0FBQTtpQkFNQSxnQkFQRjtTQUFBLGNBQUE7QUFTRSxVQURJLFVBQ0osQ0FBQTtpQkFBQSxPQUFPLENBQUMsR0FBUixDQUFZLHFDQUFaLEVBQW1ELGVBQW5ELEVBQW9FLGdCQUFwRSxFQUFzRixDQUF0RixFQVRGO1NBREY7T0FBQSxNQUFBO0FBWUUsUUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsVUFBakIsQ0FBQSxDQUFBO2VBQ0EsV0FiRjtPQURhO0lBQUEsQ0FIZixDQUFBOztBQUFBLHNCQW1CQSxrQkFBQSxHQUFvQixTQUFDLEdBQUQsRUFBTSxNQUFOLEVBQWMsUUFBZCxFQUF3QixlQUF4QixFQUF5QyxnQkFBekMsRUFBMkQsT0FBM0QsR0FBQTtBQUNsQixVQUFBLHdCQUFBO0FBQUEsTUFBQSxJQUFHLFFBQUg7QUFDRSxRQUFBLFlBQUEsR0FBZSxDQUFBLENBQUUsR0FBRixDQUFNLENBQUMsRUFBUCxDQUFVLE1BQVYsRUFBa0IsUUFBbEIsRUFBNEIsT0FBNUIsQ0FBZixDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsWUFBQSxHQUFlLENBQUEsQ0FBRSxHQUFGLENBQU0sQ0FBQyxFQUFQLENBQVUsTUFBVixFQUFrQixPQUFsQixDQUFmLENBSEY7T0FBQTtBQUFBLE1BSUEsVUFBQSxHQUFpQixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFBRyxZQUFZLENBQUMsR0FBYixDQUFpQixNQUFqQixFQUF5QixPQUF6QixFQUFIO01BQUEsQ0FBWCxDQUpqQixDQUFBO2FBS0EsSUFBQyxDQUFBLGFBQUQsQ0FBZSxVQUFmLEVBQTJCLGVBQTNCLEVBQTRDLGdCQUE1QyxFQU5rQjtJQUFBLENBbkJwQixDQUFBOztBQUFBLHNCQTJCQSxHQUFBLEdBQUssU0FBQSxHQUFBO0FBQ0gsVUFBQSxpR0FBQTtBQUFBLE1BREksOERBQ0osQ0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLEVBQVosQ0FBQTtBQUNBLFdBQUEsMkNBQUE7dUJBQUE7QUFDRSxnQkFBTyxNQUFBLENBQUEsR0FBUDtBQUFBLGVBQ08sUUFEUDtBQUN1QixZQUFBLFNBQUEsSUFBYSxHQUFiLENBRHZCO0FBQ087QUFEUCxlQUVPLFFBRlA7QUFFdUIsWUFBQSxTQUFBLElBQWEsR0FBYixDQUZ2QjtBQUVPO0FBRlAsZUFHTyxVQUhQO0FBR3VCLFlBQUEsU0FBQSxJQUFhLEdBQWIsQ0FIdkI7QUFBQSxTQURGO0FBQUEsT0FEQTtBQU1BLGNBQU8sU0FBUDtBQUFBLGFBQ08sR0FEUDtBQUFBLGFBQ1ksS0FEWjtpQkFDdUIsSUFBQyxDQUFBLGFBQUQsYUFBZSxJQUFmLEVBRHZCO0FBQUEsYUFFTyxLQUZQO0FBQUEsYUFFYyxLQUZkO0FBR0ksVUFBQyxhQUFELEVBQU0sZ0JBQU4sRUFBYyxpQkFBZCxDQUFBO2lCQUNBLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixHQUFwQixFQUF5QixNQUF6QixFQUFpQyxRQUFqQyxFQUEyQyxlQUEzQyxFQUE0RCxnQkFBNUQsRUFBOEUsT0FBOUUsRUFKSjtBQUFBLGFBS08sTUFMUDtBQUFBLGFBS2UsTUFMZjtBQU1JLFVBQUMsYUFBRCxFQUFNLGdCQUFOLEVBQWMsa0JBQWQsRUFBd0IsaUJBQXhCLENBQUE7aUJBQ0EsSUFBQyxDQUFBLGtCQUFELENBQW9CLEdBQXBCLEVBQXlCLE1BQXpCLEVBQWlDLFFBQWpDLEVBQTJDLGVBQTNDLEVBQTRELGdCQUE1RCxFQUE4RSxPQUE5RSxFQVBKO0FBQUEsYUFRTyxPQVJQO0FBQUEsYUFRZ0IsT0FSaEI7QUFTSSxVQUFDLGFBQUQsRUFBTSxnQkFBTixFQUFjLHlCQUFkLEVBQStCLDBCQUEvQixFQUFpRCxpQkFBakQsQ0FBQTtpQkFDQSxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsR0FBcEIsRUFBeUIsTUFBekIsRUFBaUMsUUFBakMsRUFBMkMsZUFBM0MsRUFBNEQsZ0JBQTVELEVBQThFLE9BQTlFLEVBVko7QUFBQSxhQVdPLFFBWFA7QUFBQSxhQVdpQixRQVhqQjtBQVlJLFVBQUMsYUFBRCxFQUFNLGdCQUFOLEVBQWMsa0JBQWQsRUFBd0IseUJBQXhCLEVBQXlDLDBCQUF6QyxFQUEyRCxpQkFBM0QsQ0FBQTtpQkFDQSxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsR0FBcEIsRUFBeUIsTUFBekIsRUFBaUMsUUFBakMsRUFBMkMsZUFBM0MsRUFBNEQsZ0JBQTVELEVBQThFLE9BQTlFLEVBYko7QUFBQTtBQWVJLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxzQ0FBWixFQUFvRCxJQUFwRCxDQUFBLENBZko7QUFBQSxPQVBHO0lBQUEsQ0EzQkwsQ0FBQTs7QUFBQSxzQkFvREEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsV0FBQTtBQUFBLE1BRE8sOERBQ1AsQ0FBQTthQUFBLFNBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBWSxDQUFDLE1BQWIsY0FBb0IsSUFBcEIsRUFETTtJQUFBLENBcERSLENBQUE7O0FBQUEsc0JBdURBLEtBQUEsR0FBTyxTQUFBLEdBQUE7YUFDTCxJQUFDLENBQUEsV0FBVyxDQUFDLEtBQWIsQ0FBQSxFQURLO0lBQUEsQ0F2RFAsQ0FBQTs7QUFBQSxzQkEwREEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLEVBRE87SUFBQSxDQTFEVCxDQUFBOzttQkFBQTs7TUFWRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/simple-drag-drop-text/node_modules/sub-atom/lib/sub-atom.coffee

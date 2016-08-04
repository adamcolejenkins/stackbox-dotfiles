(function() {
  var LoadingView;

  module.exports = LoadingView = (function() {
    function LoadingView() {
      var icon, message, messageOuter;
      this.element = document.createElement('div');
      this.element.classList.add('split-diff-modal');
      icon = document.createElement('div');
      icon.classList.add('split-diff-icon');
      this.element.appendChild(icon);
      message = document.createElement('div');
      message.textContent = "Computing the diff for you.";
      message.classList.add('split-diff-message');
      messageOuter = document.createElement('div');
      messageOuter.appendChild(message);
      this.element.appendChild(messageOuter);
    }

    LoadingView.prototype.destroy = function() {
      this.element.remove();
      return this.modalPanel.destroy();
    };

    LoadingView.prototype.getElement = function() {
      return this.element;
    };

    LoadingView.prototype.createModal = function() {
      this.modalPanel = atom.workspace.addModalPanel({
        item: this.element,
        visible: false
      });
      return this.modalPanel.item.parentNode.classList.add('split-diff-hide-mask');
    };

    LoadingView.prototype.show = function() {
      return this.modalPanel.show();
    };

    LoadingView.prototype.hide = function() {
      return this.modalPanel.hide();
    };

    return LoadingView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvZ2l0LXRpbWUtbWFjaGluZS9ub2RlX21vZHVsZXMvc3BsaXQtZGlmZi9saWIvbG9hZGluZy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxXQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEscUJBQUEsR0FBQTtBQUVYLFVBQUEsMkJBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixrQkFBdkIsQ0FEQSxDQUFBO0FBQUEsTUFJQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FKUCxDQUFBO0FBQUEsTUFLQSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQWYsQ0FBbUIsaUJBQW5CLENBTEEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULENBQXFCLElBQXJCLENBTkEsQ0FBQTtBQUFBLE1BU0EsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBVFYsQ0FBQTtBQUFBLE1BVUEsT0FBTyxDQUFDLFdBQVIsR0FBc0IsNkJBVnRCLENBQUE7QUFBQSxNQVdBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbEIsQ0FBc0Isb0JBQXRCLENBWEEsQ0FBQTtBQUFBLE1BWUEsWUFBQSxHQUFlLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBWmYsQ0FBQTtBQUFBLE1BYUEsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsT0FBekIsQ0FiQSxDQUFBO0FBQUEsTUFjQSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsWUFBckIsQ0FkQSxDQUZXO0lBQUEsQ0FBYjs7QUFBQSwwQkFtQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsRUFGTztJQUFBLENBbkJULENBQUE7O0FBQUEsMEJBdUJBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsUUFEUztJQUFBLENBdkJaLENBQUE7O0FBQUEsMEJBMEJBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO0FBQUEsUUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLE9BQVA7QUFBQSxRQUFnQixPQUFBLEVBQVMsS0FBekI7T0FBN0IsQ0FBZCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUF0QyxDQUEwQyxzQkFBMUMsRUFGVztJQUFBLENBMUJiLENBQUE7O0FBQUEsMEJBOEJBLElBQUEsR0FBTSxTQUFBLEdBQUE7YUFDSixJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBQSxFQURJO0lBQUEsQ0E5Qk4sQ0FBQTs7QUFBQSwwQkFpQ0EsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNKLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixDQUFBLEVBREk7SUFBQSxDQWpDTixDQUFBOzt1QkFBQTs7TUFGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/git-time-machine/node_modules/split-diff/lib/loading-view.coffee

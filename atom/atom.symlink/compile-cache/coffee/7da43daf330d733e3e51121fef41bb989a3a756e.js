(function() {
  describe('Handlebars grammar', function() {
    var grammar;
    grammar = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('atom-handlebars');
      });
      return runs(function() {
        return grammar = atom.grammars.grammarForScopeName('text.html.handlebars');
      });
    });
    it('parses the grammar', function() {
      expect(grammar).toBeTruthy();
      return expect(grammar.scopeName).toBe('text.html.handlebars');
    });
    it('parses helpers', function() {
      var tokens;
      tokens = grammar.tokenizeLine("{{my-helper }}").tokens;
      expect(tokens[0]).toEqual({
        value: '{{',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars']
      });
      expect(tokens[1]).toEqual({
        value: 'my-helper ',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars', 'entity.name.function.handlebars']
      });
      expect(tokens[2]).toEqual({
        value: '}}',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars']
      });
      tokens = grammar.tokenizeLine("{{my-helper class='test'}}").tokens;
      expect(tokens[0]).toEqual({
        value: '{{',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars']
      });
      expect(tokens[1]).toEqual({
        value: 'my-helper ',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars', 'entity.name.function.handlebars']
      });
      expect(tokens[2]).toEqual({
        value: 'class',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.other.attribute-name.handlebars', 'meta.tag.template.handlebars', 'entity.other.attribute-name.handlebars']
      });
      expect(tokens[3]).toEqual({
        value: '=',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.other.attribute-name.handlebars', 'meta.tag.template.handlebars']
      });
      expect(tokens[4]).toEqual({
        value: "'",
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'string.quoted.single.handlebars', 'punctuation.definition.string.begin.handlebars']
      });
      expect(tokens[5]).toEqual({
        value: 'test',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'string.quoted.single.handlebars']
      });
      expect(tokens[6]).toEqual({
        value: "'",
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'string.quoted.single.handlebars', 'punctuation.definition.string.end.handlebars']
      });
      expect(tokens[7]).toEqual({
        value: '}}',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars']
      });
      tokens = grammar.tokenizeLine("{{else}}").tokens;
      expect(tokens[0]).toEqual({
        value: '{{',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars']
      });
      expect(tokens[1]).toEqual({
        value: 'else',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars', 'entity.name.function.handlebars']
      });
      return expect(tokens[2]).toEqual({
        value: '}}',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars']
      });
    });
    it('parses variables', function() {
      var tokens;
      tokens = grammar.tokenizeLine("{{name}}").tokens;
      expect(tokens[0]).toEqual({
        value: '{{',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars']
      });
      expect(tokens[1]).toEqual({
        value: 'name',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars']
      });
      expect(tokens[2]).toEqual({
        value: '}}',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars']
      });
      tokens = grammar.tokenizeLine("{{> name}}").tokens;
      expect(tokens[0]).toEqual({
        value: '{{>',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars']
      });
      expect(tokens[1]).toEqual({
        value: ' name',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars']
      });
      return expect(tokens[2]).toEqual({
        value: '}}',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars']
      });
    });
    it('parses comments', function() {
      var tokens;
      tokens = grammar.tokenizeLine("{{!-- comment --}}").tokens;
      expect(tokens[0]).toEqual({
        value: '{{!--',
        scopes: ['text.html.handlebars', 'comment.block.handlebars']
      });
      expect(tokens[1]).toEqual({
        value: ' comment ',
        scopes: ['text.html.handlebars', 'comment.block.handlebars']
      });
      expect(tokens[2]).toEqual({
        value: '--}}',
        scopes: ['text.html.handlebars', 'comment.block.handlebars']
      });
      tokens = grammar.tokenizeLine("{{! comment }}").tokens;
      expect(tokens[0]).toEqual({
        value: '{{!',
        scopes: ['text.html.handlebars', 'comment.block.handlebars']
      });
      expect(tokens[1]).toEqual({
        value: ' comment ',
        scopes: ['text.html.handlebars', 'comment.block.handlebars']
      });
      return expect(tokens[2]).toEqual({
        value: '}}',
        scopes: ['text.html.handlebars', 'comment.block.handlebars']
      });
    });
    it('parses block expression', function() {
      var tokens;
      tokens = grammar.tokenizeLine("{{#each person in people}}").tokens;
      expect(tokens[0]).toEqual({
        value: '{{',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars']
      });
      expect(tokens[1]).toEqual({
        value: '#',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars', 'punctuation.definition.block.begin.handlebars']
      });
      expect(tokens[2]).toEqual({
        value: 'each',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars', 'entity.name.function.handlebars']
      });
      expect(tokens[3]).toEqual({
        value: ' person',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars']
      });
      expect(tokens[4]).toEqual({
        value: ' in ',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.function.handlebars']
      });
      expect(tokens[5]).toEqual({
        value: 'people',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars']
      });
      expect(tokens[6]).toEqual({
        value: '}}',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars']
      });
      tokens = grammar.tokenizeLine("{{/if}}").tokens;
      expect(tokens[0]).toEqual({
        value: '{{',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars']
      });
      expect(tokens[1]).toEqual({
        value: '/',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars', 'punctuation.definition.block.end.handlebars']
      });
      expect(tokens[2]).toEqual({
        value: 'if',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars', 'entity.name.function.handlebars']
      });
      return expect(tokens[3]).toEqual({
        value: '}}',
        scopes: ['text.html.handlebars', 'meta.tag.template.handlebars', 'entity.name.tag.handlebars']
      });
    });
    return it('parses unescaped expressions', function() {
      var tokens;
      tokens = grammar.tokenizeLine("{{{do not escape me}}}").tokens;
      expect(tokens[0]).toEqual({
        value: '{{{',
        scopes: ['text.html.handlebars', 'meta.tag.template.raw.handlebars', 'entity.name.tag.handlebars']
      });
      expect(tokens[1]).toEqual({
        value: 'do not escape me',
        scopes: ['text.html.handlebars', 'meta.tag.template.raw.handlebars']
      });
      return expect(tokens[2]).toEqual({
        value: '}}}',
        scopes: ['text.html.handlebars', 'meta.tag.template.raw.handlebars', 'entity.name.tag.handlebars']
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FqZW5raW5zLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvYXRvbS1oYW5kbGViYXJzL3NwZWMvaGFuZGxlYmFycy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLFFBQUEsT0FBQTtBQUFBLElBQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsaUJBQTlCLEVBRGM7TUFBQSxDQUFoQixDQUFBLENBQUE7YUFHQSxJQUFBLENBQUssU0FBQSxHQUFBO2VBQ0gsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQWQsQ0FBa0Msc0JBQWxDLEVBRFA7TUFBQSxDQUFMLEVBSlM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBU0EsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTtBQUN2QixNQUFBLE1BQUEsQ0FBTyxPQUFQLENBQWUsQ0FBQyxVQUFoQixDQUFBLENBQUEsQ0FBQTthQUNBLE1BQUEsQ0FBTyxPQUFPLENBQUMsU0FBZixDQUF5QixDQUFDLElBQTFCLENBQStCLHNCQUEvQixFQUZ1QjtJQUFBLENBQXpCLENBVEEsQ0FBQTtBQUFBLElBYUEsRUFBQSxDQUFHLGdCQUFILEVBQXFCLFNBQUEsR0FBQTtBQUNuQixVQUFBLE1BQUE7QUFBQSxNQUFDLFNBQVUsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsZ0JBQXJCLEVBQVYsTUFBRCxDQUFBO0FBQUEsTUFFQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxC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

//# sourceURL=/Users/ajenkins/.dotfiles/atom.symlink/packages/atom-handlebars/spec/handlebars-spec.coffee

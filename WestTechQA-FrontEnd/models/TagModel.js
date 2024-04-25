var TagModel = Backbone.Model.extend({
  urlRoot: '/api/tags',
  defaults: {
    tagID: null,
    tagName: ''
  }
});

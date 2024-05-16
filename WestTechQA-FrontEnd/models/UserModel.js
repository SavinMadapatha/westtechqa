var UserModel = Backbone.Model.extend({
  urlRoot: 'http://localhost/WestTechQA/api/users',
  defaults: {
    username: '',
    email: '',
    registered_date: null // This should match the JSON response from server
  }
});

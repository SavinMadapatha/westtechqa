var UserModel = Backbone.Model.extend({
  urlRoot: '/api/users',
  defaults: {
    userID: null,
    username: '',
    email: '',
    password: '', 
    registeredDate: null
  }
});

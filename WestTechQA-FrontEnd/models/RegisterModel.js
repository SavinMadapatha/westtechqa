var RegisterModel = Backbone.Model.extend({
  urlRoot: 'http://localhost/WestTechQA/api/auth/register',
    defaults: {
      username: '',
      email: '',
      password: ''
    }
  });
  
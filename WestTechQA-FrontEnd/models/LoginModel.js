var LoginModel = Backbone.Model.extend({
    urlRoot: 'http://localhost/WestTechQA/api/auth/login', // Endpoint for CodeIgniter login API

    defaults: {
        email: '',
        password: ''
    }
});
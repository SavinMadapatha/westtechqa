var LoginModel = Backbone.Model.extend({
    urlRoot: 'http://localhost/WestTechQA/api/auth/login', 

    defaults: {
        email: '',
        password: ''
    }
});
var LoginView = Backbone.View.extend({
    model: new LoginModel(),
    initialize: function() {
        this.loadTemplate();
    },

    loadTemplate: function() {
        var self = this;
        $.get('templates/loginTemplate.html')
            .done(function(data) {
                var templateHtml = $(data).filter('#login-template').html();
                if (templateHtml) {
                    self.template = _.template(templateHtml);
                    self.render(); 
                } else {
                    console.error('Login template content not found.');
                }
            })
            .fail(function() {
                console.error('Failed to load the login template.');
            });
    },

    events: {
        'submit #login-form': 'login'
    },

    login: function(e) {
        e.preventDefault();
        var email = this.$('#inputEmail').val();
        var password = this.$('#inputPassword').val();
        this.model.set({email: email, password: password});

        $.ajax({
            type: 'POST',
            url: 'http://localhost/WestTechQA/api/auth/login',  
            data: JSON.stringify({email: email, password: password}),
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    Backbone.trigger('loginSuccess'); 
                    appRouter.navigate('questions', {trigger: true});
                } else {
                    console.log(response.message); 
                }
            },
            error: function(response) {
                alert('Login failed: Wrong password or username, try again!');
            }
        });
    },

    render: function() {
        if (this.template) {
            this.$el.html(this.template());
        }
        return this;
    }
});

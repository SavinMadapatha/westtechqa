var LoginView = Backbone.View.extend({
    model: new LoginModel(),
    initialize: function() {
        this.loadTemplate();
    },

    loadTemplate: function() {
        var self = this;
        // Fetch the login template HTML from an external file
        $.get('templates/loginTemplate.html')
            .done(function(data) {
                // Extract the template string from the fetched data
                var templateHtml = $(data).filter('#login-template').html();
                if (templateHtml) {
                    self.template = _.template(templateHtml);
                    self.render(); // Render after the template is loaded
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

        this.model.save({}, {
            success: function(model, response) {
                if(response.status === 'success') {
                    appRouter.navigate('questions', {trigger: true});
                } else {
                    alert(response.message); 
                }
            },
            error: function(model, response) {
                console.log('Login failed with response:', response.responseText);
                alert('Login failed.'); 
            }
        });
    },

    render: function() {
        $('.custom-navbar').addClass('login-page');
        
        if (this.template) {
            this.$el.html(this.template());
        }
        return this;
    },

    remove: function() {
        $('.custom-navbar').removeClass('login-page');
        Backbone.View.prototype.remove.apply(this, arguments);
    }
});

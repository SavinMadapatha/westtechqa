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

        // Save the model to the server
        this.model.save({}, {
            success: function(model, response) {
                if(response.status === 'success') {
                    // Navigate to the home page or dashboard
                    appRouter.navigate('questions', {trigger: true});
                } else {
                    // Handle login failure
                    alert(response.message); // Placeholder for actual error handling
                }
            },
            error: function(model, response) {
                // Handle the error case
                console.log('Login failed with response:', response.responseText);
                alert('Login failed.'); // Placeholder for actual error handling
            }
        });
    },

    render: function() {
        // Add 'login-page' class to the navbar
        $('.custom-navbar').addClass('login-page');
        
        // Check if the template is loaded before rendering
        if (this.template) {
            this.$el.html(this.template());
        }
        return this;
    },

    remove: function() {
        // Remove 'login-page' class from the navbar when the view is removed
        $('.custom-navbar').removeClass('login-page');
        // Call the base remove function
        Backbone.View.prototype.remove.apply(this, arguments);
    }
});

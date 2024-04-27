var RegisterView = Backbone.View.extend({
    model: new RegisterModel(),
    initialize: function() {
        this.loadTemplate();
    },

    loadTemplate: function() {
        var self = this;
        // Fetch the register template HTML from an external file
        $.get('templates/registerTemplate.html')
            .done(function(data) {
                // Extract the template string from the fetched data
                var templateHtml = $(data).filter('#register-template').html();
                if (templateHtml) {
                    self.template = _.template(templateHtml);
                    self.render(); // Render after the template is loaded
                } else {
                    console.error('Register template content not found.');
                }
            })
            .fail(function() {
                console.error('Failed to load the register template.');
            });
    },

    events: {
        'submit #register-form': 'register'
    },

    register: function(e) {
        e.preventDefault();

        var username = this.$('#inputUsername').val();
        var email = this.$('#inputEmail').val();
        var password = this.$('#inputPassword').val();

        this.model.set({username: username, email: email, password: password});

        // Save the model to the server
        this.model.save({}, {
            success: function(model, response) {
                if(response.status === 'success') {
                    alert('Registration successful');
                    // Optionally redirect to login or home page
                    appRouter.navigate('', {trigger: true});
                } else {
                    // Handle registration failure
                    alert('Registration failed: ' + response.message);
                }
            },
            error: function(model, response) {
                // Handle the error case
                console.log('Registration failed with response:', response);
                alert('Registration failed.'); // Placeholder for actual error handling
            }
        });
    },

    render: function() {
        // Add 'register-page' class to the navbar
        $('.custom-navbar').addClass('login-page');
        
        // Check if the template is loaded before rendering
        if (this.template) {
            this.$el.html(this.template());
        }
        return this;
    },

    remove: function() {
        // Remove 'register-page' class from the navbar when the view is removed
        $('.custom-navbar').removeClass('login-page');
        // Call the base remove function
        Backbone.View.prototype.remove.apply(this, arguments);
    }
});

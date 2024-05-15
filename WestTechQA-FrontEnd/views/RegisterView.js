var RegisterView = Backbone.View.extend({
    model: new RegisterModel(),
    initialize: function() {
        this.loadTemplate();
    },

    loadTemplate: function() {
        var self = this;
        $.get('templates/registerTemplate.html')
            .done(function(data) {
                var templateHtml = $(data).filter('#register-template').html();
                if (templateHtml) {
                    self.template = _.template(templateHtml);
                    self.render();
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
        var self = this;
        var username = this.$('#inputUsername').val().trim();
        var email = this.$('#inputEmail').val().trim();
        var password = this.$('#inputPassword').val().trim();
    
        if (!username || !email || !password) {
            alert("Please fill all the fields correctly.");
            return;
        }
    
        var userData = {
            username: username,
            email: email,
            password: password
        };
    
        $.ajax({
            type: 'POST',
            url: 'http://localhost/WestTechQA/api/auth/register',
            data: JSON.stringify(userData),
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                if (response.success) { 
                    console.log('Registration successful');
                    appRouter.navigate('login', {trigger: true});
                } else {
                    console.log('Registration failed');
                }
            },
            error: function(error) {
                console.log('Registration failed:', error);
                alert('Registration failed: The Username field must be at least 5 characters in length. The Password field must be at least 8 characters in length.');
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

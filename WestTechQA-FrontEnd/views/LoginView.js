var LoginView = Backbone.View.extend({
    model: new LoginModel(),
    initialize: function() {
        this.templates = {};
        this.loadTemplates();
    },

    loadTemplates: function() {
        var self = this;
        
        $.get('templates/loginTemplate.html')
            .done(function(data) {
                var templateHtml = $(data).filter('#login-template').html();
                if (templateHtml) {
                    self.templates.login = _.template(templateHtml);
                    self.render(); 
                } else {
                    console.error('Login template content not found.');
                }
            })
            .fail(function() {
                console.error('Failed to load the login template.');
            });

        $.get('templates/passwordResetTemplate.html') 
            .done(function(data) {
                var resetTemplateHtml = $(data).filter('#password-reset-template').html();
                if (resetTemplateHtml) {
                    self.templates.reset = _.template(resetTemplateHtml);
                } else {
                    console.error('Password reset template content not found.');
                }
            })
            .fail(function() {
                console.error('Failed to load the password reset template.');
            });
    },

    events: {
        'submit #login-form': 'login',
        'click #password-reset-link': 'showResetForm',
        'submit #password-reset-form': 'resetPassword' 
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

    showResetForm: function(e) {
        e.preventDefault();
        if (this.templates.reset) {
            this.$el.html(this.templates.reset());
        } else {
            console.error('Password reset template content not found.');
        }
    },

    resetPassword: function(e) {
        e.preventDefault();
        var username = this.$('#resetUsername').val();
        var email = this.$('#resetEmail').val();
        var joinedDate = this.$('#resetJoinedDate').val();
        var newPassword = this.$('#resetPassword').val();

        $.ajax({
            type: 'POST',
            url: 'http://localhost/WestTechQA/api/auth/reset',
            data: JSON.stringify({username: username, email: email, joined_date: joinedDate, new_password: newPassword}),
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    console.log('Password reset successfully.');
                    appRouter.navigate('login', {trigger: true}); 
                    window.location.reload();
                } else {
                    alert('Password reset failed: ' + response.message);
                }
            },
            error: function() {
                alert('Error: Could not connect to server.');
            }
        });
    },

    render: function() {
        if (this.templates.login) {
            this.$el.html(this.templates.login());
        } else {
            console.log('Waiting for login template to be loaded.');
        }
        return this;
    }
});

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

        var username = this.$('#inputUsername').val();
        var email = this.$('#inputEmail').val();
        var password = this.$('#inputPassword').val();

        this.model.set({username: username, email: email, password: password});

        this.model.save({}, {
            success: function(model, response) {
                if(response.status === 'success') {
                    alert('Registration successful');
                    appRouter.navigate('', {trigger: true});
                } else {
                    alert('Registration failed: ' + response.message);
                }
            },
            error: function(model, response) {
                console.log('Registration failed with response:', response);
                alert('Registration failed.'); 
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

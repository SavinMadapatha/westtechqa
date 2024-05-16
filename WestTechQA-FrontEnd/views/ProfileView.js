var ProfileView = Backbone.View.extend({
    initialize: function() {
        this.template = null;
        this.isEditing = false;  
        var self = this;

        $.get('templates/profileTemplate.html').done(function(data) {
            self.template = _.template($('<div>').html(data).find('#profile-template').html());
            console.log("Profile template loaded successfully.");
            self.listenTo(self.model, 'sync', self.render);
            self.model.fetch();
        }).fail(function() {
            console.error('Failed to load profile template.');
        });
    },

    events: {
        'click #go-back-btn': 'toggleEdit',
        'click #edit-profile-btn': 'handleEdit'
    },

    render: function() {
        if (this.template && this.model) {
            var data = this.model.toJSON();
            data.isEditing = this.isEditing;  
            console.log("Rendering the profile view with data:", data);
            this.$el.html(this.template(data));
        } else {
            console.log('Template or model data has not loaded yet.');
        }
        return this;
    },

    toggleEdit: function() {
        if (this.isEditing) {
            this.isEditing = false;
            this.render();
        } else {
            window.history.back();
        }
    },

    handleEdit: function() {
        if (this.isEditing) {
            var newUsername = this.$('#edit-username').val().trim();
            this.model.set('username', newUsername);
            this.saveUserProfile();
        } else {
            this.isEditing = true;
            this.render();
        }
    },

    saveUserProfile: function() {
        var self = this;
        var userData = {
            username: this.model.get('username')
        };
        
        $.ajax({
            type: 'PUT',
            url: 'http://localhost/WestTechQA/api/user/update',
            data: JSON.stringify(userData),
            contentType: 'application/json',
            success: function(response) {
                console.log('User updated successfully:', response.message);
                self.isEditing = false;
                self.model.fetch();  
            },
            error: function(error) {
                console.error('Failed to update user:', error.responseText);
            }
        });
    }
});

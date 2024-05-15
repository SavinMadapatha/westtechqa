var PostQuestionView = Backbone.View.extend({
    initialize: function(options) {
        this.template = null;
        this.model = options.model || new PostQuestionModel();
        var self = this;
        $.get('templates/postQuestionTemplate.html').done(function(data) {
            self.template = _.template($('<div>').html(data).find('#post-question-template').html());
            self.render();
        }).fail(function() {
            console.error('Failed to load post question template.');
        });
    },

    events: {
        'click #post-question-btn': 'postQuestion'
    },

    postQuestion: function(event) {
        event.preventDefault();
        var self = this;
        checkLoginStatus(function(isLoggedIn, userId) {
            if (!isLoggedIn) {
                console.log("You must be logged in to post a question.");
                return;
            }
            var formData = {
                user_id: userId, 
                title: self.$('input[name="title"]').val().trim(),
                content: self.$('textarea[name="content"]').val().trim(),
                tags: self.$('input[name="tags[]"]:checked').map(function() {
                    return this.value;
                }).get()
            };
    
            if (!formData.title || !formData.content) {
                console.log("Please fill out all required fields.");
                return;
            }
    
            $.ajax({
                type: 'POST',
                url: 'http://localhost/WestTechQA/api/questions/addQuestion',
                data: JSON.stringify(formData),
                contentType: 'application/json',
                dataType: 'json',
                success: function(response) {
                    if (response.success) { 
                        console.log('Question posted successfully');
                        Backbone.history.navigate('questions/' + response.question_id, {trigger: true});
                    } else {
                        console.log('Failed to post question: ' + response.error);
                    }
                },
                error: function(response) {
                    console.log('Failed to connect to the server: ' + response.error);
                }
            });
        });
    },

    render: function() {
        if (!this.template) {
            console.log('Template not yet loaded.');
            return this;
        }
        this.$el.html(this.template());
        console.log('Rendered Post Question View');
        return this;
    }
});

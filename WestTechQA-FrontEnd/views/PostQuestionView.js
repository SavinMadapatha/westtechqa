var PostQuestionView = Backbone.View.extend({
    initialize: function(options) {
        this.template = null;
        var self = this;
        // Load the template for the Post Question page
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
        var formData = {
            title: this.$('input[name="title"]').val().trim(),
            content: this.$('textarea[name="content"]').val().trim(),
            tags: this.$('input[name="tags[]"]:checked').map(function() {
                return this.value;
            }).get() 
        };
    
        if (this.model.set(formData)) {
            this.model.save(null, {
                success: function(model, response) {
                    console.log('Question posted successfully');
                    Backbone.history.navigate('questions', {trigger: true});
                },
                error: function(model, response) {
                    console.log('Failed to post question', response);
                }
            });
        } else {
            console.log('Validation failed', this.model.validationError);
        }
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

var AnswerDetailView = Backbone.View.extend({
    initialize: function(options) {
        this.answerId = options.answerId;
        this.model = new AnswerDetailModel({ id: this.answerId });
        this.template = null;
        
        var self = this;
        $.get('templates/answerDetailTemplate.html').done(function(data) {
            self.template = _.template($('<div>').html(data).find('#answer-detail-template').html());  
            self.listenTo(self.model, 'sync', self.render);
            self.model.fetch();
        }).fail(function() {
            console.error('Failed to load answer detail template.');
        });
    },

    events: {
        "click .btn-add-comment": "postComment"
    },

    postComment: function() {
        var commentContent = this.$('.comment-input').val().trim();
        console.log(this.answerId, commentContent);
        if (commentContent) {
            $.ajax({
                type: 'POST',
                url: 'http://localhost/WestTechQA/api/comments/addComment',
                data: { answer_id: this.answerId, content: commentContent },
                success: function(response) {
                    if (response.success) {
                        console.log('Comment added successfully');
                        this.model.fetch();  
                    } else {
                        console.log('Error adding comment: ' + (response.error || 'Unknown error!'));
                    }
                }.bind(this),
                error: function() {
                    console.log('Failed to connect to the server.');
                },
                dataType: 'json'
            });
        } else {
            console.log('Please enter a comment');
        }
    },

    render: function() {
        if (!this.template) {
            console.log('Template not yet loaded.');
            return this;
        }

        var data = this.model.toJSON();

        data.formattedPostedDate = new Date(data.posted_date.replace(' ', 'T') + 'Z').toLocaleDateString();

        if (data.comments && Array.isArray(data.comments)) {
            data.commentsCount = data.comments.length;
            data.comments = data.comments.map(function(comment) {
                return {
                    ...comment,
                    formattedPostedDate: new Date(comment.posted_date.replace(' ', 'T') + 'Z').toLocaleDateString()
                };
            });
        }

        console.log(data); 

        this.$el.html(this.template(data)); 
        return this;
    }
});

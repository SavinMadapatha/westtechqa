var PostAnswerView = Backbone.View.extend({
    initialize: function(options) {
        this.questionId = options.questionId;
        this.question = null;
        this.template = null;

        this.model = new PostAnswerModel(); 
        var self = this;
        $.get('templates/postAnswerTemplate.html').done(function(data) {
            self.template = _.template($('<div>').html(data).find('#post-answer-template').html());
            self.fetchQuestion();
            self.delegateEvents();
        }).fail(function() {
            console.error('Failed to load post answer template.');
        });
    },

    events: {
        'click #post-answer-btn': 'postAnswer'
    },

    postAnswer: function(event) {
        event.preventDefault();
        var self = this;
        var answerContent = this.$('textarea[name="inputanswer"]').val().trim();
        
        checkLoginStatus(function(isLoggedIn, userId) {
            if (!isLoggedIn) {
                alert("You must be logged in to post an answer.");
                return;
            }
            
            var answerData = {
                question_id: self.questionId,
                user_id: userId,
                content: answerContent
            };

            self.model.set(answerData);
            
            if (self.model.isValid()) {
                self.model.save(null, {
                    success: function(model, response) {
                        console.log('Answer posted successfully');
                        self.model.clear(); 
                        Backbone.history.navigate('questions/' + self.questionId, {trigger: true});
                        window.location.reload();
                    },  
                    error: function(model, response) {
                        console.error('Failed to post answer:', response.responseText);
                    }
                });
            } else {
                console.log('Validation failed', self.model.validationError);
            }
        });
    },

    fetchQuestion: function() {
        var self = this;
        var questionModel = new Backbone.Model();
        questionModel.url = 'http://localhost/WestTechQA/api/answers/' + this.questionId + '/details';
        questionModel.fetch({
            success: function(model) {
                self.question = model.toJSON();
                self.render();
            },
            error: function(model, response) {
                console.error('Failed to fetch question details:', response);
                self.$el.html('Failed to load question data. Please try again.');
            }
        });
    },
    
    render: function() {
        if (!this.template || !this.question) {
            console.log('Waiting for template or question data...');
            return this;
        }
    
        this.question.formattedDate = new Date(this.question.posted_date.replace(' ', 'T') + 'Z').toLocaleDateString();
    
        this.$el.html(this.template({ question: this.question }));
        console.log('Rendered Post Answer View with formatted date');
        return this;
    }
});

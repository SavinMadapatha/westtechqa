var QuestionDetailView = Backbone.View.extend({
    initialize: function(options) {
        this.questionId = options.questionId;
        this.model = new QuestionDetailModel({ id: this.questionId });
        this.template = null;
        
        var self = this;
        $.get('templates/questionDetailTemplate.html').done(function(data) {
            self.template = _.template($('<div>').html(data).find('#question-detail-template').html());
            self.listenTo(self.model, 'sync', self.render);
            self.model.fetch(); 
        }).fail(function() {
            console.error('Failed to load question detail template.');
        });
    },

    events: {
        'click #ask-question-btn': 'askQuestion',
        'click #add-answer-btn': 'addAnswer', 
        'click #go-to-login': 'redirectToLogin',
        'click .close-modal-btn': 'closeLoginPrompt',
        'click .vote-up': 'incrementVote',
        'click .vote-down': 'decrementVote',
        'change .accept-answer': 'acceptAnswer',
        'click .question-answer-content': 'navigateToAnswerDetail',
        'click .delete-btn': 'showDeleteConfirm'
    },

    askQuestion: function(event) {
        event.preventDefault();
        this.handleAction('ask');
    },

    addAnswer: function(event) {
        event.preventDefault();
        this.handleAction('answer');
    },

    handleAction: function(actionType) {
        var self = this;
        checkLoginStatus(function(isLoggedIn) {
            if (isLoggedIn) {
                var navigateTo = actionType === 'ask' ? 'ask' : 'questions/' + self.questionId + '/answer';
                Backbone.history.navigate(navigateTo, { trigger: true });
            } else {
                self.showLoginPrompt();
            }
        });
    },

    showLoginPrompt: function() {
        var self = this; 
        var loginModalHTML = `
            <div class="login-modal-overlay" id="login-modal-overlay">
                <div class="login-modal">
                    <span class="close-modal-btn">&#10005;</span> 
                    <p class="alert-text">Only the users who are logged in can post questions, answers, and vote!</p>
                    <button id="go-to-login">Login</button>
                </div>
            </div>
        `;
        $('body').append(loginModalHTML);
        $('#login-modal-overlay').show();
    
        $('#go-to-login').on('click', function() {
            self.redirectToLogin(); 
        });
        $('.close-modal-btn').on('click', function() {
            self.closeLoginPrompt(); 
        });
    },

    redirectToLogin: function() {
        Backbone.history.navigate('login', {trigger: true});
        this.closeLoginPrompt(); 
    },
    
    closeLoginPrompt: function() {
        $('#login-modal-overlay').remove(); 
    },

    incrementVote: function(event) {
        var self = this;
        var answerId = $(event.currentTarget).data('id');
        checkLoginStatus(function(isLoggedIn) {
            if (isLoggedIn) {
                $.ajax({
                    type: 'POST',
                    url: `http://localhost/WestTechQA/api/answers/incrementVote/${answerId}`,
                    success: function(response) {
                        if (response.message) {
                            console.log(response.message);
                            self.model.fetch();
                        } else {
                            alert(response.error);
                        }
                    },
                    error: function() {
                        console.log('Failed to connect to the server.');
                    }
                });
            } else {
                self.showLoginPrompt();
            }
        });
    },
    
    decrementVote: function(event) {
        var self = this;
        var answerId = $(event.currentTarget).data('id');
        checkLoginStatus(function(isLoggedIn) {
            if (isLoggedIn) {
                $.ajax({
                    type: 'POST',
                    url: `http://localhost/WestTechQA/api/answers/decrementVote/${answerId}`,
                    success: function(response) {
                        if (response.message) {
                            console.log(response.message);
                            self.model.fetch();
                        } else {
                            alert(response.error);
                        }
                    },
                    error: function() {
                        console.log('Failed to connect to the server.');
                    }
                });
            } else {
                self.showLoginPrompt();
            }
        });
    },
    
    acceptAnswer: function(event) {
        var answerId = $(event.currentTarget).data('id');
        var self = this;
        checkLoginStatus(function(isLoggedIn) {
            if (isLoggedIn) {
                $.ajax({
                    type: 'POST',
                    url: `http://localhost/WestTechQA/api/answers/accept`,
                    data: JSON.stringify({ answer_id: answerId }),
                    contentType: 'application/json',
                    success: function(response) {
                        if (response.message) {
                            console.log(response.message);
                            self.model.fetch(); 
                        } else {
                            console.log(response.error);
                        }
                    },
                    error: function() {
                        console.log('Failed to connect to the server.');
                    }
                });
            } else {
                self.showLoginPrompt();
            }
        });
    },    

    navigateToAnswerDetail: function(event) {
        var answerId = $(event.currentTarget).data('id');
        Backbone.history.navigate('answers/' + answerId, { trigger: true });
    },

    showDeleteConfirm: function() {
        var self = this;
        var deleteModalHTML = `
            <div class="delete-modal-overlay" id="delete-modal-overlay">
                <div class="delete-modal">
                    <span class="close-modal-btn">&#10005;</span> 
                    <p class="alert-text">Are you sure you want to delete this question?</p>
                    <button id="confirm-delete">Delete</button>
                    <button id="cancel-delete">Cancel</button>
                </div>
            </div>
        `;
        $('body').append(deleteModalHTML);
        $('#delete-modal-overlay').show();

        $('#confirm-delete').on('click', function() {
            self.deleteQuestion();
        });

        $('#cancel-delete, .close-modal-btn').on('click', function() {
            self.closeDeletePrompt();
        });
    },

    closeDeletePrompt: function() {
        $('#delete-modal-overlay').remove();
    },

    deleteQuestion: function() {
        var self = this;
        $.ajax({
            type: 'DELETE',
            url: `http://localhost/WestTechQA/api/questions/delete/${this.questionId}`,
            success: function(response) {
                console.log("Question deleted successfully");
                Backbone.history.navigate('questions', {trigger: true});
                self.closeDeletePrompt();
            },
            error: function() {
                console.log("Failed to delete the question");
                self.closeDeletePrompt();
            }
        });
    },    

    render: function() {
        if (!this.template) {
            console.log('Template not yet loaded.');
            return this;
        }
    
        var data = this.model.toJSON();
        console.log(data);
    
        data.formattedDate = new Date(data.posted_date.replace(' ', 'T') + 'Z').toLocaleDateString();
    
        if (data.answers && Array.isArray(data.answers)) {
            data.answersCount = data.answers.length;
            data.answers = data.answers.map((answer) => ({
                ...answer,
                formattedDate: new Date(answer.posted_date.replace(' ', 'T') + 'Z').toLocaleDateString()
            }));
        }
    
        this.$el.html(this.template(data));
        console.log('Rendered Question Detail View');
        return this;
    }
});

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
        'click .vote-down': 'decrementVote'
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
                $.post(`http://localhost/WestTechQA/api/answers/incrementVote/${answerId}`, {}, function(response) {
                    if (response.error) {
                        alert(response.error);
                    } else {
                        self.model.fetch();
                    }
                })
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
                $.post(`http://localhost/WestTechQA/api/answers/decrementVote/${answerId}`, {}, function(response) {
                    if (response.error) {
                        alert(response.error);
                    } else {
                        self.model.fetch();
                    }
                })
            } else {
                self.showLoginPrompt();
            }
        });
    },

    render: function() {
        if (!this.template) {
            console.log('Template not yet loaded.');
            return this;
        }
    
        var data = this.model.toJSON();
    
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

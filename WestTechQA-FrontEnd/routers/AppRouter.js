var AppRouter = Backbone.Router.extend({
    routes: {
        "": "questionList",
        "login": "loginView",
        "register": "registerView",
        "questions": "questionList",
        "questions/search/:query": "searchQuestions", 
        "questions/tag/:tag": "tagFilteredQuestions",
        "questions/:id": "questionDetail",
        "ask": "postQuestion",
        "questions/:id/answer": "postAnswer",
        "answers/:id": "answerDetail"  
    },

    initialize: function() {
        this.rootEl = $('#app');
        this.on('route', this.updateNavbar);
    },

    clearBindedEvents: function() {
        this.rootEl.off(); 
    },

    updateNavbar: function(routeName) {
        checkLoginStatus(function(isLoggedIn) {
            if (isLoggedIn) {
                $('.btn-login, .btn-register').hide();
                $('.user-profile').show();
            } else {
                $('.btn-login, .btn-register').show();
                $('.user-profile').hide();
            }
        });

        if (routeName === 'loginView' || routeName === 'registerView') {
            $('.custom-navbar').addClass('login-page');
        } else {
            $('.custom-navbar').removeClass('login-page');
        }
    },

    loginView: function() {
        this.clearBindedEvents();
        console.log('Navigating to login page');
        loginView = new LoginView({ el: '#app' });
        loginView.render();
    },

    registerView: function() {
        this.clearBindedEvents();
        console.log('Navigating to register page...');
        registerView = new RegisterView({ el: '#app' });
        registerView.render();
    },

    questionList: function() {
        this.clearBindedEvents();
        console.log('Navigating to questions...');
        var questionListView = new QuestionListView({ el: '#app' });
        questionListView.render();
    },

    searchQuestions: function(query) {
        console.log('Navigating to search results for:', query);
        var questionListView = new QuestionListView({ el: '#app', search: query });
        questionListView.render();
    },

    tagFilteredQuestions: function(tag) {
        console.log('Filtering questions by tag:', tag);
        var questionListView = new QuestionListView({ el: '#app', tag: tag });
        questionListView.render();
    },

    questionDetail: function(id) {
        this.clearBindedEvents();
        console.log('Navigating to question detail with ID:', id);
        var questionDetailView = new QuestionDetailView({ el: '#app', questionId: id });
        questionDetailView.render();
    },

    answerDetail: function(id) {
        this.clearBindedEvents();
        var answerDetailView = new AnswerDetailView({ el: '#app', answerId: id});
        answerDetailView.render();
    },

    postQuestion: function() {
        this.clearBindedEvents();
        console.log('Navigating to post a question...');
        var postQuestionView = new PostQuestionView({ el: '#app' });
        postQuestionView.render();
    },

    postAnswer: function(id) {
        this.clearBindedEvents();
        console.log('Navigating to post an answer for question ID:', id);
        var postAnswerView = new PostAnswerView({ el: '#app', questionId: id });
        postAnswerView.render();
    }
});

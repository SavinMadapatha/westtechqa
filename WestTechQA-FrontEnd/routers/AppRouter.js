var AppRouter = Backbone.Router.extend({
    routes: {
        "": "questionList",
        "login": "loginView",
        "register": "registerView",
        "questions": "questionList",
        "questions/:id": "questionDetail",
        "ask": "postQuestion" 
    },

    initialize: function() {
        this.on('route', this.updateNavbar);
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
        console.log('Navigating to login page');
        if (!loginView) {
            loginView = new LoginView({ el: '#app' });
        }
        loginView.render();
    },

    registerView: function() {
        console.log('Navigating to register page...');
        registerView = new RegisterView({ el: '#app' });
        registerView.render();
    },

    questionList: function() {
        console.log('Navigating to questions...');
        var questionListView = new QuestionListView({ el: '#app' });
        questionListView.render();
    },

    questionDetail: function(id) {
        console.log('Navigating to question detail with ID:', id);
        var questionDetailView = new QuestionDetailView({ el: '#app', questionId: id });
        questionDetailView.render();
    },

    postQuestion: function() {
        console.log('Navigating to post a question...');
        var postQuestionView = new PostQuestionView({ el: '#app' });
        postQuestionView.render();
    }
});

// global navigation events
$(document).on('click', 'a.btn-login', function(e) {
    e.preventDefault();
    Backbone.history.navigate('login', { trigger: true });
});

$(document).on('click', 'a.btn-register', function(e) {
    e.preventDefault();
    Backbone.history.navigate('register', { trigger: true });
});

$(document).on('click', '.user-profile', function(e) {
    e.preventDefault();
    Backbone.history.navigate('profile', { trigger: true });
});

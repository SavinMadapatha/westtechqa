var AppRouter = Backbone.Router.extend({
    routes: {
        "": "questionList",
        "login": "loginView",
        "register": "registerView",
        "questions": "questionList",
        'questions/:id': 'questionDetail'
    },

    loginView: function() {
        console.log('Navigating to login page');
        // Only create a new login view if it does not exist
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

    questionList: function(){
        console.log('Navigating to questions...');
        var questionListView = new QuestionListView({ el: '#app' });
        questionListView.render();
    },

    questionDetail: function(id) {
        console.log('Navigating to question detail with ID:', id);
        var questionDetailView = new QuestionDetailView({ el: '#app', questionId: id });
    }
});

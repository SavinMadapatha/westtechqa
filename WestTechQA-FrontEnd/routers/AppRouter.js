var AppRouter = Backbone.Router.extend({
    routes: {
        "": "login",
        "register": "registerView",
        "questions": "questionList"
    },

    login: function() {
        // Only create a new login view if it does not exist
        if (!loginView) {
            loginView = new LoginView({ el: '#app' });
        }
        loginView.render();
    },

    registerView: function() {
        registerView = new RegisterView({ el: '#app' });
        registerView.render();
    },

    home: function(){
        console.log('Navigating to home...');
        $('#app').html('Home Page Content');
    },

    questionList: function(){
        console.log('Navigating to questions...');
        var questionListView = new QuestionListView({ el: '#app' });
        questionListView.render();
    }
});

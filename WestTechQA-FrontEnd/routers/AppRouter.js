var AppRouter = Backbone.Router.extend({
    routes: {
        "": "questionList",
        "questions": "questionList"
    },

    home: function(){
        console.log('Navigating to home...');
        // Logic to display the home view
        $('#app').html('Home Page Content');
    },

    questionList: function(){
        console.log('Navigating to questions...');
        var questionListView = new QuestionListView({ el: '#app' });
        questionListView.render();
    }
});

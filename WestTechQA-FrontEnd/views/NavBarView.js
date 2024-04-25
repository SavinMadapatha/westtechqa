// NavBarView.js
var NavBarView = Backbone.View.extend({
    el: '#sidebar',

    initialize: function(options) {
        this.router = options.router;
    },

    events: {
        'click .nav-home': 'navigateHome',
        'click .nav-questions': 'navigateQuestions'
    },

    navigateHome: function(e) {
        e.preventDefault();
        this.router.navigate("questions", {trigger: true}); // Navigate to the questions view
        
        document.getElementById('sidebarMenu').classList.remove('active');
    },

    navigateQuestions: function(e) {
        e.preventDefault();
        this.router.navigate("questions", {trigger: true});
    }
});

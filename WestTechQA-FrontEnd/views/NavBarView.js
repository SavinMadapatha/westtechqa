// NavBarView.js
var NavBarView = Backbone.View.extend({
    el: '.custom-navbar', // Targeting the navbar instead of the sidebar for these operations

    initialize: function(options) {
        this.router = options.router;
        this.render(); // Ensure that the navbar is updated upon initialization
    },

    events: {
        'click .nav-home': 'navigateHome',
        'click .nav-questions': 'navigateQuestions',
        'click .btn-login': 'navigateLogin',
        'click .btn-register': 'navigateRegister'
    },

    navigateHome: function(e) {
        e.preventDefault();
        this.router.navigate("home", {trigger: true});
    },

    navigateQuestions: function(e) {
        e.preventDefault();
        this.router.navigate("questions", {trigger: true});
    },

    navigateLogin: function(e) {
        e.preventDefault();
        this.router.navigate("#", {trigger: true});
    },

    navigateRegister: function(e) {
        e.preventDefault();
        this.router.navigate("register", {trigger: true});
    },

    render: function() {
        this.updateNavbar();
    },

    updateNavbar: function() {
        if (isLoggedIn()) {
            this.$('.btn-login, .btn-register').hide(); // Hide login and register buttons if logged in
            this.$('.btn-logout').show(); // Assuming there's a logout button to show
        } else {
            this.$('.btn-login, .btn-register').show(); // Show login and register buttons if not logged in
            this.$('.btn-logout').hide();
        }
    }
});

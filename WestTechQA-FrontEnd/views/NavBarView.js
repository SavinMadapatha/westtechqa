var NavBarView = Backbone.View.extend({
    el: '.custom-navbar',

    initialize: function(options) {
        this.router = options.router;
        this.render();
    },

    events: {
        'click .nav-questions': 'navigateQuestions',
        'click .btn-login': 'navigateLogin',
        'click .btn-register': 'navigateRegister',
        'click .user-profile': 'navigateUserProfile'
    },

    navigateQuestions: function(e) {
        e.preventDefault();
        this.router.navigate("questions", {trigger: true});
    },

    navigateLogin: function(e) {
        e.preventDefault();
        this.router.navigate("login", {trigger: true});
    },

    navigateRegister: function(e) {
        e.preventDefault();
        this.router.navigate("register", {trigger: true});
    },

    navigateUserProfile: function(e){
        e.preventDefault();
        this.router.navigate("profile", {trigger: true});
    },

    render: function() {
        var self = this;
        checkLoginStatus(function(isLoggedIn) {
            if (isLoggedIn) {
                self.$('.btn-login, .btn-register').hide();
                self.$('.user-profile').show(); 
            } else {
                self.$('.btn-login, .btn-register').show();
                self.$('.user-profile').hide(); 
            }
        });
    }
});

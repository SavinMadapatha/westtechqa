function checkLoginStatus(callback) {
    $.ajax({
        url: 'http://localhost/WestTechQA/api/auth/session',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            callback(response.logged_in);
        },
        error: function(error) {
            console.log('Error checking session:', error);
            callback(false);
        }
    });
}

var appRouter;
var navbar;
var loginView;

$(document).ready(function() {
    preloadTemplates().then(function() {
        appRouter = new AppRouter();

        Backbone.history.start();

        checkLoginStatus(function(isLoggedIn) {
            if (isLoggedIn) {
                if (Backbone.history.getFragment() === "") {
                    appRouter.navigate('questions', {trigger: true});
                }
            } else {
                if (Backbone.history.getFragment() === "") {
                    appRouter.navigate('', {trigger: true});
                }
            }
        });

        navbar = new NavBarView({ router: appRouter });

        $('#toggle-sidebar').click(function() {
            var sidebarWidth = $('#sidebar').width() > 0 ? '0px' : '250px';
            $('#sidebar').css('width', sidebarWidth);
        });

    }).catch(function(error) {
        console.error("Error loading templates:", error);
    });
});

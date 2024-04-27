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
    // First, ensure all templates are loaded
    preloadTemplates().then(function() {
        // Templates are loaded, initialize the router and other components
        appRouter = new AppRouter();

        // Start Backbone history
        Backbone.history.start();

        // Initialize the navbar
        navbar = new NavBarView({ router: appRouter });

        // Check if the user is logged in
        checkLoginStatus(function(isLoggedIn) {
            if (isLoggedIn) {
                appRouter.navigate('questions', {trigger: true});
            } else {
                appRouter.navigate('', {trigger: true});
            }
        });

        // Toggle sidebar event
        $('#toggle-sidebar').click(function() {
            var sidebarWidth = $('#sidebar').width() > 0 ? '0px' : '250px';
            $('#sidebar').css('width', sidebarWidth);
        });

    }).catch(function(error) {
        console.error("Error loading templates:", error);
    });
});

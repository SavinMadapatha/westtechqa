function isLoggedIn() {
    // Example implementation checking local storage for a user token
    return !!localStorage.getItem('userToken');
}

var appRouter;
var navbar;
var loginView;

$(document).ready(function() {
    // Initialize the router
    appRouter = new AppRouter();

    // Start Backbone history
    Backbone.history.start();

    // Initialize the navbar
    navbar = new NavBarView({ router: appRouter });

    // Check if the user is logged in
    if (!isLoggedIn()) {
        appRouter.navigate('questions', {trigger: true});
    } else {
        appRouter.navigate('', {trigger: true});
    }

    // Toggle sidebar event
    $('#toggle-sidebar').click(function() {
        var sidebarWidth = $('#sidebar').width() > 0 ? '0px' : '250px';
        $('#sidebar').css('width', sidebarWidth);
    });
});

var appRouter;

$(document).ready(function() {
    // Initialize the router
    var appRouter = new AppRouter();

    // Initialize the navbar
    var navbar = new NavBarView({ router: appRouter });

    // Start Backbone history
    Backbone.history.start();

    // Toggle sidebar
    $('#toggle-sidebar').click(function() {
        var sidebarWidth = $('#sidebar').width() > 0 ? '0px' : '250px'; // Or whichever width you prefer
        $('#sidebar').css('width', sidebarWidth);
    });
});

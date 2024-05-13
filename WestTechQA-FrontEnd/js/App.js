function checkLoginStatus(callback) {
    $.ajax({
        url: 'http://localhost/WestTechQA/api/auth/session',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.logged_in) {
                callback(true, response.user_id); 
            } else {
                callback(false);
            }
        },
        error: function(error) {
            console.log('Error checking session:', error);
            callback(false);
        }
    });
}

var appRouter;
var loginView;

$(document).ready(function() {
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

    $('#toggle-sidebar').click(function() {
        var sidebarWidth = $('#sidebar').width() > 0 ? '0px' : '250px';
        $('#sidebar').css('width', sidebarWidth);
    });
});

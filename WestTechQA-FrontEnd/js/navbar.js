document.addEventListener('DOMContentLoaded', function () {
    var mobileMenu = document.getElementById('mobile-menu');
    var sidebarMenu = document.getElementById('sidebarMenu');
    var navbar = document.querySelector('.custom-navbar');
  
    mobileMenu.addEventListener('click', function () {
      sidebarMenu.classList.toggle('active');
    });
  
    document.addEventListener('click', function (event) {
      if (!navbar.contains(event.target) && !sidebarMenu.contains(event.target) && sidebarMenu.classList.contains('active')) {
        sidebarMenu.classList.remove('active');
      }
    });
  });

  $(function() {

    // to fetch and displaye the logged-in user's username in the profile popup
    $('.user-profile').on('click', function() {
      checkLoginStatus(function(isLoggedIn, userId, username) {
          if (isLoggedIn) {
              $('#user-profile-name').text(username);
              $('#user-profile-popup').removeClass('hidden').css({ visibility: 'visible', opacity: 1 });
          } else {
              alert("Session has expired or user not logged in!");
              Backbone.history.navigate('login', { trigger: true });
          }
      });
    });

    $('.close-modal-btn').on('click', function() {
        $('#user-profile-popup').addClass('hidden').css({ visibility: 'hidden', opacity: 0 });
    });

    // logout upon clicking the 'Logout' button
    $('#logout-btn').on('click', function() {
      $.ajax({
          url: 'http://localhost/WestTechQA/api/auth/logout',
          type: 'POST',
          success: function(response) {
              console.log('User logged out:', response.message);
              Backbone.history.navigate('login', { trigger: true });
              window.location.reload(); // to clear the client side data
          },
          error: function(error) {
              console.error('Logout failed:', error.responseText);
          }
      });
    });

    $('#edit-profile-btn').on('click', function() {
        console.log('Navigate to edit profile page');
        Backbone.history.navigate('#editProfilePage', { trigger: true });  
    });
});
  
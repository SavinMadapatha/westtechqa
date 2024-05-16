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

  $('#profile-btn').on('click', function(event) {
      event.preventDefault(); 
      console.log('Navigate to profile page');
      Backbone.history.navigate('profile', { trigger: true });
      $('#user-profile-popup').addClass('hidden').css({ visibility: 'hidden', opacity: 0 });
  });

  $('.close-modal-btn').on('click', function() {
      $('#user-profile-popup').addClass('hidden').css({ visibility: 'hidden', opacity: 0 });
  });

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

  $('.search-bar button').on('click', function(e) {
    e.preventDefault();
    var searchQuery = $('.search-bar input[type="search"]').val().trim();
    if (searchQuery) {
        Backbone.history.navigate('questions/search/' + encodeURIComponent(searchQuery), { trigger: true });
    }
});
});

document.addEventListener('DOMContentLoaded', function () {
    var mobileMenu = document.getElementById('mobile-menu');
    var sidebarMenu = document.getElementById('sidebarMenu');
    var navbar = document.querySelector('.custom-navbar');
  
    mobileMenu.addEventListener('click', function () {
      sidebarMenu.classList.toggle('active');
    });
  
    // close the sidebar when clicking outside of it
    document.addEventListener('click', function (event) {
      if (!navbar.contains(event.target) && !sidebarMenu.contains(event.target) && sidebarMenu.classList.contains('active')) {
        sidebarMenu.classList.remove('active');
      }
    });
  });
  
$(document).ready(function() {
  $(".profile-pic").click(function(e) {
    console.log("click");
    $('html, body').animate({ scrollTop: 0 }, 'medium');
  });

  $(window).scroll(function() {
    var height = $(window).scrollTop();
    updateHeader(height);
  });
});

var updateHeader = function(pos) {
  if(pos > 30) {
    $(".nav-item").addClass("nav-item-scrolled");
    $(".profile-pic").addClass("profile-pic-scrolled");
    $(".nav-bar").addClass("nav-bar-scrolled");
  } else {
    $(".nav-item").removeClass("nav-item-scrolled");
    $(".profile-pic").removeClass("profile-pic-scrolled");
    $(".nav-bar").removeClass("nav-bar-scrolled");
  }
}
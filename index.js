$(document).ready(function(){

  $('.nav-item').click(function(){
     $('.navbar-collapse').collapse('hide');
     $('#nav-icon4').toggleClass('open');
  });

  $('#nav-icon4').click(function(){
    $(this).toggleClass('open');
  });

  // Navlinks Function

  $(".home").click(function() {
    $('html, body').animate({
      scrollTop: $("#homepage").offset().top
    }, 1500);
  });

  $(".uber").click(function() {
    $('html, body').animate({
      scrollTop: $("#uber").offset().top
    }, 1500);
  });

  $(".textarbeit").click(function() {
    $('html, body').animate({
      scrollTop: $("#textarbeit").offset().top
    }, 1500);
  });

  $(".foschung").click(function() {
    $('html, body').animate({
      scrollTop: $("#foschung").offset().top
    }, 1500);
  });

  $(".archive").click(function() {
    $('html, body').animate({
      scrollTop: $("#archivierung").offset().top
    }, 1500);
  });
  $(".kontakt").click(function() {
    $('html, body').animate({
      scrollTop: $("#kontakt").offset().top
    }, 1500);
  });
  $(".impressum").click(function() {
    $('html, body').animate({
      scrollTop: $("#impressum").offset().top
    }, 1500);
  });

    // Animation Plugin

    AOS.init({
      duration: 3000
    });

});

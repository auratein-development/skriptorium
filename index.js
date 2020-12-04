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

  // Scroll-Icon Function

  var $scrollSection = $('.about');
  var $scrollTrigger = $('.scrolling');
  var nextSection = 1;

  $scrollTrigger.on( 'click', function() {
    $(".scroller").show();
    $(".scroller-up").hide();
    if (nextSection >= $scrollSection.length) {
      $('html, body').animate({ scrollTop: 0 }, 1500);
      nextSection = 1;
      return;
    }

    while ( $('html, body').scrollTop() > $($scrollSection[nextSection]).offset().top ) {
      nextSection++;
    }

    if (nextSection === ($scrollSection.length - 1)) {
      $(".scroller").hide();
      $(".scroller-up").show();
    }

    $( 'html, body' ).animate({ scrollTop: $($scrollSection[nextSection]).offset().top }, 1500);
    nextSection++;
    });

    // Animation Plugin

    AOS.init({
      offset: 200,
      duration: 3000
    });

});

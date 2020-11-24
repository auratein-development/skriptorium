$(document).ready(function(){

  $('.nav-item').click(function(){
     $('.navbar-collapse').collapse('hide');
     $('#nav-icon4').toggleClass('open');
  });

  $('#nav-icon4').click(function(){
    $(this).toggleClass('open');
  });

});

$(function(){
  // find all slides
  var slides = $('.main-slide');
  // starting index
  var i = 0;
  // click listener
  $('#main-slider-next').click(function(){
    // find next index
    // i + 1 or 0 if end of slides
    i = ++i % slides.length;

    // scroll to that index
    $('.slider-wrapper').animate(
      {'left' : -i*slides.eq(i).width()},
      600
    );
    $('.slider-wrapperM').animate(
      {'left' : -i*slides.eq(i).width()},
      600
    );
  });
});
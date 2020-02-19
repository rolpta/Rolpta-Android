$.ajax({
    url : json_url+"rev.json",
    type : 'GET',
    dataType : 'json',
    success : function(results){
      //populate fields
      $.each(results, function(i, field){

        //$('#topcarousel').append('<div class="carousel-item homecarobg white-text" href="#!"><div><img  src="'+field+'"></div></div>');
        $('#topcarousel').append('<img  class="owl-lazy" data-src="'+field+'">');
      });

      $('#topcarousel').owlCarousel({
        items:1,
        lazyLoad:true,
        autoplay:true,
        autoplayTimeout:4000,
        autoplayHoverPause:true,
        loop:true,
        margin:10
      });
     }
});

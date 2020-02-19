(function($){
document.title=app_title;
$("body").delegate("a", "click", function(){
//block links with #!
vhash=$(this).attr('href');

if(vhash=='#!') {return false;}
if(vhash=='#!back') {history.back(1);return false;}
if(vhash=='#!logout') {location.href="./";return false;}

});


initialize();

$(function(){

  }); // end of document ready
})(jQuery); // end of jQuery name space

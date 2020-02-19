//check for user
var user_data={};

var vhash='';

var state_checked=false;

post_authentication();

//subs for applet
var applet_subs=['prepare','init','initialize','acceptLocation','acceptQRCODE','sync','acceptPhoto','acceptGPS','render','update','next','user_info','distance'];

//toggle password
$("body").delegate(".toggle-password", "click", function() {
  $(this).toggleClass("fa-eye fa-eye-slash");

  var input = $($(this).attr("toggle"));
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
});

$("body").delegate("[clicked]", "click", function() {
  path = $(this).attr('clicked');
  redirect(path);
});

$("body").delegate("a", "click", function() {
  link = $(this).attr('href');

  if(typeof(link)=='undefined') {return true;}

  //allow phone numbers
  if (link.indexOf('tel') != -1) {
    app_bridge("dial",link);
    return false;
  }

  if (link == '') {
    location.href = "#home";
    return false;
  }


  //block links with #!
  hash = link.split('#')[1];

  if(typeof(hash)=='undefined') {hash='';}

  //skip modals
  if (hash.indexOf('modal') != -1) {
    return true;
  }

  if (hash == '' || hash == '!') {
    return false;
  }
  if (hash == '!back') {
    goback();
    return false;
  }

  if(hash=='user/logout') {
    logout();
    return false;
  }

});


$(function() {

  //prepare sidenav
  $('.sidenav').sidenav();

  // Bind the event.
  $(window).hashchange(function() {
    // Alerts every time the hash changes!
    vhash = location.hash.split('#')[1];

    //load default vc if none other can be found
    if (typeof vhash === 'undefined') {

      if (vc_count == 0) {
        //first loader
        vhash = is_logged_in() ? user_dashboard : user_home;
      } else {
        return false;
      }
    }


    switch (vhash) {
      case '':
        return false;


        case 'user/data':
        console.log(user_data);
        history.back(1);
        return false;


      case '!':
        return false;
        break;

      case '!back':
        history.back(1);
        return false;
        break;

      case '':

        break;
      default:
        loadvc(vhash);
    }

    if (is_logged_in() && !state_checked) {
        state_checked=true;
        check_page_state();
        console.log('checking page state');
    }


  });

  // Trigger the event (useful on page load).
  $(window).hashchange();
});

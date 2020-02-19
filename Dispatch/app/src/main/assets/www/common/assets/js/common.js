//check user info after a server call
function userinfo_handler() {

  if (is_logged_in()) {
    //set headers for ajax
    hdrs = {
      'Content-Type': 'application/json',
      'Authorization': user_data.token,
      'page': vc_info.vc,
      'appkey': app_key
    };

    //configure sidebar for both requester and dispatcher
    $('#realname').html(user_data.first + ' ' + user_data.last);


    $('#user_avatar').attr('src', user_data.avatar);

    if (app_key == 'requester') {
      //requester
      userinfo_requester_routines();
    } else {
      //dispatcher
      userinfo_dispatcher_routines();
    }






    //check for mis-match error on the map
    //alert(vc_info.vc+' :: '+user_data.page);

    cpage = location.href.split('#')[1];

    check_page_state();

  } else {
    hdrs = {
      'Content-Type': 'application/json',
      'page': vc_info.vc,
      'appkey': app_key
    };
  }

  sync_headers();

}

//detect when vc is being loaded
function loadvc_handler(params) {

  if (params.vc == 'dashboard') {
    //check for verify


    if (user_data.status == 0) {
      params.vc = 'user/verify';
    } else if (user_data.bvn == null) {
      //params.vc = 'user/bvn';
    }

  }

  check_page_state();

  return params;
}


//user_info call for requester
function userinfo_requester_routines() {

}


//user_info call for dispatcher
function userinfo_dispatcher_routines() {


}

//check if nav is lost
function check_lost_state() {
  //console.log("I am lost");
  //return false;

  current_page = vc_info.vc;

  for(key in order_map) {
    pg=order_map[key];
    if(pg==current_page) {
      redirect(user_dashboard);
      console.log('Return lost user to dashboard');
      break;
    }
  }


}

//check the state of a page
function check_page_state() {

  //if no user_data or state data, skip it
  if (typeof(user_data) == 'undefined' || typeof(user_data.navstate) == 'undefined') {
    return false;
  }

  //no vc
  if (typeof(vc_info.vc) == 'undefined' || vc_info.vc=='dist/user/data' || vc_info.vc=='dist/user/map' || vc_info.vc=='user/map') {
    return false;
  }


  //vc and page must be the same for this to hold water
  //if(user_data.page!=vc_info.vc) {return;}

  //check the current navstate key
  newkey = user_data.navstate;
  expected_page = typeof(order_map[newkey])=="undefined" ? null : order_map[newkey];
  current_page = vc_info.vc;

  if(expected_page!=null && current_page!=expected_page) {
    redirect(expected_page);
    console.log("Force navigating to "+expected_page);
  } else if(newkey==0) {
    return check_lost_state();
  }

  return;
}


//setup google map
var google_map = null;

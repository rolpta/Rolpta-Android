
//interval to check geo position
var geocheck_interval = 60 * 1000;

var sync_xhr;

var sync_timer;

var work_timer;

//service worker timer interval
var service_worker_interval = 10 * 1000;

//first time initiating
var profile_sync_interval_init = 4 * 1000;

//regular time when going to and fro for user
var profile_sync_interval_user = 10 * 1000;

//regular time when going to and fro for guest
var profile_sync_interval_guest = 20 * 1000;


//do profile sync response here
function psync(response) {



  //user might have been logged out
  if (!is_logged_in()) {
    return;
  }


  if (typeof(response.time)!='undefined' &&  response.time < user_data.time) {
    console.log("skipping outdated data - " + response.time);
    return false;
  }

  //if user is authenticated, first page shows from here
  fdata_set('user_data', response);
  user_data = response;

  post_authentication();
  //go to dashboard if there is profile and you are on bvn page
  if (vc_info.vc == 'user/bvn' && user_data.bvn != null) {
    redirect(user_dashboard);
  }



}

//execute a profile sync with immediate alacrity
function profile_sync_now() {
  profilesync_updater();
}

//sync service worker
function service_worker_updater() {

  if (typeof(applet) != 'undefined' && typeof(applet.sync) == 'function') {
    applet.sync();
  }

}

//update profile
function profilesync_updater() {
  clearTimeout(sync_timer);

  if (is_logged_in()) {


    try {
      sync_xhr.abort();
    } catch (e) {
      void(0);
    }


    if(typeof(user_position_data)!='undefined') {
      pos_data=user_position_data;
    } else {
      pos_data = {
        'lat': '',
        'lng': '',
        'city': '',
        'state': '',
        'country': ''
      };
    }



    sync_xhr = $.ajax({
      url: api_base_url + "profile/sync",
      dataType: "json",
      cache: false,
      method: "POST",
      headers: hdrs,
      //data:pos_data,
      success: function(response) {
        psync(response);
      },
      error: function(xhr, status, error) {
        if(xhr.status=="504" || xhr.status=="404") {
          logout();
        }
      }
    }).always(function() {
      //reset_timer
      sync_timer = setTimeout('profilesync_updater()', profile_sync_interval_user);
    });

  } else {
    //not logged in
    sync_timer = setTimeout('profilesync_updater()', profile_sync_interval_guest);
  }
}


//begin sync stuffs
sync_timer = setTimeout('profilesync_updater()', profile_sync_interval_init);

work_timer = setInterval('service_worker_updater()', service_worker_interval);

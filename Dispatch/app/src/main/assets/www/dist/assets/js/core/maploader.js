var mapcheck_interval = 10 * 1000;
var map_loader_timer;

var map_attempts = 0;

var map_is_ready=false;

var map_url = "https://maps.googleapis.com/maps/api/js?key=" + map_key + "&language=en&libraries=geometry,places&callback=initMap";


load_map_lib();

function load_map_lib() {
  if(map_is_ready) {return;}

  console.log("Attempting to load google map");

  var script = document.createElement('script');
  script.type = 'text/javascript';

  if(map_attempts==0) {
    script.src = map_url;
  } else {
    script.src = map_url + "&no_cache=" + new Date().getTime();
  }



  script.onload = function() {
    clearTimeout(map_loader_timer);
    map_loader_timer = setTimeout('load_map_lib()', mapcheck_interval);
  };
  script.onerror = function() {
    console.log("Google map failed to load");

    clearTimeout(map_loader_timer);
    map_loader_timer = setTimeout('load_map_lib()', mapcheck_interval);
  };

  m_head = document.getElementsByTagName("head")[0];
  m_head.appendChild(script);

  map_attempts++;

  return false;
}

function initMap() {
  map_is_ready=true;

  clearTimeout(map_loader_timer);

  console.log("Google map loaded successfully");

  loadjs_once("dist/assets/js/lib/v3_epoly.js");
  loadjs_once("dist/assets/js/lib/location-picker.js");


  setTimeout(function() {

    opt = {
      fixedpointer: true,
      draggable: false
    };
    google_map = $('body').gmap(opt).init();

    console.log("Google map applet is ready");

    loadjs_once("dist/assets/js/core/apploader.js");

  },2000);


  //alert("Map fully ready");
}

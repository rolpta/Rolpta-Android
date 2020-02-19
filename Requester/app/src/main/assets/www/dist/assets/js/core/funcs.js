function isNumberKey(evt) {
  var charCode = (evt.which) ? evt.which : event.keyCode
  if (charCode != 45 && charCode > 31 && (charCode < 48 || charCode > 57))
    return false;

  return true;
}

function maxLengthCheck(object) {
  if (object.value.length > object.maxLength)
    object.value = object.value.slice(0, object.maxLength)
}

function moneyFormat(amount) {
  if(typeof(currency)=='undefined') {
    currency='â‚¦';
  }
  return currency + number_format(amount, 2);
}


function formdata(form) {
  var _form_data = {};
  jQuery(form).serializeArray().map(function(item) {
    if (_form_data[item.name]) {
      if (typeof(_form_data[item.name]) === "string") {
        _form_data[item.name] = [_form_data[item.name]];
      }
      _form_data[item.name].push(item.value);
    } else {
      _form_data[item.name] = item.value;
    }
  });

  return _form_data;
}

function goback() {
  //check if applet defines back routine
  if (typeof(applet) != 'undefined' && typeof(applet.back) == 'function') {
    applet.back();
    return;
  }

  //look for back
  if (location.hash == '') {
    return false;
  };
  history.back(1);


  setTimeout(function() {
    if (location.hash == '') {
      location.reload();
    };
  }, 1000);

}

/**
 * Calculate Distance
 */
function calc_distance(latitude1, longitude1, latitude2, longitude2) {
  distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude1, longitude1), new google.maps.LatLng(latitude2, longitude2));
  return distance;
}

function post_authentication() {
  udata = store.get('user_data_' + app_key);

  if (udata !== undefined) {
    user_data = udata;

  } else {
    user_data = {};
  }

  raise_event('userinfo', {
    data: user_data
  });

  //execute apple function
  if (typeof(applet) != 'undefined' && typeof(applet.userinfo) == 'function') {
    applet.userinfo(user_data);
  }

}


function parse_xml() {
  var xml = $($.parseXML(data)).children('html');
  return xml;
}

//convert absolute to relative url
function url(str) {
  return str.replace(location.href.split('#')[0], "");
}


/**
 * Pass a style or script to this e.g. home.css to give assets/views/styles/home.css
 */
function asset(fname) {
  root = "app";

  if (fname.indexOf('dist/') != -1) {
    //use dist
    s = fname.split('/');
    s.shift();
    fname = s.join('/');
    root = "dist";
  }


  fname = fname.replace(location.href.split('#')[0], "");

  if (fname.indexOf('.js') != -1) {
    //absolute
    path = root + "/assets/js/" + fname;
  } else {
    path = root + "/assets/css/" + fname;
  }

  return path;
}



function lockscreen(permanent) {
  opt = {
    onOverlayClick: $.unblockUI,
    message: null,
    css: {
      border: 'none',
      padding: '15px',
      backgroundColor: '#000',
      '-webkit-border-radius': '10px',
      '-moz-border-radius': '10px',
      opacity: 0.1,
      color: '#fff'
    }
  };


  if (permanent) {
    delete opt.onOverlayClick;
  }


  $.blockUI(opt);
}


function unlockscreen(secs) {
  if (typeof(secs) == 'undefined') {
    secs = 0;
  }
  setTimeout('$.unblockUI()', secs * 1000);

}

function is_function(func) {
  return typeof window[func] !== 'undefined' && $.isFunction(window[func]);
}

//raise event
function raise_event(evt, param) {

  try {
    evt = eval(evt + '_handler');
  } catch (e) {
    return false;
  }

  if (typeof evt === 'function') {
    return evt(param);
  }
}

//find data e.g. user_data, cred
function fdata_get(key) {
  ret = store.get(key + '_' + app_key);
  return ret;
}

//set fdata e.g. user_data, cred
function fdata_set(key, value) {
  store.set(key + '_' + app_key, value);
}



//store authorization credentials
function store_cred(fdata, fields) {
  cred = {};

  for (var key in fields) {
    if (fields.hasOwnProperty(key)) {
      fld = fields[key];

      $.each(fdata, (index, item) => {
        if (item.name == fld) {
          cred[fld] = item.value;
        }
      });
    }
  }

  //get credentials
  store.set('user_cred_' + app_key, cred);
}


function toasterror(xhr) {
  response = xhr.responseJSON;

  try {
    //handle error automatically
    if (typeof(response.message) !== 'undefined') {
      message = response.message;
    } else if (typeof response.msg !== 'undefined') {
      message = response.msg;
    } else {
      message = "Network error occurred";
    }
  } catch (e) {
    message = "Network error occurred";
  }
  walert(message);
}

/**
 * Send function and param to bridge
 *
 * https://medium.com/john-lewis-software-engineering/ios-wkwebview-communication-using-javascript-and-swift-ee077e0127eb
 *
 */
function app_bridge(fx, param) {

  if (typeof window.Android !== "undefined" && window.Android !== null) {
    if (typeof(param) == "undefined") {
      window.Android[fx]();
    } else {
      window.Android[fx](param);
    }
  } else if (typeof window.webkit !== "undefined" && typeof window.webkit.messageHandlers !== "undefined" && window.webkit.messageHandlers !== null) {
    if (typeof(param) == "undefined") {
      window.webkit.messageHandlers.bridge.postMessage(fx+":");
    } else {
      window.webkit.messageHandlers.bridge.postMessage(fx+":"+param);
    }

  } else {
    try {
      if (typeof(param) == "undefined") {
        window[fx]();
      } else {
        window[fx](param);
      }
    } catch (e) {
      void(0);
    }
  }


}

//bridge stuff
function trackgps() {

  if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
  					lastgps = position.coords.latitude + "," + position.coords.longitude;
  					console.log("Grab gps via browser is "+lastgps);
            setTimeout(function() {
              applet.acceptGPS(lastgps);
            },2000);
  				});
  } else {
  	console.log("Unable to detect gps via browser");
    setTimeout(function() {
      applet.acceptGPS(lastgps);
    },2000);
  }

}

//bridge fx
function getPhoto(title) {
  $("[type=file]").remove();

  $('body').append("<input id=\"upload\" type='file' />");

  $("[type=file]").trigger('click');

  $(":file").change(function() {
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function imageIsLoaded(e) {
        img = e.target.result.replace('data:image/jpeg;base64,', '');
        applet.acceptPhoto(img);
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  return false;
}


function getCamera(title) {
  return getPhoto(title);
}


//hide mat dialog
function hide_notification() {
  if (notify_active) {
    notify_active = false;
    app_bridge("stopNotification");
    $("#divMatDialog .modal").modal("close");
  }
}

function zoom_image(src) {


  var MyDialog = new MatDialog();

  MyDialog.create({
      Content: {
        Label: '<img src="'+src+'" style="width:100%;">',
        Class: 'mdl',
      },
      Buttons: [{
          Label: "Close",
          value: 'accept',
          Class: '#388e3c green darken-2',
        }
      ]
    },
    function(result) {
    }
  );

  $('.modal-content').css('padding', 0);


}


var notify_active = false;

function do_notification(sender_image, sender_name, sender_message, button_message) {
  if (notify_active) {
    return false;
  }

  var MyDialog = new MatDialog();

  MyDialog.setModalConfig({
    Dismissible: false,
    EndingTop: '30%',
    Opacity: 0.8,
    StartingTop: '40%'
  });

  if (typeof(sender_name) == 'undefined' || sender_name == null) {
    sender_name = "Application";
  }

  if (typeof(sender_image) == 'undefined' || sender_image == null) {
    sender_image = "app/assets/img/person.png";
  }

  if (typeof(sender_message) == 'undefined' || sender_message == null) {
    sender_message = "Your attention is needed";
  }

  if (typeof(button_message) == 'undefined' || button_message == null) {
    button_message = "Got it!";
  }

  output = '<div class="row notify_info">';
  output += '<div class="col sicon">' + '<img src="' + sender_image + '" class="sender_image circular">' + '</div>';
  output += '<div class="col stext">' + '<span class="sender_name">' + sender_name + '</span>' + '<span class="sender_message">' + sender_message + '</span>' + '</div>';
  output += '</div>';


  app_bridge("startNotification");


  MyDialog.create({
      Content: {
        Label: output,
        Class: 'mdl',
      },
      Buttons: [{
          Label: button_message,
          Value: 'accept',
          Class: '#388e3c green darken-2',
        }
        /*
        {
          Label: 'Cancel',
          Value: 'cancel',
          Class: '#ad1457 pink darken-3',
        }
        */
      ]
    },
    function(result) {
      //callback
      notify_active = false;
      app_bridge("stopNotification");
    }
  );

  $('.modal-content').css('padding', 0);

  notify_active = true;

  return true;
}

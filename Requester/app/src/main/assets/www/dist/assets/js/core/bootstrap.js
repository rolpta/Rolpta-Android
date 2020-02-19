//catch errors
window.onerror = function(e) {
  console.log(e);
}

var redir;
var hdrs = {};

function loadscript(url) {
  url = "assets/scripts/" + url;
  return loadjs(url);
}


function loadjs(url) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url + "?no_cache=" + new Date().getTime();

  script.onload = function() {
    //console.log("Loaded file "+url);

    applet_setup();

    //integrate map
    if(typeof(google_map)!='undefined') {
      applet.map=google_map;
    }


    //execute applet initialize function
    if(typeof(applet)!='undefined' && typeof(applet.prepare)=='function') {
      applet.prepare();
    }

    //execute applet initialize function
    if(typeof(applet)!='undefined' && typeof(applet.initialize)=='function') {
      applet.initialize();
    }

    //call sync if available
    if(typeof(applet)!='undefined' && typeof(applet.sync)=='function') {
      applet.sync();
    }

    //applet location changed
    try {
    location_changed();
  } catch(e) {}

  };
  script.onerror = function() {
    console.log('Unable to load script ' + url);
  };


  m_head = document.getElementsByTagName("head")[0];

  m_head.appendChild(script);

  return false;
}

//setup applet with the subs
function applet_setup() {
  for (key in applet_subs) {
       sub=applet_subs[key];
       if(typeof(applet[sub])=='undefined') {
         eval('applet.'+sub+'=function() {};');
       }
  }
}

//load js once
var loaded_js=[];
function loadjs_once(url) {

  if(jQuery.inArray(url, loaded_js) != -1) {
      //console.log(url+" has already been loaded");
      return false;
  }

    $.ajax({
        url: url,
        cache: false,
        dataType: "script",
        success: function() {
          loaded_js.push(url);
          console.log("Loaded " + url+" successfully");
        }
      })
      .fail(function(jqxhr, settings, exception) {
        walert('Unable to fetch requested script ' + url);
      });
}

function walert(t) {
  new MatDialog().alert(t);
}



/**
 *
 * String.format('{0} is dead, but {1} is alive! {0} {2}', 'ASP', 'ASP.NET');
 * with the result:
 * ASP is dead, but ASP.NET is alive! ASP {2}
 */
if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ?
        args[number] :
        match;
    });
  };
}

/**
 * getUrlParam
 *
 * Gets a parameter from the browse like $_GET
 * @name			The name of the parameter
 * @valouue		The default value
 */
function getUrlParam(name, value) {
  var reParam = new RegExp('(?:[\?&]|&amp;)' + name + '=([^&]+)', 'i');

  sack='?'+window.location.hash.split('?')[1];
  var match = sack.match(reParam);

  return (match && match.length > 1) ? match[1] : value;
}


function get(name) {
  return getUrlParam(name, '');
}

/**
 * This will convert a function from string to object
 * <code>
 * var func = 'function (a, b) { return a + b; }'.parseFunction();
 * walert(func(3,4));
 * </code>
 */
if (typeof String.prototype.parseFunction != 'function') {
  String.prototype.parseFunction = function() {
    var funcReg = /function *\(([^()]*)\)[ \n\t]*{(.*)}/gmi;
    var match = funcReg.exec(this.replace(/\n/g, ' '));

    if (match) {
      return new Function(match[1].split(','), match[2]);
    }

    return null;
  };
}

/**
 * Captilize
 */
String.prototype.ucfirst = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};


function number_format(number, decimals, dec_point, thousands_sep) {
  // Strip all characters but numerical ones.
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

//count length of e.g. json object
function countProperties(obj) {
  var prop;
  var propCount = 0;

  for (prop in obj) {
    propCount++;
  }
  return propCount;
}


/**
 * Checks if an api response is accepted
 * 0 - valid, 1 - invalid
 *
 * @return bool
 */
function is_accepted(response) {
  if (response.token !== undefined) {
    return true;
  }

  if (response.success !== undefined && response.success == true) {
    return true;
  }
  return false;
}

function fetch_data_bg(schema, data, cb, cbe) {

  $.ajax({
      url: api_base_url + schema,
      type: "POST",
      headers:hdrs,
      data: data,
      cache: false,
      dataType: "json",
      crossDomain: true,
      success: function(response) {
        cb(response, schema, data);
      },
      error: function(xhr, status, error) {
        response = xhr.responseJSON;
        console.log(response);

        if(typeof(cbe)==='function') {
          cbe(schema);
        }
      }
    }).fail(function() {})
    .always(function() {
    });
}


function fetch_data(schema, data, cb, cbe) {

  lockscreen(true);

  $.ajax({
      url: api_base_url + schema,
      type: "POST",
      data: data,
      headers:hdrs,
      cache: false,
      dataType: "json",
      crossDomain: true,
      success: function(response) {
        //console.log(response);
        cb(response, data, schema);
      },
      error: function(xhr, status, error) {
        response = xhr.responseJSON;

        toasterror(xhr);

        if(typeof(cbe)==='function') {
          cbe(schema);
        }

      }
    }).fail(function() {})
    .always(function() {
      //unlock screen
      $.unblockUI();
    });

}

//uses header
function send_data(schema, data, cb, cbe) {
  return fetch_data(schema,data,cb,cbe);
}


function send_data_bg(schema, data, cb, cbe) {
  return fetch_data_bg(schema,data,cb,cbe);
}


//perform authorize action
function authorize(response) {
  if (is_accepted(response)) {

    fdata_set('user_data', response);

    post_authentication();

    redir = store.get('redirect');

    if (redir !== undefined) {
      store.remove('redirect');
    } else {
      redir = user_dashboard;
    }


    redirect(redir);

    psync(response);

    return true;
  }
  return false;
}


//check if user is logged in
function is_logged_in() {
  if(typeof(user_data)=='undefined') {return false;}
  var count = Object.keys(user_data).length;
  return count > 2 ? true : false;
}

//sync headers
function sync_headers() {
  if(typeof(hdrs['Authorization'])!='undefined') {
    authcode=hdrs['Authorization'];
  } else {
    authcode='';
  }

  app_bridge("authorize",authcode);
}


//logout action
function logout() {
  try {
    sync_xhr.abort();
  } catch (e) {
    void(0);
  }

  store.clearAll();

  user_data = {};
  hdrs = {};

  sync_headers();

  //return to top page
  location.href = location.href.split('#')[0];
}


function redirect(url) {
  if(!url) {return false;}

  if (url.indexOf('#') != -1) {
    url = url.split('#')[1];
  }

  location.href = '#' + url;
}

function unlockscreen(secs) {
  if (typeof(secs) == 'undefined') {
    secs = 5;
  }
  setTimeout(function() {
    $.unblockUI();
  }, secs * 1000);

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


//populate form with json data
/*
#form1,
{
	"surname":"Doe",
	"othernames":"John Clement",
	"email":"youremail@gmail.com",
	"tel":"+234 your number",
	"password":"1234567890"
}
*/
function populate(form, data, enable) {
  if (enable === undefined || enable == false) {
    return;
  }

  first=null;

  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if(first==null) {first=key;}
      value = data[key];
        $(form).find('#' + key).val(value).focus();
    }
  }

  $(form).find('#' + first).focus();

}

//catch errors
window.onerror = function(e) {
  console.log(e);
}



function finalize() {
//finalizing stuffs

//lazyload images
$("img.lazy").lazyload();


}

//initialize stuffs
function initialize() {

    if($('body').attr('menubar')=='true') {
      $('body').prepend(menubar);
    }

    //reset background to white
    $('html').css("background-color", "#fff");

    js=$('body').attr('js');
    if(js) {
      loadscript(js);
    }

    css=$('body').attr('css');
    if(css) {
      //loadcss(css);
    }

    //login-redir
    loginredir=$('body').attr('login-redir');
    if(loginredir) {
      login_redirect(loginredir);
    }

    setTimeout('postload()',1000);
}

function postload() {
  $('body-wrapper').css("visibility",'visible');

  if($('body').attr('sidenav')=='true') {
      $('body').append(sidenav);
      $('.sidenav').sidenav({
        'edge':'left',
        'onOpenStart':function() {
          //alert('open start');
        },
        'onCloseEnd':function() {
          //alert('closeend');
        }

    });
  }

  if($('body').attr('footermenu')=='true') {
    $(footermnu).appendTo('body');

    if(fa=$('body').attr('footeractive')) {
      $('#'+fa).addClass('active');
    }
  }


  help=$('body').attr('help');
  if(help=='true') {
    $('body').append(assist);

    $('.fixed-action-btn').floatingActionButton(
      {
        hoverEnabled:false
      }
    );

    //alert('help');
    //$("#helpbtn").show('block');
  }

  finalize();
}


function loadscript(url) {
  url="assets/scripts/"+url;
  return loadjs(url);
}

function loadcss(url) {
  url="assets/scripts/"+url;

}

function loadjs(url) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url+"?no_cache=" + new Date().getTime();

  script.onload = function ()
  {
    console.log("Loaded file "+url);
    finalize(); //in case of any routines like lazyloader
  };
  script.onerror = function ()
  {
    walert('Unable to load script '+url);
  };


  m_head = document.getElementsByTagName("head")[0];

  m_head.appendChild(script);
  return false;


  $.ajax({
  url: url,
  cache: false,
  dataType: "script",
  success: function() {
    console.log("Loaded "+url);
  }
  })
  .fail(function( jqxhr, settings, exception ) {
    walert('Unable to fetch requested script '+url);
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
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
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
function getUrlParam(name,value)
{
  var reParam = new RegExp('(?:[\?&]|&amp;)' + name + '=([^&]+)', 'i') ;
  var match = window.location.search.match(reParam) ;

  return (match && match.length > 1) ? match[1] : value ;
}


function get(name) {return getUrlParam(name,'');}

/**
* This will convert a function from string to object
* <code>
* var func = 'function (a, b) { return a + b; }'.parseFunction();
* walert(func(3,4));
* </code>
*/
if (typeof String.prototype.parseFunction != 'function') {
    String.prototype.parseFunction = function () {
        var funcReg = /function *\(([^()]*)\)[ \n\t]*{(.*)}/gmi;
        var match = funcReg.exec(this.replace(/\n/g, ' '));

        if(match) {
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


function number_format (number, decimals, dec_point, thousands_sep) {
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
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
  if(response.status!==undefined && response.status==0) {
    return true;
  }
  return false;
}

function fetch_data_bg(schema,data,cb) {
  $.ajax({
          url: api_base_url+schema,
          type: "POST",
          data: data,
          cache: false,
          dataType: "json",
          crossDomain: true,
          success: function (response) {
            cb(response,schema,data);
          }
  }).fail(function() {
      console.log("Network error occurred.");
    })
    .always(function() {
    });
}


function fetch_data(schema,data,cb) {

  //console.log(data);
  lockscreen();

  $.ajax({
          url: api_base_url+schema,
          type: "POST",
          data: data,
          cache: false,
          dataType: "json",
          crossDomain: true,
          success: function (response) {
            cb(response,schema,data);
          }
  }).fail(function() {
      walert("Network error occurred.");
    })
    .always(function() {
      //unlock screen
      $.unblockUI();
    });

}


//perform authorize action
function authorize(response) {
  if(is_accepted(response)) {
    store.set('user_data',response);

    redir=store.get('redirect');

    if(redir!==undefined) {
      store.remove('redirect');
    } else {
      redir='account.html';
    }

    redirect(redir);

    return true;
  }
  return false;
}


function redirect(url)
{
  lockscreen(true);
  location.href=url;
}

function unlockscreen(secs) {
  if(typeof(secs)=='undefined') {
    secs=5;
  }
  setTimeout(function() {
    $.unblockUI();
  },secs*1000);

}

function lockscreen(permanent)
{
  opt={
      onOverlayClick:$.unblockUI,
       message: null,
       css: {
          border: 'none',
          padding: '15px',
          backgroundColor: '#000',
          '-webkit-border-radius': '10px',
          '-moz-border-radius': '10px',
          opacity: 0.1,
          color: '#fff'
      } };


  if(permanent) {
    delete opt.onOverlayClick;
  }


  $.blockUI(opt);
}

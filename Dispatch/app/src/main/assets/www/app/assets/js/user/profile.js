$('.collapsible').collapsible();

var applet = new function() {
  this.initialized = false;

  this.initialize = function() {
    this.render();
  };

  this.getPhoto = function() {
    app_bridge("getPhoto", "Select your avatar:");
  };

  this.acceptPhoto = function(photo) {
    //walert("Received Photo ");

    $('textarea#image').val(photo);

    im64 = 'data:image/png;base64, ' + photo;

    $('#avatar,#user_avatar_big,.user_avatar').attr('src', im64);
  };

  this.acceptLocation = function(pos) {
    //$('#u_lat').html(pos.lat);
    //$('#u_lng').html(pos.lng);
    //$('#u_city').html(pos.city);
    //$('#u_state').html(pos.state);
    //$('#u_country').html(pos.country);
  };

  this.render_location_info = function() {
    $('#u_lat').html(user_data.lat);
    $('#u_lng').html(user_data.lng);
    $('#u_city').html(user_data.city);
    $('#u_state').html(user_data.state);
    $('#u_country').html(user_data.country);
  }

  //syn info
  this.userinfo = function() {
    this.render_location_info();
  };


  this.render = function() {
    if (this.initialized) {
      return;
    }

    this.render_location_info();

    $('.form #first').val(user_data.first).focus();
    $('.form #last').val(user_data.last).focus();
    $('#emailady').html(user_data.email);
    $('#email').val(user_data.email).focus();
    $('.form #phone').val(user_data.phone).focus();


    $('#user_avatar_big').attr('src', user_data.avatar);

    $('#send1').focus();


    this.initialized = true;
  }

};



$('#profile').on('submit', function() {

  fdata = $(this).serializeJson();

  fetch_data(
    'profile/update/info', fdata,
    function(response) {
      psync(response);
      walert("Your profile was updated successfully.");
    });

  return false;
});




$('#changepass').on('submit', function() {

  if ($('#password2').val() != $('#password3').val()) {
    walert("Your new passwords must be the same");
    return false;
  }

  fdata = $(this).serializeJson();

  fetch_data(
    'profile/update/pass', fdata,
    function(response) {
      $('.passfld').val('');

      psync(response);
      walert("Your password was updated successfully.");
    });

  return false;
});

//profile image form
$('#pimage').on('submit', function() {

  im = $(this).find('#image').val();
  if (im.length == 0) {
    return;
  }


  fdata = $(this).serializeJson();

  fetch_data(
    'profile/update/avatar', fdata,
    function(response) {
      psync(response);
      walert("Your avatar uploaded successfully.");
    });

  return false;
});


//profile image form
$('form#mail').on('submit', function() {

  em = $(this).find('#email').val();
  if (em == user_data.email) {
    return;
  }

  fdata_set('rec_email',em);

  fdata = $(this).serializeJson();

  fetch_data(
    'profile/update/email', fdata,
    function(response) {
      redirect('user/verify_email');
    });

  return false;
});

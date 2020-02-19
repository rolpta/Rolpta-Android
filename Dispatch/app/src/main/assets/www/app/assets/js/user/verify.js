$(function() {

  populate('#form', {
    "code": "720936"
  },0);


  //setup email
  $('#email').val(user_data.email);

  $('#form').on('submit', function() {

    fdata = $(this).serializeJson();

    fetch_data(
      'profile/verify', fdata,
      function(response) {
          authorize(response);
          location.reload();
      });

    return false;
  });



});

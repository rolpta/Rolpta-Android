$(function() {

  $('#email,#email2').val(fdata_get('rec_email'));

  $('#form').on('submit', function() {

    fdata = $(this).serializeJson();

    fetch_data(
      'profile/verify/email', fdata,
      function(response) {
        psync(response);
        walert("Your email has been changed to "+response.email);

        $('#code').val('');
        $('.send_btn').attr('disabled','disabled');
        setTimeout(function() {
          redirect(user_dashboard);
        },3000);
      });

    return false;
  });



});

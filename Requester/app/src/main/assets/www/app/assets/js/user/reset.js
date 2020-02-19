$(function() {


  $('#email,#email2').val(fdata_get('rec_email')).focus();
  $('#code').focus();

  $('#form').on('submit', function() {


    if ($('#password').val() != $('#password2').val()) {
      walert("Your new passwords must be the same");
      return false;
    }

    fdata = $(this).serializeJson();

    fetch_data(
      'user/reset', fdata,
      function(response) {
        $('.passfld').val('');

        walert("Your password has been reset successfully");
        setTimeout(function() {

        authorize(response);

        },5000);
      });

    return false;
  });



});

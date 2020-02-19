$(function() {

  $('#form').on('submit', function() {

    fdata_set('rec_email',$('#email').val());

    fdata = $(this).serializeJson();

    fetch_data(
      'user/password', fdata,
      function(response) {
        redirect("user/reset");
      });

    return false;
  });



});

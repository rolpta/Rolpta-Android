$(function() {

  populate('#form', {
    "bvn": user_data.bvn,
    "address": user_data.address
  }, 1);



  $('#form').on('submit', function() {

    fdata = $(this).serializeJson();

    fetch_data(
      'user/profile?id='+user_data.id, fdata,
      function(response) {
          authorize(response);
          location.reload();
      });

    return false;
  });



});

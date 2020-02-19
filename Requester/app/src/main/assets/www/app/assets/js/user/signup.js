$(function() {

  populate('#form', {
    "first": "Tito",
    "last": "Oladeji",
    "email": "diltony@yahoo.com",
    "phone": "+2347030290744",
    "password": "lagos"
  }, 0);


  $('#form').on('submit', function() {

    fdata = $(this).serializeJson();

    store_cred(fdata, ['email', 'password']);

    fetch_data(
      'user/register', fdata,
      function(response) {
        !authorize(response);
      }
    );

    return false;
  });



});

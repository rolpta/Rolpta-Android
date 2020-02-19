var applet = new function() {
    this.processed = false;

    this.initialize = function() {

      //look for any previous order
      /*
      if(user_data.order_id!=0) {

        fetch_data_bg(
          'order/pending',[],
          function(response) {

            $('input#items').val(response.items);
            $('textarea#description').val(response.description);

            switch (response.package) {
              case 'envelope':
                $('input#envelope').prop('checked', true);
                break;
              case 'bag':
                $('input#bag').prop('checked', true);
                break;
              case 'sack':
                $('input#sack').prop('checked', true);
                break;
            }


            switch (response.paywith) {
              case 'card':
                $('input#card').prop('checked', true);
                break;
              case 'cash':
                $('input#cash').prop('checked', true);
                break;
            }

          });

      }
      */
    };

}


$('#form').on('submit', function() {
  if ($(this).find('#items').val() < 1) {
    walert("Enter number of items");
    $(this).find('#items').focus();
    return false;
  }

  fdata = $(this).serializeJson();

  send_data(
    'order/init', fdata,
    function(response) {
      redirect("pickup/set");
    });

  return false;
});

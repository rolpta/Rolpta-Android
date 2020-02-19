var applet = new function() {

  this.initialize = function() {

    fetch_data(
      'order/details', {},
      function(order) {
        $('#price').html('₦ ' + number_format(order.price, 2));
        $('#address').html(order.d_address == '' ? order.d_gaddress : order.d_address);
        $('#name').html(order.r_name);
        $('#hash').html(order.hash);

        $('#r_avatar').attr('src',order.r_avatar);

        parcel = order.items + ' ' + order.package;
        if (parseInt(order.items) > 0) {
          parcel += 's';
        }

        $('#parcel').html(parcel);

      });


  };

  this.dispatchers_list = function() {

    send_data(
      'order/show_dispatchers', {},
      function(response) {
        psync(response);
        redirect('dispatchers/list');
      });
  };

  this.back = function() {
    send_data(
      'actions/back', {},
      function(response) {
        psync(response);
        check_page_state();
      }
    );
  };

};

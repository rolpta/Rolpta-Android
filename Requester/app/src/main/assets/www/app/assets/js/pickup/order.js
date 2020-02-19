var applet = new function() {

  this.initialize = function() {

    fetch_data(
      'order/details', {},
      function(response) {
        applet.render(response);
      });

  };


  this.next = function() {
    redirect("dispatchers/list");
  }

  this.render = function(order) {
    //populate

    $('#r_name').html(order.r_name);
    $('#r_phone').html(order.r_phone);
      $('#dispatch').html(order.r_dispatch=='sod' ? "Start of Day" : "End of Day");

      $('#hash').html(order.hash);
      $('#package').html(order.package);
      $('#items').html(order.items);
      $('#description').html(order.description);
      $('#paywith').html(order.paywith);
      $('#p_gaddress').html(order.p_gaddress);
      $('#p_address').html(order.p_address);
      $('#d_gaddress').html(order.d_gaddress);
      $('#d_address').html(order.d_address);

      $('#category').html(order.category);
      $('#distance').html(order.miles + " miles");
      $('#price').html('₦ ' + number_format(order.price, 2));

      if (order.p_address == '') {
        $('#p_address_wrapper').hide();
      }
      if (order.d_address == '') {
        $('#d_address_wrapper').hide();
      }


  };


  this.back = function() {
    redirect("receiver");
  };

};

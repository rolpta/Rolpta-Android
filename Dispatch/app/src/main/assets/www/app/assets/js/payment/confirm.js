var applet = new function() {

        //sync service
        this.sync = function() {

          fetch_data_bg(
            'dispatcher/job', {},
            function(response) {
              applet.update(response);
            }
          );

        };



    this.update = function(data) {

      if (_.isEqual(data, this.last_data)) {
        return;
      }

        this.count++;


        this.last_data = data;

        $('#name').html(data.s_name);
        $('#package').html(data.package);
        $('#items').html(data.items);
        $('#p_address').html(data.p_address);
        $('#d_address').html(data.d_address);

        $('#base_price').html('₦ ' + number_format(data.base_price, 2));
        $('#pkg_price').html('₦ ' + number_format(data.pkg_price, 2));
        $('#total').html('₦ ' + number_format(data.price, 2));

        $('#userimg').attr('src',data.s_avatar);
        $('#r_avatar').attr('src',data.r_avatar);

    };

  this.next = function() {
    send_data(
      'payment/confirm', {},
      function(response) {
        psync(response);
        redirect('rate');
      }
    );

  };

};

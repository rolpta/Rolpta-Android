var applet = new function() {
  this.count = 0;


        //sync service
        this.sync = function() {

          fetch_data_bg(
            'dispatcher/job', {},
            function(response) {
              applet.update(response);
            }
          );

        };

  this.next=function() {
    walert("Confirmation will be done automatically once payment is made.");
  };

  this.update = function(data) {

    if (_.isEqual(data, this.last_data)) {
      return;
    }


      this.count++;


      this.last_data = data;

      //render data
      this.response=data;

      //sender info
      $('.s_name').html(data.s_name);
      $('.s_phone').attr('href', 'tel:' + data.s_phone);
      $('.s_avatar').attr('src',data.s_avatar);
      $('.r_avatar').attr('src',data.r_avatar);
      $('.description').html(data.description);
      $('.items').html(data.package +' / ' + data.items);

      $('.price').html('₦ '+number_format(data.price,2));

      //receiver info
      $('.r_name').html(data.r_name);
      $('.r_phone').attr('href', 'tel:' + data.r_phone);

      this.display_info('p_gaddress', "Map Address");
      this.display_info('p_address', "Full Address");


      //pickup geocoords
      //this.map.setCoords(data.d_lat,data.d_lng);

  };


  this.display_info = function(tok, lbl) {
    if (typeof(this.response[tok]) == 'undefined' || this.response[tok] == '' || this.response[tok].length < 4) {
      $('.' + tok).hide();
    } else {
      val = this.response[tok];
      $('.' + tok).html(lbl + ": " + val).show();
    }
  };

};

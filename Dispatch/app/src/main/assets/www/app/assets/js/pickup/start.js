var applet = new function() {
  this.count = 0;
  this.init_route=false;
  this.last_data=[];

  this.prepare = function() {
    this.map.show();
  };



  this.next=function() {
  //go to order/pickup

  send_data(
    'pickup/start',{'photo':this.photo},
    function(response) {
      psync(response);
      redirect('pickup/deliver');
    }
  );

  };


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

      this.response=data;
      this.last_data = data;

      //sender info
      $('.s_name').html(data.s_name);
      $('.s_phone').attr('href', 'tel:' + data.s_phone);
      $('.description').html(data.description);
      $('.items').html(data.package +' / ' + data.items);

      $('.price').html('₦ '+number_format(data.price,2));

      //order info
      this.display_info('hash', "Order ID");

      //receiver info
      $('.r_name').html(data.r_name);
      $('.r_phone').attr('href', 'tel:' + data.r_phone);

      this.display_info('p_gaddress', "Map Address");
      this.display_info('p_address', "Full Address");


      if(this.count==1) {
        //initiate route map
        route = [{
          lat: data.p_lat2,
          lng: data.p_lng2,
        },
        {
          lat: data.p_lat,
          lng:data.p_lng
        }
      ];

        this.map.showDirections(true);

        this.map.setRoute(route);
      }

      //specify present location
      applet.map.driveTo(data.lat,data.lng);


  };


  this.display_info = function(tok, lbl) {
    if (typeof(this.response[tok]) == 'undefined' || this.response[tok] == '' || this.response[tok].length < 4) {
      $('.' + tok).hide();
    } else {
      val = this.response[tok];
      $('.' + tok).html(lbl + ": " + val).show();
    }
  };


  this.distance_left = function(meters) {
    klm=meters / 1000;

    if(klm<=2) {
      applet.activate_pickup();
    }

  }

  //demo stuff
  this.demo = function() {
    var MyDialog = new MatDialog();

    MyDialog.confirm({
        Text: "Pickup will activate when you are 2KM away. <br/>Activate pick-up manually? (demo-only)",
        Buttons: {
          Ok: {
            Label: 'Yes', // you can also add icon
            Class: 'green btnspacer'
          },
          Cancel: {
            Label: 'No',
            Class: 'red'
          }
        }
      },
      function(result) {
        if (result) {
          $('#click_here').remove();
          applet.activate_manual();
        }
      }
    );

  };

  this.activate_manual = function() {
    applet.activate_pickup();
  };

  this.activate_pickup=function() {
    $('#scan_package').removeClass('hide');
  };

  this.scan = function() {
    app_bridge("getCamera","Scan the package:");
  };

  this.acceptPhoto=function(photo) {
    //walert("Received Photo ");
    this.photo=photo;

    im64='data:image/png;base64, '+photo;

    $('#order_picture').attr('src',im64).show().removeClass('hide');
    $('#pickup_complete').removeClass('hide');
  };

};

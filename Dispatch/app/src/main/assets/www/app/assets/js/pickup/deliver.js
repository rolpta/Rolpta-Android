var applet = new function() {
  this.count = 0;
  this.last_data=[];

  this.prepare = function() {
    opt={
      fixedpointer:true,
      draggable: false
    };

    this.map.show();
  };

  this.next=function() {
  //go to order/pickup


    var MyDialog = new MatDialog();

    MyDialog.create({
        Content: {
          Label: '<ul><li>* Make sure you are delivering to right person</li><li>* Never leave package unattended to or on the porch</li></ul>',
          Class: 'mdl',
        },
        Buttons: [{
            Label: "I Accept",
            value: 'accept',
            Class: '#388e3c green darken-2',
          }
        ]
      },
      function(result) {

        send_data(
          'pickup/deliver',{},
          function(response) {
            psync(response);
            redirect('payment/ask');
          }
        );

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


      this.last_data = data;

      //render data
      this.response=data;

      //order info
      this.display_info('hash', "Order ID");

      //sender info
      $('.s_name').html(data.s_name);
      $('.s_phone').attr('href', 'tel:' + data.s_phone);
      $('.description').html(data.description);
      $('.items').html(data.package +' / ' + data.items);

      $('.price').html('₦ '+number_format(data.price,2));

      //receiver info
      $('.r_name').html(data.r_name);
      $('.r_phone').attr('href', 'tel:' + data.r_phone);
      $('.r_avatar').attr('src',data.r_avatar2);

      this.display_info('d_gaddress', "Map Address");
      this.display_info('d_address', "Full Address");


      if(this.count==1) {
        //initiate route map
        route = [{
          lat: data.d_lat2,
          lng: data.d_lng2,
        },
        {
          lat: data.d_lat,
          lng:data.d_lng
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

      if(klm<=1) {
        applet.activate_dropoff();
      }

    }

    //demo stuff
    this.demo = function() {
      var MyDialog = new MatDialog();

      MyDialog.confirm({
          Text: "Drop-off will activate when you are 1KM away. <br/>Activate drop-off manually? (demo-only)",
          Buttons: {
            Ok: {
              Value:'ok',
              Label: 'Yes', // you can also add icon
              Class: 'green btnspacer'
            },
            Cancel: {
              Value:'cancel',
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

    this.activate_dropoff = function() {
      $('#drop_off').removeClass('hide');
    };

    this.activate_manual = function() {
      applet.activate_dropoff();
    };

};

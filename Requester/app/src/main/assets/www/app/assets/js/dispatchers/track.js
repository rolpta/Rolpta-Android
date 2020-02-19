var MyDialog = new MatDialog();


var applet = new function() {
  this.paid = false;
  this.prompt = false;
  this.count = 0;
  this.ostate = 0;
  this.tstate = 0;


  this.prepare = function() {};

  this.initialize = function() {

    loadjs_once("dist/assets/js/lib/paystack.js");

    this.map.show();
    this.map.pointer();
  };

  this.paynow = function() {

    message="You need to make payment of " + this.price2 + " now.";
    output = '<div class="row notify_info">';
    output += '<div class="col sicon">' + '<img src="' + this.last_data.avatar + '" class="sender_image circular">' + '</div>';
    output += '<div class="col stext">' + '<span class="sender_name">' + this.last_data.name + '</span>' + '<span class="sender_message">' + message + '</span>' + '</div>';
    output += '</div>';


      app_bridge("startNotification");


      MyDialog.create({
          Content: {
            Label: output,
            Class: 'mdl',
          },
          Buttons: [{
              Label: "Pay Now",
              Value: 'accept',
              Class: '#388e3c green darken-2',
            },
            {
              Label: 'Later',
              Value: 'cancel',
              Class: '#ad1457 pink darken-3',
            }
          ]
        },
        function(result) {
          //callback
          app_bridge("stopNotification");

          if(result=='accept') {
            applet.payWithPaystack();
          }
        }
      );

      $('.modal-content').css('padding', 0);


    /*
    MyDialog.confirm({
        Text: "You need to make payment of " + this.price2 + " now.",
        Buttons: {
          Ok: {
            Label: 'Continue', // you can also add icon
            Class: 'green btnspacer'
          },
          Cancel: {
            Label: 'Not now',
            Class: 'red'
          }
        }
      },
      function(result) {
        //callBack
        if (result) {
          applet.payWithPaystack();
        }
      }
    );
    */

    /*
    MyDialog.alert({
        Text: "You need to make payment of " + this.price2  +  " now.",
        Button: {
          Label: 'Continue',
          Class: 'blue'
        },
        ExecuteBefore: function() {}
      },
      function() {
        applet.payWithPaystack();
      }
    );
    */


  };


  this.payWithPaystack = function() {
    var handler = PaystackPop.setup({
      key: paystack_key,
      email: user_data.email,
      amount: applet.price * 100,
      currency: "NGN",
      ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      metadata: {
        custom_fields: [{
          display_name: "Mobile Number",
          variable_name: "mobile_number",
          value: user_data.phone
        }]
      },
      callback: function(response) {
        send_data(
          'payment/make', {
            'reference': response.reference
          },
          function(response) {
            psync(response);
            $('#paybtn').remove();
          });

      },
      onClose: function() {}
    });
    handler.openIframe();
  };

  this.cancel = function() {


    MyDialog.confirm({
        Text: "Are you sure you wish to cancel this order?",
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
        //callBack
        if (result) {
          applet.back();
        }
      }
    );
  };

  this.back = function() {
    send_data(
      'actions/back', {},
      function(response) {
        psync(response);
        redirect("rate");
      }
    );
  };

  this.userinfo = function(user_data) {
    /*
      if(typeof(user_data.distance)!='undefined') {
        message=user_data.distance.message;
        this.map.showMessage(message);
      } else {
        this.map.hideMessage();
      }
      */
  };



  //sync service
  this.sync = function() {

    send_data_bg(
      'dispatcher/track', {},
      function(response) {
        if (typeof(applet) != 'undefined' && typeof(applet.render) == 'function') {
          applet.render(response);
        }
      }
    );
  };


  this.render = function(data) {
    if(_.isEqual(data,this.last_data)) {
      return;
    }

    this.last_data=data;


    this.count++;

    //show cancel
    if(data.accepted_at>3) {
      $('.cancelorderbtn').hide();
    } else {
      $('.cancelorderbtn').show().removeClass('hide');
    }


    $('#message').html(data.message);

    this.price = parseInt(data.price);
    this.price2 = '₦ ' + number_format(data.price, 2);

    $('#price').html('₦' + number_format(data.price, 2) + ' (' + 'Order ID: '+data.hash + ')');

    $('#dinfo #dname').html(data.name);
    $('#dinfo #dvehicle').html(data.vehicle);
    $('#dinfo #davatar').attr('src',data.avatar);
    $('#dinfo #dphone').attr('href', 'tel:' + data.phone);

    $('#pdtimg').attr('src',data.scan2);

    //get route

    //track dispatcher
    applet.map.setCoords(data.lat, data.lng);

    if(this.count==1) {
      applet.map.showMessage('<img src="'+data.avatar+'" class="circular" align="absmiddle">'+data.name+'');
    }

    //console.log(route);

    /*
    if (data.tstate == 1) {

      if (this.tstate != 1) {
        route = [{
            lat: data.p_lat2,
            lng: data.p_lng2,
          },
          {
            lat: data.p_lat,
            lng: data.p_lng
          }
        ];

        this.map.showDirections(false);

        this.map.setRoute(route);
      }

      //map current location
      applet.map.driveTo(data.lat, data.lng);
    }



    if (data.tstate >= 2) {

      if (this.tstate != 2) {
        route = [{
            lat: data.d_lat2,
            lng: data.d_lng2,
          },
          {
            lat: data.d_lat,
            lng: data.d_lng
          }
        ];

        this.map.showDirections(false);

        this.map.setRoute(route);
      }

      //map current location
      applet.map.driveTo(data.lat, data.lng);
    }
    */

    if (this.prompt == false && data.tstate == '3') {
      this.prompt = true;
      this.paynow();
    }

    if (data.tstate == 3) {
      $('#paybtn').show();
    } else {
      $('#paybtn').hide();
    }

    //store current states
    this.ostate = data.ostate;
    this.tstate = data.tstate;

  };

};

var applet = new function() {
  this.count = 0;

  this.last_user_data = {};

  this.back = function() {
    redirect("pickup/order");
  };

  //select dispatch
  this.select = function(elm) {
    disp_id = $(elm).attr('dispatcher');


    send_data(
      'dispatcher/ping', {
        disp_id: disp_id
      },
      function(response) {
        psync(response);
        redirect("dispatchers/select");
      });



  };

  this.prepare = function() {
    this.default_message = $('#display_area').html();
  };


  this.initialize = function() {};

  //sync service
  this.sync = function() {

    fetch_data_bg(
      'dispatcher/list', {},
      function(response) {
        if (typeof(applet) != 'undefined' && typeof(applet.render) == 'function') {
          applet.render(response);
        }
      },
      function() {}
    );

  };

  this.render = function(data) {

    if (_.isEqual(data, this.last_data)) {
      return;
    }
    this.last_data=data;

    rows = 0;


    this.count++;

    if (this.count == 1) {
      unlockscreen();
    }


    $('#display_area').empty();


    for (var key in data) {
      rows++;

      item = data[key];

      posit = item.position + ' ------ ' + number_format(item.distance) + " miles";
      t = $($(".template").html()).appendTo("#display_area");
      t.find('.name').html(item.name);
      t.find('.vehicle').html(item.vehicle);
      t.find('.rate').html(item.rate);
      t.find('.position').html(posit);
      t.find('.avatar').attr('src',item.avatar);
      t.attr('dispatcher', item.user_id);
    }

    if (rows == 0) {
      $('#display_area').html(this.default_message);
    }

  };

};

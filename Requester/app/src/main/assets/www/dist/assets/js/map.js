var applet = new function() {
  this.count = 0;

  this.prepare = function() {
    this.map.show();
    this.map.select();

    this.update();
  };

  this.user_info = function() {
    this.update();
  };

  this.update = function() {
    data = user_data;

    if (_.isEqual(data, this.last_data)) {
      return;
    }

    this.count++;

    this.last_data = data;

    //sender info
    $('.s_name').html(data.name);
    $('.s_status').html(data.locked == '1' ? "position is locked" : "position is unlocked");

    //https://web.rolpta.test/dispatcher/#dist/user/map

    if (this.count == 1) {

      $('input#locked').prop('checked', data.locked == "1" ? true : false);

      //initiate route map
      this.map.setCoords(data.lat, data.lng);
    }
  };

  this.save = function() {

    fdata = {
      'lat': this.map.get('lat'),
      'lng': this.map.get('lng'),
      'locked': $('input#locked').prop('checked')==true ? 1 : 0
    };

    send_data(
      'profile/position', fdata,
      function(response) {
      });

  };



};

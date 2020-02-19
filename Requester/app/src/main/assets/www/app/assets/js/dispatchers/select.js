var applet = new function() {
  this.count = 0;

  this.back = function() {
    send_data(
      'actions/back', {},
      function(response) {
        psync(response);
        redirect("dispatchers/list");
      }
    );
  };

  this.initialize = function() {

    this.map.show();
    this.map.pointer();
  };

  this.sync = function() {
    fetch_data_bg(
      'dispatcher/select', {},
      function(data) {
      //render data
      $('#dinfo #dname').html(data.name);
      $('#dinfo #dvehicle').html(data.vehicle);
      $('#dinfo #dphone').attr('href', 'tel:' + data.phone);
      $('#avatar').attr('src',data.avatar);

      //set map coordsd
      applet.map.setCoords(data.lat, data.lng);

    });

  };


};

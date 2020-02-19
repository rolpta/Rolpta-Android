var applet = new function() {
  this.count = 0;

  this.prepare = function() {
    this.map.show();
    this.map.select();

    this.render();
  };

  //syn info
  this.userinfo = function() {
    this.render();
  };

  this.render = function() {
    //initiate route map
    this.map.setCoords(user_data.lat, user_data.lng);
  };

  this.acceptLocation = function(pos) {
    //initiate route map
    //this.map.setCoords(pos.lat, pos.lng);
  };

};


var applet = new function() {


  this.initialize=function() {

    $('.fullname').html(user_data.first+' '+user_data.last);

    this.map.show();

    applet.map.select();

    //app_bridge("trackgps");

    fetch_data(
      'order/details', {},
      function(response) {
        if(response.p_lat) {
          applet.map.setCoords(response.p_lat,response.p_lng);
        }
      });

  };

  this.acceptGPS = function(location) {
    //walert("new gps: "+location);
    //this.map.mylocation();
  };


  this.back = function() {
    redirect(user_dashboard);
  };

  this.next=function() {
    //in case of error
    if(this.map.get('place')=='') {location.reload();return;}

    fdata = {
      'p_lat': this.map.get('lat'),
      'p_lng': this.map.get('lng'),
      'p_gaddress': this.map.get('address'),
      'p_address': $('#address').val(),
      'p_city': this.map.get('city'),
      'p_state': this.map.get('state'),
      'p_country': this.map.get('country'),
      'p_place': this.map.get('place'),
    };


    send_data(
      'order/set_pickup', fdata,
      function(response) {
        redirect("pickup/destination");
      });
  }
};

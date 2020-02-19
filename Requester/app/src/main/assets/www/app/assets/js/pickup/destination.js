var applet = new function() {

  this.initialize=function() {

    $('.fullname').html(user_data.first+' '+user_data.last);


    this.map.show();
    this.map.select();


    //this.map.setCoords(lat,lng);

    fetch_data(
      'order/details', {},
      function(response) {
        if(response.d_lat) {
          applet.map.setCoords(response.d_lat,response.d_lng);
        }
      });

  };


  this.back = function() {
    redirect("pickup/set");
  };

  this.next=function() {
    //in case of error

    if(this.map.get('place')=='') {location.reload();return;}

    fdata = {
      'd_lat': this.map.get('lat'),
      'd_lng': this.map.get('lng'),
      'd_gaddress': this.map.get('address'),
      'd_address': $('#address').val(),
      'd_city': this.map.get('city'),
      'd_state': this.map.get('state'),
      'd_country': this.map.get('country'),
      'd_place': this.map.get('place'),
    };


    send_data(
      'order/set_destination', fdata,
      function(response) {
        redirect('receiver');
      });
  }
};

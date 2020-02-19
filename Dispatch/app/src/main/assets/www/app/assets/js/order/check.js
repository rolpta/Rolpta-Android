var applet = new function() {
   this.order_id=0;

  this.prepare = function() {
    response = fdata_get("order_info");
    this.order_id=response.order_id;

    this.render(response);
  };

  //accept request
  this.accept = function() {

    send_data(
      'dispatcher/accept',{order_id:this.order_id},
      function(response) {
        //console.log(response);
        $('#order_check').hide();
        applet.map.show();
        redirect('pickup/start');
      }
    );

  };


  //sync service
  this.sync = function() {

    send_data_bg(
      'dispatcher/peek',{order_id:this.order_id},
      function(response) {
        if(typeof(applet)!='undefined' && typeof(applet.render)=='function') {
          applet.render(response);
        }
      },
      function() {
        walert("This request has been cancelled by requester");
        setTimeout(function() {
          redirect("dashboard/queue");
        },3000);
      }

    );
  };

  this.render=function(response) {
      this.response = fdata_get("order_info");

        //render info
        $('#hash').html(response.hash);
        $('#name').html(response.name);
        $('#r_name').html(response.r_name+' ('+response.r_phone+')');
        $('#position').html(response.position);
        $('#package').html(response.package);
        $('#items').html(response.items);
        $('#avatar').attr('src',response.avatar);
        $('#r_avatar').attr('src',response.r_avatar);

        //this.display_info('p_gaddress', "Map Address");
        this.display_info('p_address', "Full Address");

        //this.display_info('d_gaddress', "Map Address");
        this.display_info('d_address', "Full Address");
  };

  this.display_info = function(tok, lbl) {
    if (typeof(this.response[tok]) == 'undefined' || this.response[tok] == '' || this.response[tok].length < 4) {
      $('#' + tok).hide();
    } else {
      val = this.response[tok];
      $('#' + tok).html(lbl + ": " + val).show();
    }
  }
};

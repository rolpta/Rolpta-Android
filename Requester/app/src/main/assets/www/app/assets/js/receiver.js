//populate
order = user_data.order;


$('#form').on('submit', function() {

  fdata = $(this).serializeJson();

  if(typeof(fdata.dispatch)=='undefined') {
    walert("Please select type of dispatch");
    return false;
  }


  send_data(
    'order/set_receiver', fdata,
    function(response) {
      redirect('pickup/order');
    });

  return false;
});



var applet = new function() {

  this.initialize = function() {

    fetch_data(
      'order/details', {},
      function(order) {
        $('#name').val(order.r_name).focus();
        $('#phone').val(order.r_phone).focus();
        //$('#dispatch').val(order.r_dispatch).focus();
        $('#name').focus();

        $('#r_avatar').attr('src',order.r_avatar2);
      });

  };

  this.getPhoto=function() {
    app_bridge("getPhoto","Select your avatar:");
  };

  this.acceptPhoto=function(photo) {
    $('textarea#image').val(photo);

    im64='data:image/png;base64, '+photo;

    $('#avatar,#r_avatar').attr('src',im64);
  };

  this.back = function() {
    redirect("pickup/destination");

  };
};

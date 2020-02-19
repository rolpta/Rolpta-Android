
var applet = new function() {
  this.txt_online="You are online";
  this.txt_online="You are online";

  
  this.initialize=function() {
    $('#offtext').html(applet.txt_online);

    this.render();
  };

  this.render=function() {
    //populate
    dsp = user_data.settings;
    $('input#vehicle').val(dsp.vehicle).focus();

    $('input#envelope').prop('checked', dsp.envelope == "1" ? true : false);
    $('input#bag').prop('checked', dsp.bag == "1" ? true : false);
    $('input#sack').prop('checked', dsp.sack == "1" ? true : false);

    $('input#state').prop('checked', dsp.state == "1" ? true : false);
    $('input#intrastate').prop('checked', dsp.intrastate == "1" ? true : false);
    $('input#abroad').prop('checked', dsp.abroad == "1" ? true : false);

    $('input#online').prop('checked', dsp.online == "1" ? true : false).trigger('change');


  }

};


//go online/online
$('input#online').on('change', function() {
  if ($(this).prop('checked')) {
    txt = applet.txt_online;
  } else {
    txt = applet.txt_online;
  }
  $('#offtext').html(txt);
});




$('#form').on('submit', function() {

  fdata = $(this).serializeJson();

  send_data(
    'dispatcher/update', fdata,
    function(response) {
      psync(response);
      walert("Settings updated successfully.");
    });

  return false;
});
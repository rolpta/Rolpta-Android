
var applet = new function() {

              //sync service
              this.sync = function() {

                fetch_data_bg(
                  'order/details', {},
                  function(response) {
                    applet.update(response);
                  }
                );

              };

    this.update=function(data) {
      //populate

      if (_.isEqual(data, this.last_data)) {
        return;
      }
      this.last_data=data;


      $('.dname').html(data.snd_name);

      $('#userimg').attr('src',data.avatar);

    }

};



$('#form').on('submit', function() {

  fdata = $(this).serializeJson();

  send_data(
    'actions/rate', fdata,
    function(response) {
      psync(response);
      redirect("rate/finish");
    });

  return false;
});

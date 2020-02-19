
var applet = new function() {
    this.reqlength=0; //init

    this.processed = false;

    this.initialize = function () {
      this.update();
    };

    this.userinfo = function (user_data) {
      this.update();
    };

    this.update = function () {
      reqlength = user_data.requesters_list.length;

        if (reqlength == 0) {
          $('#online_queue').html('There are no requests at this time, you can update your preferences while awaiting requests.');
          $('#viewrequests').addClass('hide');

          hide_notification();
        } else {
          reqs = reqlength == 1 ? "You have 1 request waiting" : "You have " + reqlength + " requests waiting";
          $('#online_queue').html(reqs);
          $('#viewrequests').removeClass('hide');


          if(this.reqlength!=reqlength) {
            do_notification(null,'Notification',reqs);
          }

          //in case notification is already shown, update it
          $('.modal-content .sender_message').html(reqs);

        }

        //store for future
        this.reqlength=reqlength;

        if (user_data.settings.online == "0") {
          $('#online_prompt').html('You are presently offline and cannot be seen by any requester.');
        } else if (reqlength > 0) {
          $('#online_prompt').html('You are online and already have waiting requests.');
        } else {
          $('#online_prompt').html('You are online and will soon start getting requests.');
        }


      };

}

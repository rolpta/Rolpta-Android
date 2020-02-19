
var applet = new function() {
    this.count = 0;

    this.last_user_data={};

    //select dispatch
    this.select=function(elm) {
    order_id=$(elm).attr('order');


    send_data(
      'dispatcher/peek',{order_id:order_id},
      function(response) {
        fdata_set("order_info",response);
        redirect('order/check');
      });

    };

    this.prepare = function () {
      this.default_message=$('#display_area').html();
    };


    this.initialize = function () {
      this.update();
    };

    this.userinfo = function (user_data) {
      this.update();
    };


    this.update = function() {


      rows=0;

      if (typeof(user_data.requesters_list) != 'undefined') {


        this.count++;

        if(this.count==1) {unlockscreen();}

        date=user_data.date;

        data=user_data.requesters_list;

        if(_.isEqual(data,this.last_data)) {
          return;
        }

        this.last_data=data;

        $('#cdate').html(date);

        $('#display_area').empty();

        for (var key in data) {
          rows++;

          item=data[key];

          posit=item.position+' ------ '+number_format(item.distance)+' miles';
          t=$($(".template").html()).appendTo("#display_area");
          t.find('.name').html(item.name);
          t.find('.avatar').attr('src',item.avatar);
          t.find('.position').html(posit);
          t.attr('order',item.order_id);
        }


        this.last_user_data=user_data;
      }


      if(rows==0) {
        $('#display_area').html(this.default_message);
      }

    };

};


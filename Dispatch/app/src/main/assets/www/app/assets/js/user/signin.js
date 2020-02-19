$(function() {

  $('#form').on('submit', function() {

    fdata = $(this).serializeJson();

    fetch_data(
      'user/login', fdata,
      function(response) {
        authorize(response);
        psync(response);
      });

    return false;
  });

});




var applet = new function() {
    this.initialize=function() {
      populate('#form', {
        "email": "wale@africoders.com",
        "password": "lagos"
      },0);
    };

    this.fbinit=function() {
      app_bridge("facebookLogin");
    };


    this.fbresponse = function(type,data) {
    	switch(type) {
    		case 'error':
    		walert("Facebook login error");
    		break;
    		case 'cancel':
    		//walert("Facebook login cancelled");
    		break;
    		case 'success':
    		fbdata=JSON.parse(data);

        fbid=fbdata.id;
        name=fbdata.name;
        firstname=fbdata.first_name;
        lastname=fbdata.last_name;
        email=fbdata.email;

        fdata={
          'action':'fblogin',
          'extend':1,
          'fbid':fbid,
          'firstname':firstname,
          'lastname':lastname,
          'email':email,
        };

        console.log(fdata);

    		break;
    	}

    };

};

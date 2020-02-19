var user_data=[];

var username="Customer";

udata=store.get('user_data');

if(udata!==undefined) {
  user_data=udata;
} else {
user_data=[];
}

if(typeof(user_data.name)!='undefined' && user_data.name.length>1) {
  username=user_data.name;
}

//check if user is logged in
function is_logged_in() {
if(countProperties(user_data)==0) {return false;}

//refresh data
fetch_data_bg(
  'login2',
  {
    'id':user_data['id'],
  },function (response) {
    if(is_accepted(response)) {
      store.set('user_data',response);
      console.log("data synced successfully");
    }
});


return true;
}

function login_redirect(path) {
//check auth
if(!is_logged_in()) {
  store.set('redirect',path);
  redirect('signin.html');
}

}

function logout()
{
  lockscreen();

  store.remove('user_data');

  redirect("account.html");
  return false;
}

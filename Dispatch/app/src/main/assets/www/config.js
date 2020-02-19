
//app key
var app_key="dispatcher";

//use map
var use_map = true;

//paystack key
var paystack_key='pk_test_322bcff1c8dc2ce67e0af40f507dfd450ba4a61a';

//google map key
var map_key='AIzaSyCd0QhvdM_Fe5WMVPtPO3jEx09E5VYvgyI';

//base api url
if(location.href.indexOf('dev.')==-1) {
  api_base_url = 'https://api.rolpta.afrk.co/';
} else {
  api_base_url = 'https://api.rolpta.test/';
}


//user dashboard
var user_dashboard='dashboard';

//home page
var user_home = 'home';


//map of the orders pages by state
var order_map={
	"1": "pickup/start",
	"2": "pickup/deliver",
	"3": "payment/ask",
	"4": "payment/confirm",
	"5":"rate",
	"6":"rate/cancel"
};

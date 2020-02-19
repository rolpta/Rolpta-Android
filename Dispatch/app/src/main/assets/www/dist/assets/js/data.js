$('#data').html(JSON.stringify(user_data));


sess='';
store.each(function(value, key) {
	sess+= key + ' == ' + JSON.stringify(value)+"\n";
})

$('#session').html(sess);


function clearsess() {
  store.clearAll();
  location.reload();
}

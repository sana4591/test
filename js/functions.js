function get_item_obj(id){
	for (var i = 0; i < items_list.length; i++) {
		if(items_list[i].id == id )
	   return items_list[i];
    }
    return;
}


function get_category_desc(category_name){
	console.log("category_namemmmmmmmmmmmmmmmmmmmmm:"+category_name);
	for (var i = 0; i < categories_json.length; i++) {
		if(categories_json[i].name == category_name )
	   return categories_json[i].item_description;   
    }
    return;
}

function get_category_desc_plural(category_name){
	for (var i = 0; i < categories_json.length; i++) {
		if(categories_json[i].name == category_name )
	   return categories_json[i].item_description_plural;
    }
    return;
}

function t(input_str)
{
	//console.log('language:'+language);
	if (language === 'ar')
		return ar_text_translations[input_str];
	else
		return input_str ;
}


function set_delivered(id){
	console.log('updating status');
	$$.ajax({
		  type: 'POST',
		  url: API_location+"set_delivered.php",
		  data: {"id": id },
		  success: status_updated,
		  dataType: 'JSON'
		});
	
	//mainView.router.back('kitchen-screen.html');
		
	function status_updated(data){
	console.log('going to reload the page:'+data);
	console.log(active_tab);
	//if(data == 1)
	//mainView.router.refreshPage();
	//myApp.alert('test');
	//mainView.router.loadPage('kitchen-screen.html');
	reload_page('kitchen-screen.html');
	//mainView.router.refreshPage();
	}	
}
	
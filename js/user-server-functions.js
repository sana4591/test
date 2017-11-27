//this file will contain the app user - server communication functions
function auth_user(username, password){
	// will send ajax request
	$$.ajax({
		  type: 'POST',
		  url: API_location+"auth_user.php",
		  data: {"username": username, "password": password},
		  success: auth_user_result,
		   error: function(xhr, textStatus, errorThrown){
              alert('request failed.textStatus:'+textStatus+".   errorThrown:"+errorThrown +".   xhr"+JSON.stringify(xhr) );
           },
		     dataType: 'JSON'
		
		});
		
function auth_user_result(data){
	user = username ;
	if(data != 0){
		if(data == "PENDING"){
			myApp.confirm("Dear User ("+username+"), <br> Please complete your account regsitration.",
						function () {
							mainView.router.loadPage('complete-register.html');
						});
		}
		else{
			if(data == "STILL PENDING"){
				myApp.confirm("Dear User ("+username+"), <br> Your account is still pending to be filled.",
						function () {
							mainView.router.loadPage('complete-register.html');
						});
			}
			else{
				var response = data.split(',');
				var userid = response[0];
				var kitchen_id = response[1];
				var arabic_name = response[2];
				
				console.log('display name is:'+response[3]);
				myApp.ls.setItem("user", response[3]);
				
				myApp.ls.setItem("userid", userid);
				myApp.ls.setItem("kitchen_id", kitchen_id);
				myApp.ls.setItem("user_ar", arabic_name);
				//user = username ;
				
				regsiter_device_push(userid, 'user');
				myApp.alert(t('Welcome ') + response[3], function () {
					mainView.router.loadPage('user-screen.html');
				});
			}
		}
	 }
	  else{
		  $$('#wrong_login').show();
	  }
	}
}

function get_categories(){
	console.log("kitchen_id:"+ myApp.ls.getItem("kitchen_id")+ " lang:"+ myApp.ls.getItem("lang"));
	$$.ajax({
		  type: 'POST',
		  url: API_location+"get_categories.php",
		  data: {"kitchen_id": myApp.ls.getItem("kitchen_id"), "lang": myApp.ls.getItem("lang")},
		  success: list_categories,
		  dataType: 'JSON'
		});
	
	console.log('internet:'+internet);
	if(internet == 0 )
	myApp.alert(t('Device is offline, please check your internet connection'));
			
	function list_categories(data){
		categories_json = JSON.parse(data);
		$$('#categories-list').html('');
		console.log(JSON.stringify(categories_json[0]));
		var html_row ;
		for (var i = 0; i < categories_json.length; i++) {
			
			html_row = '<div class="row row-stcmenu-categroeis">';
			html_row +='<div class="col-50 stcmenu-category"><a href="items_page.html?category-id='+categories_json[i].id+'&category-name='+categories_json[i].name+'">'+
						'<img src=\''+categs_thumb_location+categories_json[i].icon+'\' /><div>'+categories_json[i].name+'</div></a></div>';
          
			i++;
			if(i < categories_json.length)
			html_row +='<div class="col-50 stcmenu-category">'+
						'<a href="items_page.html?category-id='+categories_json[i].id+'&category-name='+categories_json[i].name+'">'+
						'<img src=\''+categs_thumb_location+categories_json[i].icon+'\' /><div>'+categories_json[i].name+'</div></a></div>';
            else
			html_row +='<div class="col-50 stcmenu-category"></div>';
            
			html_row += '</div>';
			
			$$('#categories-list').append(html_row);
		}
	}
}

function get_items(category_id, requester){
	if(requester == "user"){
	$$.ajax({
		  type: 'POST',
		  url: API_location+"get_items.php",
		  data: {"category_id": category_id , "user_id": myApp.ls.getItem("userid") , "lang": myApp.ls.getItem("lang")},
		  success: list_items,
		  dataType: 'JSON'
		});
	}
	if(requester == "kitchen"){
		$$.ajax({
		  type: 'POST',
		  url: API_location+"get_items_ktichen.php",
		  data: {"category_id": category_id , "kitchen_id": myApp.ls.getItem("kitchen_id") , "lang": myApp.ls.getItem("lang")},
		  success: list_items,
		  dataType: 'JSON'
		});
	}
	console.log('internet:'+internet);
	if(internet == 0 )
	myApp.alert(t('Device is offline, please check your internet connection'));
			
	function list_items(data){
		items_list = JSON.parse(data) ;
		//console.log(JSON.stringify(items_list));
		var html_row ;
		for (var i = 0; i < items_list.length; i++) {
			
			html_row = '<div class="row row-stcmenu-items">';
			html_row +='<div class="col-50 stcmenu-item">';

			if(requester == "user"){
	
			if(items_list[i].fav_item == '0')
				html_row +='<img src="./img/favorite.png" Alt="favourite this item" class="fav_this_item" onclick="fav_item('+items_list[i].id+')" id="item_'+items_list[i].id+'" />';
			else
				html_row +='<img src="./img/unfavorite.png" Alt="unfavourite this item" class="unfav_this_item" onclick="unfav_item('+items_list[i].id+')" id="item_'+items_list[i].id+'" />';
			}
			
			html_row +='<a href="item-page.html?id='+items_list[i].id+'">';
			html_row +='<img src=\''+items_thumb_location+items_list[i].thumbnail+'\' /><div class="item_caption">'+items_list[i].caption+'</div></a></div>';
          
			i++;
			if(i < items_list.length)
			{
				html_row +='<div class="col-50 stcmenu-item">';
			
			if(requester == "user"){
				if(items_list[i].fav_item == '0')
				html_row +='<img src="./img/favorite.png" Alt="favourite this item" class="fav_this_item" onclick="fav_item('+items_list[i].id+')" id="item_'+items_list[i].id+'" />';
				else
					html_row +='<img src="./img/unfavorite.png" Alt="unfavourite this item" class="unfav_this_item" onclick="unfav_item('+items_list[i].id+')" id="item_'+items_list[i].id+'" />';
			}
					html_row +=		'<a href="item-page.html?id='+items_list[i].id+'">'+
							'<img src=\''+items_thumb_location+items_list[i].thumbnail+'\' /><div class="item_caption">'+items_list[i].caption+'</div></a>'+
				'</div>';
			}
            else
			html_row +='<div class="col-50 stcmenu-item"></div>';
            
			html_row += '</div>';
			
			$$('.items-list-page').append(html_row);
		}
	}
}

function fav_item(id){
			console.log('bel fav');
			var icon_id = "item_"+id ;
			myApp.showIndicator();
			$$.post(API_location+'fav_item.php', {item_id: id, user_id: myApp.ls.getItem("userid")}, function (data) {
				myApp.hideIndicator();
				if (data === 'OK') {
					// negate the icon too
					//$(this).attr('src') = "./img/unfavorite.png";
					 $('#'+icon_id).attr('src', './img/unfavorite.png');
					 $('#'+icon_id).removeClass('fav_this_item');
					 $('#'+icon_id).addClass('unfav_this_item');
					 $('#'+icon_id).attr('onclick', 'unfav_item('+id+')');
					myApp.addNotification({
						title: t('Success'),
						message: t('item saved to favourite successfully'),
						hold: 1500
					});
				}
				else {
					myApp.addNotification({
						title: t('Failure'),
						message: t('Something went wrong, please try again later'),
						hold: 1500
					});
				}
			});
				
}

function unfav_item(id){
	
	console.log('bel un fav');
			var icon_id = "item_"+id;
			myApp.showIndicator();
			$$.post(API_location+'unfav_item.php', {item_id: id, user_id: myApp.ls.getItem("userid")}, function (data) {
				myApp.hideIndicator();
				if (data === 'OK') {
					// negate the icon too
					 $('#'+icon_id).attr('src', './img/favorite.png');
					 $('#'+icon_id).removeClass('unfav_this_item');
					 $('#'+icon_id).addClass('fav_this_item');
					 $('#'+icon_id).attr('onclick', 'fav_item('+id+')');
					
					myApp.addNotification({
						title: t('Success'),
						message: t('item unfavourited successfully'),
						hold: 1500
					});
				}
				else {
					myApp.addNotification({
						title: t('Failure'),
						message: t('Something went wrong, please try again later'),
						hold: 1500
					});
				}
			});
}

function get_item_options(id){
		
		  $$.ajax({
		  type: 'POST',
		  url: API_location+"get_items_options.php",
		  data: {"item_id": id, lang: myApp.ls.getItem("lang") },
		  success: list_options,
		  dataType: 'JSON'
		});
		
	if(internet == 0 )
	myApp.alert(t('Device is offline, please check your internet connection'));
		
	function list_options(data){
		var options_list = JSON.parse(data) ;
		
		var option_row ;
		if(options_list.length > 0)
		{
			$$('#options_label').show();
			for (var i = 0; i < options_list.length; i++) {
				
				option_row = '<li>'+
								'<label class="label-checkbox item-content">'+
								  '<input type="checkbox" name="ks-checkbox" value="option_'+options_list[i].id+'"/>'+
								  '<div class="item-media"><i class="icon icon-form-checkbox"></i></div>'+
								  '<div class="item-inner">'+
									'<div class="item-title">'+options_list[i].description+'</div>'+
								  '</div>'+
								'</label>'+
							  '</li>';
				
				$$('#option-list').append(option_row);
			}
		
		}
	}  
}

function send_order(){
	console.log('order object:'+JSON.stringify(order_obj));
				$.ajax({
					type: "POST",
					url: API_location+"order.php",
					data: order_obj,
					success: order_insert_feedback,
					fail: failedajax ,
					dataType: "text"
				});
				
		myApp.hidePreloader();
		mainView.router.back('user-screen.html');
			
	console.log('order is sent');	
		if(internet == 0 )
	myApp.alert(t('Device is offline, please check your internet connection'));
	
	function order_insert_feedback(data){
			console.log('order_insert_feedback:'+data);	
		
		if(data != "0")
		{
			var order_id = data; 
			// empty the stuff:
			order_items_html = "<li>"+t("no items are added yet")+" </li>";
			order_items = [] ;
			order_obj = new Object();
			
			//set time out, then check the order delivery on kitchen party:
			//code before the pause
				setTimeout(function(){
					//call an ajax that checks  this stuff for me:
					check_delivery_to_kitchen(order_id);
				}, 30000);
		}
		
		myApp.addNotification({
				message: t('Your order has been sent'),
				closeIcon: false ,
				hold: 1500
			});
	}
}

function check_delivery_to_kitchen(order_id){
		console.log('following order:'+order_id);	
		
				$.ajax({
					type: "POST",
					url: API_location+"order_follow.php",
					data: {"id": order_id },
					success: order_follow_feedback,
					fail: failedajax ,
					dataType: "text"
				});
				
		myApp.hidePreloader();
		
	function order_follow_feedback(data){
			
		if(data != "0")  // means the order is been delivered and start waiting for acknowledgement
		{
			console.log('order is delivered by kitchen, will check for ack after three miinutes');
			
			//set time out, then check the order delivery on kitchen party:
			//code before the pause
				setTimeout(function(){
					//call an ajax that checks  this stuff for me:
					check_ack_by_kitchen(order_id);
				}, 180000);
		}
		else{
			console.log('order is not delivered by kitchen, sms must be sent');
		}
		
	}
}


function check_ack_by_kitchen(order_id){
		console.log('following order ack:'+order_id);	
				$.ajax({
					type: "POST",
					url: API_location+"order_follow_two.php",
					data: {"id": order_id },
					success: order_follow_two_feedback,
					fail: failedajax ,
					dataType: "text"
				});
				
		myApp.hidePreloader();
		
	function order_follow_two_feedback(data){
			
		if(data >= 1)  // means the order is been delivered and start waiting for acknowledgement
		{
			console.log('order is acked by kitchen.');
		}
		else{
			console.log('order is not acked by kitchen, sms must be sent');
		}
		
	}
}



function get_kitchens(){
	//console.log('hello!');
	var user_id = myApp.ls.getItem("userid") ;
		$.ajax({
			type: "POST",
			url: API_location+"get_kitchens.php",
		    data: {"user_id": user_id, lang: myApp.ls.getItem("lang") },
			success: kitchens_list,
			fail: failedajax,
			dataType: "JSON"
		});			
		
	function kitchens_list(data){
		//console.log('kitchens:'+data);
		kitchens = data ;
		if(kitchens.length >= 1 )
		$$('#ks-picker-kitchen').val(kitchens[0]);
		
		if(kitchens.length > 1 )
		{
			var pickerDevice2 = myApp.picker({
			input: '#ks-picker-kitchen',
			//value: kitchens[0],
			cols: [
				{
					textAlign: 'center',
					values: kitchens
				}
				]
			});
		}
	}	
}
function get_locations(){
		$.ajax({
			type: "POST",
			url: API_location+"get_locations.php",
		    data: {"user_id": myApp.ls.getItem("userid"), "lang": myApp.ls.getItem("lang") },
			success: locations_list,
			fail: failedajax,
			dataType: "JSON"
		});			
		
	function locations_list(data){
		console.log('locations:'+data);
		locations = data ;
		
		if(locations.length >= 1 )
		$$('#ks-picker-location').val(locations[0]);
		
		if(locations.length > 1 )
		{
			var pickerDevice3 = myApp.picker({
			input: '#ks-picker-location',
			cols: [
					{
						textAlign: 'center',
						values: locations
					}
				]
			});
		}
	}
}




function get_fav_orders(){
	$.ajax({
			type: "POST",
			url: API_location+"get_fav_orders.php",
		    data: {"user_id": myApp.ls.getItem("userid"), "lang": myApp.ls.getItem("lang")},
			success: list_fav_orders,
			fail: failedajax,
			dataType: "JSON"
		});		
	$$('#loading').show();
	function list_fav_orders(data){
		$$('#my_fav_orders_ui').html('');
		
		$$('#loading').hide();
		if(data != ""){
		var orders = data ;
	console.log("test: "+JSON.stringify(orders));
		var list_item ;
			for (var i = 0 ; i < orders.length ; i++) {
				list_item = 
				
				//'		<li class="swipeout item-remove-callback">'+
				'		<li>'+
				'			<a href="view-order-user.html?id='+orders[i].id+'" class="item-link swipeout item-remove-callback">'+
				'            <div class="item-content">'+
				'              <div class="item-media"><i class="icon icon-f7"></i></div>'+
				'              <div class="item-inner"> '+
				'                <div class="item-title">';
								list_item += orders[i].items;
								list_item +=' </div>'+
				'				</div>'+
				'            </div>'+
				'          </a>'+
			//	'  <div class="swipeout-actions-right"><a href="#" data-confirm="Are you sure you want to delete this item?" class="swipeout-delete">Delete</a></div>'+
				'		</li>';

				$$('#my_fav_orders_ui').append(list_item);
			} //end for
		}
		else{
		$$('#no_fav_orders_yet').show();
		}
	}
		
}


function get_recent_orders(){
	$.ajax({
			type: "POST",
			url: API_location+"get_recent_orders.php",
		    data: {"user_id": myApp.ls.getItem("userid"), "lang": myApp.ls.getItem("lang") },
			success: list_recent_orders,
			fail: failedajax,
			dataType: "JSON"
		});		
	$$('#loading').show();
	function list_recent_orders(data){
		$$('#my_orders_ui').html('');
		$$('#loading').hide();
		if(data != ""){
		var orders = data ;
		var list_item ;
			for (var i = 0 ; i < orders.length ; i++) {
				list_item = 
				'			<li><a href="view-order-user.html?id='+orders[i].id+'&favourited='+orders[i].favourited+'" class="item-link">'+
				'            <div class="item-content">'+
				'              <div class="item-media"><i class="icon icon-f7"></i></div>'+
				'              <div class="item-inner"> '+
				'                <div class="item-title">';

				list_item += orders[i].items;
				list_item += ' </div>';
				
				list_item += 	'<div class="item-after"><span class="badge">';
				
				console.log('submit time:'+ orders[i].submit_time);
				list_item += get_run_time(orders[i].submit_time);
				
				list_item 	+= '</span></div>';
				list_item +=
					'				</div>'+
					'            </div>'+
					'          </a></li>';

				$$('#my_orders_ui').append(list_item);
			} //end for
		}
		else{
		$$('#no_orders_yet').show();
		}
	}		
}


function get_floor_orders(){
	$.ajax({
			type: "POST",
			url: API_location+"get_floor_orders.php",
		    data: {"user_id": myApp.ls.getItem("userid"), "lang": myApp.ls.getItem("lang") },
			success: list_floor_orders,
			fail: failedajax,
			dataType: "JSON"
		});
	$$('#loading').show();
	function list_floor_orders(data){
		$$('#floor_orders_ui').html('');
		$$('#loading').hide();
		if(data != ""){
		var orders = data ;
		var list_item ;
			for (var i = 0 ; i < orders.length ; i++) {
				list_item = 
				'			<li><a href="view-order-user.html?id='+orders[i].id+'" class="item-link">'+
				'            <div class="item-content">'+
				'              <div class="item-media"><i class="icon icon-f7"></i></div>'+
				'              <div class="item-inner"> '+
				'                <div class="item-title">';

				list_item += orders[i].items;
				list_item += ' </div>';
				
				list_item += 	'<div class="item-after">';
				
				 
				if((myApp.ls.getItem("user_"+myApp.ls.getItem("lang")) === orders[i].username.toLowerCase() && myApp.ls.getItem("lang") === "ar" )
				||  (myApp.ls.getItem("user") === orders[i].username.toLowerCase() && myApp.ls.getItem("lang") === "en" ))
				{
					list_item += "<span class='badge'>You</span>";
					console.log('if succeed');
				}
				else{
					list_item += orders[i].username;
					console.log('else succeed');				
				}
				list_item 	+= '</div>';
				list_item +=
					'				</div>'+
					'            </div>'+
					'          </a></li>';

				$$('#floor_orders_ui').append(list_item);
			} //end for
		}
		else{
		$$('#no_floor_orders').show();
		}
	}		
}


var floor_id ;

function get_user_location(){
	// this function sould send an ajax request to get back with following info for this user:
	// building id , floor, and ktichen.
	console.log('semsem:');
	
	$.ajax({
			type: "POST",
			url: API_location+"get_user_location.php",
		    data: {"user_id": myApp.ls.getItem("userid")},
			success: got_user_location,
			fail: failedajax,
			dataType: "text"
		});
	//$$('#loading').show();
	function got_user_location(data){
	
	console.log('semsem:'+data);
	var user_location = data.split(',');
	
	// user_location[2] -> the building id
	// user_location[1] -> the floor id
	// user_location[0] -> the kitchen id
	floor_id = user_location[1] ;
	console.log('result user location:'+JSON.stringify(user_location));
	// now call the get building function:
	get_buildings(user_location[2]);
	
	}
	
}


function get_buildings(building_id){
	$.ajax({
			type: "POST",
			url: API_location+"get_buildings.php",
		    data: {"lang": myApp.ls.getItem("lang")},
			success: list_buildings,
			fail: failedajax,
			dataType: "JSON"
		});
	function list_buildings(data){
		var buildings = data ;
		console.log('buildings:'+JSON.stringify(buildings));
		
		
		var building_name ;
		var building_names = [] ;
		for(var i = 0 ; i < buildings.length ; i++)
		{
			building_names.push(buildings[i]["name"]); 
			if(buildings[i]["id"] ==  building_id)
				building_name = buildings[i]["name"] ;
		}
		
		var building_ids = [] ;
		for(var i = 0 ; i < buildings.length ; i++)
			building_ids.push(buildings[i]["id"]); 
		
		if(buildings.length >= 1 )
		$$('#available_buildings').val(building_name);
		
		if(buildings.length > 1 )
		{
			var picker_val = building_id ;
			var pickerDevice3 = myApp.picker({
			input: '#available_buildings',
			formatValue: function (picker, values, displayValues) {
				return picker.displayValue;
			},
			onOpen: function (p, values, displayValues) {
				//picker_val = p.value ;
				//console.log('p val:'+ p.value);
			},
			
			onClose: function (p, values, displayValues) {
				console.log('picker_val:'+picker_val);
				console.log('p.value:'+p.value);
				
				if(p.value != picker_val)
				{	
					console.log('here it should call refresh floors:'+ p.value);
					picker_val = p.value ;
					get_floors(p.value.toString());
					$$('#available_kitchens').html('');
				}
			},
			cols: [
					{
						textAlign: 'center',
						value: building_id,
						displayValue: building_name ,
			
						values: building_ids,
						displayValues: building_names						
					}
				]
			});
		}
		
		get_floors(building_id);
		get_floors_kitchen(floor_id);
	}		
}

function get_floors(bid){
	console.log('in get floors...');
	$$('#available_floors').html('');
	$$('#no_building_floors').hide();
	$$('#loading_floors').show();
	
	$.ajax({
			type: "POST",
			url: API_location+"get_building_floors.php",
		    data: {"bid": bid, "lang": myApp.ls.getItem("lang")},
			success: list_building_floors,
			fail: failedajax,
			dataType: "JSON"
		});
		
		console.log('building floors id:'+ bid);
		
	function list_building_floors(data){
		console.log('building floors:'+ JSON.stringify(data));
		$$('#available_floors').html('');
		$$('#no_building_floors').hide();
		$$('#loading_floors').hide();

		if(data != ""){
		var floors = data ;
		var list_item ;
			for (var i = 0 ; i < floors.length ; i++) {
				list_item = 
				'			<li onclick="get_floors_kitchen('+floors[i].id+')" > <label class="label-radio item-content">'+
						  '<input type="radio" class="floors_radio" id="floor_'+floors[i].id+'" name="ks-radio-floors" value="'+floors[i].name+'" ';
						  
						  if(floors[i].id == floor_id)
								list_item +=  'checked="checked"' ;
						  
				list_item += '/>'+
						  '<div class="item-inner">'+
							'<div class="item-title">'+floors[i].name+'</div>'+
						  '</div>'+
						'</label></li>';

				$$('#available_floors').append(list_item);
			} //end for
		
		}
		else{
		$$('#no_building_floors').show();
		}
	}		
	//get_floors_kitchen(floor_id);
}

function get_floors_kitchen(fid){
	$.ajax({
			type: "POST",
			url: API_location+"get_floor_kitchens.php",
		    data: {"fid": fid, "lang": myApp.ls.getItem("lang")},
			success: list_floor_kitchens,
			fail: failedajax,
			dataType: "JSON"
		});
		
	$$('#available_kitchens').html('');
	$$('#no_floor_kitchens').hide();
	$$('#loading_kitchens').show();
	
	function list_floor_kitchens(data){
		$$('#available_kitchens').html('');
		$$('#no_floor_kitchens').hide();
		$$('#loading_kitchens').hide();
	
	if(data != ""){
		var kitchens = data;//JSON.parse(data) ;
		var list_item ;
			for (var i = 0 ; i < kitchens.length ; i++) {
				list_item = 
				'			<li> <label class="label-radio item-content">'+
						  '<input type="radio" class="kitchens_radio" id="kitchen_'+kitchens[i].id+'" name="ks-radio-kitchen" value="'+kitchens[i].name+'" ';
						  
						  if(kitchens[i].id == myApp.ls.getItem("kitchen_id"))
								list_item +=  'checked="checked"' ;
						  
				list_item += '/>'+
						  '<div class="item-inner">'+
							'<div class="item-title">'+kitchens[i].name+'</div>'+
						  '</div>'+
						'</label></li>';

				$$('#available_kitchens').append(list_item);
			} //end for
		
		}
		else{
		$$('#no_floor_kitchens').show();
		}
	}		
}

function get_run_time(time){
	var text_result = '' ;
	console.log('time:'+time);
	
	//var date1 = new Date(time.replace(' ', 'T'));
	var date1 = new Date(time.replace(/-/g, '/'));
	var date2 = new Date();
	
//	console.log('date1:'+date1);	
	
//	console.log('date2:'+date2);	
	
	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
	var diffmins = Math.ceil(timeDiff / (1000 * 60 )); 
	
	//console.log('diffmins:'+diffmins );

	var hrs = Math.floor(diffmins / 60);
	//console.log("hours:"+hrs);
	var and_mins = diffmins - (hrs*60) ;
	//console.log("and_mins:"+and_mins);
	
	if(language == 'ar')
	text_result 	+=t(' ago ');
			
	if( hrs > 24)
	{
		var days = Math.floor(hrs / 24);
		
		if(days > 1)
		text_result 	+= days +t(' days');
		else
		text_result 	+= days +t(' day');
		
		/*
		if(days > 1)
		text_result 	+= 's';
		*/
		
		// clear other time variables because showing days number is enough.
		hrs = 0 ; 
		and_mins = 0 ;
		/*
		hrs = hrs - (days*24)
		
		if(hrs > 0 || and_mins > 0)
		text_result 	+=' and ' ; */
	}
	
	if(hrs > 0 && hrs < 24)
	{
		if(hrs == 1)
		text_result 	+= hrs+t(' hour');
		else	
		text_result 	+= hrs+t(' hours');
		
		if(and_mins > 0)
		text_result 	+=' and ' ;
	}
	
	if(and_mins > 0)
	{
		if(and_mins > 1)
			text_result 	+= and_mins+' mins';
		else
			text_result 	+= and_mins+' min';
	}
	
	if(language == 'en')
	text_result 	+=t(' ago ');
						
	return 	text_result ;		
}

function failedajax(data){
console.log('failed:'+data);
}
//this file will contain the app kitchen - server communication functions
function kitchen_exist(kitchen_name){
	// will send ajax request
	$$.ajax({
		  type: 'POST',
		  url: API_location+"kitchen_exist.php",
		  data: {"kitchen_name": kitchen_name },
		  success: kitchen_exist_result,
		  dataType: 'text'
		});
		
	function kitchen_exist_result(data){
		console.log(data);
		if(data == 0){
		  $$('#wrong_login').show();
		}
	  else{
			myApp.ls.setItem("user", 'kitchen');
			myApp.ls.setItem("kitchen_id", data);
			myApp.ls.setItem("kitchenname", kitchen_name);
			//user = 'kitchen' ;
			regsiter_device_push(data, 'kitchen');
			myApp.alert(t('Welcome to kitchen: ') + kitchen_name, function () {
				mainView.router.loadPage('kitchen-screen.html');
			});
	   }
	}
}

function get_orders(){
	console.log('getting orders..'+ t('Success'));
	$$.ajax({
		  type: 'POST',
		  url: API_location+"get_kitchen_orders.php",
		  data: {"kitchen_id": myApp.ls.getItem("kitchen_id") , "lang": myApp.ls.getItem("lang") },
		  success: kitchen_orders_result,
		  dataType: 'text'
		});
		
	function kitchen_orders_result(data){
		//console.log(data);
		var orders_list = JSON.parse(data) ;
		$$('#tab1ul').html('');
		$$('#tab2ul').html('');
		$$('#tab3ul').html('');
		
		var list_item  ;
		for (var i = 0; i < orders_list.length; i++) {
			list_item = 
'			<li><a href="view-order.html?id='+orders_list[i].id+'" class="item-link">'+
'            <div class="item-content">'+
'              <div class="item-media"><i class="icon icon-f7"></i></div>'+
'              <div class="item-inner"> '+
'                <div class="item-title">'+orders_list[i].username+'</div>'+
'                <div class="item-after"><span class="badge ';

		//	console.log('orders_list[i].delivery_time:'+orders_list[i].delivery_time);
			//var date1 = new Date(orders_list[i].delivery_time);
			// Split timestamp into [ Y, M, D, h, m, s ]
			var te = orders_list[i].delivery_time.split(/[- :]/);

			// Apply each element to the Date function
			var date1 = new Date(te[0], te[1]-1, te[2], te[3], te[4], te[5]);
			//var date2 = new Date(new Date().toISOString().slice(0, 19).replace('T', ' '));
			var date2 = new Date();
			//console.log(date1 +"|"+ date2);
			if(date1 <= date2 && orders_list[i].status < 2)
			{
				var timeDiff = Math.abs(date2.getTime() - date1.getTime());
				var diffmins = Math.ceil(timeDiff / (1000 * 60 )); 
				//console.log('diffmins:'+diffmins);
				if(diffmins < 5)
				list_item 	+='bg-orange">'+t('now, ');
				else{
					if(diffmins < 10)
					list_item 	+='bg-red">'+diffmins+t(' mins ago, ');
					else{
						/*console.log('diffmins:'+diffmins );
				
						var hrs = Math.floor(diffmins / 60);
						console.log("hours:"+hrs);
						var and_mins = diffmins - (hrs*60) ;
						console.log("and_mins:"+and_mins);
						
						if(hrs == 1)
						list_item 	+='bg-red">'+hrs+' hour';
						else	
						list_item 	+='bg-red">'+hrs+' hours';
							
						if(and_mins > 0)
						list_item 	+=' and '+and_mins+' mins';
							
						list_item 	+=' ago, ';*/
						list_item 	+='bg-red">'+t('LATE, ');
					
					}
				}
			}
			else
			list_item 	+='">';
				
			list_item 	+= orders_list[i].itemCount ;
			
			if(orders_list[i].itemCount > '1')
				list_item 	+= t(' items');
			else
				list_item 	+= t(' item');
			
			list_item 	+= '</span></div>'+
			'				</div>'+
			'            </div>'+
			'          </a></li>';

			if(orders_list[i].status < 1)
				$$('#tab1ul').append(list_item);
			else if(orders_list[i].status == 1)
				$$('#tab2ul').append(list_item);
			else if(orders_list[i].status == 2)
				$$('#tab3ul').append(list_item);
		}
	}
}

var order_status ;
function get_order_obj(id){
	$$.ajax({
		  type: 'POST',
		  url: API_location+"get_order.php",
		  data: {"id": id , "lang": myApp.ls.getItem("lang")},
		  success: order_result,
		  dataType: 'JSON'
		});
		
	function order_result(data){
		var order = JSON.parse(data) ;
		//console.log(order);
		$$('#requester_name').html(order.username);
		$$('#location').html(order.name);
		$$('#time').html(order.delivery_time);
	
		
		if(order.status < 2){
			if(order.status == 0)
			$$('#ack-button').html(t('Acknowledge'));
			else if(order.status == 1)
			$$('#ack-button').html(t('Log delivered'));
			
			$$('#action_button_block').show();
		}
		
		//else if(order.status == 2)
		//$$('#ack-button').hide();
	
		order_status = order.status ;
	}
}

function get_order_items(id){
	$$.ajax({
		  type: 'POST',
		  url: API_location+"get_order_items.php",
		  data: {"id": id , lang: myApp.ls.getItem("lang")},
		  success: fill_order_items,
		  dataType: 'JSON'
		});
		
	function fill_order_items(data){
		var items = JSON.parse(data) ;
		console.log(data);
		
		var item_li = ""
		
		// for loop 3ala el item:
		for (var i = 0; i < items.length; i++) {
			item_li = 
'			 <li>'+
'            <label class="item-content">'+
'              <div class="item-media"><img src="'+items_thumb_location+items[i].thumbnail+'" width="80"/></div>'+
'              <div class="item-inner">'+
'                <div class="item-title-row">'+
'                  <div class="item-title">'+items[i].caption+'</div>'+
'                </div>'+
'                <div class="item-subtitle">'+items[i].quantity+' ';

	
		
	console.log(JSON.stringify(items[i]));
	if(items[i].quantity === '1') // add descriptive word
		item_li += items[i].item_description;//get_category_desc(items[i].name)/*category_description_word[items[i].name]*/+'</div>';
	else
		item_li += items[i].item_description_plural;//get_category_desc_plural(items[i].name)/*category_description_word_plural[items[i].name]*/+'</div>';
		
	item_li += '<div class="item-text">'+items[i].options;
	
	
	
			item_li += 
		'				</div>'+
		'              </div>'+
		'            </label>'
		'			 </li> ';
		
			$$('#order-items').append(item_li);
		}//end for loop
	}
}

function update_status(id){
	console.log('updating status');
	$$.ajax({
		  type: 'POST',
		  url: API_location+"update_status.php",
		  data: {"id": id , "status": order_status },
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
/*
 var recent_orders = $.grep(data.items, function(element, index){
          return element.status == "0";
    });
 var pending_orders = $.grep(data.items, function(element, index){
          return element.status == "1";
    });
 var history_orders = $.grep(data.items, function(element, index){
          return element.status == "2";
    });
*/
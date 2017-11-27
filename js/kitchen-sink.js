var myApp = new Framework7({
    modalTitle: 'STC E-menu',
    animateNavBackIcon: true
});

// Expose Internal DOM library
var $$ = Dom7;

// Add main view
var mainView = myApp.addView('.view-main', {
    // Enable Dynamic Navbar for this view
    dynamicNavbar: true
});
/*
// Add another view, which is in right panel
var rightView = myApp.addView('.view-right', {
    // Enable Dynamic Navbar for this view
    dynamicNavbar: true
});
*/

// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function (e) {
	console.log('requested url, ajax started:'+e.detail.xhr.requestUrl);
   
    if (e.detail.xhr.requestUrl.indexOf('get_categories.php') >= 0) {
        // Don't show preloader for autocomplete demo requests
    myApp.hideIndicator();
        return;
    }
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function (e) {
    if (e.detail.xhr.requestUrl.indexOf('autocomplete-languages.json') >= 0) {
        // Don't show preloader for autocomplete demo requests
        return;
    }
    myApp.hideIndicator();
});

$$(document).on('ajaxError', function (e) {
  var xhr = e.detail.xhr;
  //console.log('ERROR:'+xhr);
  console.log('ERROR:'+JSON.stringify(e));
});

// Callbacks for specific pages when it initialized
/* ===== Modals Page events  ===== */
myApp.onPageInit('modals', function (page) {
    $$('.demo-alert').on('click', function () {
        myApp.alert('Hello!');
    });
    $$('.demo-confirm').on('click', function () {
        myApp.confirm('Are you feel good today?', function () {
            myApp.alert('Great!');
        });
    });
    $$('.demo-prompt').on('click', function () {
        myApp.prompt('What is your name?', function (data) {
            // @data contains input value
            myApp.confirm('Are you sure that your name is ' + data + '?', function () {
                myApp.alert('Ok, your name is ' + data + ' ;)');
            });
        });
    });
    $$('.demo-login').on('click', function () {
        myApp.modalLogin('Enter your username and password', function (username, password) {
            myApp.alert('Thank you! Username: ' + username + ', password: ' + password);
        });
    });
    $$('.demo-password').on('click', function () {
        myApp.modalPassword('Enter your password', function (password) {
            myApp.alert('Thank you! Password: ' + password);
        });
    });
    $$('.demo-modals-stack').on('click', function () {
        // Open 5 alerts
        myApp.alert('Alert 1');
        myApp.alert('Alert 2');
        myApp.alert('Alert 3');
        myApp.alert('Alert 4');
        myApp.alert('Alert 5');
    });
    $$('.demo-picker-modal').on('click', function () {
        myApp.pickerModal('.picker-modal-demo');
    });
});

/* ===== Preloader Page events ===== */
myApp.onPageInit('preloader', function (page) {
    $$('.demo-indicator').on('click', function () {
        myApp.showIndicator();
        setTimeout(function () {
            myApp.hideIndicator();
        }, 2000);
    });
    $$('.demo-preloader').on('click', function () {
        myApp.showPreloader();
        setTimeout(function () {
            myApp.hidePreloader();
        }, 2000);
    });
    $$('.demo-preloader-custom').on('click', function () {
        myApp.showPreloader('My text...');
        setTimeout(function () {
            myApp.hidePreloader();
        }, 2000);
    });
});


	 $$('.icon-back').on('click', function () {
	    myApp.hidePreloader();
        
    });

/* ===== items_page init ===== */

myApp.onPageAfterBack('items-page', function (page) {


	if(order_items_html.substring(0, 4) === "<li>" || order_items_html === "")
	{
		// make order send button disabled.
		console.log("order_items_html hey:"+order_items_html);	
		$('.clear-btn').attr("disabled", true);
	}
	else{
		console.log('should be enabled!	');
		$('.clear-btn').attr("enabled", true);	
	}
});

myApp.onPageInit('items-page', function (page) {
	myApp.hideIndicator();
	
	
	category_selected = page.query['category-name'] ;
	
	$$('.pg-title').html(category_selected);

	// an ajax reqest to be sent to server asking for items for this category: 
	if(page.fromPage.name == "kitchen-categories")
	{
		get_items(page.query['category-id'], "kitchen"); 
		$('#order_btn').hide();
	}
	else
		get_items(page.query['category-id'], "user"); 
	 
	if(order_items_html.substring(0, 4) === "<li>" || order_items_html === "")
	{
		// make order send button disabled.
	console.log("order_items_html, sho bel nesbeh ??:"+order_items_html);	
		$('.clear-btn').attr("disabled", true);
	}
	else{
		console.log('should be enabled!');
		$('.clear-btn').attr("enabled", true);	
	}
	 
});
	
/* ===== favourite items_page init ===== */
myApp.onPageInit('fav-items-page', function (page) {
	$$('#loading').show();
	// Request fav. items:
	$$.post(API_location+'get_fav_items.php', {user_id: myApp.ls.getItem("userid"), lang: myApp.ls.getItem("lang")}, function (data) {
		//loading = false;
		$$('#loading').hide();
console.log('mmmmm:'+data.length);
			
		if (data.length === 2) {
			console.log('mmmmm');
			$$('#no_fav_items_yet').show();
		}
		else {
			items_list = JSON.parse(data) ;
			//console.log(JSON.stringify(items_list));
			var html_row ;
			for (var i = 0; i < items_list.length; i++) {
				
				html_row = '<div class="row row-stcmenu-items">';
				html_row +='<div class="col-50 stcmenu-item"><a href="item-page.html?id='+items_list[i].id+'">'+
							'<img src=\''+items_thumb_location+items_list[i].thumbnail+'\' /><div>'+items_list[i].caption+'</div></a></div>';
			  
				i++;
				if(i < items_list.length)
				html_row +='<div class="col-50 stcmenu-item"><a href="item-page.html?id='+items_list[i].id+'">'+
							'<img src=\''+items_thumb_location+items_list[i].thumbnail+'\' /><div>'+items_list[i].caption+'</div></a></div>';
				else
				html_row +='<div class="col-50 stcmenu-item"></div>';
				
				html_row += '</div>';
				
				$$('.items-list-page').append(html_row);
			}
		}
	});
});

/* ===== frequent used items_page init ===== */
myApp.onPageInit('freq-items-page', function (page) {
	$$('#loading').show();
	// Request the list of frequently used items:
	$$.post(API_location+'get_freq_items.php', {user_id: myApp.ls.getItem("userid"), lang: myApp.ls.getItem("lang")}, function (data) {
		$$('#loading').hide();

		if (data === '') {
			$$('#no_freq_items_yet').show();
		}
		else {
			items_list = JSON.parse(data) ;
			//console.log(JSON.stringify(items_list));
			var html_row ;
			for (var i = 0; i < items_list.length; i++) {
				
				html_row = '<div class="row row-stcmenu-items">';
				html_row +='<div class="col-50 stcmenu-item"><a href="item-page.html?id='+items_list[i].id+'">'+
							'<img src=\''+items_thumb_location+items_list[i].thumbnail+'\' /><div>'+items_list[i].caption+'</div></a></div>';
			  
				i++;
				if(i < items_list.length)
				html_row +='<div class="col-50 stcmenu-item"><a href="item-page.html?id='+items_list[i].id+'">'+
							'<img src=\''+items_thumb_location+items_list[i].thumbnail+'\' /><div>'+items_list[i].caption+'</div></a></div>';
				else
				html_row +='<div class="col-50 stcmenu-item"></div>';
				
				html_row += '</div>';
				
				$$('.items-list-page').append(html_row);
			}
		}
	});
});


myApp.onPageInit('item-kitchen', function (page) {

});

/* ===== item_page init ===== */
myApp.onPageInit('item-page', function (page) {
// here to fill the page with approriate data
var item = get_item_obj(page.query['id']);

$$('#item-chosen').html(item.caption);
//$$('#item-pg-title').html(item.caption);

$$('#category-chosen').html(category_selected);
$$('#item_img').attr("src", items_thumb_location+item.thumbnail);

if(item.short_desc == "null")
$$('#item-descrption').hide();
else
$$('#item-descrption').html(item.short_desc);
	
if(category_selected !== 'Services')
	get_item_options(item.id) ;
else{
$$('#quantity_block').hide();
}


$$('#quantity').on('keypress', function (e) {
	if (e.keyCode == 13)
	{
		console.log('key code is enter/go');
		$$('#submit-button').click();
	}
	
});
if(myApp.ls.getItem("user") === "kitchen" )
	{
		
		console.log('la kitchen');
		$$('#quantity_block').hide();
		$$('#options_block').hide();
		
		$$('#submit-button').html(t("Out of stock"));
	}
	else{
		console.log('la mish kitchen');
	}
$$('#submit-button').on('click', function () {
	
	
if(myApp.ls.getItem("user") !== "kitchen" ){
        //myApp.alert($$('#my-form').serializeJSON());
		// navigate to user-screen.html after form elements value are saved into order json as new object
		var item_obj = new Object();
		item_obj.id = item.id;
	    item_obj.quantity = $$('#quantity').val();
		if( $$('#quantity').val() <= 0 || $$('#quantity').val() > 30)
		{
			myApp.alert(t("Quantity can't be more than 30!")	);
		}
		else
		{
			var checkedoptions = $('input:checkbox:checked').map(function() {return this.value;}).get();
		item_obj.options = checkedoptions ;
	   
		// add this item obj to items objects array
		order_items.push(item_obj);
	// now form the item in an <li> element format to be previewed before to use sent (later will be removable on swipe or editable on click etc )
	
	
	if(order_items_html.substring(0, 4) === "<li>")
	{
		order_items_html = "";
	}
/*	else{
	alert('fad:'+order_items_html.substring(0, 4));
	}*/
	var item_index = order_items.length -1 ;
	order_items_html += 
'			 <li class="swipeout item-remove-callback" id="item_'+item_index+'">'+
'            <label class="item-content swipeout-content">'+
'              <div class="item-media"><img src="'+items_thumb_location+item.thumbnail+'" width="80"/></div>'+
'              <div class="item-inner">'+
'                <div class="item-title-row">'+
'                  <div class="item-title">'+item.caption+'</div>'+
'                </div>'+
'                <div class="item-subtitle">'+category_selected+'</div>'+
'                <div class="item-text">'+item_obj.quantity+' ';

console.log('item:'+JSON.stringify(item));

console.log('item_obj:'+JSON.stringify(item_obj));

	if(item_obj.quantity > 1)
	order_items_html += item.item_description ;//get_category_desc_plural(category_selected);//category_description_word_plural[category_selected];
	else
	order_items_html += item.item_description_plural;//item.item_description_plural;// get_category_desc(category_selected);//category_description_word[category_selected];
	
	//if(item_obj.quantity > 1) //then add s to descriptive word
	//order_items_html += 's';

	
	order_items_html += 
'				</div>'+
'              </div>'+
'            </label>'+
'  <div class="swipeout-actions-right"><a href="#" data-confirm="Are you sure you want to delete this item?" class="swipeout-delete">Delete</a></div>'+
          
         ' </li> ';
	mainView.router.back('user-screen.html');
	myApp.addNotification({
				message: t('Item added to your order'),
				closeIcon: false ,
				hold: 1500
});	}}
		
		
	else{
		console.log('tamtam');
		$$.post(API_location+'out_of_stock.php', 
		{kitchen_id: myApp.ls.getItem("kitchen_id"), item_id: item.id},
		function (data) {
			if(data == '1'){
				myApp.addNotification({
							message: t('Item updated'),
							closeIcon: false ,
							hold: 1500
				});
			}
			else{
				myApp.addNotification({
							message: t('Failed to update item!'),
							closeIcon: false ,
							hold: 1500
				});
			}
			
			mainView.router.back('user-screen.html');
			
		});
	}	
		
	});

});
	
/* ===== orders ===== */
myApp.onPageInit('order-send', function (page) {
    var today = new Date();
	$$('#order-items').html(order_items_html);
	
	$$('.item-remove-callback').on('deleted', function () {
		 console.log(this.id.replace("item_",""));
		 var item_index = this.id.replace("item_","") ;
    	order_items.splice(item_index,1);
		
    });
	
	 $$('#cancel_order').on('click', function () {
		//console.log($$('#order-items').html());
		//if ($$('#order-items').html() != "undefined")
		order_items_html = $$('#order-items').html();
	});
	
	//get_kitchens();
	/*if(user.toUpperCase() !== "CEO")
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
	
		$$("#ks-picker-kitchen").val('IT VP Kitchen');
	}*/
	
	
	get_locations();
	/*if(user.toUpperCase() === "CEO")
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
		
		$$("#ks-picker-location").val('CEO Office');
	}*/
	
 // Inline time
    var pickerInlinetime = myApp.picker({
        input: '#ks-picker-time',
        container: '#ks-picker-time-container',
        toolbar: false,
        rotateEffect: true,
        value: [ today.getHours(), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],
        formatValue: function (p, values, displayValues) {
		  return   values[0] + ':' + values[1];
        },
        cols: [
            // Hours
            {
                values: (function () {
                    var arr = [];
                    for (var i = 0; i <= 23; i++) { arr.push(i); }
                    return arr;
                })()
            },
            // Divider
            {
                divider: true,
                content: ':'
            },
            // Minutes
            {
                values: (function () {
                    var arr = [];
                    for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                    return arr;
                })()
            }
        ]
    });

	$$('#send_order_button').on('click', function () {
		if($$('fav-checkbox').checked)
			console.log('this is checked!');
			
		if(order_items.length == 0)
			 myApp.alert(t("Can't send an empty order to kitchens"));
		 else{ // do the stuff
			//push the order elements to order json object and 
			order_obj.userid  =  myApp.ls.getItem("userid");
			//order_obj.kitchen  =  $$('#ks-picker-kitchen').val();
			order_obj.kitchen  =  myApp.ls.getItem("kitchen_id");
			order_obj.location  =  $$('#ks-picker-location').val();
			order_obj.time  =  $$('#ks-picker-time').val();
			order_obj.lang  =   myApp.ls.getItem("lang");
			console.log("time:"+order_obj.time);
			console.log("order_items length:"+order_items.length);
			order_obj.order_items = order_items ;
			//console.log('checked: '+ $$('#fav-checkbox').prop('checked'));
			order_obj.fav = $$('#fav-checkbox').prop('checked');
			// send it to API requesting to insr the order to DB and send to kitchen device of-course.
			send_order();
			/*
			// empty the stuff:
			order_items_html = "<li>no items are added yet </li>";
			order_items = [] ;
			order_obj = new Object();*/
		 }
	});
});

function refresh_the_page() {
    //check the internet connection:
	clearInterval(refresh_page);
	
console.log('refresh:');
/*
//var state = navigator.connection.type;
var networkState = navigator.connection && navigator.connection.type;

setTimeout(function(){
networkState = navigator.connection && navigator.connection.type;

console.log(states[networkState]);
}, 1000);*/

	if(internet == 1)
	{
		mainView.router.refreshPage();
	}
	else
	console.log('no internet');
}

//myApp.onPageInit('user-screen', function (page) {
//$$('.no-network').show();
	
//});
myApp.onPageBeforeAnimation('kitchen-screen', function (page){
  //right before animation from page3 to page2
  if (page.from === 'left') {
    //update here page2
	get_orders();
  }
});
myApp.onPageInit('kitchen-screen', function (page) {
	get_categories();
	get_orders();
	
	myApp.showTab(active_tab);
	console.log('kitchen name:'+myApp.ls.getItem("kitchenname"));
	$$('#kitchen-pg-title').html(myApp.ls.getItem("kitchenname"));

	refresh_page = setInterval(get_orders, 30000);
	//$$('.no-network').hide();
	if(myApp.ls.getItem("lang") == 'ar')
		$$('#lang_btn_kitchen').html("<strong>English</strong>");
	$$('#lang_btn_kitchen').on('click', function () {
		// should switch to another language
		var  current_lang = myApp.ls.getItem("lang");
		if(current_lang === "en")
		myApp.ls.setItem("lang", "ar");
		else
		myApp.ls.setItem("lang", "en");
		
		console.log('language ddd:'+myApp.ls.getItem("lang"));
		window.location = "index.html";
		//onDeviceReady();//mainView.router.loadPage('index.html');
	});
	
	
	$$('#tab1').on('show', function () {
    //myApp.alert('Tab 1 is visible');
	active_tab = '#tab1' ;
	if(new_order_to_kitchen == 1) // then there is need to refresh to get new orders
		{
			new_order_to_kitchen = 0 ;
			reload_page('kitchen-screen.html');
		}
	});
	 
	$$('#tab2').on('show', function () {
	//myApp.alert('Tab 2 is visible');
	active_tab = '#tab2' ;
	});
	 
	$$('#tab3').on('show', function () {
	//myApp.alert('Tab 3 is visible');
	active_tab = '#tab3' ;
	});  
});

myApp.onPageInit('order-view', function (page) {
	console.log('from page:'+page.fromPage.name);
	if(page.fromPage.name === 'view-my-fav-orders')
	{
		$$('#fav_order').remove();
		$$('#time_delivery_div').hide();
		$$('#unfav_block').show();
	}
	else if(page.fromPage.name === 'view-my-orders')
	{
		//$$('#resend_order').remove();
		if(page.query['favourited'] == 1)
		{
			$$('#fav_order').remove();
			$$('#time_delivery_div').hide();
			$$('#unfav_block').show();
		}
		
		else{
			$$('#resend_order').hide();
		}
	}
    else if(page.fromPage.name === 'view-floor-orders')
	{
		$$('#fav_order').remove();
		$$('#resend_order').remove();
	}
	
	// get url paramter order id , then get the items along with thier details 
	var order_status = get_order_obj(page.query['id']);
	get_order_items(page.query['id']);

	// fill them into list liek the items in roder send page
	// item list item has: item caption , (not necessary the category of-course)
	// quanitty
	// if it has options then show them seperated in commas
	
	// and show rest of data like: requester name, location, time  of delivery
	
	
	// check what is the status of order, to fill the button,
	// on acknowlsdge button is clicked, this will send ajax to changes status,
	// on success refresh page:
	
	$$('#ack-button').on('click', function () {
		update_status(page.query['id']);   
	});
	
	
	$$('#fav_order').on('click', function () {
		myApp.showIndicator();
		$$.get(API_location+'fav_order.php', {order_id: page.query['id']}, function (data) {
	   myApp.hideIndicator();
			if (data === 'OK') {
				myApp.addNotification({
					title: t('Success'),
					message: t('Your order is saved to favourite list successfully'),
					hold: 2000
				});
			}
            else {
				myApp.addNotification({
					title: t('Failure'),
					message: t('Something went wrong, please try again later'),
					hold: 2000
				});
			}
	
			get_recent_orders();
			mainView.router.back();
        });
	});
	
	
	$$('#unfav_order').on('click', function () {
		myApp.showIndicator();
		$$.get(API_location+'unfav_order.php', {order_id: page.query['id']}, function (data) {
	   myApp.hideIndicator();
			if (data === 'OK') {
				myApp.addNotification({
					title: t('Success'),
					message: t('Your order is removed from favourite list successfully'),
					hold: 2000
				});
			}
            else {
				myApp.addNotification({
					title: t('Failure'),
					message: t('Something went wrong, please try again later'),
					hold: 2000
				});
			}
	
			get_fav_orders();
			mainView.router.back();
        });
	});
	
	
	$$('#resend_order').on('click', function () {
		myApp.showIndicator();
		$$.get(API_location+'re_order.php', {order_id: page.query['id']}, function (data) {
			myApp.hideIndicator();
			mainView.router.back();
			myApp.addNotification({
			message: t('Your order has been sent to kitchen'),
			closeIcon: false ,
			hold: 1500
			});
        });
	});
});

myApp.onPageInit('feedback_form', function (page) {
	$$('#submit_feedback').on('click', function () {
		myApp.showIndicator();
		console.log($$('#description').val());
		$$.post(API_location+'feed_back.php', 
		{user_id: myApp.ls.getItem("userid"), summery: $$('#summery').val(), description: $$('#description').val()},
		function (data) {
        myApp.hideIndicator();
		console.log(data);
		if (data === 'OK') {
				myApp.addNotification({
					title: t('Success'),
					message: t('Thank you, your feedback is been sent'),
					hold: 2000
				});
			}
            else {
				myApp.addNotification({
					title: t('Failure'),
					message: t('Something went wrong, please try again later'),
					hold: 2000
				});
			}
		
			mainView.router.back();
			
		});
	});
});

  
 /* ===== Swipe to delete events callback demo ===== */
myApp.onPageInit('swipe-delete', function (page) {
    $$('.demo-remove-callback').on('deleted', function () {
        myApp.alert('Thanks, item removed!');
    });
});
myApp.onPageInit('swipe-delete media-lists', function (page) {
    $$('.demo-reply').on('click', function () {
        myApp.alert('Reply');
    });
    $$('.demo-mark').on('click', function () {
        myApp.alert('Mark');
    });
    $$('.demo-forward').on('click', function () {
        myApp.alert('Forward');
    });
});


/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('swipe-delete modals media-lists', function (page) {
    var actionSheetButtons = [
        // First buttons group
        [
            // Group Label
            {
                text: 'Here comes some optional description or warning for actions below',
                label: true
            },
            // First button
            {
                text: 'Alert',
                onClick: function () {
                    myApp.alert('He Hoou!');
                }
            },
            // Another red button
            {
                text: 'Nice Red Button ',
                color: 'red',
                onClick: function () {
                    myApp.alert('You have clicked red button!');
                }
            },
        ],
        // Second group
        [
            {
                text: 'Cancel',
                bold: true
            }
        ]
    ];
    $$('.demo-actions').on('click', function (e) {
        myApp.actions(actionSheetButtons);
    });
    $$('.demo-actions-popover').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(this, actionSheetButtons);
    });

});

/* ===== Messages Page ===== */
myApp.onPageInit('messages', function (page) {
    var conversationStarted = false;
    var answers = [
        'Yes!',
        'No',
        'Hm...',
        'I am not sure',
        'And what about you?',
        'May be ;)',
        'Lorem ipsum dolor sit amet, consectetur',
        'What?',
        'Are you sure?',
        'Of course',
        'Need to think about it',
        'Amazing!!!',
    ];
    var people = [
        {
            name: 'Kate Johnson',
            avatar: 'http://lorempixel.com/output/people-q-c-100-100-9.jpg'
        },
        {
            name: 'Blue Ninja',
            avatar: 'http://lorempixel.com/output/people-q-c-100-100-7.jpg'
        },

    ];
    var answerTimeout, isFocused;

    // Initialize Messages
    var myMessages = myApp.messages('.messages');

    // Initialize Messagebar
    var myMessagebar = myApp.messagebar('.messagebar');

    $$('.messagebar a.send-message').on('touchstart mousedown', function () {
        isFocused = document.activeElement && document.activeElement === myMessagebar.textarea[0];
    });
    $$('.messagebar a.send-message').on('click', function (e) {
        // Keep focused messagebar's textarea if it was in focus before
        if (isFocused) {
            e.preventDefault();
            myMessagebar.textarea[0].focus();
        }
        var messageText = myMessagebar.value();
        if (messageText.length === 0) {
            return;
        }
        // Clear messagebar
        myMessagebar.clear();

        // Add Message
        myMessages.addMessage({
            text: messageText,
            type: 'sent',
            day: !conversationStarted ? 'Today' : false,
            time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
        });
        conversationStarted = true;
        // Add answer after timeout
        if (answerTimeout) clearTimeout(answerTimeout);
        answerTimeout = setTimeout(function () {
            var answerText = answers[Math.floor(Math.random() * answers.length)];
            var person = people[Math.floor(Math.random() * people.length)];
            myMessages.addMessage({
                text: answers[Math.floor(Math.random() * answers.length)],
                type: 'received',
                name: person.name,
                avatar: person.avatar
            });
        }, 2000);
    });
});

/* ===== Pull To Refresh Demo ===== */
myApp.onPageInit('pull-to-refresh', function (page) {
    // Dummy Content
    var songs = ['Yellow Submarine', 'Don\'t Stop Me Now', 'Billie Jean', 'Californication'];
    var authors = ['Beatles', 'Queen', 'Michael Jackson', 'Red Hot Chili Peppers'];
    // Pull to refresh content
    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
    // Add 'refresh' listener on it
    ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            var picURL = 'http://lorempixel.com/88/88/abstract/' + Math.round(Math.random() * 10);
            var song = songs[Math.floor(Math.random() * songs.length)];
            var author = authors[Math.floor(Math.random() * authors.length)];
            var linkHTML = '<li class="item-content">' +
                                '<div class="item-media"><img src="' + picURL + '" width="44"/></div>' +
                                '<div class="item-inner">' +
                                    '<div class="item-title-row">' +
                                        '<div class="item-title">' + song + '</div>' +
                                    '</div>' +
                                    '<div class="item-subtitle">' + author + '</div>' +
                                '</div>' +
                            '</li>';
            ptrContent.find('ul').prepend(linkHTML);
            // When loading done, we need to "close" it
            myApp.pullToRefreshDone();
        }, 2000);
    });
});

/* ===== Sortable page ===== */
myApp.onPageInit('sortable-list', function (page) {
    // Sortable toggler
    $$('.list-block.sortable').on('open', function () {
        $$('.toggle-sortable').text('Done');
    });
    $$('.list-block.sortable').on('close', function () {
        $$('.toggle-sortable').text('Edit');
    });
});

/* ===== Photo Browser Examples ===== */
// Create photoprobsers first:
var photoBrowserPhotos = [
	{
		url: 'img/beach.jpg',
		caption: 'Amazing beach in Goa, India'
	},
    'http://placekitten.com/1024/1024',
    'img/lock.jpg',
    {
        url: 'img/monkey.jpg',
        caption: 'I met this monkey in Chinese mountains'
    },
    {
        url: 'img/mountains.jpg',
        caption: 'Beautiful mountains in Zhangjiajie, China'
    }

];
var photoBrowserStandalone = myApp.photoBrowser({
    photos: photoBrowserPhotos
});
var photoBrowserPopup = myApp.photoBrowser({
    photos: photoBrowserPhotos,
    type: 'popup'
});
var photoBrowserPage = myApp.photoBrowser({
    photos: photoBrowserPhotos,
    type: 'page',
    backLinkText: 'Back'
});
var photoBrowserDark = myApp.photoBrowser({
    photos: photoBrowserPhotos,
    theme: 'dark'
});
var photoBrowserPopupDark = myApp.photoBrowser({
    photos: photoBrowserPhotos,
    theme: 'dark',
    type: 'popup'
});
var photoBrowserLazy = myApp.photoBrowser({
    photos: photoBrowserPhotos,
    lazyLoading: true,
    theme: 'dark'
});
myApp.onPageInit('photo-browser', function (page) {
    $$('.ks-pb-standalone').on('click', function () {
        photoBrowserStandalone.open();
    });
    $$('.ks-pb-popup').on('click', function () {
        photoBrowserPopup.open();
    });
    $$('.ks-pb-page').on('click', function () {
        photoBrowserPage.open();
    });
    $$('.ks-pb-popup-dark').on('click', function () {
        photoBrowserPopupDark.open();
    });
    $$('.ks-pb-standalone-dark').on('click', function () {
        photoBrowserDark.open();
    });
    $$('.ks-pb-lazy').on('click', function () {
        photoBrowserLazy.open();
    });
});

/* ===== Infinite Scroll Page ===== */
myApp.onPageInit('infinite-scroll', function (page) {
    // Loading trigger
    var loading = false;
    // Last loaded index, we need to pass it to script
    var lastLoadedIndex = $$('.infinite-scroll .list-block li').length;
    // Attach 'infinite' event handler
    $$('.infinite-scroll').on('infinite', function () {
        // Exit, if loading in progress
        if (loading) return;
        // Set loading trigger
        loading = true;
        // Request some file with data
        $$.get('infinite-scroll-load.php', {leftIndex: lastLoadedIndex + 1}, function (data) {
            loading = false;
            if (data === '') {
                // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                myApp.detachInfiniteScroll($$('.infinite-scroll'));
            }
            else {
                // Append loaded elements to list block
                $$('.infinite-scroll .list-block ul').append(data);
                // Update last loaded index
                lastLoadedIndex = $$('.infinite-scroll .list-block li').length;
            }
        });
    });
});

/* ===== Notifications Page ===== */
myApp.onPageInit('notifications', function (page) {
    $$('.ks-notification-simple').on('click', function () {
        myApp.addNotification({
            title: 'Framework7',
            message: 'This is a simple notification message with title and message'
        });
    });
    $$('.ks-notification-full').on('click', function () {
        myApp.addNotification({
            title: 'Framework7',
            subtitle: 'Notification subtitle',
            message: 'This is a simple notification message with custom icon and subtitle',
            media: '<i class="icon icon-f7"></i>'
        });
    });
    $$('.ks-notification-custom').on('click', function () {
        myApp.addNotification({
            title: 'My Awesome App',
            subtitle: 'New message from John Doe',
            message: 'Hello, how are you? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut posuere erat. Pellentesque id elementum urna, a aliquam ante. Donec vitae volutpat orci. Aliquam sed molestie risus, quis tincidunt dui.',
            media: '<img width="44" height="44" style="border-radius:100%" src="http://lorempixel.com/output/people-q-c-100-100-9.jpg">'
        });
    });
    $$('.ks-notification-callback').on('click', function () {
        myApp.addNotification({
            title: 'My Awesome App',
            subtitle: 'New message from John Doe',
            message: 'Hello, how are you? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut posuere erat. Pellentesque id elementum urna, a aliquam ante. Donec vitae volutpat orci. Aliquam sed molestie risus, quis tincidunt dui.',
            media: '<img width="44" height="44" style="border-radius:100%" src="http://lorempixel.com/output/people-q-c-100-100-9.jpg">',
            onClose: function () {
                myApp.alert('Notification closed');
            }
        });
    });
});

var username ;
/* ===== Login screen page events ===== */
myApp.onPageInit('login-screen-embedded', function (page) {
	$$('input[name="password"]').on('keypress', function (e) {
	if (e.keyCode == 13)
	{
		console.log('key code is enter/go');
		$$(page.container).find('#sign_in').click();
	}
});

    $$(page.container).find('#sign_in').on('click', function () {
        username = $$(page.container).find('input[name="username"]').val();
        var password = $$(page.container).find('input[name="password"]').val();
        //myApp.alert('Username: ' + username + ', password: ' + password);
      auth_user(username, password);
    });
});

myApp.onPageAfterBack('user-screen', function (page) {


	if(order_items_html.substring(0, 4) === "<li>" || order_items_html.length < 10)
	{
		// make order send button disabled.
		console.log("order_items_html hey:"+order_items_html);	
		$('.clear-btn').attr("disabled", true);
	}
	else{
		console.log('should be enabled!	');
		$('.clear-btn').attr("enabled", true);	
	}
});

myApp.onPageInit('user-screen', function (page) {
	myApp.hideIndicator();
		console.log('indicator el mafrod yendab');
	if(order_items_html.substring(0, 4) === "<li>" || order_items_html.length < 10)
	{
		console.log('order_items_html:'+order_items_html.length);
		// make order send button disabled.
		$('.clear-btn').attr("disabled", true);
	}
	
	else{
		console.log('should be enabled!	');
		$('.clear-btn').attr("disabled", false);	
	}	
	
	if(user === null || user === '' )
	{
		/* below tw lines are commented by sana in 13-november, and replaced  by the belower 2 lines */
		/*if(username.toUpperCase() === "VP OMAR")
		$(".toolbar").show();
	
		if(username.toUpperCase().indexOf("VP") > -1 ||  username.toUpperCase().indexOf("CEO") > -1 )
		$(".toolbar").show();*/

		if(username.toUpperCase().indexOf("CEO") > -1 ) // then show the option: "Floor Orders" in the left menu
		$("#floors_orders_options").show();
	}
	else{
		/*if(user.toUpperCase() === "VP OMAR")
		$(".toolbar").show();	
	
		if(user.toUpperCase().indexOf("VP") > -1 ||  user.toUpperCase().indexOf("CEO") > -1 )
		$(".toolbar").show();	*/
	
		if(user.toUpperCase().indexOf("CEO") > -1 ) // then show the option: "Floor Orders" in the left menu
		$("#floors_orders_options").show();
	}
	get_categories();

	
});

myApp.onPageInit('kitchen-categories', function (page) {
	get_categories();
});

myApp.onPageInit('view-my-orders', function (page) {
	get_recent_orders();
});

myApp.onPageInit('view-my-fav-orders', function (page) {
	get_fav_orders();
});


myApp.onPageInit('view-floor-orders', function (page) {
	get_floor_orders();
});

myApp.onPageInit('change-location', function (page) {
	
	get_user_location();
	//get_floors_kitchen();
	
	
	
	$$('#change_location_button').on('click', function () {
		// get the item checked:
		var list_of_kitchens = $$('.kitchens_radio');
		
		console.log(list_of_kitchens.length);
		
		if(list_of_kitchens.length == 0 )
		myApp.alert(t("User, Kindly choose a proper location, or cancel the operation"));
		
		for (var i = 0 ; i < list_of_kitchens.length ; i++) 
		{
			if(list_of_kitchens[i].checked){
				// compare the checked item with current item
				var str = (list_of_kitchens[i].id).replace("kitchen_", "");
				if(str != myApp.ls.getItem("kitchen_id"))
				{
					// then send ajax request to update the kitchen and return  from the function
				
					$$.post(API_location+'change_kitchen.php', {kitceh_id: str, userid: myApp.ls.getItem("userid")}, function (data) {
					if(data == "OK")
					{
						myApp.ls.setItem("kitchen_id", str);
							myApp.addNotification({
							title: t('Success'),
							message: t('Default ktichen has been changed successfully'),
							hold: 2000
						});
					}
					else{
							myApp.addNotification({
							title: t('Failure'),
							message: t('something went worng, please try again later'),
							hold: 2000
						});
					}
					
					page.view.router.back({url: 'user-screen.html',force: true,ignoreCache: true});
					
					});
				}
				return ;
			}
		}
		
		
		
	});

});



myApp.onPageInit('complete-register', function (page) {

	// should get buildings
	// should also get the 
	get_buildings_T();

	$$('#complete_registration_button').on('click', function () {
	// this must send ajax to save on DB the info 
	// and then act like auhenticaate user	
	
	console.log('user:'+ user);
	
	
	
	var list_of_kitchens = $$('.kitchens_radio');
		
		var kid = -1;
		if(list_of_kitchens.length == 0 )
		myApp.alert(t("User, Kindly choose a proper location, or cancel the operation"));
		
		for (var i = 0 ; i < list_of_kitchens.length ; i++) 
		{
			if(list_of_kitchens[i].checked){
				// compare the checked item with current item
				kid = (list_of_kitchens[i].id).replace("kitchen_", "");
				//break;
			}
		}
		
		if(kid == -1 )
		{
			myApp.alert(t("User, Kindly choose a proper location, or cancel the operation"));
		}
		else{
			console.log('kitchen:'+kid);
		
			$$.ajax({
			type: "POST",
			url: API_location+"update_user.php",
		    data: {"username": user, "kid":kid},
			success: user_updated,
			fail: failedajax,
			dataType: "text"
			});
		}
		
	function user_updated(data){
		// hone sawwi kaeenak raje3 mn auth user
		console.log('user is updated');
		
		myApp.ls.setItem("user", user);
				
		var response = data.split(',');
		var userid = response[0];
		var kitchen_id = response[1];
		var arabic_name = response[2];
		
		myApp.ls.setItem("userid", userid);
		myApp.ls.setItem("kitchen_id", kitchen_id);
		myApp.ls.setItem("user_ar", arabic_name);
		//user = username ;
		
		regsiter_device_push(userid, 'user');
		myApp.alert(t('Welcome ') + username, function () {
			mainView.router.loadPage('user-screen.html');
		});
		
	}
	
	});
	
});

function get_buildings_T(){
	
	
	console.log('im here');
	$.ajax({
			type: "POST",
			url: API_location+"get_buildings.php",
		    data: {"lang": myApp.ls.getItem("lang")},
			success: list_buildings,
			fail: failedajax,
			dataType: "JSON"
		});
	function list_buildings(data){
	console.log('suceess callback');
		var buildings = data ;
		
		
		var building_name ;
		var building_names = [] ;
		for(var i = 0 ; i < buildings.length ; i++)
			building_names.push(buildings[i]["name"]); 
		
		
		var building_ids = [] ;
		for(var i = 0 ; i < buildings.length ; i++)
			building_ids.push(buildings[i]["id"]); 
		
		
		if(buildings.length > 1 )
		{
			var picker_val;// = building_id ;
			var pickerDevice3 = myApp.picker({
			input: '#available_buildings_T',
			value:building_ids[0],
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
					get_floors_T(p.value.toString());
					$$('#available_kitchens_T').html('');
				}
			},
			cols: [
					{
						textAlign: 'center',
						value: building_ids[0],
						displayValue: building_names[0] ,
			
						values: building_ids,
						displayValues: building_names						
					}
				]
			});
		}
	}
}
function get_floors_T(bid){
	$$('#available_floors_T').html('');
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
		$$('#available_floors_T').html('');
		
		$$('#no_building_floors').hide();
		$$('#loading_floors').hide();
	
	if(data != ""){
		var floors = data ;
		var list_item ;
			for (var i = 0 ; i < floors.length ; i++) {
				list_item = 
				'			<li onclick="get_kitchens_T('+floors[i].id+')"> <label class="label-radio item-content">'+
						  '<input type="radio" class="floors_radio" id="floor_'+floors[i].id+'"  name="ks-radio-floors" value="'+floors[i].name+'" ';
						  
				list_item += '/>'+
						  '<div class="item-inner">'+
							'<div class="item-title">'+floors[i].name+'</div>'+
						  '</div>'+
						'</label></li>';

				$$('#available_floors_T').append(list_item);
			} //end for
		}
		
		else{
		$$('#no_building_floors').show();
		}
	}
	
}
function get_kitchens_T(fid){
	console.log('in getting kitchens for this floor..');
	$$.ajax({
			type: "POST",
			url: API_location+"get_floor_kitchens.php",
		    data: {"fid": fid, "lang": myApp.ls.getItem("lang")},
			success: list_floor_kitchens,
			fail: failedajax,
			dataType: "JSON"
		});
	
	$$('#available_kitchens_T').html('');
	$$('#no_floor_kitchens').hide();
	$$('#loading_kitchens').show();
	
	function list_floor_kitchens(data){
		$$('#available_kitchens_T').html('');
		$$('#no_floor_kitchens').hide();
		$$('#loading_kitchens').hide();
		if(data != ""){
		var kitchens_T = JSON.parse(data) ;
		var list_item ;
		console.log('number of kitchens: '+kitchens_T.length);
			for (var i = 0 ; i < kitchens_T.length ; i++) {
				list_item = 
				'			<li> <label class="label-radio item-content">'+
						  '<input type="radio" class="kitchens_radio" id="kitchen_'+kitchens_T[i].id+'" name="ks-radio-kitchen" value="'+kitchens_T[i].name+'" ';
						  
						  if(kitchens_T[i].id == myApp.ls.getItem("kitchen_id"))
								list_item +=  'checked="checked"' ;
						  
				list_item += '/>'+
						  '<div class="item-inner">'+
							'<div class="item-title">'+kitchens_T[i].name+'</div>'+
						  '</div>'+
						'</label></li>';

				$$('#available_kitchens_T').append(list_item);
			} //end for
		
		}
		else{
		$$('#no_floor_kitchens').show();
		}
	}		

	
}

myApp.onPageInit('switch-language', function (page) {
	var  current_lang = myApp.ls.getItem("lang");
		$$('#'+current_lang).prop("checked", true);
	$$('#switch_language_button').on('click', function () {
		if($$('#en').prop("checked") && current_lang !== "en")
		{
			myApp.ls.setItem("lang", "en");
			console.log("back to previus/main page and switch layout direction from rtl to lrt");
			
			//mainView.router.loadPage('index.html');
			window.location = "index.html"; //.reload();
			//onDeviceReady();//mainView.router.loadPage('index.html');
		}
		if($$('#ar').prop("checked") && current_lang !== "ar")
		{
			myApp.ls.setItem("lang", "ar");
			console.log("back to previus/main page and switch layout direction from ltr to rtl");
			
			//mainView.router.loadPage('index.html');
			window.location = "index.html";
			//onDeviceReady();//mainView.router.loadPage('index.html');
		}
		mainView.router.back();
	});
});

myApp.onPageInit('about', function (page) {
	$('#divv').height(function(index, height) {
		console.log('height test:'+window.innerHeight - $(this).offset().top);
    return window.innerHeight - $(this).offset().top;
	});
});

/* ===== Login screen page events ===== */
myApp.onPageInit('proceed_kitchen', function (page) {
	$$('input[name="name"]').on('keypress', function (e) {
	if (e.keyCode == 13)
	{
		console.log('key code is enter/go');
		$$(page.container).find('.list-button').click();
	}
	});
	
    $$(page.container).find('.list-button').on('click', function () {
		proceed();
	});
	
	function proceed(){
		console.log('jwwa proceed');
		var kitchen_name = $$(page.container).find('input[name="name"]').val();		
		kitchen_exist(kitchen_name) ;
	
	}
	$$('#enter_kitchen').on('keypress', function (e) {
	if (e.keyCode == 13)
	{
		console.log('tetstsstst');
		proceed();
	}
});

});
$$('.login-screen').find('.list-button').on('click', function () {
    var username = $$('.login-screen').find('input[name="username"]').val();
    var password = $$('.login-screen').find('input[name="password"]').val();
    myApp.alert('Username: ' + username + ', password: ' + password, function () {
        myApp.closeModal('.login-screen');
    });
});

/* ===== Demo Popover ===== */
$$('.popover a').on('click', function () {
    myApp.closeModal('.popover');
});

/* ===== Color themes ===== */
myApp.onPageInit('color-themes', function (page) {
    var themes = 'theme-white theme-black theme-yellow theme-red theme-blue theme-green theme-pink theme-lightblue theme-orange theme-gray';
    var layouts = 'layout-dark layout-white';
    $$(page.container).find('.ks-color-theme').click(function () {
        $$('body').removeClass(themes).addClass('theme-' + $$(this).attr('data-theme'));
    });
    $$(page.container).find('.ks-layout-theme').click(function () {
        $$('body').removeClass(layouts).addClass('layout-' + $$(this).attr('data-theme'));
    });
});

/* ===== Virtual List ===== */
myApp.onPageInit('virtual-list', function (page) {
    // Generate array with 10000 demo items:
    var items = [];
    for (var i = 0; i < 10000; i++) {
        items.push({
            title: 'Item ' + i,
            subtitle: 'Subtitle ' + i
        });
    }

    // Create virtual list
    var virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
        // Pass array with items
        items: items,
        // Custom search function for searchbar
        searchAll: function (query, items) {
            var found = [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].title.indexOf(query) >= 0 || query.trim() === '') found.push(i);
            }
            return found; //return array with mathced indexes
        },
        // List item Template7 template
        template: '<li>' +
                    '<a href="#" class="item-link item-content">' +
                      '<div class="item-inner">' +
                        '<div class="item-title-row">' +
                          '<div class="item-title">{{title}}</div>' +
                        '</div>' +
                        '<div class="item-subtitle">{{subtitle}}</div>' +
                      '</div>' +
                    '</a>' +
                  '</li>',
        // Item height
        height: 63,
    });
});
/* ===== Swiper Two Way Control Gallery ===== */
myApp.onPageInit('swiper-gallery', function (page) {
    var swiperTop = myApp.swiper('.ks-swiper-gallery-top', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 10
    });
    var swiperThumbs = myApp.swiper('.ks-swiper-gallery-thumbs', {
        slidesPerView: 'auto',
        spaceBetween: 10,
        centeredSlides: true,
        touchRatio: 0.2,
        slideToClickedSlide: true
    });
    swiperTop.params.control = swiperThumbs;
    swiperThumbs.params.control = swiperTop;
});
/* ===== Calendar ===== */
myApp.onPageInit('calendar', function (page) {
    // Default
    var calendarDefault = myApp.calendar({
        input: '#ks-calendar-default',
    });
    // With custom date format
    var calendarDateFormat = myApp.calendar({
        input: '#ks-calendar-date-format',
        dateFormat: 'DD, MM dd, yyyy'
    });
    // With multiple values
    var calendarMultiple = myApp.calendar({
        input: '#ks-calendar-multiple',
        dateFormat: 'M dd yyyy',
        multiple: true
    });
    // Range Picker
    var calendarRange = myApp.calendar({
        input: '#ks-calendar-range',
        dateFormat: 'M dd yyyy',
        rangePicker: true
    });
    // Inline with custom toolbar
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August' , 'September' , 'October', 'November', 'December'];
    var calendarInline = myApp.calendar({
        container: '#ks-calendar-inline-container',
        value: [new Date()],
        weekHeader: false,
        toolbarTemplate:
            '<div class="toolbar calendar-custom-toolbar">' +
                '<div class="toolbar-inner">' +
                    '<div class="left">' +
                        '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' +
                    '</div>' +
                    '<div class="center"></div>' +
                    '<div class="right">' +
                        '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' +
                    '</div>' +
                '</div>' +
            '</div>',
        onOpen: function (p) {
            $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
            $$('.calendar-custom-toolbar .left .link').on('click', function () {
                calendarInline.prevMonth();
            });
            $$('.calendar-custom-toolbar .right .link').on('click', function () {
                calendarInline.nextMonth();
            });
        },
        onMonthYearChangeStart: function (p) {
            $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
        }
    });
});



/* ===== Progress Bars ===== */
myApp.onPageInit('progressbar', function (page) {
    $$('.ks-demo-progressbar-inline .button').on('click', function () {
        var progress = $$(this).attr('data-progress');
        var progressbar = $$('.ks-demo-progressbar-inline .progressbar');
        myApp.setProgressbar(progressbar, progress);
    });
    $$('.ks-demo-progressbar-load-hide .button').on('click', function () {
        var container = $$('.ks-demo-progressbar-load-hide p:first-child');
        if (container.children('.progressbar').length) return; //don't run all this if there is a current progressbar loading

        myApp.showProgressbar(container, 0);

        // Simluate Loading Something
        var progress = 0;
        function simulateLoading() {
            setTimeout(function () {
                var progressBefore = progress;
                progress += Math.random() * 20;
                myApp.setProgressbar(container, progress);
                if (progressBefore < 100) {
                    simulateLoading(); //keep "loading"
                }
                else myApp.hideProgressbar(container); //hide
            }, Math.random() * 200 + 200);
        }
        simulateLoading();
    });
    $$('.ks-demo-progressbar-overlay .button').on('click', function () {
        // Add Directly To Body
        var container = $$('body');
        if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading

        myApp.showProgressbar(container, 0);

        // Simluate Loading Something
        var progress = 0;
        function simulateLoading() {
            setTimeout(function () {
                var progressBefore = progress;
                progress += Math.random() * 20;
                myApp.setProgressbar(container, progress);
                if (progressBefore < 100) {
                    simulateLoading(); //keep "loading"
                }
                else myApp.hideProgressbar(container); //hide
            }, Math.random() * 200 + 200);
        }
        simulateLoading();
    });
    $$('.ks-demo-progressbar-infinite-overlay .button').on('click', function () {
        // Add Directly To Body
        var container = $$('body');
        if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
        myApp.showProgressbar(container);
        setTimeout(function () {
            myApp.hideProgressbar();
        }, 3000);
    });
    $$('.ks-demo-progressbar-infinite-multi-overlay .button').on('click', function () {
        var container = $$('body');
        if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
        myApp.showProgressbar(container, 'multi');
        setTimeout(function () {
            myApp.hideProgressbar();
        }, 3000);
    });
});

/* ===== Autocomplete ===== */
myApp.onPageInit('autocomplete', function (page) {
    // Fruits data demo array
    var fruits = ('Apple Apricot Avocado Banana Melon Orange Peach Pear Pineapple').split(' ');

    // Simple Dropdown
    var autocompleteDropdownSimple = myApp.autocomplete({
        input: '#autocomplete-dropdown',
        openIn: 'dropdown',
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });

    // Dropdown with input expand
    var autocompleteDropdownExpand = myApp.autocomplete({
        input: '#autocomplete-dropdown-expand',
        openIn: 'dropdown',
        expandInput: true, // expand input
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });

    // Dropdown with all values
    var autocompleteDropdownAll = myApp.autocomplete({
        input: '#autocomplete-dropdown-all',
        openIn: 'dropdown',
        source: function (autocomplete, query, render) {
            var results = [];
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });

    // Dropdown with placeholder
    var autocompleteDropdownPlaceholder = myApp.autocomplete({
        input: '#autocomplete-dropdown-placeholder',
        openIn: 'dropdown',
        dropdownPlaceholderText: 'Try to type "Apple"',
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });

    // Dropdown with ajax data
    var autocompleteDropdownAjax = myApp.autocomplete({
        input: '#autocomplete-dropdown-ajax',
        openIn: 'dropdown',
        preloader: true, //enable preloader
        valueProperty: 'id', //object's "value" property name
        textProperty: 'name', //object's "text" property name
        limit: 20, //limit to 20 results
        dropdownPlaceholderText: 'Try "JavaScript"',
        expandInput: true, // expand input
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Show Preloader
            autocomplete.showPreloader();
            // Do Ajax request to Autocomplete data
            $$.ajax({
                url: 'js/autocomplete-languages.json',
                method: 'GET',
                dataType: 'json',
                //send "query" to server. Useful in case you generate response dynamically
                data: {
                    query: query
                },
                success: function (data) {
                    // Find matched items
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
                    }
                    // Hide Preoloader
                    autocomplete.hidePreloader();
                    // Render items by passing array with result items
                    render(results);
                }
            });
        }
    });

    // Simple Standalone
    var autocompleteStandaloneSimple = myApp.autocomplete({
        openIn: 'page', //open in page
        opener: $$('#autocomplete-standalone'), //link that opens autocomplete
        backOnSelect: true, //go back after we select something
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        },
        onChange: function (autocomplete, value) {
            // Add item text value to item-after
            $$('#autocomplete-standalone').find('.item-after').text(value[0]);
            // Add item value to input value
            $$('#autocomplete-standalone').find('input').val(value[0]);
        }
    });

    // Standalone Popup
    var autocompleteStandalonePopup = myApp.autocomplete({
        openIn: 'popup', //open in page
        opener: $$('#autocomplete-standalone-popup'), //link that opens autocomplete
        backOnSelect: true, //go back after we select something
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        },
        onChange: function (autocomplete, value) {
            // Add item text value to item-after
            $$('#autocomplete-standalone-popup').find('.item-after').text(value[0]);
            // Add item value to input value
            $$('#autocomplete-standalone-popup').find('input').val(value[0]);
        }
    });

    // Multiple Standalone
    var autocompleteStandaloneMultiple = myApp.autocomplete({
        openIn: 'page', //open in page
        opener: $$('#autocomplete-standalone-multiple'), //link that opens autocomplete
        multiple: true, //allow multiple values
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        },
        onChange: function (autocomplete, value) {
            // Add item text value to item-after
            $$('#autocomplete-standalone-multiple').find('.item-after').text(value.join(', '));
            // Add item value to input value
            $$('#autocomplete-standalone-multiple').find('input').val(value.join(', '));
        }
    });

    // Standalone With Ajax
    var autocompleteStandaloneAjax = myApp.autocomplete({
        openIn: 'page', //open in page
        opener: $$('#autocomplete-standalone-ajax'), //link that opens autocomplete
        multiple: true, //allow multiple values
        valueProperty: 'id', //object's "value" property name
        textProperty: 'name', //object's "text" property name
        limit: 50,
        preloader: true, //enable preloader
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Show Preloader
            autocomplete.showPreloader();
            // Do Ajax request to Autocomplete data
            $$.ajax({
                url: 'js/autocomplete-languages.json',
                method: 'GET',
                dataType: 'json',
                //send "query" to server. Useful in case you generate response dynamically
                data: {
                    query: query
                },
                success: function (data) {
                    // Find matched items
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
                    }
                    // Hide Preoloader
                    autocomplete.hidePreloader();
                    // Render items by passing array with result items
                    render(results);
                }
            });
        },
        onChange: function (autocomplete, value) {
            var itemText = [],
                inputValue = [];
            for (var i = 0; i < value.length; i++) {
                itemText.push(value[i].name);
                inputValue.push(value[i].id);
            }
            // Add item text value to item-after
            $$('#autocomplete-standalone-ajax').find('.item-after').text(itemText.join(', '));
            // Add item value to input value
            $$('#autocomplete-standalone-ajax').find('input').val(inputValue.join(', '));
        }
    });
});

/* ===== Change statusbar bg when panel opened/closed ===== */
$$('.panel-left').on('open', function () {
    $$('.statusbar-overlay').addClass('with-panel-left');
});
$$('.panel-right').on('open', function () {
    $$('.statusbar-overlay').addClass('with-panel-right');
});
$$('.panel-left, .panel-right').on('close', function () {
    $$('.statusbar-overlay').removeClass('with-panel-left with-panel-right');
});

function reload_page(pageurl){
	//mainView.router.loadPage(pageurl);
	
	if(pageurl === 'kitchen-screen.html')
	clearInterval(refresh_page);
	
	mainView.router.refreshPage({ url: pageurl, animatePages: false });
	//mainView.router.refreshPage(pageurl, animatePages: false);
}
	
/* ===== Generate Content Dynamically ===== */
var dynamicPageIndex = 0;
function createContentPage() {
    mainView.router.loadContent(
        $$('<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left sliding"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-content" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or generate <a href="#" class="ks-generate-page">one more page</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>')
    );
    return;
}
$$(document).on('click', '.ks-generate-page', createContentPage);

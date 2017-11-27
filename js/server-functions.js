var id ;
var type ;
var device_type ;
function regsiter_device_push(user_id, user_type){
	alert('in register device!');
		if(window.isphone){   // if app is not loaded on web view then it is on mobile
		alert(" deviceType:"+deviceType);
		// check what mobile platofrm this app is loadded on:
		//if android :
		if (deviceType == 'android' || deviceType == 'Android') 
		{
			device_type = "android";
			try 
				{ 
					id = user_id ;
					type = user_type ;
				
					//alert('registering device...');
					pushNotification = window.plugins.pushNotification;
					pushNotification.register(successHandler, errorHandler, {"senderID":android_sender_id,"ecb":"onNotificationGCM"});		// required!
			
				}
				catch(err) 
				{ 
					var txt="An error occured\n\n"; 
					txt+="Description: " + err.message + "\n\n"; 
					//alert(txt); 
				}
		}
		else{				
				device_type = "ios";
				try 
				{ 
					alert('registering device...');
					pushNotification = window.plugins.pushNotification;
					pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});	// required!
					id = user_id ;
					type = user_type ;
				}
				catch(err) 
				{ 
					var txt="An error occured\n\n"; 
					txt+="Description: " + err.message + "\n\n"; 
					alert(txt); 
				} 
			}
		}
	}
	
	 function tokenHandler (result) {
		// Your iOS push server needs to know the token before it can push to this device
		// here is where you might want to send it the token for later use.
		//alert('device token:'+result);
		//alert('user:'+user);
		//if(user === null || user === '' )
		//regsiter_device_onserver(result);
		
		//if(user === null || user === '' )
			alert('saved device id:'+myApp.ls.getItem("device_id"));
		if(myApp.ls.getItem("device_id") === null || myApp.ls.getItem("user") === '' )
		{
			regsiter_device_onserver(result);
			myApp.ls.setItem("device_id", result);
		}
		
		user = myApp.ls.getItem("user");  
	}
	
	function errorHandler (error) {
     	alert('error:'+ error );
	}
	 function successHandler (result) {
      	alert('success:'+ result );
	}
	
// handle APNS notifications for iOS
	function onNotificationAPN(e) {
		//alert('in on notifcation');
		//myApp.alert(JSON.stringify(e));
		
		// HERE a DELIVERY REPORT MUST BE SENT
		console.log(e.orderId);
		// call update status with the order id paramter!
		set_delivered(e.orderId);
		
		if (e.sound) {
                    // playing a sound also requires the org.apache.cordova.media plugin
                    var snd = new Media(e.sound);
                    snd.play();
                }
		if (e.foreground == 1)
		{
			myApp.addNotification({
				title: e.title,
				message: e.body,
				hold: 5000
			});
			if(user === 'kitchen' ) // just refresh the page to have the recently added order insluded.
			{
				if(active_tab === '#tab1') 
					//reload_page('kitchen-screen.html');
				get_orders();
				else new_order_to_kitchen = 1 ;
				//reload_page('kitchen-screen.html');
			}
			 if (e.sound) {
                    // playing a sound also requires the org.apache.cordova.media plugin
                    var snd = new Media(e.sound);
                    snd.play();
                }
		}
		else// background or closed cases:
		{
			if(user === 'kitchen' )
			{
				active_tab = '#tab1' ;
				//mainView.router.loadPage('kitchen-screen.html');
				reload_page('kitchen-screen.html');
			}
			else // for users, no need to do anytihng in my opinion ! lol
			{
				//mainView.router.loadPage('user-screen.html');
			}
		}        
	}	

	// handle GCM notifications for Android
	function onNotificationGCM(e) {
		//myApp.alert(JSON.stringify(e));
		
		//alert("event:"+e.event);
			
		switch( e.event )
		{
			case 'registered':
			if ( e.regid.length > 0 )
			{
				// Your GCM push server needs to know the regID before it can push to this device
				// here is where you might want to send it the regID for later use.
				console.log(JSON.stringify(e));
				console.log("regID = " + e.regid);
				
				//if(user === null || user === '' )
				if(myApp.ls.getItem("device_id") === null || myApp.ls.getItem("user") === '' )
				{
					regsiter_device_onserver(e.regid);
					myApp.ls.setItem("device_id", e.regid);
				}
				user = myApp.ls.getItem("user");
	    
			}
			break;
			
			case 'message':
				// if this flag is set, this notification happened while we were in the foreground.
				if (e.foreground)
				{
					//myApp.alert("forground notifcation!");
					myApp.addNotification({
						title: e.payload.title,
						message: e.payload.message,
						hold: 5000
					});
					if(user === 'kitchen' ) // just refresh the page to have the recently added order insluded.
					{
						if(active_tab === '#tab1') 
							//reload_page('kitchen-screen.html');
						get_orders();
						else new_order_to_kitchen = 1 ;
						//reload_page('kitchen-screen.html');
					}
					 if (e.payload.sound) {
							// playing a sound also requires the org.apache.cordova.media plugin
							var snd = new Media("/android_asset/www/"+ e.payload.soundname);
							snd.play();
						}
				}
				else
				{	// otherwise we were launched because the user touched a notification in the notification tray.
					//notification = 'yes';
					if (e.coldstart)
					{
						if(user === 'kitchen' )
						{
							active_tab = '#tab1' ;
							//mainView.router.loadPage('kitchen-screen.html');
							reload_page('kitchen-screen.html');
						}
						else // for users, no need to do anytihng in my opinion ! lol
						{
							//mainView.router.loadPage('user-screen.html');
						}
					}
					else
					{
					}
				}
			break;
			
			case 'error':
				console.log("ERROR -> MSG:" + e.msg);
				//$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
			break;
			
			default:
				console.log("EVENT -> Unknown, an event was received and we do not know what it is");
				//$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
			break;
		}
	}
			
			
	function regsiter_device_onserver(device_id){
		// send an ajax request to the server, to add new user
		//alert('sending paramters to server:');
		//alert(id+' , '+type+' , '+device_id);
		$$.ajax({
		  type: 'POST',
		  url: API_location+"regsiter_device.php",
		  data: {"id": id, "table": type, "device_id": device_id, "device_type": device_type },
		  success: saved_user,
		  dataType: 'text'
		});
	}
	
	function saved_user(data){
		//myApp.alert("saved user ersult:"+data);
		if(data == "1")
			myApp.addNotification({
				title: 'STC E-Menu App Says',
				message: 'Your device has been added to our server database :) ',
				hold: 3000
			});
		else
				myApp.addNotification({
				title: 'STC E-Menu App Says',
				message: 'Failed to register your device :( ',
				hold: 3000
			});
		
	}
   
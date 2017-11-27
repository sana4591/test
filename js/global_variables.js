var user ;

// local URL:
//var root = "http://localhost/STC/";

// Template doctors (testing) URL:
var root = "http://templatedoctors.com/stcemenuapp/release/" ;

// STC Server URL:
//var root = "http://emenu.stc.com.sa/stcemenuapp/release/";



var API_location = root + "APIS/";
var items_thumb_location = root  + "items_thumbnails/";
var categs_thumb_location = root  + "categs_thumbnails/";

var active_tab = '#tab1' ;
var category_selected = '';
var categories_json = [];// =  [{"id":"1","name":"Hot drinks"},{"id":"2","name":"Cold drinks"},
					//	{"id":"3","name":"Mixed fruits"},{"id":"4","name":"Breakfast"},
					//	{"id":"5","name":"Dates"},{"id":"6","name":"Insence"},{"id":"7","name":"Services"}];
						
var category_description_word = {"Hot drinks":"cup","Cold drinks":"glass","Mixed fruits":"person",
								  "Breakfast":"person","Dates":"person","Insence":"person", "Services":"man"};

var category_description_word_plural = {"Hot drinks":"cups","Cold drinks":"glasses","Mixed fruits":"persons",
								  "Breakfast":"persons","Dates":"persons","Insence":"persons", "Services":"men"};

var order_obj = new Object();
var  pushNotification ;
var new_order_to_kitchen = 0 ;
var order_items = [] ;
var order_items_html = "<li>no items are added yet</li>";
var kitchens ;//=  ['IT VP Kitchen', 'Kitchen 3'] ;
var locations;// = ['CEO Office', 'GCEO Main Meeting Room', 'CEO Small Meeting Room', 'GCEO GM Office', 'GCEO operation office',
				//'GCEO Waiting Area', 'GCEO Guest Room', 'GCEO Secretary', 'GCEO IT'];
				
/*var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';
	*/
var internet =  1 ;	
var orders_ids_limit = 5 ;
var user_orders_ids = new Array() ;
var refresh_page ;

var language ;

var deviceType ;
var android_sender_id = "164560008203" ;
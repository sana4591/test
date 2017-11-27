var app_trans = angular.module("myApp_ng",['pascalprecht.translate']);

app_trans.config(["$translateProvider",function($translateProvider){
  
  var en_translations = {
    "Options" : "Options",
    "My Recent orders" : "My Recent orders",
    "My favourite orders" : "My favourite orders",
    "My favourite items" : "My favourite items",
    "Frequently used items" : "Frequently used items",
    "Floor orders" : "Floor orders",
    "My Kitchen" : "My Kitchen",
    "My Location" : "My Location",
   
   "Feedback" : "Feedback",
    "Switch language" : "Switch language",
	"Logout" : "Logout",
	
    "Welcome to STC E-Menu" : "Welcome to STC E-Menu",
    "Back to Room Control APP" : "Back to Room Control APP",
	
	"Back" : "Back"
  }
  
  var ar_translations = {
     "Options" : "خيارات",
     "My Recent orders" : "طلباتي",
    "My favourite orders" : "طلباتي المفضلة",
    "My favourite items" : "الأصناف المفضلة",
    "Frequently used items" : "الأصناف المستخدمة كثيرا",
    "Floor orders" : "طلبات الآخرين",
    "My Kitchen" : "مطبخي",
    "My Location" : "مكاني",
    "Feedback" : "تغذية راجعة",
    "Switch language" : "تغيير اللغة",
	"Logout" : "تسجيل خروج",
	
    "Welcome to STC E-Menu" : "أهلا بك في تطبيق STC E-Menu",
    "Back to Room Control APP" : "الرجوع إلى Room Control APP",
	
	"Back" : "رجوع"
  }
  
  $translateProvider.translations('en',en_translations);
  
  $translateProvider.translations('ar',ar_translations);
  
  $translateProvider.preferredLanguage(myApp.ls.getItem("lang"));
  
}]);

app_trans.controller("translateController" ,["$scope","$translate",function($scope,$translate){
  $scope.changeLanguage = function(lang){
	 $translate.use(lang); 
  }
  
}]);


/**
 * Controller for the home page(index.html)
 * Creates angular module named sample-app
 * Configures app with $routeProvider and $httpProvider
 * manages menus on home pages view using spa-home directive 
 */

//Creates angular module 
var app = angular.module("sample-app", [
	'ngRoute',
	'ngResource',
	'ngCookies',
	'ui.bootstrap',
	'spaHome',
	'alertManager',
	'spinnerDirective',
	'minMaxDateDirective']);

// configure app condtants
instantiateConstants(app);

// define controller
app.controller("homeController",
	["$rootScope",
	 "$scope",
	 "$location",
	 "$resource",
	 "$routeParams",
	 function($rootScope,
			 $scope,
			 $location, 
			 $resource,
			 $routeParams) {
		var self = this;
		self.homePageNavigator = function (hrefData) {
			if(hrefData.isHome){
				self.updateHomeNavigationScope({}, hrefData.href);
			}
			$location.path(hrefData.href);
		}

		self.updateHomeNavigationScope = function(userBean, pathName) {
			var navigationScope = undefined;
			if((pathName == "" || pathName == "logout") &&  userBean == null){
				sessionStorage.clear();
			}
			if (userBean != undefined) {
				self.user = userBean;
				navigationScopeApi = $resource($rootScope.API_URL + "/navigationScope/"+ pathName);
				navigationScope = navigationScopeApi.get(null, function(data) {
					navigationScope = data;
					console.log('navigationScope from REST server');
					console.log(navigationScope);
					processNavigationScope(self, navigationScope);
				});
			} else {
				processNavigationScope(self, null);
			}
		}
		self.updateHomeNavigationScope();

		$scope.setUserType = function(userType){
			switch(userType){
			case 'admin' :
				$scope.userType = 0;
				break;
			}
		}

		$scope.Date = function(arg){
			   return new Date(arg);
		};
		
		function BannerHeader(primary, secondary) {
			this.primary = primary;
			this.secondary = secondary;
		}

		//brandNameContents - can be simple string or html tag for the image of the brand.
		function BrandingData(brandNameContents, href) {
			this.brandNameContents = brandNameContents;
			this.href = href;
		}

		function navigationScopeBean(){
			self.leftNavBarConents = [];
			self.rightNavBarConents = [];
			self.leftNavBarConents = [];
		}
		
		function processNavigationScope(self, navigationScope){
			if (navigationScope == undefined) {
				self.leftNavBarConents = angular.isUndefined(sessionStorage.leftNavBarConents) ? undefined : JSON.parse(sessionStorage.leftNavBarConents);
				self.rightNavBarConents = angular.isUndefined(sessionStorage.rightNavBarConents) ? undefined : JSON.parse(sessionStorage.rightNavBarConents);
				self.menuTreeNodes = angular.isUndefined(sessionStorage.menuTreeNodes) ? undefined : JSON.parse(sessionStorage.menuTreeNodes);
				self.favorites = angular.isUndefined(sessionStorage.favorites) ? undefined : JSON.parse(sessionStorage.favorites);
			}
			else {
				if(navigationScope.leftNavBarConents != undefined){
					self.leftNavBarConents = navigationScope.leftNavBarConents;	
					sessionStorage.leftNavBarConents = JSON.stringify(self.leftNavBarConents);
				}
				if(navigationScope.menuTreeNodes != undefined){
					self.menuTreeNodes = navigationScope.menuTreeNodes;
					sessionStorage.menuTreeNodes = JSON.stringify(self.menuTreeNodes);
				}
				if(navigationScope.rightNavBarConents != undefined){
					self.rightNavBarConents = navigationScope.rightNavBarConents;
					sessionStorage.rightNavBarConents = JSON.stringify(self.rightNavBarConents);
				}
				if(navigationScope.favorites != undefined){
					self.favorites = navigationScope.favorites;
					sessionStorage.favorites = JSON.stringify(self.favorites);
				}
			}
			// get the all the data/strings/menus required for the home page
			self.bannerHeader = new BannerHeader("Sample application", "this is sample application");
			self.brandingData = new BrandingData("SVCPL", "#");
		}
}]);

/*
 * resolve needs to be used to configure access of the protected pages.
 * before accessing that page, a resolve would be called to ensure the page is accessible.
 * though, the resolve seems to be the second level of protection...
 * as the un-autherised user wouldn't get protected view listed in his home-page-navigation-scope.
 * so the resolve serves as way to authenticate manually tampered URL.
 *
 * part of this should be auto generated, because it models the exact same structure as we maintain for our static resources
 * */
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	console.log($locationProvider.html5Mode());
	$locationProvider.hashPrefix('');
	$routeProvider.
		when('/', {
			// this is an odd man out, the route that is not from menu structure...
			// this is intentional, because it doesn't fit in menu structure.
			templateUrl: "routes/login/login.html",
			controller: "loginController",
			controllerAs: "loginCtrl"
		})
		// we use login page and its controller to end the session maintained on client
		// so when the page is navigated by this route, with parameter as doLogout, the controller ends the session.
		.when('/login', {
			templateUrl: "routes/login/login.html",
			controller: "loginController",
			controllerAs: "loginCtrl",
			doLogout: 'true'
		})
		.otherwise({redirectTo: '/'});
}]);

// configure $httpProvider to msnge user session and add authorisation header to all requests if access token set in cookies
app.config(function($httpProvider) {
	$httpProvider.interceptors.push(function($q, $rootScope, $injector, $cookies, $location) {
		return {
			//For each request the interceptor will set the bearer token header.
	        request: function($config) {
	            //Fetch token from cookie
	            var token=$cookies.get('access_token');
	            if(token != undefined){
	            	//	set authorization header
	            	$config.headers['Authorization'] = 'Bearer '+token;
	            }
	            return $config;
	        },
			responseError : function(rejection) {
				// check if response error is not due to unAuthorised access i.e code 401
				if (rejection.status == 401) {
					$rootScope.sessionExpired = true;
					$location.path("/");
				}
				return $q.reject(rejection);
			}
		};
	});
});
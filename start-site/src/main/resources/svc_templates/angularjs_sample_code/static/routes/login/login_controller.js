var app = angular.module("sample-app");
app.controller("loginController",
		["login_api",
			"$location",
     	    "$route",
			"$scope",
			"$rootScope",
			"$resource",
	function(login_api,
			$location,
			$route,
			$scope,
			$rootScope,
			$resource) {
		var self = this;
		var isLogout = $route.current.$$route.doLogout;
		console.log(isLogout);
		if (isLogout == undefined) {
			self.userBean = {};
			self.userBean.grant_type = "password"
		} else {
			// it means we are redirecting to login page by ending the session.
	    	login_api.logout();
			$scope.$parent.homeCtrl.updateHomeNavigationScope(null, "logout");
		}
		self.doLogin = function() {
			/* Sample code to do authentication using external oauth server
			
			self.userBean.grant_type = "password";
			//getApiUrl contains lcms app support srv api url which is in the application.properties.
			//its the url of the machine where sample-app_srv is running.
			//getOauthAccessTokenUrlResource contains the oauth access token url of application.properties
			//of sample-app_srv. It's the url of the host machine where oauth is running.
			var getApiUrl = $resource(window.origin + "/actuator/dependencies");
			getApiUrl.get().$promise.then(function(data) {
				//setting value of data.LcmsAppSupportSrvApiUrl to $rootScope.API_URL so that it can be globally accessible.
				$rootScope.API_URL = data.LcmsAppSupportSrvApiUrl;
				var getOauthAccessTokenUrlResource = $resource($rootScope.API_URL + "/actuator/dependencies");
				getOauthAccessTokenUrlResource.get().$promise.then(function(data) {
					login_api.obtainAccessToken(self.userBean, data.OAuthAccessTokenUrl).then(function(data){
						if (data) {
							$scope.$parent.homeCtrl.updateHomeNavigationScope(self.userBean, "user_home");
							$location.path("/user_home");
						} else {
							console.log('log in failed!');
						}
					},function (errResponse) {
						self.alertHtml = $sce.trustAsHtml(errResponse.data);
					});
		    	},function(errorResponse) {
		    		console.log("could not get url for OAuth2 access token!");
					self.alertHtml = errorResponse.data;
					console.log(self.alertHtml);
				});
			},function(errorResponse) {
	    		console.log("could not get api url of lcms app support srv!");
				self.alertHtml = errorResponse.data;
				console.log(self.alertHtml);
			});
			*/
			// TODO login authenticatin logic
		}
	}
]);
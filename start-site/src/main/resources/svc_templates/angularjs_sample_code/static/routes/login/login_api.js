var app = angular.module('sample-app');
app.factory('login_api',
		['$q',
			'$http',
			'$httpParamSerializer',
			"$cookies",
			'$rootScope',
			function($q,
					$http,
					$httpParamSerializer,
					$cookies,
					$rootScope){
	return {
		obtainAccessToken : function(params, OauthAccessTokenUrl){
			//Sample code to get authentication done from given oauth server access token url
			/*$cookies.remove("access_token");
		    var req = {
		            method: 'POST',
		            url: OauthAccessTokenUrl,
		            headers: {
		            	"Authorization": "Basic " + btoa("secret-key:password"),
		                "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
		            },
		            data: $httpParamSerializer(params)
		        }
		        return $http(req).then(
		            function(data){
		            	$http.defaults.headers.common.Authorization = 'Bearer ' + data.data.access_token;
		                var expireDate = new Date (new Date().getTime() + (1000 * data.data.expires_in));
		                $cookies.put("access_token", data.data.access_token, {'expires': expireDate});
		                return true;
		            },function(response){
		                console.log("error");
		                console.log(response.data);
		                return false;
		            }
		        )*/
			// TODO code to get authentication done
		},
		logout: function() {
	    	$cookies.remove("access_token");
	    	$http.defaults.headers.common.Authorization = '';
		}
	}
}]);
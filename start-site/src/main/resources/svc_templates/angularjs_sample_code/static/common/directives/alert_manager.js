var theModule = angular.module('alertManager', []);
/*
 * Directive and service to show success, failure, warning alerts
 * The service is used to set messages to be shown and the directive can be used to actually showing the alerts with messages
 * use service's add function to set the message , message type and heading if the message
 *  and use '<bs-alert></bs-alert>' where you to add the alerts
 * */
theModule.factory('alertManagerService', function($rootScope, $sce) {
   $rootScope.alerts = [];
   return{
		add : function(type, heading, msg) {
			$rootScope.alerts.push({
				'type' : type,
				'heading' : heading,
				'message' : $sce.trustAsHtml(msg)
			});
		},
		closeAlert : function(index) {
			$rootScope.alerts.splice(index, 1);
		},
		clear : function() {
			$rootScope.alerts = [];
		}
   }
  });

theModule.directive('bsAlert',['alertManagerService', function(alertManagerService) {
  return {
    template: '<div ng-repeat="alert in $root.alerts">'
    	+'<div ng-class=\'"alert alert-" + alert.type\' style="width:800px">'
    	+'<a class="close" data-dismiss="alert" ng-click="$root.alerts.splice($index, 1);" aria-label="close">&times;</a>'
    	+'<strong>{{alert.heading}}</strong>{{alert.message}}</div>'
    	+'</div>',

    link: function(scope, element, attrs) {
        element.on('$destroy', function() {
        	alertManagerService.clear();
        });
      }
  };
}]);
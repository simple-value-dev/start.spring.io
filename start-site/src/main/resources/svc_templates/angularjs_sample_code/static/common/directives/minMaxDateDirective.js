var theModule = angular.module('minMaxDateDirective', []);

/*
 * these needs to be moved to a separate file, where entire application can use these directives wherever 
 * min/max is needed for dat control
 */
theModule.directive('ngDateMin', function() {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elem, attr, ctrl) {
			scope.$watch(attr.ngDateMin, function() {
				if (ctrl.$isDirty)
					ctrl.$setViewValue(ctrl.$viewValue);
			});

			var minValidator = function(value) {
				var isEmpty = function(value) {
					return angular.isUndefined(value) || value === ""
							|| value === null;
				}

				var granularity = 'minute';
				if (attr.type === "date") {
					granularity = 'day';
				}
				if (!isEmpty(value)
						&& moment(value).isBefore(
								moment(new Date(attr.ngDateMin)))
						&& !moment(value).isSame(
								moment(new Date(attr.ngDateMin)))) {
					ctrl.$setValidity('ngDateMin', false);
					return undefined;
				} else {
					ctrl.$setValidity('ngDateMin', true);
					return value;
				}
				return value;
			};
			ctrl.$parsers.push(minValidator);
			ctrl.$formatters.push(minValidator);
		}
	};
});

theModule.directive('ngDateMax',
		function() {
			return {
				restrict : 'A',
				require : 'ngModel',
				link : function(scope, elem, attr, ctrl) {
					scope.$watch(attr.ngMax, function() {
						if (ctrl.$isDirty)
							ctrl.$setViewValue(ctrl.$viewValue);
					});

					var maxValidator = function(value) {
						var isEmpty = function(value) {
							return angular.isUndefined(value) || value === ""
									|| value === null;
						}

						var granularity = 'minute';
						if (attr.type === "date") {
							granularity = 'day';
						}
						if (!isEmpty(value)
								&& moment(value).isAfter(
										moment(new Date(attr.ngDateMax)),
										granularity)
								&& !moment(value).isSame(
										moment(new Date(attr.ngDateMax)),
										granularity)) {
							ctrl.$setValidity('ngDateMax', false);
							return undefined;
						} else {
							ctrl.$setValidity('ngDateMax', true);
							return value;
						}
					};

					ctrl.$parsers.push(maxValidator);
					ctrl.$formatters.push(maxValidator);
				}
			};
		});

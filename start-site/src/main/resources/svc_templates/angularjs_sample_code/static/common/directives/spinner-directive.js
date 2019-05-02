var theModule = angular.module('spinnerDirective', [ 'angularSpinner' ]);

/*
 * this directive is used to show spinner while a page is loading
 * use <spinner spinner-state="<<EXPERSSION>>"></spinner>
 * the spinner will be shown while <<EXPERSSION>> is truthy
 */
theModule.directive('spinner', [ function() {
	return {
		restrict : 'E',
		scope : {
			spinnerState : '=spinnerState',
			spinnerStyle : '=?spinnerStyle'
		},
		template : '<span ' + ' ng-class="{spinner_backdrop : spinnerState}" '
				+ ' us-spinner="spinnerStyle" '//uses angularSpinner
				+ ' spinner-on="spinnerState">' + '</span>'
	};
} ]);
/**
 * this file defines all the constants needed for this application throughout angularjs code.
 */

function instantiateConstants(app) {
    app.constant('constants', {
        UserType: {
        	'admin' : 0,
        	'userType1' : 1
        },
	    UserTypeToGlossary: {
	    	0 : 'Admin',
	    	1 : 'User type 1'
	    }
    }).run(function ($rootScope, constants) {
        $rootScope.constants = constants;
    });
}


	/**
	 *	Initialize  angular app module with all dependencies
	 */
	var underscore = angular.module('underscore',[])
					.factory('_',['$window', function($window){
						return  $window._;
					}]);


    /**
	 * Create and Register Session Based Authentication Module with Main App module
	 * 
	 */

	var authenticationModule = angular.module('apolloApp.authentication',['ngCookies'])
									 .value('session', Session());


	/**
	 * Create controller independent instance of model data
	 */

	function Session(){
		var session ;
		return session = {
			sessionId : "" ,
			user : {
				email : "",
				name : "" ,
				token : "",
				userType : ""
			},
			isLoggedIn : function(){
				return (session.sessionId !=null);
			}
		}
	}



    /** End Authentication Module */
	var apolloApp = angular.module('apolloApp' , ['ui.router','angularMoment','ui.bootstrap','underscore','ngFileUpload','ngAnimate','toaster','apolloApp.authentication']);

	apolloApp.config(function($stateProvider , $urlRouterProvider,$qProvider){

		//$qProvider.errorOnUnhandledRejections(false);

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home' , {
				url : '/',
				templateUrl :'js/login/login.html'
			})
			.state('create-ticket',{
				url :'/ticket',
				templateUrl : 'js/ticket/ticket.html',
				controller : 'TicketController'

			})
			.state('dashboard',{
				url : '/dashboard',
				templateUrl : 'js/admin/dashboard/dashboard.html',
				controller : 'DashboardController'
			})
			.state('dashboard.location' ,{
				url : '/locationMaster' ,
				templateUrl : 'js/admin/location-master/locationMaster.html',
				controller : 'LocationMasterController'

			})
			.state('dashboard.designation' ,{
				url : '/designationMaster',
				templateUrl : 'js/admin/designation-master/designationMaster.html',
				controller : 'DesignationMasterController'
			})
			.state('dashboard.user' ,{
				url : '/userMaster',
				templateUrl : 'js/admin/user-master/userMaster.html',
				controller : 'UserMasterController'
			})
			.state('dashboard.ticket' ,{
				url : '/user/ticket',
				templateUrl : 'js/user/ticket/ticket.html',
				controller : 'TicketUserController'
			})
			.state('dashboard.ticketDetails' ,{
				url : '/user/ticket/:id',
				templateUrl : 'js/user/ticket/ticketDetail.html',
				controller : 'TicketUserController'
			});
	})
	.run(['$rootScope','$cookieStore','$state','$location',function($rootScope,$cookieStore,$state,$location){
		if($cookieStore.get('apolloUser')){
			$rootScope.user=$cookieStore.get('apolloUser');
			$rootScope.isLoggedIn = true;
		}else{
			$rootScope.user=null;
			$rootScope.isLoggedIn = false;
		}

		// enumerate routes that don't need authentication
  		var routesThatDontRequireAuth = ['' ,'ticket'];

  		// check if current location matches route  
  		var routeClean = function (route) {
			  route = route.split('/');
    	return _.find(routesThatDontRequireAuth,
      			function (noAuthRoute) {
					  
        			return route[1].startsWith(noAuthRoute);
     		 });
  		};

  $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
    // if route requires auth and user is not logged in
    if (!routeClean($location.url()) && !$rootScope.isLoggedIn) {
      // redirect back to login

      $location.path('/');
    }
  });
	}]);



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
	var apolloApp = angular.module('apolloApp' , ['ui.router','angularMoment','ui.bootstrap','underscore','ngFileUpload','ngAnimate','toaster','apolloApp.authentication','ngProgress','ui.calendar' ,'720kb.datepicker']);

	apolloApp.config(function($stateProvider , $urlRouterProvider,$qProvider){

		//$qProvider.errorOnUnhandledRejections(false);
		//$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home' , {
				url : '/',
				redirectTo : 'login'
			})
			.state('login' , {
				url : '/login',
				templateUrl :'js/login/login.html'
			})
			
			.state('create-ticket',{
				url :'/ticket',
				templateUrl : 'js/ticket/ticket.html',
				controller : 'TicketController'

			})
			.state('task-detail',{
				url :'/task-detail/:id',
				templateUrl : 'js/user/tasks/taskDetails.html',
				controller : 'TaskController'

			})
			.state('dashboard',{
				url : '/dashboard',
				templateUrl : 'js/admin/dashboard/dashboard.html',
				controller : 'DashboardController'
			})
			.state('dashboard.document-search' , {
				url : '/document-search?query',
				templateUrl :'js/search/search.html'
			})
			.state('dashboard.home',{
				url : '/dashboard/home',
				templateUrl : 'js/user/calendar/calendar.html',
				controller : 'CalendarController'
			})
			.state('dashboard.location' ,{
				url : '/admin/locationMaster' ,
				templateUrl : 'js/admin/location-master/locationMaster.html',
				controller : 'LocationMasterController'

			})
			.state('dashboard.designation' ,{
				url : '/admin/designationMaster',
				templateUrl : 'js/admin/designation-master/designationMaster.html',
				controller : 'DesignationMasterController'
			})
			.state('dashboard.user' ,{
				url : '/admin/userMaster',
				templateUrl : 'js/admin/user-master/userMaster.html',
				controller : 'UserMasterController'
			})
			.state('dashboard.admin-ticket' ,{
				url : '/admin/tickets',
				templateUrl : 'js/admin/tickets/adminTickets.html',
				controller : 'AdminTicketsController'
			})
			.state('dashboard.ticket' ,{
				url : '/user/open-tickets',
				templateUrl : 'js/user/ticket/ticket.html',
				controller : 'TicketUserController'
			})
			.state('dashboard.all-tickets' ,{
				url : '/user/all-tickets',
				templateUrl : 'js/user/ticket/alltickets.html',
				controller : 'AllTicketController'
			})
			.state('dashboard.my-tickets' ,{
				url : '/user/my-tickets',
				templateUrl : 'js/user/ticket/myticket.html',
				controller : 'MyTicketUserController'
			})
			.state('dashboard.marked-me' ,{
				url : '/user/marked-me',
				templateUrl : 'js/user/ticket/markedticket.html',
				controller : 'MarkedTicketUserController'
			})
			.state('dashboard.document' ,{
				url : '/admin/documentMaster',
				templateUrl : 'js/admin/documentTemplateField/documentTemplateField.html',
				controller : 'DocumentTemplateFieldController'
			})
			.state('dashboard.documentDetails' ,{
				url : '/admin/documentMaster/:id',
				templateUrl : 'js/admin/documentTemplateField/documentTemplateFieldDetail.html',
				
			})
			.state('dashboard.document-approval' ,{
				url : '/admin/documentApprovalMaster',
				templateUrl : 'js/admin/documentApproval/documentApproval.html',
				controller : 'DocumentApprovalController'
			})
			.state('dashboard.document-approvaldetail' ,{
				url : '/admin/documentApprovalMaster/:id',
				templateUrl : 'js/admin/documentApproval/documentApprovalDetail.html',
				
			})

			.state('dashboard.ticketDetails' ,{
				url : '/user/ticket/:id',
				templateUrl : 'js/user/ticket/ticketDetail.html',
				controller : 'TicketUserController',
				resolve :{
					tickets : function(ticketService){
						return ticketService.getAllTickets();
					}
				}
			})
			.state('dashboard.markedTicketDetails' ,{
				url : '/user/marked-ticket/:id',
				templateUrl : 'js/user/ticket/markedTicketDetail.html',
				controller : 'MarkedTicketUserController',
				resolve :{
					tickets : function(ticketService){
						return ticketService.getMarkedTickets();
					}
				}
			})
			.state('dashboard.allTicketDetail' ,{
				url : '/user/detail-ticket/:id',
				templateUrl : 'js/user/ticket/allTicketsDetail.html',
				controller : 'AllTicketController',
				resolve :{
					tickets : function(ticketService){
							return ticketService.getAllTickets_r();
					}
				}
			})
			.state('dashboard.adminTicketDetail' ,{
				url : '/admin/tickets/:id',
				templateUrl : 'js/admin/tickets/adminTicketDetail.html',
				controller : 'AdminTicketsController',
				resolve :{
					tickets : function(ticketService){
							return ticketService.getAllTickets_r();
					}
				}
			})
			.state('dashboard.myTicketDetails' ,{
				url : '/user/my-ticket/:id',
				templateUrl : 'js/user/ticket/myTicketDetail.html',
				controller : 'MyTicketUserController',
				resolve :{
					tickets : function(ticketService){
						return ticketService.getMyTickets();
					}
				}
			});
	})
	.run(['$rootScope','$cookieStore','$state','$location',function($rootScope,$cookieStore,$state,$location){
		if($cookieStore.get('apolloUser')){
			$rootScope.user=$cookieStore.get('apolloUser');
			$rootScope.isLoggedIn = true;
			console.log('User Logged in');
		}else{
			$rootScope.user=null;
			$rootScope.isLoggedIn = false;
			console.log('User not Logged in');
		}

		// enumerate routes that don't need authentication
  		var routesThatDontRequireAuth = ['/login' ,'/ticket','/task-detail'];

  		// check if current location matches route  
  		var routeClean = function (route) {
			  
    	return _.find(routesThatDontRequireAuth,
      			function (noAuthRoute) {
					//console.log(route.startsWith(noAuthRoute));
        			return route.startsWith(noAuthRoute);
     		 });
  		};

  $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
    // if route requires auth and user is not logged in
    /*
    if (!routeClean($location.url()) && !$rootScope.isLoggedIn) {
      // redirect back to login
	  console.log('url '+$location.url()+' to '+to);
	  console.log(to);
      $location.path('/login');
    }else{
		console.log($rootScope.isLoggedIn);
		console.log(routeClean($location.url()));
		console.log('url '+$location.url());
	}

	if (to.redirectTo) {
        ev.preventDefault();
        $state.go(to.redirectTo, toParams, {location: 'replace'})
      }

		

    */
/*
     if(in_array($location.path(),routesThatDontRequireAuth) && !$rootScope.isLoggedIn){
            $location.path("/");
        }
        
        if(!$rootScope.isLoggedIn){
           $state.go('login');
        }

        if(($location.path() === "/") && $rootScope.isLoggedIn){
            $location.path("/get-bands");
        }*/
				if (to.redirectTo){
        ev.preventDefault();
        $state.go(to.redirectTo, toParams, {location: 'replace'});
      }
  });


  	//Keep Track of Current and Previous States
	$rootScope.previousState;
	$rootScope.currentState;
	$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
    	$rootScope.previousState = from.name;
    	$rootScope.currentState = to.name;
    	console.log('Previous state:'+$rootScope.previousState)
    	console.log('Current state:'+$rootScope.currentState)
	});

	}]);


function in_array(needle, haystack, argStrict){
  var key = "",
  strict = !! argStrict;
 
  if(strict){
    for(key in haystack){
      if(haystack[key] === needle){
        return true;
      }
    }
  }else{
    for(key in haystack){
      if(haystack[key] == needle){
        return true;
      }
    }
  }
  return false;
}
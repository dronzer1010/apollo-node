
	/**
	 *	Initialize  angular app module with all dependencies
	 */ 
	var apolloApp = angular.module('apolloApp' , ['ui.router']);

	apolloApp.config(function($stateProvider , $urlRouterProvider){
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home' , {
				url : '/',
				templateUrl :'partials/home/index.html'
			})
			.state('location' ,{
				url : '/locationMaster' ,
				templateUrl : 'js/admin/location-master/locationMaster.html',
				controller : 'LocationMasterController'

			})
			.state('designation' ,{
				url : '/designationMaster',
				templateUrl : 'js/admin/designation-master/designationMaster.html',
				controller : 'DesignationMasterController'
			})
			.state('user' ,{
				url : '/userMaster',
				templateUrl : 'js/admin/user-master/userMaster.html',
				controller : 'UserMasterController'
			});
	});


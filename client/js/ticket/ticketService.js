$(function(){

    'use strict';
 	var appService = angular.module('apolloApp');
	appService.factory('ticketService', ['$http', '$q','$rootScope', function($http, $q , $rootScope){
        var url= 'https://apollo-node.herokuapp.com';

        return {
        
        
			createTicket: function(ticket){
					return $http.post(url+'/api/tickets/', ticket)
					.then(
							function(response){
								return response.data;
							}, 
							function(errResponse){
								console.error('Error while creating ticket');
								return $q.reject(errResponse);
							}
					);
				},
			
			getAllTickets : function(){
				var config =	{
						method: 'GET',
						url: url+'/api/tickets',
						headers: {
							authorization : $rootScope.user.token
						},
					
					};
				return $http(config)
					.then(
							function(response){
								return response.data;
							}, 
							function(errResponse){
								console.error('Error while fetching ticket');
								return $q.reject(errResponse);
							}
					);
			},
			getMyTickets : function(){
				var config =	{
						method: 'GET',
						url: url+'/api/tickets/mytickets',
						headers: {
							authorization : $rootScope.user.token
						},
					
					};
				return $http(config)
					.then(
							function(response){
								return response.data;
							}, 
							function(errResponse){
								console.error('Error while fetching ticket');
								return $q.reject(errResponse);
							}
					);
			},

			getMarkedTickets : function(){
				var config =	{
						method: 'GET',
						url: url+'/api/tickets/marked',
						headers: {
							authorization : $rootScope.user.token
						},
					
					};
				return $http(config)
					.then(
							function(response){
								return response.data;
							}, 
							function(errResponse){
								console.error('Error while fetching ticket');
								return $q.reject(errResponse);
							}
					);
			},



			pickTicket: function(id){
					var config =	{
						method: 'PUT',
						url: url+'/api/tickets/pick/'+id,
						headers: {
							authorization : $rootScope.user.token
						},
					
					};
					return $http(config)
					.then(
							function(response){
								return response.data;
							}, 
							function(errResponse){
								console.error('Error while creating ticket');
								return $q.reject(errResponse);
							}
					);
				},

		
        }
		
    }]);

}());
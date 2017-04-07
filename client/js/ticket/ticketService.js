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
						url: url+'/api/tickets/open',
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
			getTicketById : function(id){
				var config =	{
						method: 'GET',
						url: url+'/api/tickets/indi/'+id,
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
								console.error('Error while fetching ticket By ID');
								return $q.reject(errResponse);
							}
					);
			},
			getAllTickets_r : function(){
				var config =	{
						method: 'GET',
						url: url+'/api/tickets/',
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
								console.error('Error while fetching My ticket');
								return $q.reject(errResponse);
							}
					);
			},
			getMyTicketsExport : function(){
				var config =	{
						method: 'GET',
						url: url+'/api/tickets/mytickets/export',
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

			editTicket : function(data , id){
				var config =	{
						method: 'PUT',
						url: url+'/api/tickets/edit/'+id,
						data : data,
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
								console.error('Error while updating ticket');
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


			closeTicket: function(id ,data){
					var config =	{
						method: 'POST',
						url: url+'/api/tickets/close/'+id,
						data :data,
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
								console.error('Error while closing ticket');
								return $q.reject(errResponse);
							}
					);
				},

				getCoManagerUsers: function(id){
					var config =	{
						method: 'GET',
						url: url+'/api/tickets/comanagers/'+id,
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
				createComanager: function(tid,comanager){
					return $http.post(url+'/api/tickets/comanagers/'+tid, comanager)
					.then(
							function(response){
								return response.data;
							}, 
							function(errResponse){
								console.error('Error while creating comanager');
								return $q.reject(errResponse);
							}
					);
				},
				createTask: function(task){
					return $http.post(url+'/api/tasks/', task)
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
				getTaskDetail: function(task){
					return $http.get(url+'/api/tasks/'+task)
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

				closeTask: function(id){
					var config =	{
						method: 'PUT',
						url: url+'/api/tasks/close/'+id,
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
								console.error('Error while closing task');
								return $q.reject(errResponse);
							}
					);
				},
				getTaskList: function(task){
					return $http.get(url+'/api/tickets/tasks/'+task)
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
				/**
				 *  Report data Service
				 */
				getReportData: function(data){
					return $http.post(url+'/api/tickets/report', data)
					.then(
							function(response){
								return response.data;
							}, 
							function(errResponse){
								console.error('Error while fetching Report Data');
								return $q.reject(errResponse);
							}
					);
				},
				getAllEvents : function(){
				var config =	{
						method: 'GET',
						url: url+'/api/events',
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
								console.error('Error while fetching events');
								return $q.reject(errResponse);
							}
					);
			},

		
        }
		
    }]);

}());
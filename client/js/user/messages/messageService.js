$(function(){

    'use strict';
 	var appService = angular.module('apolloApp');
	appService.factory('messageService', ['$http', '$q','$rootScope', function($http, $q , $rootScope){
        var url= 'http://www.ahel-legal.in';

        return {
        
        
			sendMessage: function(data){
					return $http.post(url+'/api/messages/', data)
					.then(
							function(response){
								return response.data;
							}, 
							function(errResponse){
								console.error('Error sending message');
								return $q.reject(errResponse);
							}
					);
				},

			sendNote: function(data){
					return $http.post(url+'/api/notes/', data)
					.then(
							function(response){
								return response.data;
							}, 
							function(errResponse){
								console.error('Error sending message');
								return $q.reject(errResponse);
							}
					);
				},

			getMessage: function(data){
					return $http.get(url+'/api/messages/'+data)
					.then(
							function(response){
								return response.data;
							}, 
							function(errResponse){
								console.error('Error getting message');
								return $q.reject(errResponse);
							}
					);
				},

				getNote: function(data){
					return $http.get(url+'/api/notes/'+data)
					.then(
							function(response){
								return response.data;
							}, 
							function(errResponse){
								console.error('Error getting message');
								return $q.reject(errResponse);
							}
					);
				}
			
			
		
        }
		
    }]);

}());
$(function(){

    'use strict';
 	var appService = angular.module('apolloApp');
	appService.factory('messageService', ['$http', '$q','$rootScope', function($http, $q , $rootScope){
        var url= 'https://apollo-node.herokuapp.com';

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
			getMessage: function(data){
					return $http.get(url+'/api/messages/'+data)
					.then(
							function(response){
								return response.data;
							}, 
							function(errResponse){
								console.error('Error sending message');
								return $q.reject(errResponse);
							}
					);
				}
			
			
		
        }
		
    }]);

}());
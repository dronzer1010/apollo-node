$(function(){

	'use strict';
 	var appService = angular.module('apolloApp');
	appService.factory('locationMasterService', ['$http', '$q', function($http, $q){
	 	var url= 'http://www.ahel-legal.in';
	    return {
	         
	    fetchAllLocations: function() {
	            return $http.get(url+'/api/locations/')
	            .then(
	                    function(response){
	                        return response.data;
	                    }, 
	                    function(errResponse){
	                        console.error('Error while fetching designation');
	                        return $q.reject(errResponse);
	                    }
	            );
	        },
	     
	    createLocation: function(location){
	            return $http.post(url+'/api/locations/', location)
	            .then(
	                    function(response){
	                        return response.data;
	                    }, 
	                    function(errResponse){
	                        console.error('Error while creating designation');
	                        return $q.reject(errResponse);
	                    }
	            );
	        },
	     
	    updateLocation: function(location, id){
	            return $http.put(url+'/api/locations/'+id, location)
	            .then(
	                    function(response){
	                        return response.data;
	                    }, 
	                    function(errResponse){
	                        console.error('Error while updating designation');
	                        return $q.reject(errResponse);
	                    }
	            );
	        },
	     
	   deleteLocation: function(id){
	            return $http.delete(url+'/api/locations/'+id)
	            .then(
	                    function(response){
	                        return response.data;
	                    }, 
	                    function(errResponse){
	                        console.error('Error while deleting user');
	                        return $q.reject(errResponse);
	                    }
	            );
	        }
	         
	    };
	 
	}]);
}());
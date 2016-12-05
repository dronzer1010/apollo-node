$(function(){

	'use strict';
 	var appService = angular.module('apolloApp');
	appService.factory('locationMasterService', ['$http', '$q', function($http, $q){
	 
	    return {
	         
	    fetchAllLocations: function() {
	            return $http.get('http://localhost:3000/api/locations/')
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
	            return $http.post('http://localhost:3000/api/locations/', location)
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
	            return $http.put('http://localhost:3000/api/locations/'+id, location)
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
	            return $http.delete('http://localhost:3000/api/locations/'+id)
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
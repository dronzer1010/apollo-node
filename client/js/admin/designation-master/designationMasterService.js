$(function(){

	'use strict';
 	var appService = angular.module('apolloApp');
	appService.factory('designationMasterService', ['$http', '$q', function($http, $q){
	 	var url= 'http://www.ahel-legal.in';
	    return {
	         
	    fetchAllDesignations: function() {
	            return $http.get(url+'/api/designations/')
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
	     
	    createDesignation: function(designation){
	            return $http.post(url+'/api/designations/', designation)
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
	     
	    updateDesignation: function(designation, id){
	            return $http.put(url+'/api/designations/'+id, designation)
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
	     
	   deleteDesignation: function(id){
	            return $http.delete(url+'/api/designations/'+id)
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
$(function(){

	'use strict';
    var appService = angular.module('apolloApp');
    appService.factory('documentTemplateFieldService', ['$http', '$q', function($http, $q){
        var url= 'https://apollo-node.herokuapp.com';

         return {


              fetchAllDocumentTemplates: function() {
	            return $http.get(url+'/api/documents/')
	            .then(
	                    function(response){
	                        return response.data;
	                    }, 
	                    function(errResponse){
	                        console.error('Error while fetching documents');
	                        return $q.reject(errResponse);
	                    }
	            );
	        },
            createDocumentTemplate: function(template){
	            return $http.post(url+'/api/documents/', template)
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
            updateDocument: function(document, id){
	            return $http.put(url+'/api/documents/'+id, document)
	            .then(
	                    function(response){
	                        return response.data;
	                    }, 
	                    function(errResponse){
	                        console.error('Error while updating document');
	                        return $q.reject(errResponse);
	                    }
	            );
	        },
            deleteDocument: function(id){
	            return $http.delete(url+'/api/documents/'+id)
	            .then(
	                    function(response){
	                        return response.data;
	                    }, 
	                    function(errResponse){
	                       
	                        return $q.reject(errResponse);
	                    }
	            );
	        }


         };

    }]);

}());
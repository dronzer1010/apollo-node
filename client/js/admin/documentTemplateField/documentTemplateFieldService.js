$(function(){

	'use strict';
    var appService = angular.module('apolloApp');
    appService.factory('documentTemplateFieldService', ['$http', '$q', function($http, $q){
        var url= 'http://www.ahel-legal.in';

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
			fetchAllApprovedDocumentTemplates: function() {
	            return $http.get(url+'/api/documents/approve')
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
			fetchApprovalDocumentTemplates: function() {
	            return $http.get(url+'/api/documents/approved')
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
			fetchApprovedDocById: function(id) {
	            return $http.get(url+'/api/documents/approved/'+id)
	            .then(
	                    function(response){
	                        return response.data;
	                    }, 
	                    function(errResponse){
	                        console.error('Error while fetching Approved  documents by ID');
	                        return $q.reject(errResponse);
	                    }
	            );
	        },
			queryDocument: function(query){
	            return $http.post(url+'/api/document-master/search', query)
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
			approveDocumentTemplate: function(template){
	            return $http.post(url+'/api/documents/approve', template)
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
			updateNewName: function(id , data){
	            return $http.put(url+'/api/document-master/changename/'+id, data)
	            .then(
	                    function(response){
	                        return response.data;
	                    }, 
	                    function(errResponse){
	                        console.error('Error while updating name');
	                        return $q.reject(errResponse);
	                    }
	            );
	        },
			approveDocument: function(data,id){
	            return $http.post(url+'/api/document-master/approve/'+id, data)
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

			updateApprovedDocument: function(document, id){
	            return $http.put(url+'/api/documents/approve/'+id, document)
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
	        },
			deleteApprovedDocument: function(id){
	            return $http.delete(url+'/api/documents/approve/'+id)
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
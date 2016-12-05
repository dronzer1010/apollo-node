$(function(){
	'use strict';
	angular.module('apolloApp')
			.service('userMasterService',['$http', '$q',function($http , $q){

				return {

					fetchAllUsers: function() {
			            return $http.get('http://localhost:3000/api/users/')
			            .then(
			                    function(response){
			                        return response.data;
			                    }, 
			                    function(errResponse){
			                        console.error('Error while fetching users');
			                        return $q.reject(errResponse);
			                    }
			            );
			        },

			        createUser: function(user){
			            return $http.post('http://localhost:3000/api/users/', user)
			            .then(
			                    function(response){
			                        return response.data;
			                    }, 
			                    function(errResponse){
			                        console.error('Error while creating user');
			                        return $q.reject(errResponse);
			                    }
			            );
			        },

			        activateUser : function(data){
			        	 return $http.post('http://localhost:3000/api/users/activate', data)
			            .then(
			                    function(response){
			                        return response.data;
			                    }, 
			                    function(errResponse){
			                        console.error('Error while activating user');
			                        return $q.reject(errResponse);
			                    }
			            );
			        },
			        markUser : function(data){
			        	 return $http.post('http://localhost:3000/api/users/direct', data)
			            .then(
			                    function(response){
			                        return response.data;
			                    }, 
			                    function(errResponse){
			                        console.error('Error while marking user');
			                        return $q.reject(errResponse);
			                    }
			            );
			        },

			        updateUser: function(user, id){
			            return $http.put('http://localhost:3000/api/users/'+id, user)
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
			        deleteUser: function(id){
			            return $http.delete('http://localhost:3000/api/users/'+id)
			            .then(
			                    function(response){
			                        return response.data;
			                    }, 
			                    function(errResponse){
			                        console.error('Error while deleting User');
			                        return $q.reject(errResponse);
			                    }
			            );
			        },

				};

			}]);
}());
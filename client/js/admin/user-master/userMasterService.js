$(function(){
	'use strict';
	angular.module('apolloApp')
			.service('userMasterService',['$http', '$q',function($http , $q){
				var url= 'https://apollo-node.herokuapp.com';
				return {

					fetchAllUsers: function() {
			            return $http.get(url+'/api/users/')
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
			            return $http.post(url+'/api/users/', user)
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
			        	 return $http.post(url+'/api/users/activate', data)
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
			        	 return $http.post(url+'/api/users/direct', data)
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

					getMarkedUsers : function(data){
			        	 return $http.get(url+'/api/users/markedusers', data)
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
			            return $http.put(url+'/api/users/'+id, user)
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
			            return $http.delete(url+'/api/users/'+id)
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

					loginUser : function(user){
						return $http.post(url+'/api/users/login' , user)
								.then(
									 function(response){
			                        return response.data;
			                    }, 
			                    function(errResponse){
			                        console.error('Error while login User');
			                        return $q.reject(errResponse);
			                    }
								);
					},

				};

			}]);
}());
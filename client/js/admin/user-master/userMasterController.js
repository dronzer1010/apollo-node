$(function(){
	'use strict' ;
	var app = angular.module('apolloApp')
					.controller('UserMasterController' , ['$scope','$rootScope','userMasterService' , function($scope ,$rootScope, userMasterService){
						
						var self = this;
						$scope.currentUser = $rootScope.user.email;
						self.user = {
							_id : null ,
							firstName : '',
							lastName : '',
							email : '',
							password : '',
							designation : '',
							location : '',
							userType:'',
							lastPassword:'',
							active : false,
							markDirect : false
						};

						self.users = [],
						$scope.currentPage = 1
						,$scope.itemsPerPage = 5
						,$scope.maxSize = 5;

						//method to fetch all users 
						self.fetchAllUsers = function(){
							userMasterService.fetchAllUsers()
													.then(function(users){
														self.users = users.data;
													},function(errResponse){
														console.log('error fetching users');
													});
						};

						//method to create user

						self.createUser = function(user){
							userMasterService.createUser(user)
													.then(self.fetchAllUsers, function(errResponse){
														console.log('error creating  user');
													});
						};

						self.updateUser = function(user ,id){
							userMasterService.updateUser(user ,id)
													.then(self.fetchAllUsers, function(errResponse){
														console.log('error updating  user');
													});
						};						
						self.deleteUser = function(id){
							userMasterService.deleteUser(id)
													.then(self.fetchAllUsers, function(errResponse){
														console.log('error creating  User');
													});
						};
						self.submit = function() {
							//console.log('Im called');
			              if(self.user._id===null){
			                  console.log('Saving New User', self.user);    
			                  self.createUser(self.user);
			              }else{
			              	 console.log('Saving  Location', self.user);
							 if(self.user.password == ''){
								 //self.user.password = self.user.lastPassword;
							 }
			                 self.updateUser(self.user, self.user._id);
			                 console.log('User updated with id ', self.user._id);
			              }
			              
			              self.reset();
			          };

			          self.activate = function(id , status){
			          	console.log('id : '+id+' status : '+status);
			          	var data ={};
			          	data.id=id;
			          	data.status = !status;

			          	userMasterService.activateUser(data)
			          								.then(self.fetchAllUsers, function(errResponse){
														console.log('error activating user');
													});
			          };

			          self.markDirect = function(id , status){
			          	console.log('id : '+id+' status : '+status);
			          	var data ={};
			          	data.id=id;
			          	data.status = !status;

			          	userMasterService.markUser(data)
			          								.then(self.fetchAllUsers, function(errResponse){
														console.log('error activating user');
													});
			          };


			          self.edit = function(id){
			              console.log('id to be edited', id);
						  console.log(self.user);
			              for(var i = 0; i < self.users.length; i++){
			                  if(self.users[i]._id === id) {
			                     self.user = angular.copy(self.users[i]);
								 self.user.lastPassword = self.user.password;
								 self.user.password='';

			                     break;
			                  }
			              }
						  console.log(self.user);
			          };

			          self.remove = function(id){
			              console.log('id to be deleted', id);
			              if(self.user._id === id) {//clean the form if the user to be deleted is shown there.
			                  self.reset();
			              }
			              self.deleteUser(id);
			          }
			          self.reset = function(){
			              self.user = {
							_id : null ,
							fname : '',
							lname : '',
							email : '',
							password : '',
							designation : '',
							location : '',
							userType:'',
							lastPassword:'',
							active : false,
							markDirect : false
						};

			              $scope.userForm.$setPristine(); //reset Form
			          };

						self.fetchAllUsers();


					}]);
}());

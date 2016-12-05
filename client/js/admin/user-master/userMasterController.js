$(function(){
	'use strict' ;
	var app = angular.module('apolloApp')
					.controller('UserMasterController' , ['$scope','userMasterService' , function($scope , userMasterService){
						
						var self = this;

						self.user = {
							_id : null ,
							firstName : '',
							lastName : '',
							email : '',
							password : '',
							designation : '',
							location : '',
							userType:'',
							active : false,
							markDirect : false
						};

						self.users = [];

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
			              if(self.user._id===null){
			                  console.log('Saving New User', self.user);    
			                  self.createUser(self.user);
			              }else{
			              	 console.log('Saving  Location', self.user);
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
			              for(var i = 0; i < self.users.length; i++){
			                  if(self.users[i]._id === id) {
			                     self.user = angular.copy(self.users[i]);
			                     self.user.password='';

			                     break;
			                  }
			              }
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
							active : false,
							markDirect : false
						};

			              $scope.userForm.$setPristine(); //reset Form
			          };

						self.fetchAllUsers();


					}]);
}());

$(function(){
	'use strict' ;
	var controllers = angular.module('apolloApp');

	controllers.controller('DesignationMasterController' , ['$scope','designationMasterService' ,function($scope ,designationMasterService){
		var self = this;
		self.designation = {
			_id : null ,
			short_name : '',
			designation : '',
		};

		self.designations = [];

		//method to fetch all services 
		self.fetchAllDesignations = function(){
			designationMasterService.fetchAllDesignations()
									.then(function(designations){
										self.designations = designations.data;
									},function(errResponse){
										console.log('error fetching designations');
									});
		};

		//method to create designation

		self.createDesignation = function(designation){
			designationMasterService.createDesignation(designation)
									.then(self.fetchAllDesignations, function(errResponse){
										console.log('error creating  designation');
									});
		};

		self.updateDesignation = function(designation , id){
			designationMasterService.updateDesignation(designation , id)
									.then(self.fetchAllDesignations, function(errResponse){
										console.log('error creating  designation');
									});
		};

		self.deleteDesignation = function(id){
			designationMasterService.deleteDesignation(id)
									.then(self.fetchAllDesignations, function(errResponse){
										console.log('error creating  designation');
									});
		};

		$scope.name ="Designation Master";


		self.fetchAllDesignations();

		self.submit = function() {
              if(self.designation._id===null){
                  console.log('Saving New User', self.designation);    
                  self.createDesignation(self.designation);
              }else{
                 self.updateDesignation(self.designation, self.designation._id);
                 console.log('User updated with id ', self.designation._id);
              }
              
              self.reset();
          };

        self.edit = function(id){
              console.log('id to be edited', id);
              for(var i = 0; i < self.designations.length; i++){
                  if(self.designations[i]._id === id) {
                     self.designation = angular.copy(self.designations[i]);
                     break;
                  }
              }
          }

        self.remove = function(id){
              console.log('id to be deleted', id);
              if(self.designation._id === id) {//clean the form if the user to be deleted is shown there.
                  self.reset();
              }
              self.deleteDesignation(id);
          }


		self.reset = function(){
              self.designation = {
				id : null ,
				short_name : '',
				designation : '',
			};
              $scope.designationForm.$setPristine(); //reset Form
          };
	}]);
}());
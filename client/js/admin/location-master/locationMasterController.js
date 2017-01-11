$(function(){
	'use strict' ;
	var controllers = angular.module('apolloApp');

	controllers.controller('LocationMasterController' , ['$scope','locationMasterService' ,function($scope ,locationMasterService){
		var self = this;

		self.location = {
			_id : null ,
			name : '',
			division : '',
		};

		self.locations = []
        ,$scope.currentPage = 1
    	,$scope.itemsPerPage = 7
        ,$scope.maxSize = 5;

		//method to fetch all services 
		self.fetchAllLocations = function(){
			locationMasterService.fetchAllLocations()
									.then(function(locations){
										self.locations = locations.data;
									},function(errResponse){
										console.log('error fetching designations');
									});
		};

		//method to create designation
	
		self.createLocation = function(location){
			locationMasterService.createLocation(location)
									.then(self.fetchAllLocations, function(errResponse){
										console.log('error creating  designation');
									});
		};

		self.updateLocation = function(location , id){
			locationMasterService.updateLocation(location , id)
									.then(self.fetchAllLocations, function(errResponse){
										console.log('error creating  designation');
									});
		};

		self.deleteLocation = function(id){
			locationMasterService.deleteLocation(id)
									.then(self.fetchAllLocations, function(errResponse){
										console.log('error creating  designation');
									});
		};

		$scope.name ="Designation Master";


		self.fetchAllLocations();

		self.submit = function() {
              if(self.location._id===null){
                  console.log('Saving New Location', self.location);    
                  self.createLocation(self.location);
              }else{
              	 console.log('Saving  Location', self.location);
                 self.updateLocation(self.location, self.location._id);
                 console.log('User updated with id ', self.location._id);
              }
              
              self.reset();
          };

        self.edit = function(id){
              console.log('id to be edited', id);
			  
              for(var i = 0; i < self.locations.length; i++){
                  if(self.locations[i]._id === id) {
                     self.location = angular.copy(self.locations[i]);
                     break;
                  }
              }
          }

        self.remove = function(id){
              console.log('id to be deleted', id);
              if(self.location._id === id) {//clean the form if the user to be deleted is shown there.
                  self.reset();
              }
              self.deleteLocation(id);
          }


		self.reset = function(){
              self.location = {
				_id : null ,
				name : '',
				division : '',
			};
              $scope.locationForm.$setPristine(); //reset Form
          };
	}]);
}());
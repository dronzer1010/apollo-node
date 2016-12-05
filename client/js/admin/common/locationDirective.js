$(function(){
	'use strict';

	angular.module('apolloApp')
			.directive('locations' ,['locationMasterService' ,function(locationMasterService){

				return {
			      restrict: 'E',
			      replace:true,
			      template: "<select class='form-control' data-ng-options='location as location.name for location in locations track by location._id'></select>",
			      require: 'ngModel',
			      link: function(scope, element, attrs, ngModelCtrl) {
			        
			        locationMasterService.fetchAllLocations()
			        					.then(function(locations) {
			        
			          scope.locations = locations.data;
			        });
			      }
			    };

			}]);
}());
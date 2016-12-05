$(function(){
	'use strict';

	angular.module('apolloApp')
			.directive('designations' ,['designationMasterService' ,function(designationMasterService){

				return {
			      restrict: 'E',
			      replace:true,
			      template: "<select class='form-control' data-ng-options='designation as designation.designation for designation in designations track by designation._id'></select>",
			      require: 'ngModel',
			      link: function(scope, element, attrs, ngModelCtrl) {
			        
			        designationMasterService.fetchAllDesignations()
			        					.then(function(designations) {
			        
			          scope.designations = designations.data;
			        });
			      }
			    };

			}]);
}());
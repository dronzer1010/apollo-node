$(function(){
	'use strict';

	angular.module('apolloApp')
			.directive('desuser' ,['userMasterService' ,function(userMasterService){

				return {
			      restrict: 'E',
			      replace:true,
			      template: "<select class='form-control' data-ng-options='document as document.documentTemplateId.legalType for document in documents track by document.documentTemplateId._id'><option value=''>None</option></select>",
			      require: 'ngModel',
			      link: function(scope, element, attrs, ngModelCtrl) {
			        var num = scope.$eval(attrs.des);
                    console.log(num);

			        userMasterService.fetchAllDesignationUsers(num)
			        					.then(function(users) {
			        
			          scope.documents = users.data;
								console.log(scope.documents);
			        });
			      }
			    };

			}]);
}());
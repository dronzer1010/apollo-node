$(function(){
	'use strict';

	angular.module('apolloApp')
			.directive('approved' ,['documentTemplateFieldService' ,function(documentTemplateFieldService){

				return {
			      restrict: 'E',
			      replace:true,
			      template: "<select class='form-control' data-ng-options='document as document.documentTemplateId.legalType for document in documents track by document.documentTemplateId._id'><option value=''>None</option></select>",
			      require: 'ngModel',
			      link: function(scope, element, attrs, ngModelCtrl) {
			        
			        documentTemplateFieldService.fetchAllApprovedDocumentTemplates()
			        					.then(function(documents) {
			        
			          scope.documents = documents.data;
								console.log(scope.documents);
			        });
			      }
			    };

			}]);
}());
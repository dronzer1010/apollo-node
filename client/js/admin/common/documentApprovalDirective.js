$(function(){
	'use strict';

	angular.module('apolloApp')
			.directive('documentsapproval' ,['documentTemplateFieldService' ,function(documentTemplateFieldService){

				return {
			      restrict: 'E',
			      replace:true,
			      template: "<select class='form-control' data-ng-options='document as document.legalType for document in documents track by document._id'><option value=''>None</option></select>",
			      require: 'ngModel',
			      link: function(scope, element, attrs, ngModelCtrl) {
			        
			        documentTemplateFieldService.fetchApprovalDocumentTemplates()
			        					.then(function(documents) {
			        
			          scope.documents = documents.data;
			        });
			      }
			    };

			}]);
}());
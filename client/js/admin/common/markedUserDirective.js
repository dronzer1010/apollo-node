$(function(){
	'use strict';

	angular.module('apolloApp')
			.directive('markedusers' ,['userMasterService' ,function(userMasterService){

				return {
			      restrict: 'E',
			      replace:true,
			      template: "<select class='form-control' data-ng-options='user as user.email for user in users track by users._id' >  <option value=''>None</option>  </select>",
			      require: 'ngModel',
			      link: function(scope, element, attrs, ngModelCtrl) {
			        
			        userMasterService.getMarkedUsers()
			        					.then(function(users) {
			        
			          scope.users = users.data;
			        });
			      }
			    };

			}]);
}());
$(function(){
	'use strict';

	angular.module('apolloApp')
			.directive('comanagers' ,['ticketService' ,function(ticketService){

				return {
			      restrict: 'E',
			      replace:true,
			      template: "<select class='form-control' data-ng-options='user as user.firstName for user in users track by user._id' >  <option value=''>None</option>  </select>",
			      require: 'ngModel',
			      link: function(scope, element, attrs, ngModelCtrl) {
			        
			        ticketService.getCoManagerUsers(attrs.ticketId)
			        					.then(function(users) {
			        
			          scope.users = users.data;
			        });
			      }
			    };

			}]);
}());
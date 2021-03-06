$(function(){
	'use strict';

	angular.module('apolloApp')
			.directive('onlyDigits' ,[function(){

				return {
			      restrict: 'A',
			     require: 'ngModel',
			       link: function (scope, element, attr, ctrl) {
                        function inputValue(val) {
                        if (val) {
                            var digits = val.replace(/[^0-9.]/g, '');

                            if (digits.split('.').length > 2) {
                            digits = digits.substring(0, digits.length - 1);
                            }

                            if (digits !== val) {
                            ctrl.$setViewValue(digits);
                            ctrl.$render();
                            }
                            return parseFloat(digits);
                        }
                        return undefined;
                        }            
                        ctrl.$parsers.push(inputValue);
                    }
			    };

			}]);
}());
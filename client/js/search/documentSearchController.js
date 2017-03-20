$(function(){

    angular.module('apolloApp')
            .controller('DocumentSearchController',['$scope','documentTemplateFieldService','$state','$stateParams','$uibModal','$document','toaster','$timeout',function($scope,documentTemplateFieldService,$state,$stateParams,$uibModal,$document,toaster,$timeout ){

                var self = this ;
               $scope.documents=[];
                if($stateParams.query){
                    var data={};
                    data.query = $stateParams.query;
                    documentTemplateFieldService.queryDocument(data )
                                .then(function(docs){
                                        $scope.documents = docs.data;
									},function(errResponse){
                                        $scope.documents=[];
										console.log('error fetching designations');
									});
                    
                }else{
                    
                }

            }]);
}());
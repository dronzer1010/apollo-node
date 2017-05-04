$(function(){

    angular.module('apolloApp')
            .controller('DocumentSearchController',['$scope','$http','documentTemplateFieldService','$state','$stateParams','$uibModal','$document','toaster','$timeout',function($scope,$http,documentTemplateFieldService,$state,$stateParams,$uibModal,$document,toaster,$timeout ){

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

                $scope.doc_request = function(key){
                    var data={};
                    data.key = key;
                    $http({url:"https://apollo-node.herokuapp.com/api/doc/request",
                                        method: "POST",
                                        data : data,
                                        headers: {
                                        
                                        authorization : $rootScope.user.token
                                        },})
                }

            }]);
}());
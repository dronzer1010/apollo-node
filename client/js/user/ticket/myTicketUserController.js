$(function(){
    angular.module('apolloApp')
        .filter('offset', function() {
                return function(input, start) {
                    return input.slice(start);
                };
            })
            .controller('MyTicketUserController',['$scope','$uibModal','$document','$rootScope','$stateParams','moment','$cookieStore','toaster','ticketService',function($scope ,$uibModal,$document, $rootScope,$stateParams,moment,$cookieStore,toaster,ticketService){
                var self =  this;

                   $scope.filteredTickets = []
                    ,$scope.currentPage = 1
                    ,$scope.itemsPerPage = 5
                    ,$scope.maxSize = 5;

                    

                self.tickets = [];

                self.fetchAllTickets = function(){
                    ticketService.getMyTickets()
                                .then(function(tickets){
										self.tickets = tickets.data;
                                       // $scope.filteredTickets = tickets.data.slice(0,$scope.numPerPage);
									},function(errResponse){
										console.log('error fetching designations');
									});
                };


                

                self.fetchAllTickets();

                

                
                 function findTicket(id){
                    var targetTicket = null;
                    console.log(self.tickets);
                    self.tickets.forEach(function(ticket){
                   

                    });
                    
                    return targetTicket;
                }

                // You never actually call this function
                function list($scope, $stateParams) {
                    ticketService.getMyTickets()
                                .then(function(tickets){
										self.tickets = tickets.data;
                                        console.log(self.tickets);
                                        var targetTicket = null;
                                         self.tickets.forEach(function(ticket){
                                             //console.log(ticket.ticketId._id);
                                             if(ticket._id==$stateParams.id){
                                                 targetTicket = ticket;
                                             }

                                        });
                                        angular.extend($scope, targetTicket);
									},function(errResponse){
										console.log('error fetching designations');
									});
                   
                }
                
                if ($stateParams.id) {
                    list($scope, $stateParams);
                    //console.log($scope);
                }



                self.open = function(parent , data ){

                    
                    self.modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'coManagerTemplate.html',
                        controller : function($uibModalInstance,ticketService , $scope){
                            var self2=this;
                           self2.submit=function(){
                               
                                ticketService.createComanager(data ,self2.data).then(self.fetchAllTickets, function(errResponse){
                                                    console.log('error creating comanager');
                                                });
                                $uibModalInstance.dismiss('cancel');
                            };
                           
                            self2.data={
                                comanager:""
                        };
                            self2.cancel = function(){
                                $uibModalInstance.dismiss('cancel');
                            }
                        },
                        controllerAs :'ctrl2',
                        scope : $scope,
                        size: 'md',
                        appendTo: angular.element($document[0].querySelector(parent)),
                        resolve: {
                            
                        }
                    });
                    //add

                };
                
            }]);
}());
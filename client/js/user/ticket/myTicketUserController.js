$(function(){
    angular.module('apolloApp')
        .filter('offset', function() {
                return function(input, start) {
                    return input.slice(start);
                };
            })
            .controller('MyTicketUserController',['$scope','$rootScope','$stateParams','moment','$cookieStore','toaster','ticketService',function($scope , $rootScope,$stateParams,moment,$cookieStore,toaster,ticketService){
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
                                             console.log(ticket.ticketId._id);
                                             if(ticket.ticketId._id==$stateParams.id){
                                                 targetTicket = ticket.ticketId;
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
                
            }]);
}());
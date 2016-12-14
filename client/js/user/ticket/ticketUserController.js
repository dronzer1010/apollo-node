$(function(){
    angular.module('apolloApp')
            .controller('TicketUserController',['$scope','$rootScope','$stateParams','moment','$cookieStore','toaster','ticketService',function($scope , $rootScope,$stateParams,moment,$cookieStore,toaster,ticketService){
                var self =  this;

                self.tickets = [];

                self.fetchAllTickets = function(){
                    ticketService.getAllTickets()
                                .then(function(tickets){
										self.tickets = tickets.data;
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
                    ticketService.getAllTickets()
                                .then(function(tickets){
										self.tickets = tickets.data;
                                        var targetTicket = null;
                                         self.tickets.forEach(function(ticket){
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
                    console.log($scope);
                }
                
            }]);
}());
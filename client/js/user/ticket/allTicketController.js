$(function(){
    angular.module('apolloApp')
        .filter('offset', function() {
                return function(input, start) {
                    return input.slice(start);
                };
            })
            .controller('AllTicketController',['$scope','$rootScope','$stateParams','moment','$cookieStore','toaster','ticketService',function($scope , $rootScope,$stateParams,moment,$cookieStore,toaster,ticketService){
                var self =  this;

                   $scope.filteredTickets = []
                    ,$scope.currentPage = 1
                    ,$scope.itemsPerPage = 5
                    ,$scope.maxSize = 5;

                    

                self.tickets = [];

                self.fetchAllTickets = function(){
                    ticketService.getAllTickets_r()
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
                    ticketService.getAllTickets_r()
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
                    //console.log($scope);
                }
                
            }]);
}());
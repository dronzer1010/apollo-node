$(function(){
    angular.module('apolloApp')
        .filter('offset', function() {
                return function(input, start) {
                    return input.slice(start);
                };
            })
            .controller('AdminTicketsController',['$scope','$interval','$rootScope','$stateParams','moment','$cookieStore','toaster','ticketService','messageService',function($scope ,$interval, $rootScope,$stateParams,moment,$cookieStore,toaster,ticketService,messageService){
                var self =  this;

                   $scope.filteredTickets = []
                    ,$scope.currentPage = 1
                    ,$scope.itemsPerPage = 5
                    ,$scope.maxSize = 5;

                    

                self.tickets = [];
                $scope.messages=[];
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
                
                self.getMessages = function(){
                                    messageService.getMessage($stateParams.id).then(function(data){
                                        $scope.messages=data.data;
                                        
                                    }, function(err){
                                        console.log(err);
                                    });
                                };

                if ($stateParams.id) {
                    list($scope, $stateParams);
                    //console.log($scope);
                     self.getMessages();
                    $interval(self.getMessages, 5000);
                }
                self.sendMessage = function(t_id){
                    var temp={};
                    temp.threadId=t_id;
                    temp.senderId = $rootScope.user.sessionId;
                    temp.message = self.message;
                    console.log(temp);
                    messageService.sendMessage(temp).then(self.getMessages(), function(errResponse){
										console.log('error picking ticket');
									});
                    self.message="";
                };
                
            }]);
}());
$(function(){
    angular.module('apolloApp')
        .filter('offset', function() {
                return function(input, start) {
                    return input.slice(start);
                };
            })
            .controller('MyTicketUserController',['$scope','$interval','$uibModal','$document','$rootScope','$stateParams','moment','$cookieStore','toaster','ticketService','messageService',function($scope ,$interval,$uibModal,$document, $rootScope,$stateParams,moment,$cookieStore,toaster,ticketService,messageService){
                var self =  this;

                   $scope.filteredTickets = []
                    ,$scope.currentPage = 1
                    ,$scope.itemsPerPage = 5
                    ,$scope.maxSize = 5;

                    
                $scope.messages=[];
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
                




                /****************Task Functions */
                self.task = {
                    _id : null ,
                    name : '',
                    type : 'Document',
                    handlerName : "",
                    handlerEmail : "",
                    handlerNo : "",
                    handlerLocation : null,
                    taskPrivacy : "Closed",
                    completionDate:"",
                    handlingLocation:"",
                    master :  $rootScope.user.sessionId,
                    ticketId : $stateParams.id

                };
                $scope.completionDate_popup={
                    opened : false
                };
                $scope.minDate=new Date();

                self.createTask2 = function(data){
                    ticketService.createTask(data).then(function(data){
                        console.log(data);
                    },function(err){
                        console.log(err);
                    });
                }
                self.reset = function(){
                    self.task = {
                        _id : null ,
                        name : '',
                        type : 'Document',
                        handlerName : "",
                        handlerEmail : "",
                        handlerNo : "",
                        handlerLocation : null,
                        taskPrivacy : "Closed",
                        completionDate:"",
                        handlingLocation:"",
                        master :  $rootScope.user.sessionId,
                        ticketId : $stateParams.id

                    };
                }
                self.createTask = function(){
                    if(self.task._id===null){
                        console.log('Saving New task', self.task);    
                        self.createTask2(self.task);
                    }
                    
                    self.reset();
                }


            }]);
}());
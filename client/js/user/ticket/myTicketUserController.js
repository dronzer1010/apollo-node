$(function(){
    angular.module('apolloApp')
        .filter('offset', function() {
                return function(input, start) {
                    return input.slice(start);
                };
            })
            .controller('MyTicketUserController',['$scope','documentTemplateFieldService','$interval','$uibModal','$document','$rootScope','$stateParams','moment','$cookieStore','toaster','ticketService','messageService',function($scope,documentTemplateFieldService ,$interval,$uibModal,$document, $rootScope,$stateParams,moment,$cookieStore,toaster,ticketService,messageService){
                var self =  this;

                   $scope.filteredTickets = []
                    ,$scope.currentPage = 1
                    ,$scope.itemsPerPage = 5
                    ,$scope.maxSize = 5;
                    $scope.searchText={};

                    $scope.searchText.ticketStatus = "open";

                    
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

                self.dataExport = function(){
                    ticketService.getMyTicketsExport()
                                .then(function(data){
										//self.tickets = tickets.data;
                                       // $scope.filteredTickets = tickets.data.slice(0,$scope.numPerPage);
                                    console.log(data);
                                       console.log(encodeURI(data));
                                      if (window.navigator.msSaveOrOpenBlob) {
                                        var blob = new Blob([data]);  //csv data string as an array.
                                        // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
                                        window.navigator.msSaveBlob(blob, "Report.xls");
                                    } else {
                                        var anchor = angular.element('<a/>');
                                        anchor.css({display: 'none'}); // Make sure it's not visible
                                        angular.element(document.body).append(anchor); // Attach to document for FireFox

                                        anchor.attr({
                                            href: 'data:attachment/xls;charset=utf-8,' + encodeURI(data),
                                            target: '_blank',
                                            download:"Report.xls"
                                    })[0].click();
                                    anchor.remove();
                                    }
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
                                             //console.log("State parameter is"+$stateParams.id);
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

                self.closeTicket = function(id){
                    ticketService.closeTicket(id).then(list($scope, $stateParams), function(errResponse){
										console.log('error picking ticket');
									});
                };
                


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

                self.openComanager = function(parent , data ){

                    
                    self.modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'coManagerTemplate.html',
                        controller : function($uibModalInstance,ticketService , $scope , $state){
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
                        list($scope, $stateParams);
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
                };







                /**
                 * Modal service
                 */
                self.open = function(parent , documentId ){

                    
                    self.modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'myModalContent.html',
                        controller : function($uibModalInstance , $scope ,$state){


                            var self=this;
                            self.document={};
                            this.document.documentType="";
                            this.cancel = function(){
                                $uibModalInstance.dismiss('cancel');
                            };

                            self.submit = function(data){
                                if(data.documentType){
                                    data.approvalDoneBy = $rootScope.user.sessionId ;
                                    documentTemplateFieldService.approveDocument(data , documentId)
                                .then(function(doc){
                                        $uibModalInstance.dismiss('cancel');
                                        $state.reload();
									},function(errResponse){
                                       
										console.log('error fetching designations');
									});
                                }else{

                                }
                            };

                            $scope.approvedDoc=[];
                            $scope.render=function(data){
                                self.document.docAdditionalDetail=[];


                                //Data Set Here
                                if(data){
                                    data.fields.forEach(function(item){
                                        var temp_data ={
                                            fieldName : item.fieldName ,
                                            fieldValue : ""
                                        }

                                        self.document.docAdditionalDetail.push(temp_data);
                                    });
                                    documentTemplateFieldService.fetchApprovedDocById(data._id)
                                .then(function(docs){
                                        if(docs.data){
                                            $scope.approvedDoc = docs.data.designations;
                                            self.document.approvedBy=[];
                                        }else{
                                            $scope.approvedDoc = [];
                                            self.document.approvedBy=[];
                                        }
										
                                       // $scope.filteredTickets = tickets.data.slice(0,$scope.numPerPage);
									},function(errResponse){
                                        $scope.approvedDoc =[];
										console.log('error fetching designations');
									});
                                }
                                


                                
                                
                            }
                        },
                        controllerAs :'ctrl3',
                        scope : $scope,
                        size: 'md',
                        appendTo: angular.element($document[0].querySelector(parent)),
                        resolve: {
                            
                        }
                    });
                    //add

                };






                /**
                 * Modal service
                 */
                self.closeTicketModal = function(parent ,ticketId ){

                    console.log(ticketId);
                    self.modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'closingTicket.html',
                        controller : function($uibModalInstance ,ticketService , $scope ,$state){
                            var self = this;
                            self.closingNote="";
                            
                            self.submit=function(notes){
                                var data={};
                                data.closingNote = notes;
                                ticketService.closeTicket(ticketId ,data).then(function(response){
                                    $state.reload();
                                }, function(errResponse){
										console.log('error picking ticket');
									});
                            };
                            self.cancel = function(){
                                $uibModalInstance.dismiss('cancel');
                            }; 
                                
                            
                        },
                        controllerAs :'closeCtrl',
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
$(function(){

    angular.module('apolloApp')
            .controller('TicketController',['$scope','$uibModal','$document','toaster','Upload','$timeout','ticketService','ngProgressFactory',function($scope,$uibModal,$document,toaster,Upload,$timeout ,ticketService,ngProgressFactory){

                var self = this ;
                $scope.progressbar = ngProgressFactory.createInstance();
                self.ticket = {
                    firstName : "",
                    lastName : "",
                    email : "",
                    location :"",
                    designation : "",
                    ticketPriority : "0",
                    ticketNotes : "",
                    markDirectTo:"",
                    ticketType:"transactionalType",
                    replyByDate : new Date(),
                    transactionType : "opinion",
                    transactionType2 : "",
                    transactionFinalDate : null,
                    transactionNewOrExisting : "new",
                    transactionDocumentType : "",
                    transactionAdditionalDetails:[],
                    transactionNotes : "" ,
                    litigationNoticeReceived : "N",
                    litigationNoticeFrom : "",
                    litigationNoticeAgainst : "",
                    litigationOpposingLawyer : "",
                    litigationContactAddress : "",
                    litigationContactEmail : "",
                    litigationCourt : "A",
                    litigationCouselAppointed : "Y",
                    litigationCouselAddress : "",
                    litigationCouselPhone : "",
                    litigationCouselEmail : "",
                    litigationCourtLocation : "",
                    litigationAmount : "",
                    othersNotes : "",
                    documents : []

                }


                $scope.replyByDate_popup={
                    opened : false
                };

                $scope.transactionFinalDate_popup ={
                    opened : false
                };

                $scope.popup1_open = function(){
                    //alert('opened');
                    $scope.replyByDate_popup.opened = true;
                };

                $scope.popup2_open = function(){
                    //alert(self.ticket.replyByDate);
                    $scope.transactionFinalDate_popup.opened = true;
                };
                $scope.minDateFinal = new Date();
                $scope.$watch(angular.bind(this,function(){
                    return this.ticket.replyByDate;
                }), function(newValue, oldValue) {
                    $scope.minDateFinal=new Date(newValue);
                });
                
                 $scope.dateOptions = {
                    dateDisabled: false,
                    formatYear: 'yy',
                    maxDate: new Date(2020, 5, 22),
                    minDate: new Date(),
                    startingDay: 1
                };
                $scope.dateOptions2 = {
                    dateDisabled: false,
                    formatYear: 'yy',
                    maxDate: new Date(2020, 5, 22),
                    minDate:new Date($scope.minDateFinal),
                    startingDay: 1
                };
                

                /**
                 * Multiple Upload file functionality
                 */
                
                 $scope.uploadFiles = function(files, errFiles) {
                    $scope.files = files;
                    $scope.errFiles = errFiles;
                    //$scope.progressbar.start();
                    angular.forEach(files, function(file) {
                        file.upload = Upload.upload({
                            url: 'https://apollo-node.herokuapp.com/api/upload',
                            data: {document: file}
                        });

                        file.upload.then(function (response) {
                            $timeout(function () {
                                file.result = response.data;
                                self.ticket.documents.push(response.data.path);
                                //$scope.progressbar.complete();
                                
                            });
                        }, function (response) {
                            if (response.status > 0)
                                $scope.errorMsg = response.status + ': ' + response.data;
                        }, function (evt) {
                            file.progress = Math.min(100, parseInt(100.0 * 
                                                    evt.loaded / evt.total));
                        });
                    });
                };


                self.submit= function(){
                    console.log("ticket value is ");
                    console.log(self.ticket);
                    ticketService.createTicket(self.ticket)
									. then(function(response){
                                        console.log('ticket created');
                                        console.log(response);
                                        self.reset();
                                        
                                        toaster.pop({
                                            type: 'success',
                                            title: 'Ticket Created',
                                            body: 'Ticket is successfully created.',
                                            timeout: 2000
                                        });

                                    }, 
                                        function(errResponse){
									        console.log('error creating ticket');
                                            console.log(errResponse)
                                            self.reset();

                                            toaster.pop({
                                                type: 'error',
                                                title: 'Error',
                                                body: 'Unexpected error , try again!',
                                                timeout: 2000
                                            });
									});
                };

                self.reset = function(){

                    self.ticket = {
                        firstName : "",
                        lastName : "",
                        email : "",
                        location :"",
                        designation : "",
                        ticketPriority : "0",
                        ticketNotes : "",
                        markDirectTo:"",
                        ticketType:"transactionalType",
                        replyByDate : new Date(),
                        transactionType : "opinion",
                        transactionType2 : "",
                        transactionFinalDate : new Date(),
                        transactionNewOrExisting : "new",
                        transactionDocumentType : "medico_legal",
                        transactionNotes : "" ,
                        litigationNoticeReceived : "N",
                        litigationNoticeFrom : "",
                        litigationNoticeAgainst : "",
                        litigationOpposingLawyer : "",
                        litigationContactAddress : "",
                        litigationContactEmail : "",
                        litigationCourt : "A",
                        litigationCouselAppointed : "Y",
                        litigationCouselAddress : "",
                        litigationCouselPhone : "",
                        litigationCouselEmail : "",
                        litigationCourtLocation : "",
                        litigationAmount : "",
                        othersNotes : "",
                        documents : []

                    }
                    $scope.files = "";
                    $scope.errFiles = "";
                };



                /**
                 * Modal service
                 */
                self.open = function(parent , data ){

                    self.ticket.transactionAdditionalDetails=[];

                    data.fields.forEach(function(item){
                        var temp_data ={
                            fieldName : item.fieldName ,
                            fieldValue : ""
                        }

                        self.ticket.transactionAdditionalDetails.push(temp_data);
                    });
                    
                    self.modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'myModalContent.html',
                        controller : function($uibModalInstance , $scope){
                            this.cancel = function(){
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
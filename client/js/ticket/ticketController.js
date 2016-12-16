$(function(){

    angular.module('apolloApp')
            .controller('TicketController',['$scope','toaster','Upload','$timeout','ticketService',function($scope,toaster,Upload,$timeout ,ticketService){

                var self = this ;

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


                $scope.replyByDate_popup={
                    opened : false
                };

                $scope.transactionFinalDate_popup ={
                    opened : false
                };

                $scope.popup1_open = function(){
                    alert('opened');
                    $scope.replyByDate_popup.opened = true;
                };

                $scope.popup2_open = function(){
                    $scope.transactionFinalDate_popup.opened = true;
                };

                 $scope.dateOptions = {
                    dateDisabled: false,
                    formatYear: 'yy',
                    maxDate: new Date(2020, 5, 22),
                    minDate: new Date(),
                    startingDay: 1
                };



                /**
                 * Multiple Upload file functionality
                 */

                 $scope.uploadFiles = function(files, errFiles) {
                    $scope.files = files;
                    $scope.errFiles = errFiles;
                    angular.forEach(files, function(file) {
                        file.upload = Upload.upload({
                            url: 'https://apollo-node.herokuapp.com/api/upload',
                            data: {document: file}
                        });

                        file.upload.then(function (response) {
                            $timeout(function () {
                                file.result = response.data;
                                self.ticket.documents.push(response.data.path);
                                
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

                

            }]);
}());
$(function(){
    angular.module('apolloApp')
            .controller('TaskController',['$scope','$document','documentTemplateFieldService','$state','$timeout','$interval','$rootScope','$stateParams','moment','$cookieStore','toaster','ticketService','messageService','ngProgressFactory','Upload','$uibModal',function($scope,$document,documentTemplateFieldService ,$state,$timeout ,$interval ,$rootScope,$stateParams,moment,$cookieStore,toaster,ticketService,messageService,ngProgressFactory,Upload,$uibModal){
                var self =  this;
                $scope.progressbar = ngProgressFactory.createInstance();
                self.task={};
                self.tasks=[];
                self.note="";
                self.fetchTaskData = function(id){
                    ticketService.getTaskDetail(id)
                                .then(function(task){

										self.task = task.msg;
                                        if(!$cookieStore.get('apolloUser')){
                                            if(self.task.status=='closed'){
                                                $state.go('login');
                                            }
                                        }
                                       //// $scope.filteredTickets = tickets.data.slice(0,$scope.numPerPage);
                                       ticketService.getTaskList(self.task.ticketId._id).then(function(data){
                                            self.tasks=data.data.task_list;   
                                       },function(err){
                                          console.log(err); 
                                       });
									},function(errResponse){
										console.log('error fetching designations');
									});
                };



                self.getNotes = function(){
                    messageService.getNote($stateParams.id).then(function(data){
                        $scope.notes=data.data;
                        
                    }, function(err){
                        console.log(err);
                    });
                };


                

                self.sendNotes=function(n_id , s_mail ,type){
                    if($rootScope.user){
                        s_mail = $rootScope.user.email;
                    }

                    var temp={};
                    temp.threadId=n_id;
                    temp.senderEmail = s_mail;
                    temp.note = self.note;
                    if(type==null || type.userType=='legalteam_member'){
                        messageService.sendNote(temp).then(self.getNotes(), function(errResponse){
										console.log('error picking ticket');
									});
                    }
                    self.note="";

                };

                self.closeTask = function(){
                    ticketService.closeTask($stateParams.id).then(self.fetchTaskData($stateParams.id), function(errResponse){
										console.log('error closing task');
									});
                };

                $scope.upload = function(file) {
                    $scope.file = file;
                    //$scope.errFiles = errFiles;
                    $scope.progressbar.start();
                    //console.log(file);
              
                        //console.log("I am called");
                        file.upload = Upload.upload({
                            url: 'https://apollo-node.herokuapp.com/api/upload/task/'+$stateParams.id,
                            data: {document: file}
                        });

                        file.upload.then(function (response) {
                            $timeout(function () {
                                //file.result = response.data;
                                //self.ticket.documents.push(response.data.path);
                                $scope.progressbar.complete();
                                
                            });
                        }, function (response) {
                            if (response.status > 0)
                                $scope.errorMsg = response.status + ': ' + response.data;
                        }, function (evt) {
                            file.progress = Math.min(100, parseInt(100.0 * 
                                                    evt.loaded / evt.total));
                        });
               
                };

                if ($stateParams.id) {
                   self.fetchTaskData($stateParams.id);
                   self.getNotes();
                    $interval(self.getNotes, 5000);
                }else{
                    if(!$cookieStore.get('apolloUser')){
                         $state.go('login');
                    }else{
                         $state.go('dashboard');
                    }   
                }



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
                
            }]);
}());
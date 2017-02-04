$(function(){
    angular.module('apolloApp')
            .controller('TaskController',['$scope','$state','$interval','$rootScope','$stateParams','moment','$cookieStore','toaster','ticketService','messageService',function($scope ,$state,$interval ,$rootScope,$stateParams,moment,$cookieStore,toaster,ticketService,messageService){
                var self =  this;

                self.task={};
                self.tasks=[];
                self.note="";
                self.fetchTaskData = function(id){
                    ticketService.getTaskDetail(id)
                                .then(function(task){
										self.task = task.msg;
                                       //// $scope.filteredTickets = tickets.data.slice(0,$scope.numPerPage);
                                       ticketService.getTaskList(self.task.ticketId).then(function(data){
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
                
            }]);
}());
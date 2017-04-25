$(function(){
    angular.module('apolloApp')
            .controller('ChangePasswordController',['$scope','userMasterService','$interval','$state','$rootScope','$stateParams','moment','$cookieStore','toaster','ticketService','messageService','uiCalendarConfig',function($scope ,userMasterService,$interval,$state, $rootScope,$stateParams,moment,$cookieStore,toaster,ticketService,messageService,uiCalendarConfig){

                var self = this;

                self.newPass="";
                self.confirmPass = "";


                self.submit = function(pass){
											var data = {};
											data.userId = $rootScope.user.sessionId;
											data.password = pass;
											console.log(data);
											userMasterService.adminChangeUserPassword(data)
			          								.then(function(){
                                                          self.newPass="";
                                                          self.confirmPass = "";
                                                          toaster.pop({
                                                            type: 'success',
                                                            title: 'Password Changed',
                                                            body: 'Password Changed successfully.',
                                                            timeout: 2000
                                                        });
                                                      }, function(errResponse){
														self.newPass="";
                                                        self.confirmPass = "";
                                                        toaster.pop({
                                                            type: 'error',
                                                           title: 'Error',
                                                            body: 'Unexpected error , try again!',
                                                            timeout: 2000
                                                        });
													});
										};

                

                



                
            }]);
}());
$(function(){
    'use strict';

    var controller = angular.module('apolloApp');

    controller.controller('LoginController',['$scope','$rootScope','$cookieStore','$state','userMasterService','toaster',function($scope,$rootScope,$cookieStore,$state,userMasterService ,toaster){
        var self = this;

        self.user ={
            email : "",
            password : ""
        };

        self.login=function(){
            userMasterService.loginUser(self.user)
                             .then(function(user){
                                 console.log(user);
                                 self.saveUser(user.data);
                                 toaster.pop({
                                            type: 'success',
                                            title: 'Login success',
                                            body: 'Logged in successfully !',
                                            timeout: 2000
                                        });


                                 $state.go('dashboard');
                             } , function(errResponse){
                                 toaster.pop({
                                                type: 'error',
                                                title: 'Error',
                                                body: 'Unexpected error , try again!',
                                                timeout: 2000
                                    });

                                 console.log("error loggin ");
                             });
        };

        self.saveUser = function(data){
            //console.log(data);
            
            $rootScope.user={};
            $rootScope.user.sessionId = data.id;
            $rootScope.user.email = data.email ;
            $rootScope.user.userType = data.userType;
            $rootScope.user.name = data.name;
            $rootScope.user.token = data.auth_token;
            console.log('session is '+$rootScope);
            $cookieStore.put('apolloUser' , $rootScope.user);
        }
    }]);

}());
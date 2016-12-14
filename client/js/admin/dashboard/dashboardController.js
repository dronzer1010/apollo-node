$(function(){
    angular.module('apolloApp')
            .controller('DashboardController',['$scope','$rootScope','$state','$cookieStore','toaster',function($scope , $rootScope,$state,$cookieStore,toaster){
                var self =  this;

                self.logout = function(){
                    if($cookieStore.get('apolloUser')){
                        $rootScope.user = null;
                        $cookieStore.remove('apolloUser');
                        toaster.pop({
                                            type: 'success',
                                            title: 'Logout Success',
                                            body: 'Logged out successfully !',
                                            timeout: 2000
                                        });
                        $state.go('home');
                    }
                };
            }]);
}());
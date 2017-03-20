$(function(){
    angular.module('apolloApp')
            .controller('DashboardController',['$scope','$rootScope','$state','$cookieStore','toaster',function($scope , $rootScope,$state,$cookieStore,toaster){
                var self =  this;
                self.search1="";
                self.search2="";
                $scope.search = function(query){
                    console.log(query);
                    self.search1="";
                    self.search2="";
                   $state.go('dashboard.document-search' ,{query:query});
                   
                };
                if(!$cookieStore.get('apolloUser')){
                    $state.go('login');
                }
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
                        $state.go('login');
                    }
                };
            }]);
}());
$(function(){
    angular.module('apolloApp')
            .controller('CalendarController',['$scope','$interval','$state','$rootScope','$stateParams','moment','$cookieStore','toaster','ticketService','messageService','uiCalendarConfig',function($scope ,$interval,$state, $rootScope,$stateParams,moment,$cookieStore,toaster,ticketService,messageService,uiCalendarConfig){
                var date = new Date();
		    var d = date.getDate();
		    var m = date.getMonth();
		    var y = date.getFullYear();
                $scope.events = [];
                
                var self =  this;
                var eventDate , currDate;


                $scope.export_cal = function(){
                    html2canvas(document.getElementById('export-calendar'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }],
                    // a string or { width: number, height: number }
                pageSize: 'A5',

  // by default we use portrait, you can change it to landscape if you wish
                pageOrientation: 'landscape',

  // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                //pageMargins: [ 40, 60, 40, 60 ],
                };
                var curr = new Date();
                var name = "Calendar"+curr+'.pdf';
                pdfMake.createPdf(docDefinition).download(name);
            }
        });
                };     



                self.fetchAllEvents = function(){
                    ticketService.getAllEvents()
                                .then(function(events){
										//$scope.events = events.data;
                                        angular.forEach(events.data , function(value){

                                            if(value.type=="ticket"){
                                                eventDate = new Date(value.start);
                                                currDate = new Date();
                                                if(eventDate >= currDate){
                                                    $scope.events.push({
                                                title : value.title,
                                                start : new Date(value.start),
                                                catchy:value.additionalData,
                                                allDay: true,
                                                stick: true,
                                                color: '#2ecc71',
                                                type:"ticket"
                                               
                                            });
                                                }else{
                                                    $scope.events.push({
                                                title : value.title,
                                                start : new Date(value.start),
                                                catchy:value.additionalData,
                                                allDay: true,
                                                stick: true,
                                                color: '#ff0000',
                                                type:"ticket"
                                               
                                            });
                                                }
                                            }else{
                                                eventDate = new Date(value.start);
                                                currDate = new Date();
                                                if(eventDate>=currDate){
                                                    $scope.events.push({
                                                title : value.title,
                                                start : new Date(value.start),
                                                catchy:value.additionalData,
                                                allDay: true,
                                                stick: true,
                                                type : "task"
                                               

                                               
                                            });
                                                }else{
                                                    $scope.events.push({
                                                title : value.title,
                                                start : new Date(value.start),
                                                catchy:value.additionalData,
                                                allDay: true,
                                                stick: true,
                                                color: '#ff0000',
                                                type : "task"
                                               

                                               
                                            });
                                                }
                                            }
                                        });
                                        
                                       //// $scope.filteredTickets = tickets.data.slice(0,$scope.numPerPage);
									},function(errResponse){
										console.log('error fetching events');
									});
                };


                

                self.fetchAllEvents();
                $scope.eventSources=[$scope.events];
                $scope.alertOnEventClick = function(date, jsEvent, view){
                    var data = {id:date.catchy};
                   if(date.type=="ticket"){
                       if($rootScope.user.userType=='legalteam_member'){
                           $state.go('dashboard.myTicketDetails',data);
                       }else{
                           if($rootScope.user.userType=='executive'){
                               $state.go('dashboard.allTicketDetail',data);
                           }else{
                               $state.go('dashboard.adminTicketDetail',data);
                           }
                       }
                       
                   }else{
                       $state.go('task-detail',data);
                   }
                    
                
                };



                $scope.uiConfig = {
                    calendar:{
                        height: 450,
                        editable: true,
                        header:{
                        left: 'month agendaWeek agendaDay',
                        center: 'title',
                        right: 'today prev,next'
                        },
                        eventClick: $scope.alertOnEventClick,
                    },
                    
                };
                
            }]);
}());
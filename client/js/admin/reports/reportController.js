$(function(){
	'use strict' ;
	var controllers = angular.module('apolloApp');

	controllers.controller('ReportController' , ['$scope', 'ticketService' ,function($scope,ticketService){
		var self = this;


        $scope.dateFrom= new Date();
        $scope.dateTo = angular.copy($scope.dateFrom);
        $scope.dateToo  = new Date($scope.dateTo.setMonth($scope.dateTo.getMonth()+4));
        $scope.dateChange = function(date){
            var dateChanged = new Date(date);
            
            $scope.dateToo  = new Date(dateChanged.setMonth(dateChanged.getMonth()+4));  
        };
        self.MedicoFrom = {
            amount : 0 ,
            count : 0
        };
        self.MedicoTo = {
            amount : 0 ,
            count : 0
        };


        self.TaxFrom = {
            amount : 0 ,
            count : 0
        };
        self.TaxTo = {
            amount : 0 ,
            count : 0
        };


        self.NonMedicoCRFrom = {
            amount : 0 ,
            count : 0
        };
        self.NonMedicoCRTo = {
            amount : 0 ,
            count : 0
        };

        self.fetchData = function(from , to){
        
            /**
             * for Medico Legal Cases
             */


            var fetchMedicoFrom = function(from){
                if(!from){
                    from = new Date();
                }else{
                    from = new Date(from);
                }
                var data= {};
                data.ticketType = "medico_legal";
                data.queryDate = from;

            
                ticketService.getReportData(data).then(function(data){
                                        console.log(data);
                                        if(data.data.length==0){
                                            console.log("Hai");
                                            self.MedicoFrom = {
                                                amount : 0 ,
                                                count : 0
                                            };
                                        }else{
                                            //console.log(" NahiHai");
                                            self.MedicoFrom =  data.data[0];
                                        }
										

									},function(errResponse){
										console.log('error fetching Medico Reports');
					});
            };


            var fetchMedicoTo = function(to){
                if(!to){
                    to = new Date();
                }else{
                    to = new Date(to);
                }
                var data= {};
                data.ticketType = "medico_legal";
                data.queryDate = to;

            
                ticketService.getReportData(data).then(function(data){
                                        console.log(data);
                                        if(data.data.length==0){
                                            //console.log("Hai");
                                            self.MedicoTo = {
                                                amount : 0 ,
                                                count : 0
                                            };
                                        }else{
                                            //console.log(" NahiHai");
                                            self.MedicoTo = data.data[0];
                                        }
										

									},function(errResponse){
										console.log('error fetching Medico Reports');
					});
            };






            /**
             * for Medico Legal Cases
             */


            var fetchTaxFrom = function(from){
                if(!from){
                    from = new Date();
                }
                var data= {};
                data.ticketType = "tax_related";
                data.queryDate = from;

            
                ticketService.getReportData(data).then(function(data){
                                        console.log(data);
                                        if(data.data.length==0){
                                            console.log("Hai");
                                            self.TaxFrom = {
                                                amount : 0 ,
                                                count : 0
                                            };
                                        }else{
                                            //console.log(" NahiHai");
                                            self.TaxFrom =  data.data[0];
                                        }
										

									},function(errResponse){
										console.log('error fetching Medico Reports');
					});
            };


            var fetchTaxTo = function(to){
                if(!to){
                    from = new Date();
                }
                var data= {};
                data.ticketType = "tax_related";
                data.queryDate = to;

            
                ticketService.getReportData(data).then(function(data){
                                        console.log(data);
                                        if(data.data.length==0){
                                            //console.log("Hai");
                                            self.TaxTo = {
                                                amount : 0 ,
                                                count : 0
                                            };
                                        }else{
                                            //console.log(" NahiHai");
                                            self.TaxTo = data.data[0];
                                        }
										

									},function(errResponse){
										console.log('error fetching Medico Reports');
					});
            };







            var fetchNonMedicoCRFrom = function(from){
                if(!from){
                    from = new Date();
                }
                var data= {};
                data.ticketType = "non_medico_legal";
                data.subType = "contract_related";
                data.queryDate = from;

            
                ticketService.getReportData(data).then(function(data){
                                        console.log(data);
                                        if(data.data.length==0){
                                            console.log("Hai");
                                            self.NonMedicoCRFrom = {
                                                amount : 0 ,
                                                count : 0
                                            };
                                        }else{
                                            //console.log(" NahiHai");
                                            self.NonMedicoCRFrom =  data.data[0];
                                        }
										

									},function(errResponse){
										console.log('error fetching Medico Reports');
					});
            };


            var fetchNonMedicoCRTo = function(to){
                if(!to){
                    from = new Date();
                }
                var data= {};
                data.ticketType = "non_medico_legal";
                data.subType = "contract_related";
                data.queryDate = to;

            
                ticketService.getReportData(data).then(function(data){
                                        console.log(data);
                                        if(data.data.length==0){
                                            //console.log("Hai");
                                            self.NonMedicoCRTo = {
                                                amount : 0 ,
                                                count : 0
                                            };
                                        }else{
                                            //console.log(" NahiHai");
                                            self.NonMedicoCRTo = data.data[0];
                                        }
										

									},function(errResponse){
										console.log('error fetching Medico Reports');
					});
            };





            /**
             *  Fetch data
             */

            fetchMedicoFrom(from);
            fetchMedicoTo(to);
            fetchTaxFrom(from);
            fetchTaxTo(to);
            fetchNonMedicoCRFrom(from)
            fetchNonMedicoCRTo(to);




        };
		
	}]);
}());
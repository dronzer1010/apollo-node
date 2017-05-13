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

        self.q_MedicoFrom = {
           
            count : 0
        };
        self.q_MedicoTo = {
            
            count : 0
        };


        self.q_TaxFrom = {
            
            count : 0
        };
        self.q_TaxTo = {
           
            count : 0
        };


        self.NonMedicoCRFrom = {
            amount : 0 ,
            count : 0
        };
        self.NonMedicoLMFrom = {
            amount : 0 ,
            count : 0
        };
        self.NonMedicoSCFrom = {
            amount : 0 ,
            count : 0
        };
        self.NonMedicoLRFrom = {
            amount : 0 ,
            count : 0
        };
        self.NonMedicoPLFrom = {
            amount : 0 ,
            count : 0
        };


        self.q_NonMedicoCRFrom = {
         
            count : 0
        };
        self.q_NonMedicoLMFrom = {
          
            count : 0
        };
        self.q_NonMedicoSCFrom = {
         
            count : 0
        };
        self.q_NonMedicoLRFrom = {
          
            count : 0
        };
        self.q_NonMedicoPLFrom = {
         
            count : 0
        };



        self.NonMedicoCRTo = {
            amount : 0 ,
            count : 0
        };
        self.NonMedicoLMTo = {
            amount : 0 ,
            count : 0
        };
        self.NonMedicoSCTo = {
            amount : 0 ,
            count : 0
        };
        self.NonMedicoLRTo = {
            amount : 0 ,
            count : 0
        };
        self.NonMedicoPLTo = {
            amount : 0 ,
            count : 0
        };


        self.q_NonMedicoCRTo = {
            
            count : 0
        };
        self.q_NonMedicoLMTo = {
            
            count : 0
        };
        self.q_NonMedicoSCTo = {
           
            count : 0
        };
        self.q_NonMedicoLRTo = {
          
            count : 0
        };
        self.q_NonMedicoPLTo = {
           
            count : 0
        };

        self.fetchData = function(from , to){
        

        self.q_NonMedicoCRTo = {
            
            count : 0
        };
        self.q_NonMedicoLMTo = {
            
            count : 0
        };
        self.q_NonMedicoSCTo = {
           
            count : 0
        };
        self.q_NonMedicoLRTo = {
          
            count : 0
        };
        self.q_NonMedicoPLTo = {
           
            count : 0
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
        self.NonMedicoLMFrom = {
            amount : 0 ,
            count : 0
        };
        self.NonMedicoSCFrom = {
            amount : 0 ,
            count : 0
        };
        self.NonMedicoLRFrom = {
            amount : 0 ,
            count : 0
        };
        self.NonMedicoPLFrom = {
            amount : 0 ,
            count : 0
        };
        self.NonMedicoCRTo = {
            amount : 0 ,
            count : 0
        };
        self.NonMedicoLMTo = {
            amount : 0 ,
            count : 0
        };
        self.NonMedicoSCTo = {
            amount : 0 ,
            count : 0
        };
        self.NonMedicoLRTo = {
            amount : 0 ,
            count : 0
        };
        self.NonMedicoPLTo = {
            amount : 0 ,
            count : 0
        };







            /**
             * for Medico Legal Cases
             */
            console.log(new Date());
            console.log(from);
            console.log(to);

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
                }else{
                    from = new Date(from);
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
                    to = new Date();
                }else{
                    to = new Date(to);
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
                }else{
                    from = new Date(from);
                }
                var data= {};
                data.ticketType = "non_medico_legal";
                //data.subType = "contract_related";
                data.queryDate = from;

            
                ticketService.getReportData(data).then(function(data){
                                        console.log(data);
                                        if(data.data.length==0){
                                            console.log("Hai");
                                            self.NonMedicoCRFrom = {
                                                amount : 0 ,
                                                count : 0
                                            };
                                            self.NonMedicoLMFrom = {
                                                amount : 0 ,
                                                count : 0
                                            };
                                            self.NonMedicoSCFrom = {
                                                amount : 0 ,
                                                count : 0
                                            };
                                            self.NonMedicoLRFrom = {
                                                amount : 0 ,
                                                count : 0
                                            };
                                            self.NonMedicoPLFrom = {
                                                amount : 0 ,
                                                count : 0
                                            };
                                        }else{
                                            //console.log(" NahiHai");
                                            data.data.forEach(function(datum){
                                                if(datum._id == 'contracts_related'){
                                                    self.NonMedicoCRFrom = datum;
                                                }else if(datum._id == 'land_matters'){
                                                    self.NonMedicoLMFrom = datum;
                                                }
                                                else if(datum._id == 'labour_related'){
                                                    self.NonMedicoLRFrom = datum;
                                                }
                                                else if(datum._id == 'statutory_compliance'){
                                                    self.NonMedicoSCFrom = datum;
                                                }
                                                else if(datum._id == 'pharmacy_licenses'){
                                                    self.NonMedicoPLFrom = datum;
                                                }
                                            });
                                            // /self.NonMedicoCRFrom =  data.data[0];
                                        }
										

									},function(errResponse){
										console.log('error fetching Medico Reports');
					});
            };


            var fetchNonMedicoCRTo = function(to){
                if(!to){
                    to = new Date();
                }else{
                    to = new Date(to);
                }
                var data= {};
                data.ticketType = "non_medico_legal";
                //data.subType = "contract_related";
                data.queryDate = to;

            
                ticketService.getReportData(data).then(function(data){
                                        console.log(data);
                                        if(data.data.length==0){
                                            //console.log("Hai");
                                            self.NonMedicoCRTo = {
                                                amount : 0 ,
                                                count : 0
                                            };
                                            self.NonMedicoLMTo = {
                                                amount : 0 ,
                                                count : 0
                                            };
                                            self.NonMedicoSCTo = {
                                                amount : 0 ,
                                                count : 0
                                            };
                                            self.NonMedicoLRTo = {
                                                amount : 0 ,
                                                count : 0
                                            };
                                            self.NonMedicoPLTo = {
                                                amount : 0 ,
                                                count : 0
                                            };
                                        }else{
                                            //console.log(" NahiHai");
                                             data.data.forEach(function(datum){
                                                if(datum._id == 'contracts_related'){
                                                    self.NonMedicoCRTo = datum;
                                                }else if(datum._id == 'land_matters'){
                                                    self.NonMedicoLMTo = datum;
                                                }
                                                else if(datum._id == 'labour_related'){
                                                    self.NonMedicoLRTo = datum;
                                                }
                                                else if(datum._id == 'statutory_compliance'){
                                                    self.NonMedicoSCTo = datum;
                                                }
                                                else if(datum._id == 'pharmacy_licenses'){
                                                    self.NonMedicoPLTo = datum;
                                                }
                                            });
                                        }
										

									},function(errResponse){
										console.log('error fetching Medico Reports');
					});
            };


            /**
             *      Data Quarter
             *  
             */
            var fetchQuarterNonMedicoCRFrom = function(from , to){
                if(!from){
                    from = new Date();
                }else{
                    from = new Date(from);
                }
                var data= {};
                data.ticketType = "non_medico_legal";
                //data.subType = "contract_related";
                data.queryDate = from;
                data.q_type    = "quarter";
                data.state   = "added";
                data.dateTo    = new Date(to);
            
                ticketService.getReportData(data).then(function(data){
                                        console.log(data);
                                        if(data.data.length==0){
                                            console.log("Hai");
                                            self.q_NonMedicoCRFrom = {
                                               
                                                count : 0
                                            };
                                            self.q_NonMedicoLMFrom = {
                                               
                                                count : 0
                                            };
                                            self.q_NonMedicoSCFrom = {
                                                
                                                count : 0
                                            };
                                            self.q_NonMedicoLRFrom = {
                                                
                                                count : 0
                                            };
                                            self.q_NonMedicoPLFrom = {
                                                
                                                count : 0
                                            };
                                        }else{
                                            //console.log(" NahiHai");
                                            data.data.forEach(function(datum){
                                                if(datum._id == 'contracts_related'){
                                                    self.q_NonMedicoCRFrom = datum;
                                                }else if(datum._id == 'land_matters'){
                                                    self.q_NonMedicoLMFrom = datum;
                                                }
                                                else if(datum._id == 'labour_related'){
                                                    self.q_NonMedicoLRFrom = datum;
                                                }
                                                else if(datum._id == 'statutory_compliance'){
                                                    self.q_NonMedicoSCFrom = datum;
                                                }
                                                else if(datum._id == 'pharmacy_licenses'){
                                                    self.q_NonMedicoPLFrom = datum;
                                                }
                                            });
                                            // /self.NonMedicoCRFrom =  data.data[0];
                                        }
										

									},function(errResponse){
										console.log('error fetching Medico Reports');
					});
            };






            var fetchQuarterNonMedicoCRTo = function(from , to){
                if(!from){
                    from = new Date();
                }else{
                    from = new Date(from);
                }
                var data= {};
                data.ticketType = "non_medico_legal";
                //data.subType = "contract_related";
                data.queryDate = from;
                data.q_type    = "quarter";
                data.state   = "disposed";
                data.dateTo    = new Date(to);
            
                ticketService.getReportData(data).then(function(data){
                                        console.log(data);
                                        if(data.data.length==0){
                                            console.log("Hai");
                                            self.q_NonMedicoCRTo = {
                                               
                                                count : 0
                                            };
                                            self.q_NonMedicoLMTo = {
                                               
                                                count : 0
                                            };
                                            self.q_NonMedicoSCTo = {
                                                
                                                count : 0
                                            };
                                            self.q_NonMedicoLRTo = {
                                                
                                                count : 0
                                            };
                                            self.q_NonMedicoPLTo = {
                                                
                                                count : 0
                                            };
                                        }else{
                                            //console.log(" NahiHai");
                                            data.data.forEach(function(datum){
                                                if(datum._id == 'contracts_related'){
                                                    self.q_NonMedicoCRTo = datum;
                                                }else if(datum._id == 'land_matters'){
                                                    self.q_NonMedicoLMTo = datum;
                                                }
                                                else if(datum._id == 'labour_related'){
                                                    self.q_NonMedicoLRTo = datum;
                                                }
                                                else if(datum._id == 'statutory_compliance'){
                                                    self.q_NonMedicoSCTo = datum;
                                                }
                                                else if(datum._id == 'pharmacy_licenses'){
                                                    self.q_NonMedicoPLTo = datum;
                                                }
                                            });
                                            // /self.NonMedicoCRFrom =  data.data[0];
                                        }
										

									},function(errResponse){
										console.log('error fetching Medico Reports');
					});
            };




            var fetchQuarterTaxFrom = function(from,to){
                if(!to){
                    to = new Date();
                }else{
                    to = new Date(to);
                }
                var data= {};
                data.ticketType = "tax_related";
                data.queryDate = new Date(from);
                data.q_type    = "quarter";
                data.state   = "added";
                data.dateTo    = to;

            
                ticketService.getReportData(data).then(function(data){
                                        console.log(data);
                                        if(data.data.length==0){
                                            //console.log("Hai");
                                            self.q_TaxFrom = {
                                               
                                                count : 0
                                            };
                                        }else{
                                            //console.log(" NahiHai");
                                            self.q_TaxFrom = data.data[0];
                                        }
										

									},function(errResponse){
										console.log('error fetching Medico Reports');
					});
            };




            var fetchQuarterTaxTo = function(from,to){
                if(!to){
                    to = new Date();
                }else{
                    to = new Date(to);
                }
                var data= {};
                data.ticketType = "tax_related";
                data.queryDate = new Date(from);
                data.q_type    = "quarter";
                data.state   = "disposed";
                data.dateTo    = to;

            
                ticketService.getReportData(data).then(function(data){
                                        console.log(data);
                                        if(data.data.length==0){
                                            //console.log("Hai");
                                            self.q_TaxTo = {
                                               
                                                count : 0
                                            };
                                        }else{
                                            //console.log(" NahiHai");
                                            self.q_TaxTo = data.data[0];
                                        }
										

									},function(errResponse){
										console.log('error fetching Medico Reports');
					});
            };




            var fetchQuarterMedicoFrom = function(from , to){
                if(!from){
                    from = new Date();
                }else{
                    from = new Date(from);
                }
                var data= {};
                data.ticketType = "medico_legal";
                data.queryDate = from;
                 data.q_type    = "quarter";
                data.state   = "added";
                data.dateTo    = new Date(to);

            
                ticketService.getReportData(data).then(function(data){
                                        console.log(data);
                                        if(data.data.length==0){
                                            console.log("Hai");
                                            self.q_MedicoFrom = {
                                              
                                                count : 0
                                            };
                                        }else{
                                            //console.log(" NahiHai");
                                            self.q_MedicoFrom =  data.data[0];
                                        }
										

									},function(errResponse){
										console.log('error fetching Medico Reports');
					});
            };

            var fetchQuarterMedicoTo = function(from , to){
                if(!from){
                    from = new Date();
                }else{
                    from = new Date(from);
                }
                var data= {};
                data.ticketType = "medico_legal";
                data.queryDate = from;
                 data.q_type    = "quarter";
                data.state   = "disposed";
                data.dateTo    = new Date(to);

            
                ticketService.getReportData(data).then(function(data){
                                        console.log(data);
                                        if(data.data.length==0){
                                            console.log("Hai");
                                            self.q_MedicoTo = {
                                              
                                                count : 0
                                            };
                                        }else{
                                            //console.log(" NahiHai");
                                            self.q_MedicoTo =  data.data[0];
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
            fetchQuarterNonMedicoCRFrom(from , to);
            fetchQuarterNonMedicoCRTo(from , to);
            fetchQuarterTaxFrom(from , to);
            fetchQuarterTaxTo(from , to);
            fetchQuarterMedicoFrom(from ,to);
            fetchQuarterMedicoTo(from ,to);

        };
		




        self.fetchData($scope.dateFrom , $scope.dateToo);
	}]);
}());
$(function(){
    angular.module('apolloApp')
            .controller('DocumentApprovalController',['$scope','$stateParams','$rootScope','$state','$cookieStore','documentTemplateFieldService',function($scope ,$stateParams, $rootScope,$state,$cookieStore,documentTemplateFieldService){
                var self =  this;
                self.documents =[];
                self.document = {
                    _id : null ,
                    documentId: "",
                    
                    designations : [
                        {
                            designation : ""
                        }
                    ]
                };


                self.fetchAllApprovedDocuments = function(){
                    documentTemplateFieldService.fetchAllApprovedDocumentTemplates()
                                            .then(function(documents){
                                                self.documents = documents.data;
                                            },function(errResponse){
                                                console.log('error fetching designations');
                                            });
                };

                self.fetchAllApprovedDocuments();

                self.updateDocument = function(document , id){
                    documentTemplateFieldService.updateApprovedDocument(document , id)
                                            .then(self.fetchAllApprovedDocuments, function(errResponse){
                                                console.log('error creating  document');
                                            });
                };

                self.deleteDocument = function(id){
                    documentTemplateFieldService.deleteApprovedDocument(id)
                                            .then(self.fetchAllApprovedDocuments, function(errResponse){
                                                console.log('error deleting');
                                            });
                };


                self.remove = function(id){
                    
                    if(self.document._id === id) {//clean the form if the user to be deleted is shown there.
                        self.reset();
                    }
                    self.deleteDocument(id);
                }

                self.addFieldTemplate = function(){
                    var temp_field = {
                        designation : ""
                    };
                    self.document.designations.push(temp_field);
                };

                self.removeField = function(i){
                    self.document.designations.splice(i,1);
                };



                self.createDocument = function(document){
                    documentTemplateFieldService.approveDocumentTemplate(document)
                                                .then(function(){
                                                    console.log("Template created");
                                                     self.fetchAllApprovedDocuments();
                                                }, function(){
                                                    console.log("Some error");
                                                });
                };


                self.edit = function(id){
                    console.log('id to be edited', id);
                    
                    for(var i = 0; i < self.documents.length; i++){
                        if(self.documents[i]._id === id) {
                            self.document = angular.copy(self.documents[i]);
                            break;
                        }
                    }
                }



                self.submit = function(){
                    if(self.document._id===null){
                            
                        self.createDocument(self.document);

                    }else{
                       
                        self.updateDocument(self.document, self.document._id);
                 
                    }
                    
                    self.reset();
                };

                self.reset = function(){
                    self.document = {
                        documentId : "",
                        designations : [
                            {
                                designation : "",     
                            }
                        ]
                    }; 
                };


                //extend

                function findDocument(id){
                    var targetDocument = null;
                    console.log(self.documents);
                    self.documents.forEach(function(document){
                   

                    });
                    
                    return targetDocument;
                };

                // You never actually call this function
                function list($scope, $stateParams) {
                    documentTemplateFieldService.fetchAllApprovedDocumentTemplates()
                                .then(function(tickets){
										self.documents = tickets.data;
                                        var targetDocument = null;
                                         self.documents.forEach(function(document){
                                             if(document._id==$stateParams.id){
                                                 targetDocument = document;
                                             }

                                        });
                                        angular.extend($scope, targetDocument);
									},function(errResponse){
										console.log('error fetching Documents');
									});
                   
                }
                
                if ($stateParams.id) {
                    list($scope, $stateParams);
                    //console.log($scope);
                }


            }]);
}());
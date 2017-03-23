var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
// set up a mongoose model
var DocumentMaster = new Schema({

    documentName :{
        type : String,
        required : true
    },
    ticketId :{
         type: Schema.Types.ObjectId, 
         ref: 'Tickets',
    },
    taskId : {
         type: Schema.Types.ObjectId, 
         ref: 'Tasks',
    },
    nameOfUser:{
        type: String,
        required : true
    },
    emailOfUser : {
        type:String,
        required : true
    },
    notes : {
        type:String,
        
    },
    documentType : {
        type : String,
        //required : true
    },
    documentFileType : {
        type : String,
        //required : true
    },
    renewalDate : {
        type:String,
        //required : true
    },
    parentDocument : {
        type: Schema.Types.ObjectId, 
         ref: 'DocumentMaster',
    },
    relationType : {
        type:String ,
        enum : ['parent' , 'child'],
        default : 'parent'
    },
    documentDescription : {
        type:String    
    },
    documentLocation : {
        type: Schema.Types.ObjectId, 
         ref: 'Locations',
    },
    documentOrigin : {
        type: String,
        enum : ['internal' , 'external'],
        default : 'internal'
    },
    documentLegalTypeId :{
        type: Schema.Types.ObjectId, 
        ref: 'DocumentTemplateField',
    },
    documentUrl : {
        type:String,
        required : true
    },
    approved : {
        type : Boolean ,
        default : false
    },
    additionalDetails :[
      {
          fieldName :{
              type : String
          },
          fieldValue : {
              type:String
          }
      }
  ],

  approvalBy :[{
    type:Schema.Types.ObjectId,
    ref:'Users'
}],

    approvalDoneBy :{
       type:Schema.Types.ObjectId,
        ref:'Users' 
    }


},{
    timestamps: true
});

DocumentMaster.index({'$**': 'text'});
module.exports = mongoose.model('DocumentMaster', DocumentMaster);
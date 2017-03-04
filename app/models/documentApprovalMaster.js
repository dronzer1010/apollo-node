var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
// set up a mongoose model
var DocumentApprovalMaster = new Schema({
  
  documentTemplateId : {
      type: Schema.Types.ObjectId, 
      ref: 'DocumentTemplateField',
  },

  designations :[
      {
          designation :{
             type: Schema.Types.ObjectId, 
             ref: 'Designations',
          }
      }
  ]

},{
    timestamps: true
});



module.exports = mongoose.model('DocumentApprovalMaster', DocumentApprovalMaster);


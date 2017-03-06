var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
// set up a mongoose model
var DocumentTemplateField = new Schema({
  
  
  description:{
    type:String,
    
  },
  legalType : {
    type:String,
    required:true
  },
  mandatory : {
      type:String,
      default : 'N'
  },
  approved :{
      type : Boolean ,
      default : false,
  },
  fields :[
      {
          fieldName :{
              type : String
          },
          fieldType : {
              type:String
          }
      }
  ]

},{
    timestamps: true
});



module.exports = mongoose.model('DocumentTemplateField', DocumentTemplateField);


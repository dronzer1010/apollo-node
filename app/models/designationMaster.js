var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
// set up a mongoose model
var DesignationMaster = new Schema({
  
  
  designation:{
    type:String,
    required:true
  },
  short_name : {
    type:String,
    required:true
  },

},{
    timestamps: true
});



module.exports = mongoose.model('Designations', DesignationMaster);


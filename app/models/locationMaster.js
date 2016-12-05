var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
// set up a mongoose model
var LocationMaster = new Schema({
  
  
  name:{
    type:String,
    required:true
  },
  division : {
    type:String,
    required:true
  },

},{
    timestamps: true
});



module.exports = mongoose.model('Locations', LocationMaster);


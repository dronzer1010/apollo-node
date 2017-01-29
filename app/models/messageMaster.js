var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
// set up a mongoose model
var MessageMaster = new Schema({
  threadId :{
      type: Schema.Types.ObjectId, 
      ref: 'MessageThreads',
  },
  senderId : {
      type:Schema.Types.ObjectId,
      ref : 'Users'
  },
  message : {
      type : String,
      required : true
  }
  

},{
    timestamps: true
});



module.exports = mongoose.model('Messages', MessageMaster);


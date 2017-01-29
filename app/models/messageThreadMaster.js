var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
// set up a mongoose model
var MessageThreadMaster = new Schema({
  ticketId :{
      type: Schema.Types.ObjectId, 
      ref: 'Tickets',
  },
  

},{
    timestamps: true
});



module.exports = mongoose.model('MessageThreads', MessageThreadMaster);


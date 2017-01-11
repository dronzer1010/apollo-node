var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
// set up a mongoose model
var OwnerData = new Schema({
  
  
  ticketId:{
    type: Schema.Types.ObjectId, 
    ref: 'Tickets',
    required : true
  },
  userId : {
    type: Schema.Types.ObjectId, 
     ref: 'Users',
     required : true
  },

},{
    timestamps: true
});



module.exports = mongoose.model('OwnerData', OwnerData);


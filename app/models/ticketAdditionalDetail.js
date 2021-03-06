var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
// set up a mongoose model
var TicketAdditionalDetails = new Schema({
  
  ticketId:{
      type: Schema.Types.ObjectId, 
      ref: 'Tickets',
  },
  documentTemplateId : {
      type: Schema.Types.ObjectId, 
      ref: 'DocumentTemplateField',
  },
  

},{
    timestamps: true
});



module.exports = mongoose.model('TicketAdditionalDetails', TicketAdditionalDetails);


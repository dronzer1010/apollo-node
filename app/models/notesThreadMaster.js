var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
// set up a mongoose model
var NotesThreadMaster = new Schema({
  ticketId :{
      type: Schema.Types.ObjectId, 
      ref: 'Tickets',
  },
  taskId:{
      type: Schema.Types.ObjectId, 
      ref: 'TaskMaster',
  }

},{
    timestamps: true
});



module.exports = mongoose.model('NotesThread', NotesThreadMaster);


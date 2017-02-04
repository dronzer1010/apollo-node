var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
// set up a mongoose model
var NotesMaster = new Schema({
  threadId :{
      type: Schema.Types.ObjectId, 
      ref: 'NotesThread',
  },
  senderEmail : {
      type:String
  },
  note : {
      type : String,
      required : true
  }
  

},{
    timestamps: true
});



module.exports = mongoose.model('NotesMaster', NotesMaster);


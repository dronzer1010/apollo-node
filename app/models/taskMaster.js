var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
// set up a mongoose model
var TaskMaster = new Schema({

    taskMaster : {
        type: Schema.Types.ObjectId, 
        ref: 'Users',
    },
    taskName : {
        type : String,
        required:true
    },
    taskType : {
        type :String ,
        required : true
    },
    taskCompletionDate : {
        type : Date,
        required : true
    },
    taskHandlingLocation : {
        type : String ,
        required :true,
    },
    taskHandlerEmail : {
        type: String ,
        required : true
    },
    taskHandlerName : {
        type : String ,
        required : true
    },
    taskHandlerLocation : {
       type: Schema.Types.ObjectId, 
        ref: 'Locations', 
    },
    taskHandlerContactNo : {
        type: String
    },
    taskPrivacy : {
        type : String,
        
    },
    status : {
        type : String ,
        enum :['open' , 'progress'  , 'closed']
    },
    notesThread : {
        type: Schema.Types.ObjectId, 
        ref: 'NotesThread', 
    },
    




  
  

},{
    timestamps: true
});



module.exports = mongoose.model('Tasks', TaskMaster);


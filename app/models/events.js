var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
// set up a mongoose model
var Events = new Schema({
    type: {
        type : String ,
        enum :['ticket' , 'task'],
        default : 'ticket'
    },
    start : {
        type : Date
    },
    title : {
        type: String
    },
    eventOwner : {
        type: Schema.Types.ObjectId, 
        ref: 'Users',
        default : null
    },
    additionalData : {
        type: String
    },
    ticketRef : {
       type: Schema.Types.ObjectId, 
        ref: 'Tickets',
        default : null 
    },
    taskRef : {
        type: Schema.Types.ObjectId, 
        ref: 'Tasks',
        default : null 
    }

},{
    timestamps: true
});



module.exports = mongoose.model('Events', Events);


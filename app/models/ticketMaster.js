var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
// set up a mongoose model
var TicketMaster = new Schema({
  
  
  firstName : {
      type : String
  },
  lastName : {
      type : String
  } ,
  email : {
      type : String
  } ,
  location : {
      type: Schema.Types.ObjectId, 
      ref: 'Locations',
  },
  designation : {
      type: Schema.Types.ObjectId, 
      ref: 'Designations',
  },
  ticketPriority : {
    type:String ,
 
  	default : 'low'
  } ,
  ticketNotes : {
      type : String
  },
  markDirectTo : {
     type: Schema.Types.ObjectId, 
     ref: 'Users', 
  },
  ticketType : {
    type:String ,

  	default : 'transactionalType' 
  },
  replyByDate :{
      type : Date
  },
  transactionalDetails : {

      type : {
          type : String,

          default : 'opinion'

      },
      finalDate : {
          type : Date
      },
      newOrExisting : {
          type : String,
          default : 'new'
      },
      documentType : {
          type : String
      },
      notes : {
          type : String
      }

  },
  litigationalDetails : {
      noticedReceived : {
          type : String ,
          default : 'N'
      },
      noticeFrom : {
          type  : String
      },
      noticeAgainst : {
          type : String
      },
      opposingLawyer : {
          type : String 
      },
      contactAddress : {
          type : String 
      },
      contactEmail : {
          type : String 
      },
      court : {
          type : String 
      },
      counselAppointed : {
          type : String ,
          default : 'Y'
      },
      counselAddress : {
          type : String 
      },
      counselPhone : {
          type :String 
      },
      counselEmail : {
          type : String
      },
      courtLocation : {
          type : String , 
      },
      amount : {
          type : String
      }


  },
  othersDetails : {
      notes : {
          type : String
      }
  },
  attachedDocuments : {
      type : [String]
  }

},{
    timestamps: true
});



module.exports = mongoose.model('Tickets', TicketMaster);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
// set up a mongoose model
var TicketMaster = new Schema({
  
  isPicked : {
      type : Boolean ,
      required : true
  },
  
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
      transactionType : {
          type: Schema.Types.ObjectId, 
          ref: 'DocumentTemplateField',
      },
      additionalDetails :[
      {
          fieldName :{
              type : String
          },
          fieldValue : {
              type:String
          }
      }
  ],
      finalDate : {
          type : Date
      },
      newOrExisting : {
          type : String,
          default : 'new'
      },
      documentType : {
          type: Schema.Types.ObjectId, 
          ref: 'DocumentTemplateField',
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
          type : Number,
          default:0
      }


  },
  othersDetails : {
      notes : {
          type : String
      }
  },
  attachedDocuments : [{
      type: Schema.Types.ObjectId, 
        ref: 'DocumentMaster',
  }
  ],
  ticketOwner:{
    type: Schema.Types.ObjectId, 
    ref: 'Users', 
  },
  ticketCo_Owners:[{
      type: Schema.Types.ObjectId, 
        ref: 'Users',
  }],
task_list:[{
    type:Schema.Types.ObjectId,
    ref:'Tasks'
}],
messageThread : {
        type: Schema.Types.ObjectId, 
        ref: 'MessageThreads',
},
ticketStatus : {
    type:String,
    enum:['open','inprogress' ,'closed'],
    default : 'open'
}
},{
    timestamps: true
});



module.exports = mongoose.model('Tickets', TicketMaster);
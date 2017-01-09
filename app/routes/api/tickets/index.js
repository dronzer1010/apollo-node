var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();
var jwt      = require('jwt-simple');
var Ticket = require(__base + 'app/models/ticketMaster');
var config = require(__base + 'app/config/database');

router.post('/' , function(req,res){

    if(!req.body.firstName || !req.body.email || !req.body.location || !req.body.designation ||!req.body.replyByDate || !req.body.ticketType){
        res.status(200).send({success : false , msg : "Invalid parameters"});
    }else{
        var newTicket = new Ticket({
            firstName : req.body.firstName ,
            lastName : (req.body.lastName)?req.body.lastName :'',
            email : req.body.email ,
            location : req.body.location ,
            designation : req.body.designation ,
            ticketPriority : req.body.ticketPriority,
            ticketNotes : (req.body.ticketNotes)?req.body.ticketNotes : '',
            markDirectTo : (req.body.markDirectTo)?req.body.markDirectTo : null ,
            isPicked : (req.body.markDirectTo)?"some" :"false",
            ticketType : req.body.ticketType,
            replyByDate : req.body.replyByDate ,
            transactionalDetails : {
                type : (req.body.ticketType == 'transactionalType')?req.body.transactionType : null ,
                finalDate : (req.body.ticketType == 'transactionalType')?req.body.transactionFinalDate : null,
                newOrExisting : (req.body.ticketType == 'transactionalType')?req.body.transactionNewOrExisting : null,
                documentType : (req.body.ticketType == 'transactionalType')?req.body.transactionDocumentType : null,
                notes : (req.body.ticketType == 'transactionalType')?req.body.transactionNotes : null,
            },
            litigationalDetails : {
                noticeReceived : (req.body.ticketType == 'litigationalType')?req.body.litigationNoticeReceived : null ,
                noticeFrom : (req.body.ticketType == 'litigationalType')?req.body.litigationNoticeFrom : null ,
                noticeAgainst : (req.body.ticketType == 'litigationalType')?req.body.litigationNoticeAgainst : null ,
                opposingLawyer : (req.body.ticketType == 'litigationalType')?req.body.litigationOpposingLawyer : null ,
                contactAddress : (req.body.ticketType == 'litigationalType')?req.body.litigationContactAddress : null ,
                contactEmail : (req.body.ticketType == 'litigationalType')?req.body.litigationContactEmail : null,
                court : (req.body.ticketType == 'litigationalType')?req.body.litigationCourt : null ,
                counselAppointed : (req.body.ticketType == 'litigationalType')?req.body.litigationCounselAppointed : null ,
                counselAddress : (req.body.ticketType == 'litigationalType')?req.body.litigationCounselAddress : null ,
                counselPhone : (req.body.ticketType == 'litigationalType')?req.body.litigationCounselPhone : null ,
                counselEmail : (req.body.ticketType == 'litigationalType')?req.body.litigationCounselEmail : null,
                courtLocation : (req.body.ticketType == 'litigationalType')?req.body.litigationCourtLocation : null,
                amount : (req.body.ticketType == 'litigationalType')?req.body.litigationAmount : null,
            },
            othersDetails : {
                notes :(req.body.ticketType == 'othersType')?req.body.othersNotes : null,
            },
            attachedDocuments : (req.body.documents)?req.body.documents:[] 

        });


        newTicket.save(function(err , data){
            if(!err){
                res.status(200).send({success :true , data : data});
            }else{

                res.status(400).send({success:false , msg : err});
            }
        });
    }

});




//route to get all tickets
router.get('/',function(req,res){
    var token = getToken(req.headers);

    if(token){
        var decoded = jwt.decode(token, config.secret);
        var populateQuery = [{path:'designation'},{path:'location'}];
        Ticket.find( { $or:[ {markDirectTo : decoded._id}, {markDirectTo : null}]})
                .populate(populateQuery)
                .exec( function(err,docs){
                if(!err){
                    res.status(200).send({success : true , data : docs});
                }else{
                    res.status(400).send({success : false , msg : err});
                }
            });
    }else{
        res.status(403).send({success : false , msg : "Token not provided"});
    }
});

/**
 *  Generic token parsing function
 */
var getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};


module.exports = router;
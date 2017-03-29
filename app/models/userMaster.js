var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
 
// set up a mongoose model
var UserMaster = new Schema({
  
  
  firstName:{
    type:String,
    required:true
  },
  lastName : {
    type:String,
    
  },
  password:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique : true
  },
  location :{
  	type: Schema.Types.ObjectId, 
    ref: 'Locations',
    required:true 
  },
  designation :{
  	type: Schema.Types.ObjectId, 
    ref: 'Designations',
    required:true 
  },
  userType :{
  	type:String ,
  	enum : ['admin','legalteam_member' ,'executive','senior_counsel' ,'local_manager'],
  	default : 'legalteam_member'
  },
  markDirect :{
  	type : Boolean ,
  	default : false
  },
  active :{
  	type : Boolean ,
  	default : false
  },
  markAsDeleted :{
  	type : Boolean ,
  	default : false
  }

},{
    timestamps: true
});

UserMaster.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
 
UserMaster.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Users', UserMaster);


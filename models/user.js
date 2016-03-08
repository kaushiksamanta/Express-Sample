var mongoose = require('mongoose');
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/nodeauth');
var bcrypt = require('bcryptjs');
//User schema
var UserSchema = mongoose.Schema({
  username:{
    type:String,
    index:true
  },
  password:{
    type:String
  },
  email:{
    type:String
  },
  profileimage:{
    type: String
  }
});

 var User = module.exports = mongoose.model('User',UserSchema);

  module.exports.getUserByUsername = function(newUser,callback) {
    console.log("---------------------------------getUserByUsername--------------------------------");
    var query={username:username};
    User.findOne(id,callback);
  }
  module.exports.comparePassword = function (candidatePassword,hash,callback) {
    console.log("---------------------------------comparePassword--------------------------------");
    bcrypt.compare(candidatePassword,hash,function(err,isMatch) {
      if(err) return callback(err);
      callback(null,isMatch);
    })
  }
  module.exports.getUserById = function(id,callback) {
    console.log("---------------------------------getUserById--------------------------------");
    User.findById(query,callback);
  }
 module.exports.createUser = function(newUser,callback) {
   bcrypt.hash(newUser.password,10, function(err, hash) {
     if (err) throw err;
     newUser.password = hash;
     newUser.save(callback);
  });
 }

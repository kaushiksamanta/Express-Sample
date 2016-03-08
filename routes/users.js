var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/register',upload.single('profileimage'),function(req,res,next) {
  console.log('Inside Register...');
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  console.log(req.body);
  console.log(req.file);
  //check for Image Feild
  if(req.file){
    console.log('Uploading File...');

    //file Info
    var profileImageOriginalName = req.file.fieldname;
    var profileImageName         = req.file.name;
    var profileImageMime         = req.file.mimetype;
    var profileImagePath         = req.file.path;
    var profileImageencoding     = req.file.encoding;
    var profileImageSize         = req.file.size;
  }
  else {
    // set a default Image
    console.log('error');
    var profileImageName = 'noimage.png';
  }

  //Form validation
  req.checkBody('name','Name Feild is required').notEmpty();
  req.checkBody('email','Email Feild is required').notEmpty();
  req.checkBody('email','Email not valid').isEmail();
  req.checkBody('username','Username Feild is required').notEmpty();
  req.checkBody('password','Password Feild is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);


  //check for errors
  var errors = req.validationErrors();

  if(errors){
    res.render('register',{
        errors:errors,
        name:name,
        email:email,
        username:username,
        password:password,
        password2:password2
    });
  }
  else {
    var newUser = new User({
        name:name,
        email:email,
        username:username,
        password:password,
        password2:password2,
        profileimage:profileImageName
    });

    //Create User
    User.createUser(newUser,function(err,user) {
        if(err) throw err;
        console.log(user);
    });

    // Success message
    req.flash('success','You are now registered and may log in ');

    res.location('/');
    res.redirect('/');
  }
});

passport.serializeUser(function(user,done) {
  console.log("---------------------------------Inside serializeUser--------------------------------");
  done(null,user.id);
});
passport.deserializeUser(function(id,done) {
  console.log("---------------------------------Inside deserializeUser--------------------------------");
  User.getUserById(id,function(err,user) {
    done(err,user);
  })
});

passport.use(new LocalStrategy(
  function(username,password,done) {
    console.log("---------------------------------Inside LocalStrategy--------------------------------");
      User.getUserByUsername(username,function(err,user) {
        if(err) throw err;
        if(!user){
          console.log("unknown user");
          return done(null,false,{message:'Unknown User'});
        }
        User.comparePassword(password, user.password,function(err,isMatch) {
          if(err) throw err;
          if(isMatch){
            return done(null,user);
          }
          else {
            console.log('Invalid Password');
            return done(null,false,{message:'Invalid Password'});
          }
        });
      });
  }
));
router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'invalid username or password'}),function(req,res) {
  console.log('Authentication Sucess');
  req.flash('success','You are logged in');
  res.redirect('/');
});
// router.post('/login', function(req, res, next) {
//   console.log(req.body);
// });

module.exports = router;

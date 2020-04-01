const bcrypt = require('bcrypt'), //for encryption of password..
mongoose = require('mongoose'),
Schema = mongoose.Schema,
jwt = require('jsonwebtoken'),
config = require('../config');


const userSchema = new Schema({
    name: {
        type: String,
        min: [4, 'Too short min character is 4 charcter'],
        max: [32, 'Too long max character is 32 charcter'],
        required: 'First name is to short must be at least 4 characters.'
    },
    lastname: {
      type: String,
      min: [4, 'Too short min character is 4 charcter'],
      max: [32, 'Too long max character is 32 charcter'],
      required: 'Last name is to short must be at least 4 characters.'
    },
    cart: {
      type: Array,
      default: []
    },
    history: {
      type: Array,
      default: []
    },
    email:{
        type: String,
        min: [4, 'Too short min character is 4 charcter'],
        max: [32, 'Too long max character is 32 charcter'],
        unique: true,
        lowercase: true,
        required: 'Email is required',
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        min: [4, 'Too short min character is 4 charcter'],
        max: [32, 'Too long max character is 32 charcter'],
        required: 'Password is required'
    },
    role: {
      type: Number,
      default: 0
    },
    token: {
      type: String
    }
})

//check if password is the same as password on file
userSchema.methods.hasSamePassword = function(requestedPassword){
    return bcrypt.compareSync(requestedPassword, this.password);
}

//encrypt password..
userSchema.pre('save', function(next) {
    const user = this;
    
    if(user.isModified('password')) {
      bcrypt.genSalt(10, function(err, salt) {
        if(err) return next(err);
  
        bcrypt.hash(user.password, salt, function(err, hash) {
          if(err) return next(err);
            // Store hash in your password DB.
            user.password = hash;
            next();
        });
      });
    } else {
      next();
    }
})

userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch){
    if(err) {return cb(err)};
    cb(null,isMatch)
  })
}

userSchema.methods.generateToken = function(cb) {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), config.SECRET);

  user.token = token;
  user.save(function(err, user) {
    if(err) {return cb(err)};
    cb(null, user);
  })
}

userSchema.statics.findByToken = function(token, cb) {
  const user = this;

  jwt.verify(token, config.SECRET, function(err, decode) {
    user.findOne({"_id": decode, "token": token}, function(err, user){
      if(err) {return cb(err)};
      cb(null, user);
    })
  })

}

const User = mongoose.model('User',userSchema);

module.exports = { User }

//module.exports = mongoose.model('User', userSchema);

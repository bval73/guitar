const { User } = require('./../models/user');

let admin = (req, res, next) => {

  if(req.user.role === 0) {
    return res.send('You are not authorized to perform this function')
  }
  next();

}

module.exports = { admin };


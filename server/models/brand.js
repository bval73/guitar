const mongoose = require('mongoose'),
      Schema = mongoose.Schema



const brandSchema = new Schema({
  name: {
    required: true, 
    type: String,
    unique: 1,
    maxlength: 100
  }
});


const Brand = mongoose.model('Brand',brandSchema);

module.exports = { Brand }

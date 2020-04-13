const mongoose = require('mongoose'),
      Schema = mongoose.Schema

const productSchema = new Schema({
  name: {
    required: true, 
    type: String,
    maxlength: 100
  },
  description: {
    required: true, 
    type: String,
    maxlength: 10000
  },
  price: {
    required: true, 
    type: Number,
    maxlength: 255
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  shipping: {
    required: true,
    type: Boolean
  },
  available: {
    required: true,
    type: Boolean
  },
  wood: {
    type: Schema.Types.ObjectId,
    ref: 'Wood',
    required: true,
  },
  frets: {
    required: true,
    type: Number
  },
  sold: {
    type: Number,
    maxlength: 100,
    default: 0
  },
  publish: {
    required: true,
    type: Boolean
  },
  images: {
    type: Array,
    default: []
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
//    required: true
  }
},{timestamps: true});

//module.exports = mongoose.model('Product', productSchema);
const Product = mongoose.model('Product', productSchema);
module.exports = { Product }
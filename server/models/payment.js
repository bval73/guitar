const mongoose = require('mongoose')
      Schema = mongoose.Schema

const paymentSchema = new Schema({
  user: {
    type: Array,
    default: []
  },
  data: {
    type: Array,
    default: []
  },
  product: {
    type: Array,
    default: []
  },

})

const Payment = mongoose.model('Payment',paymentSchema);

module.exports = { Payment }
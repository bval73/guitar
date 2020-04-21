const mongoose = require('mongoose'),
      Schema = mongoose.Schema

const siteSchema = new Schema({
  featured: {
    required: true,
    type: Array,
    default: []
  },
  siteInfo: {
    required: true,
    type: Array,
    default: []
  }
})

const Site = mongoose.model('Site',siteSchema);

module.exports = { Site }

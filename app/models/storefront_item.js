const mongoose = require('mongoose')

const storefrontItemSchema = new mongoose.Schema({
  warehouseItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WarehouseItem',
    requried: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('StorefrontItem', storefrontItemSchema)

const mongoose = require('mongoose')

/* ~~~~~~~~~~~~~~Inventory Model Begins Here~~~~~~~~~~~~~~~~~~~ */
const warehouseItemSchema = new mongoose.Schema({
  name: {
    type: String,
    requried: true
  },
  price: {
    // cents
    type: Number,
    required: true,
    min: 0
  }
})
/* ~~~~~~~~~~~~~~Inventory Model Ends Here ~~~~~~~~~~~~~~~~~~~~ */

module.exports = mongoose.model('WarehouseItem', warehouseItemSchema)

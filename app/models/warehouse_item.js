const mongoose = require('mongoose')

/* ~~~~~~~~~~~~~~Inventory Model Begins Here~~~~~~~~~~~~~~~~~~~ */
const warehouseItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    // cents
    type: Number,
    required: true,
    min: 0
  }
},
{
  collection: 'warehouseItems'
})
/* ~~~~~~~~~~~~~~Inventory Model Ends Here ~~~~~~~~~~~~~~~~~~~~ */

module.exports = mongoose.model('WarehouseItem', warehouseItemSchema)

// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
// pull in Mongoose model for item
const WarehouseItem = require('../models/warehouse_item')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

/* ~~~~~~~~~~~~~~~~~~~~~~~ Routes Start Here ~~~~~~~~~~~~~~~~~~ */

// INDEX
// Get /
router.get('/warehouse', requireToken, (req, res, next) => {
  WarehouseItem.find()
    .then(items => {
      // `items` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return items.map(item => item.toObject())
    })
    // respond with status 200 and JSON of the examples
    .then(items => res.status(200).json({ items: items }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

/* ~~~~~~~~~~~~~~~~~~~~~~~ Routes End Here ~~~~~~~~~~~~~~~~~~ */

module.exports = router

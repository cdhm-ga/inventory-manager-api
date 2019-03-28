// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for storefront-items
const StorefrontItem = require('../models/storefront_item')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /storefront-items
router.get('/storefront-items', requireToken, (req, res, next) => {
  StorefrontItem.find()
    .then(items => {
      return items.filter(item => req.user._id.equals(item.owner))
    })
    .then(items => res.status(200).json({ items: items }))
    .catch(next)
})

// CREATE
// POST /storefront-items
router.post('/storefront-items', requireToken, (req, res, next) => {
  // set owner of new item to be current user
  req.body.storefrontItem.owner = req.user.id

  StorefrontItem.create(req.body.storefrontItem)
    // respond to succesful `create` with status 201 and JSON of new "storefront_item"
    .then(item => {
      res.status(201).json({ storefrontItem: item.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

module.exports = router

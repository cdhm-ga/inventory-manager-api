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
  StorefrontItem.find({ owner: req.user._id }).populate('warehouseItem')
    .then(items => items.map(item => item.toObject()))
    .then(items => res.status(200).json({ items: items }))
    .catch(next)
})

// CREATE
// POST /storefront-items
router.post('/storefront-items', requireToken, (req, res, next) => {
  // set owner of new item to be current user
  req.body.storefrontItem.owner = req.user.id
  // search collection for existing doc. If none exists, create new doc.
  // If doc exists, update existing doc and return updated doc as json object.
  StorefrontItem.findOneAndUpdate(
    // first arg: filter
    // search from doc that contains same warehouseItem ID as req object
    { 'warehouseItem': req.body.storefrontItem.warehouseItem },
    // second arg: update
    // if doc found, update/overwrite doc quantity with req.body quantity
    { $set: { 'quantity': req.body.storefrontItem.quantity,
      'warehouseItem': req.body.storefrontItem.warehouseItem,
      'owner': req.body.storefrontItem.owner
    }
    },
    // third arg: sets method behaviors
    {
      // creates new doc if no docs match filter
      upsert: true,
      // returns updated doc in response instead of original doc
      new: true
    }
  )
    // respond to succesful `create` with status 201 and JSON of new "storefront_item"
    .then(item => {
      res.status(201).json({ storefrontItem: item.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
router.patch('/storefront-items/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.storefrontItem.owner

  StorefrontItem.findById(req.params.id)
    .then(handle404)
    .then(storefrontItem => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, storefrontItem)

      // pass the result of Mongoose's `.update` to the next `.then`
      return storefrontItem.update(req.body.storefrontItem)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
router.delete('/storefront-items/:id', requireToken, (req, res, next) => {
  StorefrontItem.findById(req.params.id)
    .then(handle404)
    .then(storefrontItem => {
      // throw an error if current user doesn't own `storefrontItem`
      requireOwnership(req, storefrontItem)
      // delete the storefrontItem ONLY IF the above didn't throw
      storefrontItem.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router

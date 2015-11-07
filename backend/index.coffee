express = require 'express'
app = express()
bodyParser = require 'body-parser'

MongoClient = require('mongodb').MongoClient
ObjectId = require('mongodb').ObjectId
mongoURL = 'mongodb://localhost:27017/teachme'

app.use(bodyParser.json())

Array.prototype.unique = -> this.filter ((element, index, array) ->
                if element of this then false else (@[element] = true)
              ), {}

app.get '/users', (req, res) ->
  MongoClient.connect(mongoURL, (err, db) ->
    if err
      console.err(err)
      res.end()
      return
    users = []
    cursor = db.collection('users').find()
    cursor.each (err, doc) ->
      if err
        console.err(err)
        res.end()
        return      
      if doc == null
        res.send(users)
      else
        users.push(doc)
  )
  
app.get '/users/search', (req, res) ->
  query = req.query.q
  res.end('[]') if query.length < 1
  MongoClient.connect(mongoURL, (err, db) ->
    users = []
    cursor = db.collection('users').find({"name": new RegExp('^' + query, 'i')})
    cursor.each (err, doc) ->
      if doc == null
        res.send(users)
      else
        users.push(doc)
  )

app.get '/users/:id/nearby', (req, res) ->
  MongoClient.connect(mongoURL, (err, db) ->
    users = []
    console.log("ID: " + req.params.id)
    cursor = db.collection('users').findOne({"_id": ObjectId(req.params.id)}, (err, requestedUser) ->
      if requestedUser == null
        res.end('[]')
        return
      else
        resCursor = db.collection('users').find({
          "lastLoc": {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: requestedUser.lastLoc.coordinates
              },
              $maxDistance: 1000
            }
          }
        })
        resCursor.each (err, doc) ->
          if doc == null
            res.send(users)
          else
            users.push(doc)
    )
  )

app.patch '/users/:id', (req, res) ->
  console.log('Incoming point: ' + req.body.location);
  MongoClient.connect(mongoURL, (err, db) ->
    db.collection('users').update(
      { '_id': ObjectId(req.params.id) },
      { $set: { 'lastLoc.coordinates': req.body.location } },
      (err, count, status) ->
        res.end('' + count);
    )
  )
            

app.get '/skills', (req, res) ->
  MongoClient.connect(mongoURL, (err, db) ->
    skills = []
    cursor = db.collection('users').find({}, {'skills': true, '_id': false})
    cursor.each (err, doc) ->
      if doc == null
        # Make array unique
        uniqueSkills = skills.unique()
        res.send({skills: uniqueSkills, count: uniqueSkills.length})
      else
        skills = skills.concat(doc.skills)
  )

app.get '/skills/search', (req, res) ->
  query = req.query.q
  res.end('[]') if query.length < 1
  queryRegex = new RegExp('^' + query, 'i')
  MongoClient.connect(mongoURL, (err, db) ->
    skills = []
    cursor = db.collection('users').find({"skills": { $in: [queryRegex] }})
    cursor.each (err, doc) ->
      if err
        console.error(err)
        res.end()
        return
      if doc == null
        uniqueSkills = skills.filter((skill) -> skill.match(queryRegex)).unique()
        res.send({skills: uniqueSkills, count: uniqueSkills.length})
      else
        skills = skills.concat(doc.skills)
  )
        

app
  .set('port', process.env.PORT || 5000)
  .listen(app.get('port'), -> 
    console.log('Listening on port', app.get('port'))
  )

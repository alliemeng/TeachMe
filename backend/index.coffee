express = require 'express'
app = express()
bodyParser = require 'body-parser'

MongoClient = require('mongodb').MongoClient
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

app.get '/skills', (req, res) ->
  MongoClient.connect(mongoURL, (err, db) ->
    skills = []
    cursor = db.collection('users').find({}, {'skills': true, '_id': false})
    cursor.each (err, doc) ->
      if doc == null
        # Make array unique
        res.send(skills.unique())
      else
        skills = skills.concat(doc.skills)
  )

app
  .set('port', process.env.PORT || 5000)
  .listen(app.get('port'), -> 
    console.log('Listening on port', app.get('port'))
  )

express = require 'express'
app = express()
bodyParser = require 'body-parser'

MongoClient = require('mongodb').MongoClient
mongoURL = 'mongodb://localhost:27017/teachme'

app.use(bodyParser.json())

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

app
  .set('port', process.env.PORT || 5000)
  .listen(app.get('port'), -> 
    console.log('Listening on port', app.get('port'))
  )

express = require 'express'
app = express()
bodyParser = require 'body-parser'

unirest = require 'unirest'

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
      console.error(err)
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
  response = {}
  busStopFormatter = (stop) ->
    {
      name: stop.name,
      location: stop.location
    }
  busResponseFormatter = (busResp) ->
    busResp.data.map(busStopFormatter)
  finish = ->
    return unless response['bus_stops']? && response['people']?
    res.send(response)
  MongoClient.connect(mongoURL, (err, db) ->
    users = []
    cursor = db.collection('users').findOne({"_id": ObjectId(req.params.id)}, (err, requestedUser) ->
      if requestedUser == null
        res.end('[]')
        return
      else
        unirest.get('https://transloc-api-1-2.p.mashape.com/stops.json?agencies=yale&callback=call&geo_area=41.3144767%2C-72.9306981%7C500')
        .header('X-Mashape-Key', 'WdxhWbE8XWmsh2Uc5SIOvbZOFNZ0p1ym6ecjsnXYoG6WvDLXXN')
        .header('Accept', 'application/json')
        .end (result) ->
          response['bus_stops'] = busResponseFormatter(result.body)
          finish()
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
            response['people'] = users
            finish()
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
    cursor = db.collection('users').find({}, {'skills.name': true, '_id': false})
    cursor.each (err, doc) ->
      if doc == null
        # Make array unique
        uniqueSkills = skills.unique()
        res.send({skills: uniqueSkills, count: uniqueSkills.length})
      else
        skills = skills.concat(doc.skills.map((skill) -> skill.name))
  )

app.get '/skills/search', (req, res) ->
  query = req.query.q
  res.end('[]') if query.length < 1
  queryRegex = new RegExp('^' + query, 'i')
  MongoClient.connect(mongoURL, (err, db) ->
    skills = []
    cursor = db.collection('users').find({"skills.name": { $in: [queryRegex] }})
    cursor.each (err, doc) ->
      if err
        console.error(err)
        res.end()
        return
      if doc == null
        uniqueSkills = skills.filter((skill) -> skill.match(queryRegex)).unique()
        res.send({skills: uniqueSkills, count: uniqueSkills.length})
      else
        skills = skills.concat(doc.skills.map((skill) -> skill.name))
  )

chatMatcher = (uid1, uid2) ->
  { 'members': { $all: [uid1, uid2] } }
app.post '/messages/:targetID', (req, res) ->
  senderID = req.body.senderID;
  targetID = req.params.targetID;
  body = req.body.message;
  message = {
    senderID: senderID,
    body: body,
    type: req.body.type,
    sent: new Date()
  }
  unirest.post("https://api.havenondemand.com/1/api/sync/analyzesentiment/v1")
         .send(["text=" + body, 'apikey=daacc338-92a5-4129-92b0-e92245c8243f'].join('&'))
         .end (result) ->
               console.log('Sentiment: ' + JSON.stringify(result))
               message['sentiment'] = result.body.aggregate.score
               MongoClient.connect(mongoURL, (err, db) ->
                 db.collection('chats').findOne(
                   chatMatcher(senderID, targetID),
                   (err, chat) ->
                     if err
                       console.error('Error finding existing chat: ' + chat);
                       res.end('{}')
                       return
                     if chat
                       console.log('Updating');
                       db.collection('chats').update(
                         chatMatcher(senderID, targetID),
                         { $push: { messages: message } },
                         (err, count, status) ->
                           if err
                             console.error('Error updating chat: ' + err)
                           else
                             res.send(count)
                       )
                     else
                       chat = {
                         messages: [message],
                         members: [senderID, targetID]
                       }
                       db.collection('chats').insert(
                         chat,
                         (err, count, status) ->
                           if err
                             console.error('Error saving message: ' + err)
                           else
                             res.send(count)
                       )
                 )
               )

app.get '/messages/:readerID/:targetID', (req, res) ->
  readerID = req.params.readerID;
  targetID = req.params.targetID;
  MongoClient.connect(mongoURL, (err, db) ->
    db.collection('chats').findOne(
      chatMatcher(readerID, targetID),
      (err, chat) ->
        console.log('Chat: ' + JSON.stringify(chat))
        console.log('Error: ' + err)
        if err
          console.error('Error finding existing chat: ' + chat)
          res.end('{}')
          return
        else
          res.send(chat)
    )
  )

app
  .set('port', process.env.PORT || 5000)
  .listen(app.get('port'), -> 
    console.log('Listening on port', app.get('port'))
  )

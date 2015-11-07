assert = require 'assert'
mappers = require '../lib/mappers/mappers.coffee'

Responder = require '../lib/responder.coffee'

describe 'BatteryRangeMapper', ->
  it 'properly converts the battery level', ->
    gmResp = {
      "service": "getEnergyService",
      "status": "200",
      "data": {
        "tankLevel": {
          "type": "Null",
          "value": "null"
        },
        "batteryLevel": {
          "type": "Number",
          "value": "30"
        }
      }
    }
    expectedResp = {
      "percent": 30
    }
    assert.equal(JSON.stringify(mappers.batteryRange(gmResp)), JSON.stringify(expectedResp))

describe 'FuelRangeMapper', ->
  it 'properly converts the fuel level', ->
    gmResp = {
      "service": "getEnergyService",
      "status": "200",
      "data": {
        "tankLevel": {
          "type": "Number",
          "value": "95"
        },
        "batteryLevel": {
          "type": "Null",
          "value": "null"
        }
      }
    }
    expectedResp = {
      "percent": 95
    }
    assert.equal(JSON.stringify(mappers.fuelRange(gmResp)), JSON.stringify(expectedResp))

describe 'SecurityMapper', ->
  it 'properly converts the door status', ->
    gmResp = {
      "service": "getSecurityStatus",
      "status": "200",
      "data": {
        "doors": {
          "type": "Array",
          "values": [
            {
              "location": {
                "type": "String",
                "value": "frontLeft"
              },
              "locked": {
                "type": "Boolean",
                "value": "False"
              }
            },
            {
              "location": {
                "type": "String",
                "value": "frontRight"
              },
              "locked": {
                "type": "Boolean",
                "value": "True"
              }
            }
          ]
        }
      }
    }
    expectedResp = [
      {
        "location": "frontLeft",
        "locked": false
      },
      {
        "location": "frontRight",
        "locked": true
      }
    ]
    assert.equal(JSON.stringify(mappers.security(gmResp)), JSON.stringify(expectedResp))

describe 'VehicleInfoMapper', ->
  it 'properly converts 4-door vehicle info', ->
    gmResp = {
      "service": "getVehicleInfo",
      "status": "200",
      "data": {
        "vin": {
          "type": "String",
          "value": "123123412412"
        },
        "color": {
          "type": "String",
          "value": "Metallic Silver"
        },
        "fourDoorSedan": {
          "type": "Boolean",
          "value": "True"
        },
        "twoDoorCoupe": {
          "type": "Boolean",
          "value": "False"
        },
        "driveTrain": {
          "type": "String",
          "value": "v8"
        }
      }
    }
    expectedResp = {
      "vin": "123123412412",
      "color": "Metallic Silver",
      "doorCount": 4,
      "driveTrain": "v8"
    }
    assert.equal(JSON.stringify(mappers.vehicleInfo(gmResp)), JSON.stringify(expectedResp))
  it 'properly converts 2-door vehicle info', ->
    gmResp = {
      "service": "getVehicleInfo",
      "status": "200",
      "data": {
        "vin": {
          "type": "String",
          "value": "123123412412"
        },
        "color": {
          "type": "String",
          "value": "Metallic Silver"
        },
        "fourDoorSedan": {
          "type": "Boolean",
          "value": "False"
        },
        "twoDoorCoupe": {
          "type": "Boolean",
          "value": "True"
        },
        "driveTrain": {
          "type": "String",
          "value": "v8"
        }
      }
    }
    expectedResp = {
      "vin": "123123412412",
      "color": "Metallic Silver",
      "doorCount": 2,
      "driveTrain": "v8"
    }
    assert.equal(JSON.stringify(mappers.vehicleInfo(gmResp)), JSON.stringify(expectedResp))

describe 'EngineMapper', ->
  it 'properly converts successful engine action status', ->
    gmResp = {
      "service": "actionEngine",
      "status": "200",
      "actionResult": {
        "status": "EXECUTED"
      }
    }
    expectedResp = {
      "status": "success"
    }
    assert.equal(JSON.stringify(mappers.engine(gmResp)), JSON.stringify(expectedResp))
  it 'properly converts failed engine action status', ->
    gmResp = {
      "service": "actionEngine",
      "status": "200",
      "actionResult": {
        "status": "FAILED"
      }
    }
    expectedResp = {
      "status": "error"
    }
    assert.equal(JSON.stringify(mappers.engine(gmResp)), JSON.stringify(expectedResp))

describe 'Responder', ->
  fakeRequest = { params: { id: 1234 } }
  it 'sends GM API data to a mapper', (done) ->
    fakeMapper = (gmResp) ->
      assert.equal(gmResp.service, 'getVehicleInfo')
      done()
    fakeResponse = { json: -> return }
    responder = new Responder(undefined, fakeMapper)
    responder.render(fakeRequest, fakeResponse)
  it 'outputs JSON', (done) ->
    fakeMapper = (gmResp) -> return {}
    fakeResponse = { 
      json: (content) -> 
        assert(content)
        done()
    }
    responder = new Responder(undefined, fakeMapper)
    responder.render(fakeRequest, fakeResponse)

  serviceMapper = (gmResp) -> return gmResp.service
  serviceResponse = (expServiceResp, done) ->
    {
      json: (content) ->
        assert.equal(content, expServiceResp)
        done()
    }
  it 'loads the right service for vehicle info', (done) ->
    resp = serviceResponse('getVehicleInfo', done)
    responder = new Responder(undefined, serviceMapper)
    responder.render(fakeRequest, resp)
  it 'loads the right service for doors', (done) ->
    resp = serviceResponse('getSecurityStatus', done)
    responder = new Responder('doors', serviceMapper)
    responder.render(fakeRequest, resp)
  it 'loads the right service for fuel level', (done) ->
    resp = serviceResponse('getEnergy', done)
    responder = new Responder('fuel', serviceMapper)
    responder.render(fakeRequest, resp)
  it 'loads the right service for doors', (done) ->
    resp = serviceResponse('getEnergy', done)
    responder = new Responder('battery', serviceMapper)
    responder.render(fakeRequest, resp)
  it 'loads the right service for engine start/stop', (done) ->
    resp = serviceResponse('actionEngine', done)
    responder = new Responder('engine', serviceMapper)
    responder.render(fakeRequest, resp, {command: 'START_VEHICLE'})

  invalidRequest = { params: { id: 9999 } }
  it 'responds with 404 in case of invalid vehicle ID', (done) ->
    resp = {
      status: (content) -> return {
        json: (content) ->
          assert.equal(content.status, '404')
          done()
      }
    }
    # Mapper should not be called in error case
    responder = new Responder()
    responder.render(invalidRequest, resp)
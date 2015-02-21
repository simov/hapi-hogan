
var fs = require('fs')
  , path = require('path')
var Hapi = require('hapi')
  , request = require('request')
  , should = require('should')
var hogan = require('../lib/hapi-hogan')


describe('integration', function () {
  var readFile = fs.readFileSync
    , timesRead = 0
    , server

  before(function (done) {
    fs.readFileSync = function () {
      timesRead++
      return readFile.apply(fs, arguments)
    }

    server = new Hapi.Server()
    server.connection({host:'localhost', port:6767})

    server.route({method:'GET', path:'/', handler:function (req, res) {
        res.view('layout', {name:'simo', partials: {header:'header'}})
      }
    })
    server.views({
      relativeTo:__dirname,
      path:'./views',
      engines: {
        html:{
          module: hogan,
          compileMode: 'sync',
          compileOptions: {
            partialsPath: path.join(__dirname, 'partials'),
            isCached: true
          }
        }
      }
    })
    server.start(done)
  })

  it('caching', function (done) {
    request.get('http://localhost:6767', function (err, res, body) {
      if (err) return done(err)
      body.should.equal('Hello simo from header partial Hello simo from layout template')
      hogan.cache.header.text.should.equal('Hello {{name}} from header partial ')
      timesRead.should.equal(1)
      
      request.get('http://localhost:6767', function (err, res, body) {
        if (err) return done(err)
        body.should.equal('Hello simo from header partial Hello simo from layout template')
        hogan.cache.header.text.should.equal('Hello {{name}} from header partial ')
        timesRead.should.equal(1)
        done()
      })
    })
  })

  after(function (done) {
    fs.readFileSync = readFile
    server.stop(done)
  })
})

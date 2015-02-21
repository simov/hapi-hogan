
var fs = require('fs')
  , path = require('path')
var should = require('should')
var hogan = require('../lib/hapi-hogan')


describe('cache', function () {
  var readFile = fs.readFileSync, timesRead

  before(function () {
    fs.readFileSync = function () {
      timesRead++
      return readFile.apply(fs, arguments)
    }
  })

  it('compileOptions.isCached defaults to true', function () {
    var context
      , options = {partialsPath:path.join(__dirname, 'partials')}
      , partials
    timesRead = 0

    context = {partials:{header:'header'}}
    partials = hogan.partials(context, options)

    partials.header.text.should.equal('Hello {{name}} from header partial ')
    should.equal(context.partials, undefined)
    options.partialsCache.header.text.should.equal('Hello {{name}} from header partial ')
    timesRead.should.equal(1)

    context = {partials:{header:'header'}}
    partials = hogan.partials(context, options)
    
    partials.header.text.should.equal('Hello {{name}} from header partial ')
    should.equal(context.partials, undefined)
    options.partialsCache.header.text.should.equal('Hello {{name}} from header partial ')
    timesRead.should.equal(1)
  })

  it('compileOptions.isCached set to false', function () {
    var context
      , options = {partialsPath:path.join(__dirname, 'partials'), isCached:false}
      , partials
    timesRead = 0

    context = {partials:{header:'header'}}
    partials = hogan.partials(context, options)

    partials.header.text.should.equal('Hello {{name}} from header partial ')
    should.equal(context.partials, undefined)
    should.deepEqual(options.partialsCache, {})
    timesRead.should.equal(1)

    context = {partials:{header:'header'}}
    partials = hogan.partials(context, options)

    partials.header.text.should.equal('Hello {{name}} from header partial ')
    should.equal(context.partials, undefined)
    should.deepEqual(options.partialsCache, {})
    timesRead.should.equal(2)
  })

  after(function () {
    fs.readFileSync = readFile
  })
})

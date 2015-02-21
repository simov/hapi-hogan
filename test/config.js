
var path = require('path')
var should = require('should')
var hogan = require('../lib/hapi-hogan')


describe('config', function () {
  it('missing compileOptions.partialsPath key', function () {
    var context = {partials:{header:'header'}}
      , options = {}
    var partials = hogan.partials(context, options)
    should.equal(partials, undefined)
  })
  it('missing context.partials', function () {
    var context = {name:'simo'}
      , options = {partialsPath:path.join(__dirname, 'partials')}
    var partials = hogan.partials(context, options)
    should.equal(partials, undefined)
  })
})

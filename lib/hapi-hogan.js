
var fs = require('fs')
  , path = require('path')
var Hogan = require('hogan.js')


function compile (template, compileOptions) {
  var compiled = Hogan.compile(template)
  return function (context, runtimeOptions) {
    return compiled.render(context, partials(context, compileOptions))
  }
}

function partials (context, compileOptions) {
  compileOptions.partialsCache = compileOptions.partialsCache || {}

  var dpath = compileOptions.partialsPath
    , cached = (compileOptions.isCached == undefined) ? true : compileOptions.isCached
    , cache = compileOptions.partialsCache

  if (!dpath || !context.partials) {
    delete context.partials
    return
  }

  var partials = {}
  for (var key in context.partials) {
    var html
    // try to read from cache
    if (cached) {
      html = cache[key]
    }
    // read from fs
    if (!cached || !html) {
      var fpath = path.join(dpath, context.partials[key]+'.html')
        , template = fs.readFileSync(fpath, 'utf8')
      html = Hogan.compile(template)
    }
    // store in cache
    if (cached && !cache[key]) {
      cache[key] = html
    }

    partials[key] = html
  }

  exports.cache = cache
  delete context.partials
  return partials
}


exports.cache = {}
exports.compile = compile
exports.partials = partials

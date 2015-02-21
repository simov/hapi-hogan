
# hapi-hogan

```js
var Hapi = require('hapi')
  , hogan = require('hapi-hogan')

server = new Hapi.Server()
server.connection({host:'localhost', port:3000})

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
server.start()
```

Just like in [consolidate][consolidate] pass your partials using the `partials` key

```js
server.route({method:'GET', path:'/', handler:function (req, res) {
    res.view('layout', {name:'simo', partials: {header:'header'}})
  }
})
```

Here `header` is the name of your `{{>header}}` partial and the 'header' string is the relative path to it. In the above example thats the `header.html` file located in the `partials` folder

```js
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
```

`partialsPath` is the absolute path to your partials folder. The partials are cached by default, to disable it set `isCached` to `false`. Both of these two options should be placed inside the `compileOptions` key


  [consolidate]: https://github.com/tj/consolidate.js

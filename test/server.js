const http = require('http')
    , bl   = require('bl')
    , EE   = require('events').EventEmitter


function testServer (status) {
  var ee     = new EE()
    , server = http.createServer(function (req, res) {
        ee.emit('connect', req, res)
        ee.emit('url', req.url)
        ee.emit('method', req.method)
        ee.emit('headers', req.headers)

        req.pipe(bl(function (err, data) {
          ee.emit('data', data.toString())
        }))

        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(JSON.stringify(status))
      }).listen(0, function () {
        ee.emit('port', server.address().port)
      })

  setTimeout(function () {
    server.close()
    ee.emit('close')
  }, 100)

  return ee
}


module.exports = testServer
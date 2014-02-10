const test       = require('tape')
    , status     = require('../status')
    , testServer = require('./server')


test('test simple status', function (t) {
  t.plan(6)

  var expectedStatus = { foo: 'bar', type: 'replication' }
    , server         = testServer([ expectedStatus ])

  server.on('port', function (port) {
    status('auser', 'apass', 'http://localhost:' + port, function (err, data) {
      t.notOk(err, 'no error')
      t.deepEqual(data, expectedStatus, 'got expected status')
    })
  })

  server.on('url', function (url) {
    t.equal(url, '/_active_tasks', 'used correct url')
  })

  server.on('headers', function (headers) {
    t.ok(headers.authorization, 'got auth header')
    t.equal(headers.authorization, 'Basic ' + new Buffer('auser:apass').toString('base64'), 'got correct auth header')
  })

  server.on('close', function () {
    t.ok(true, 'got close')
  })
})


test('test no replication status', function (t) {
  t.plan(3)

  var server = testServer([ { foo: 'bar' } ])

  server.on('port', function (port) {
    status('auser', 'apass', 'http://localhost:' + port, function (err) {
      t.ok(err, 'got error')
      t.ok((/Unexpected response/i).test(err.message), 'got expected error')
    })
  })

  server.on('close', function () {
    t.ok(true, 'got close')
  })
})


test('test no status', function (t) {
  t.plan(3)

  var server = testServer([ ])

  server.on('port', function (port) {
    status('auser', 'apass', 'http://localhost:' + port, function (err) {
      t.ok(err, 'got error')
      t.ok((/Unexpected response/i).test(err.message), 'got expected error')
    })
  })

  server.on('close', function () {
    t.ok(true, 'got close')
  })
})

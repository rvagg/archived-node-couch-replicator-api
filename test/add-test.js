const test       = require('tape')
    , xtend      = require('xtend')
    , add        = require('../add')
    , testServer = require('./server')


test('test simple add', function (t) {
  t.plan(8)

  var expectedAdd  = { ok: 'foo' }
    , expectedId   = 'foo'
    , expectedData = { foo: 'bar', boom: 'bang' }
    , server       = testServer(expectedAdd)

  server.on('port', function (port) {
    add('http://localhost:' + port, 'auser', 'apass', expectedId, xtend(expectedData), function (err, data) {
      t.notOk(err, 'no error')
      t.deepEqual(data, expectedAdd, 'got expected add')
    })
  })

  server.on('method', function (method) {
    t.equal(method, 'PUT', 'used correct method')
  })

  server.on('url', function (url) {
    t.equal(url, '/_replicator/foo', 'used correct url')
  })

  server.on('headers', function (headers) {
    t.ok(headers.authorization, 'got auth header')
    t.equal(headers.authorization, 'Basic ' + new Buffer('auser:apass').toString('base64'), 'got correct auth header')
  })

  server.on('data', function (data) {
    t.deepEqual(JSON.parse(data), xtend(expectedData, { _id: 'foo' }), 'got expected add data')
  })

  server.on('close', function () {
    t.ok(true, 'got close')
  })
})


test('test no add', function (t) {
  t.plan(3)

  var server     = testServer({ error: 'failed', reason: 'foobar' })
    , expectedId = 'foo'

  server.on('port', function (port) {
    add('http://localhost:' + port, 'auser', 'apass', expectedId, { foo: 'bar' }, function (err, data) {
      t.ok(err, 'got error')
      t.ok((/Got error from couch/i).test(err.message), 'got expected error')
    })
  })

  server.on('close', function () {
    t.ok(true, 'got close')
  })
})

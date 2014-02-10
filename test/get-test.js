const test       = require('tape')
    , testServer = require('./server')
    , get        = require('../get')
    , Api        = require('../')


function makeSimpleGetTest (type) {
  return function (t) {
    t.plan(6)

    var expectedGet = { foo: 'bar' }
      , expectedId  = 'foo'
      , server      = testServer(expectedGet)

    server.on('port', function (port) {
      if (type == 'direct') {
        get('http://localhost:' + port, 'auser', 'apass', expectedId, function (err, data) {
          t.notOk(err, 'no error')
          t.deepEqual(data, expectedGet, 'got expected get')
        })
      } else {
        new Api('http://localhost:' + port, 'auser', 'apass', expectedId).get(function (err, data) {
          t.notOk(err, 'no error')
          t.deepEqual(data, expectedGet, 'got expected get')
        })
      }
    })

    server.on('url', function (url) {
      t.equal(url, '/_replicator/foo', 'used correct url')
    })

    server.on('headers', function (headers) {
      t.ok(headers.authorization, 'got auth header')
      t.equal(headers.authorization, 'Basic ' + new Buffer('auser:apass').toString('base64'), 'got correct auth header')
    })

    server.on('close', function () {
      t.ok(true, 'got close')
    })
  }
}


function makeNoGetTest (type) {
  return function (t) {
    t.plan(3)

    var server     = testServer({ error: 'failed', reason: 'foobar' })
      , expectedId = 'foo'

    server.on('port', function (port) {
      if (type == 'direct') {
        get('http://localhost:' + port, 'auser', 'apass', expectedId, function (err) {
          t.ok(err, 'got error')
          t.ok((/Got error from couch/i).test(err.message), 'got expected error')
        })
      } else {
          new Api('http://localhost:' + port, 'auser', 'apass', expectedId).get(function (err) {
          t.ok(err, 'got error')
          t.ok((/Got error from couch/i).test(err.message), 'got expected error')
        })
      }
    })

    server.on('close', function () {
      t.ok(true, 'got close')
    })
  }
}


test('test simple get (direct)', makeSimpleGetTest('direct'))

test('test simple get (obj)', makeSimpleGetTest('obj'))

test('test no get (direct)', makeNoGetTest('direct'))

test('test no get (obj)', makeNoGetTest('obj'))

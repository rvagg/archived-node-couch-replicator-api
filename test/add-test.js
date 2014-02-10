const test       = require('tape')
    , xtend      = require('xtend')
    , testServer = require('./server')
    , add        = require('../add')
    , Api        = require('../')


function makeSimpleAddTest (type) {
  return function (t) {
    t.plan(8)

    var expectedAdd  = { ok: 'foo' }
      , expectedId   = 'foo'
      , expectedData = { foo: 'bar', boom: 'bang' }
      , server       = testServer(expectedAdd)

    server.on('port', function (port) {
      if (type == 'direct') {
        add('http://localhost:' + port, 'auser', 'apass', expectedId, xtend(expectedData), function (err, data) {
          t.notOk(err, 'no error')
          t.deepEqual(data, expectedAdd, 'got expected add')
        })
      } else {
        new Api('http://localhost:' + port, 'auser', 'apass').add(expectedId, xtend(expectedData), function (err, data) {
          t.notOk(err, 'no error')
          t.deepEqual(data, expectedAdd, 'got expected add')
        })
      }
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
  }
}


function makeNoAddTest (type) {
  return function (t) {
    t.plan(3)

    var server     = testServer({ error: 'failed', reason: 'foobar' })
      , expectedId = 'foo'

    server.on('port', function (port) {
      if (type == 'direct') {
        add('http://localhost:' + port, 'auser', 'apass', expectedId, { foo: 'bar' }, function (err, data) {
          t.ok(err, 'got error')
          t.ok((/Got error from couch/i).test(err.message), 'got expected error')
        })
      } else {
        new Api('http://localhost:' + port, 'auser', 'apass').add(expectedId, { foo: 'bar' }, function (err, data) {
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

test('test simple add (direct)', makeSimpleAddTest('direct'))

test('test simple add (obj)', makeSimpleAddTest('obj'))

test('test no add (direct)', makeNoAddTest('direct'))

test('test no add (obj)', makeNoAddTest('obj'))

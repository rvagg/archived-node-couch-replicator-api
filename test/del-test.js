const test       = require('tape')
    , xtend      = require('xtend')
    , testServer = require('./server')
    , del        = require('../del')
    , Api        = require('../')


function makeSimpleDelNoRevTest (type) {
  return function (t) {
    t.plan(11)

    var expectedRev  = 'foobarbang'
      , expectedDel  = { ok: 'foo', _rev: expectedRev } // return this from both the GET for rev and DELETE
      , expectedId   = 'foo'
      , server       = testServer(expectedDel)

    server.on('port', function (port) {
      if (type == 'direct') {
        del('http://localhost:' + port, 'auser', 'apass', expectedId, function (err, data) {
          t.notOk(err, 'no error')
          t.deepEqual(data, expectedDel, 'got expected del')
        })
      } else {
        new Api('http://localhost:' + port, 'auser', 'apass', expectedId).del(function (err, data) {
          t.notOk(err, 'no error')
          t.deepEqual(data, expectedDel, 'got expected del')
        })
      }
    })

    server.once('method', function (method) {
      // first get the rev, then delete by rev
      t.equal(method, 'GET', 'used correct method')
      server.on('method', function (method) {
        t.equal(method, 'DELETE', 'used correct method')
      })
    })

    server.once('url', function (url) {
      // first is a GET, second is a DELETE
      t.equal(url, '/_replicator/foo', 'used correct url')
      server.on('url', function (url) {
        t.equal(url, '/_replicator/foo?rev=' + expectedRev, 'used correct url')
      })
    })

    server.on('headers', function (headers) {
      // run twice
      t.ok(headers.authorization, 'got auth header')
      t.equal(headers.authorization, 'Basic ' + new Buffer('auser:apass').toString('base64'), 'got correct auth header')
    })

    server.on('close', function () {
      t.ok(true, 'got close')
    })
  }
}


function makeSimpleDelWithRevTest (type) {
  return function (t) {
    t.plan(7)

    var expectedDel  = { ok: 'foo' } // return this from both the GET for rev and DELETE
      , expectedId   = 'foo'
      , expectedRev  = 'foobarbang'
      , server       = testServer(expectedDel)

    server.on('port', function (port) {
      if (type == 'direct') {
        del('http://localhost:' + port, 'auser', 'apass', expectedId, expectedRev, function (err, data) {
          t.notOk(err, 'no error')
          t.deepEqual(data, expectedDel, 'got expected del')
        })
      } else {
        new Api('http://localhost:' + port, 'auser', 'apass', expectedId).del(expectedRev, function (err, data) {
          t.notOk(err, 'no error')
          t.deepEqual(data, expectedDel, 'got expected del')
        })
      }
    })

    server.on('method', function (method) {
      t.equal(method, 'DELETE', 'used correct method')
    })

    server.on('url', function (url) {
      t.equal(url, '/_replicator/foo?rev=' + expectedRev, 'used correct url')
    })

    server.on('headers', function (headers) {
      // run twice
      t.ok(headers.authorization, 'got auth header')
      t.equal(headers.authorization, 'Basic ' + new Buffer('auser:apass').toString('base64'), 'got correct auth header')
    })

    server.on('close', function () {
      t.ok(true, 'got close')
    })
  }
}


function makeNoDelTest (type) {
  return function (t) {
    t.plan(3)

    var server     = testServer({ error: 'failed', reason: 'foobar' })
      , expectedId = 'foo'

    server.on('port', function (port) {
      if (type == 'direct') {
        del('http://localhost:' + port, 'auser', 'apass', expectedId, function (err, data) {
          t.ok(err, 'got error')
          t.ok((/Got error from couch/i).test(err.message), 'got expected error')
        })
      } else {
        new Api('http://localhost:' + port, 'auser', 'apass', expectedId).del(function (err, data) {
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

test('test simple del, no rev (direct)', makeSimpleDelNoRevTest('direct'))

test('test simple del, no rev (obj)', makeSimpleDelNoRevTest('obj'))

test('test simple del, with rev (direct)', makeSimpleDelWithRevTest('direct'))

test('test simple del, with rev (obj', makeSimpleDelWithRevTest('obj'))

test('test no del (direct)', makeNoDelTest('direct'))

test('test no del (obj)', makeNoDelTest('obj'))

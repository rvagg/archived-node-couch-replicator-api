const test       = require('tape')
    , testServer = require('./server')
    , status     = require('../status')
    , Api        = require('../')


function makeSimpleStatusTest (type) {
  return function (t) {
    t.plan(6)

    var expectedStatus = { foo: 'bar', type: 'replication', target: 'mydb' }
      , server         = testServer([ expectedStatus, { bar: 'foo', type: 'replication', target: 'otherdb' }, { somethign: 'else' } ])

    server.on('port', function (port) {
      if (type == 'direct') {
        status('http://localhost:' + port, 'auser', 'apass', 'mydb', function (err, data) {
          t.notOk(err, 'no error')
          t.deepEqual(data, expectedStatus, 'got expected status')
        })
      } else {
        new Api('http://localhost:' + port, 'auser', 'apass', 'mydb').status(function (err, data) {
          t.notOk(err, 'no error')
          t.deepEqual(data, expectedStatus, 'got expected status')
        })
      }
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
  }
}


function makeNoReplicationStatusTest (type) {
  return function (t) {
    t.plan(3)

    var server = testServer([ { foo: 'bar' } ])

    server.on('port', function (port) {
      if (type == 'direct') {
        status('http://localhost:' + port, 'auser', 'apass', 'mydb', function (err) {
          t.ok(err, 'got error')
          t.ok((/Unexpected response/i).test(err.message), 'got expected error')
        })
      } else {
        new Api('http://localhost:' + port, 'auser', 'apass', 'mydb').status(function (err) {
          t.ok(err, 'got error')
          t.ok((/Unexpected response/i).test(err.message), 'got expected error')
        })
      }
    })

    server.on('close', function () {
      t.ok(true, 'got close')
    })
  }
}


function makeNoStatusTest (type) {
  return function (t) {
    t.plan(3)

    var server = testServer([ ])

    server.on('port', function (port) {
      if (type == 'direct') {
        status('http://localhost:' + port, 'auser', 'apass', 'mydb', function (err) {
          t.ok(err, 'got error')
          t.ok((/Unexpected response/i).test(err.message), 'got expected error')
        })
      } else {
        new Api('http://localhost:' + port, 'auser', 'apass', 'mydb').status(function (err) {
          t.ok(err, 'got error')
          t.ok((/Unexpected response/i).test(err.message), 'got expected error')
        })
      }
    })

    server.on('close', function () {
      t.ok(true, 'got close')
    })
  }
}


test('test simple status (direct)', makeSimpleStatusTest('direct'))

test('test simple status (obj)', makeSimpleStatusTest('obj'))

test('test no replication status (direct)', makeNoReplicationStatusTest('direct'))

test('test no replication status (obj)', makeNoReplicationStatusTest('obj'))

test('test no status (direct)', makeNoStatusTest('direct'))

test('test no status (obj)', makeNoStatusTest('obj'))

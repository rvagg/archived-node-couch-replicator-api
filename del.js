const hyperquest     = require('hyperquest')
    , bl             = require('bl')

    , get            = require('./get')

    , replicatorBase = '/_replicator/'


function del (couch, user, pass, id, rev, callback) {
  if (typeof rev == 'function') {
    callback = rev
    return get(couch, user, pass, id, function (err, data) {
      if (err)
        return callback(err)

      del(couch, user, pass, id, data._rev, callback)
    })
  }

  hyperquest.delete(couch + replicatorBase + id + '?rev=' + rev, { auth: user + ':' + pass })
    .pipe(bl(function (err, data) {
      if (err)
        return callback(err)

      var _data = JSON.parse(data.toString())

      if (typeof _data.error == 'string')
        return callback(new Error('Got error from couch: ' + _data.reason + ' (' + JSON.stringify(_data) + ')'))

      callback(null, _data)
    }))
}


module.exports = del

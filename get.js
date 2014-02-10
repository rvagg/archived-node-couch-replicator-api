const hyperquest     = require('hyperquest')
    , bl             = require('bl')

    , replicatorBase = '/_replicator/'


function get (user, pass, couch, id, callback) {
  hyperquest(couch + replicatorBase + id, { auth: user + ':' + pass })
    .pipe(bl(function (err, data) {
      if (err)
        return callback(err)

      var _data = JSON.parse(data.toString())

      if (typeof _data.error == 'string')
        return callback(new Error('Got error from couch: ' + _data.reason + ' (' + JSON.stringify(_data) + ')'))

      callback(null, _data)
    }))
}


module.exports = get

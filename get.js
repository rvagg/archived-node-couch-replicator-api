const hyperquest     = require('hyperquest')
    , bl             = require('bl')

    , replicatorBase = '/_replicator/'


function get (couch, user, pass, id, callback) {
  var options = { }
  if(user && pass)
    options.auth = user + ':' + pass

  hyperquest(couch + replicatorBase + id, options)
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

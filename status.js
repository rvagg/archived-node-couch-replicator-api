const hyperquest = require('hyperquest')
    , bl         = require('bl')

    , statusUrl  = '/_active_tasks'


function status (couch, user, pass, target, callback) {
  var options = { }
  if(user && pass)
    options.auth = user + ':' + pass

  hyperquest(couch + statusUrl, options).pipe(bl(function (err, data) {
    if (err)
      return callback(err)

    var _data = JSON.parse(data.toString())

    if (typeof _data.error == 'string')
      return callback(new Error('Got error from couch: ' + _data.reason + ' (' + JSON.stringify(_data) + ')'))

    if (!Array.isArray(_data))
      return callback(new Error('Unexpected response from couch: ' + data.toString()))

    _data = _data.filter(function (s) {
      return s && s.type == 'replication' && s.target == target
    })[0]

    if (!_data)
      return callback(new Error('Unexpected response from couch: ' + data.toString()))

    callback(null, _data)
  }))
}


module.exports = status

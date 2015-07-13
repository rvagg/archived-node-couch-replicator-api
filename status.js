const hyperquest = require('hyperquest')
    , bl         = require('bl')

    , statusUrl  = '/_active_tasks'


function status (couch, user, pass, target, doc_id, callback) {
  if (typeof doc_id == 'function') {
    var callback = doc_id
      , doc_id = false
  }

  hyperquest(couch + statusUrl, { auth: user + ':' + pass }).pipe(bl(function (err, data) {
    if (err)
      return callback(err)

    var _data = JSON.parse(data.toString())

    if (typeof _data.error == 'string')
      return callback(new Error('Got error from couch: ' + _data.reason + ' (' + JSON.stringify(_data) + ')'))

    if (!Array.isArray(_data))
      return callback(new Error('Unexpected response from couch: ' + data.toString()))

    _data = _data.filter(function (s) {
      if(doc_id)
        return s && s.type == 'replication' && s.doc_id == doc_id
      return s && s.type == 'replication' && s.target == target
    })[0]

    if (!_data)
      return callback(new Error('Unexpected response from couch: ' + data.toString()))

    callback(null, _data)
  }))
}


module.exports = status

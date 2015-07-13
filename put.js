const hyperquest     = require('hyperquest')
    , bl             = require('bl')
    , xtend          = require('xtend')
    , url            = require('url')

    , replicatorBase = '/_replicator/'

/*
{
   "_id": "fullfatnpm",
   "source": "https://fullfatdb.npmjs.com/registry",
   "target": "registry",
   "continuous": true,
   "user_ctx": {
       "name": "rvagg",
       "roles": [
           "_admin"
       ]
   },
   "owner": "rvagg"
}
*/

function put (couch, user, pass, id, doc, callback) {
  doc = xtend(doc, { _id: id })

  var data    = JSON.stringify(doc)
    , options = {
        headers: {
              'content-type'   : 'application/json'
            , 'content-length' : data.length
            , 'referer'        : url.parse(couch).hostname
        }
      }
  if(user && pass)
    options.auth = user + ':' + pass;

  var req  = hyperquest.put(couch + replicatorBase + id, options)

  req.pipe(bl(function (err, data) {
      if (err)
        return callback(err)

      var _data = JSON.parse(data.toString())

      if (typeof _data.error == 'string')
        return callback(new Error('Got error from couch: ' + _data.reason + ' (' + JSON.stringify(_data) + ')'))

      callback(null, _data)
    }))

  req.end(data)
}


module.exports = put

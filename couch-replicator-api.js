
function CouchReplicatorApi (url, user, pass) {
  if (!(this instanceof CouchReplicatorApi))
    return new CouchReplicatorApi(url, user, pass)
}


module.exports = CouchReplicatorApi


module.exports.status = require('./status')
module.exports.del    = require('./del')
module.exports.add    = require('./add')
module.exports.get    = require('./get')

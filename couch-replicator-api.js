
function CouchReplicatorApi (url, user, pass) {
  if (!(this instanceof CouchReplicatorApi))
    return new CouchReplicatorApi(url, user, pass)

  this.url  = url
  this.user = user
  this.pass = pass
}

CouchReplicatorApi.prototype.status = function (callback) {
  CouchReplicatorApi.status(this.url, this.user, this.pass, callback)
}


CouchReplicatorApi.prototype.get    = function (id, callback) {
  CouchReplicatorApi.get(this.url, this.user, this.pass, id, callback)
}


CouchReplicatorApi.prototype.add    = function (id, doc, callback) {
  CouchReplicatorApi.add(this.url, this.user, this.pass, id, doc, callback)
}


CouchReplicatorApi.prototype.del    = function (id, rev, callback) {
  CouchReplicatorApi.del(this.url, this.user, this.pass, id, rev, callback)
}


CouchReplicatorApi.status = require('./status')
CouchReplicatorApi.del    = require('./del')
CouchReplicatorApi.add    = require('./add')
CouchReplicatorApi.get    = require('./get')


module.exports = CouchReplicatorApi

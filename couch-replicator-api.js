
function CouchReplicatorApi (url, user, pass, db) {
  if (!(this instanceof CouchReplicatorApi))
    return new CouchReplicatorApi(url, user, pass)

  this.url  = url
  this.user = user
  this.pass = pass
  this.db   = db
}

CouchReplicatorApi.prototype.status = function (callback) {
  CouchReplicatorApi.status(this.url, this.user, this.pass, this.db, callback)
}


CouchReplicatorApi.prototype.get    = function (callback) {
  CouchReplicatorApi.get(this.url, this.user, this.pass, this.db, callback)
}


CouchReplicatorApi.prototype.add    = function (doc, callback) {
  CouchReplicatorApi.add(this.url, this.user, this.pass, this.db, doc, callback)
}


CouchReplicatorApi.prototype.del    = function (rev, callback) {
  CouchReplicatorApi.del(this.url, this.user, this.pass, this.db, rev, callback)
}


CouchReplicatorApi.status = require('./status')
CouchReplicatorApi.del    = require('./del')
CouchReplicatorApi.add    = require('./add')
CouchReplicatorApi.get    = require('./get')


module.exports = CouchReplicatorApi

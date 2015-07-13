/**
 * @constructor CouchReplicatorApi
 * @param {string} url - The url of couch
 * @param {string} user - The username of couch
 * @param {string} pass - The password of couch
 * @param {string|false} db - The database of the replication (may be false if doc_id param is set)
 * @param {string|false} [doc_id] - The doc_id of the replication (may be false if db param is set) (optional)
 * @returns {CouchReplicatorApi}
 */
function CouchReplicatorApi (url, user, pass, db, doc_id) {
  if (!(this instanceof CouchReplicatorApi))
    return new CouchReplicatorApi(url, user, pass)

  this.url    = url
  this.user   = user
  this.pass   = pass
  this.db     = db
  this.doc_id = false
  if(doc_id)
    this.doc_id = doc_id
}

CouchReplicatorApi.prototype.status = function (callback) {
  CouchReplicatorApi.status(this.url, this.user, this.pass, this.db, this.doc_id, callback)
}


CouchReplicatorApi.prototype.get    = function (callback) {
  CouchReplicatorApi.get(this.url, this.user, this.pass, (this.doc_id?this.doc_id:this.db), callback)
}


CouchReplicatorApi.prototype.put    = function (doc, callback) {
  CouchReplicatorApi.put(this.url, this.user, this.pass, (this.doc_id?this.doc_id:this.db), doc, callback)
}


CouchReplicatorApi.prototype.del    = function (rev, callback) {
  CouchReplicatorApi.del(this.url, this.user, this.pass, (this.doc_id?this.doc_id:this.db), rev, callback)
}


CouchReplicatorApi.status = require('./status')
CouchReplicatorApi.del    = require('./del')
CouchReplicatorApi.put    = require('./put')
CouchReplicatorApi.get    = require('./get')


module.exports = CouchReplicatorApi

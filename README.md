# node-couch-replicator-api

[![Build Status](https://secure.travis-ci.org/rvagg/couch-replicator-api.png)](http://travis-ci.org/rvagg/couch-replicator-api)

**A simple Node API for dealing with the couch *_replicator* database**

[![NPM](https://nodei.co/npm/couch-replicator-api.png?downloads=true)](https://nodei.co/npm/couch-replicator-api/)

You can fetch **status** for a database replication, **get** a replication doc, **delete** a replication doc, and **put** a replication doc.

## Example

```js
const CouchReplicator = require('couch-replicator-api')
    , couchUrl        = 'http://npm.nodejs.org.au:5984'
    , couchUser       = 'admin'
    , couchPass       = 'super$ecure'
    , db              = 'registry'

CouchReplicator.status(couchUrl, couchUser, couchPass, db, printStatus)

// also:
//  - CouchReplicator.get(url, user, pass, db, callback)
//  - CouchReplicator.del(url, user, pass, db, [rev, ] callback)
//  - CouchReplicator.put(url, user, pass, db, doc, callback)

function printStatus (err, data) {
  if (err)
  
    throw err

  console.log('status:', data)
}
```

Will print the replication status:

```
status: { pid: '<0.26018.0>',
  checkpointed_source_seq: 93275,
  continuous: true,
  doc_id: 'registry',
  doc_write_failures: 0,
  docs_read: 450,
  docs_written: 450,
  missing_revisions_found: 450,
  progress: 98,
  replication_id: 'cb249c0a32a9c3c289c29efbea91fd92+continuous',
  revisions_checked: 533,
  source: 'https://fullfatdb.npmjs.com/registry/',
  source_seq: 94787,
  started_on: 1391948768,
  target: 'registry',
  type: 'replication',
  updated_on: 1392021201 }
```

Alternatively you can use the `CouchReplicator` as a constructor and store the Couch URL, admin credentials and database id in the object to make calls even simpler:

```js
const CouchReplicator = require('couch-replicator-api')

    , replicator = new CouchReplicator(
          'http://npm.nodejs.org.au:5984'
        , 'admin'
        , 'super$ecure'
        , 'registry'
      )

replicator.status(function (err, data) {
  if (err)
  
    throw err

  console.log('status:', data)
}

// also:
//  - replicator.get(callback)
//  - replicator.del([rev, ] callback)
//  - replicator.put(doc, callback)
```


## API

### status

Get the status doc from CouchDB for this replication. The doc comes from */_active_tasks* and has the `type` of `'replication'` and `'target'` of the db specified.

```js
CouchReplicator.status(url, user, pass, db, callback)
// or on an existing CouchReplicator object:
replicator.status(callback)
```

### get

Gets the replication doc from */_replicator/<db>*.

```js
CouchReplicator.get(url, user, pass, db, callback)
// or on an existing CouchReplicator object:
replicator.get(callback)
```

### del

Deletes the replication doc from */_replicator/<db>?rev=revision*, immediately stopping replication. Note that if `rev` is not supplied then a `get()` will be performed to look up the latest `rev` for this replication doc.

```js
CouchReplicator.del(url, user, pass, db, [rev, ] callback)
// or on an existing CouchReplicator object:
replicator.del([rev, ] callback)
```

### put

Put a new replication doc at */_replicator/<db>* as specified by the `doc` parameter.

```js
CouchReplicator.put(url, user, pass, db, doc, callback)
// or on an existing CouchReplicator object:
replicator.put(doc, callback)
```

Generally a replication doc should look something like this:

```json
{
   "source": "https://fullfatdb.npmjs.com/registry",
   "target": "registry",
   "continuous": true,
   "user_ctx": {
       "name": "adminuser",
       "roles": [
           "_admin"
       ]
   }
}
```

See [this gist](https://gist.github.com/fdmanana/832610) for details about the _replicator database.


## License

**node-couch-replicator-api** is Copyright (c) 2014 Rod Vagg [@rvagg](https://twitter.com/rvagg) and licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.

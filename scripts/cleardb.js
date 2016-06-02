var rimraf = require('rimraf')
rimraf.sync('events.db', {})

require('./clearsynctokens')

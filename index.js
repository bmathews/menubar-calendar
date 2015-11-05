require('babel/register')({
  sourceMaps: 'inline',
  optional: ["es7.classProperties"]
});
require('./server/server.js')

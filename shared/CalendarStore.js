var EventEmitter = require('events');

var PouchDB = require('pouchdb');
var adapters = require('pouchdb/lib/adapters-browser');

Object.keys(adapters).forEach(function (adapterName) {
  PouchDB.adapter(adapterName, adapters[adapterName], true);
});

var db = new PouchDB('menu-calendar', { adapter: 'websql' });

// db.destroy().then(function (res) {
//   console.log(res);
//   db = new PouchDB('menu-calendar', { adapter: 'websql' });
// }, function (err) {
//   console.error(err);
// });

class CalendarStore extends EventEmitter {

  setItems (list) {
    // clone items and set _id and _rev props
    var items = list.map((i) => {
      var copy = Object.assign({}, i);
      var id = copy.id;
      copy._id = i.start.dateTime + "/" + id;
      copy._rev = i.updated || i.created;
      return copy;
    });

    console.log("Saving all items: ", items);
    return db.bulkDocs(items);
  }

  getAll (start, end) {
    console.log("Getting all items");
    return db.allDocs({
      include_docs: true,
      startkey: start,
      endkey: end
    });
  }

}

export default CalendarStore

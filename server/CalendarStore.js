var Q = require('q');
var LinvoDB = require("linvodb3");
LinvoDB.dbPath = process.cwd();

var Events = new LinvoDB("events", {});

class CalendarStore {

  /*
   * Save or update items
   */

  setItems (items) {
    var list = items.map((i) => {
      var copy = Object.assign({}, i);
      var id = copy.id;
      copy._id = id;
      return copy;
    });

    console.log("CalendarStore: #setItems: Saving all items: ", list.length);
    return Q.ninvoke(Events, "save", list);
  }


  /*
   * Remove items
   */

  removeItems (items) {
    var ids = items.map((i) => {
      return i.id;
    });
    console.log("CalendarStore: #removeItems: Removing items: ", ids.length);
    return Q.ninvoke(Events, "remove", { _id: { $in: ids } }, { multi: true });
  }

  /*
   * Get all items between start/end time range
   */

  getAll (start, end) {
    return Q.ninvoke(Events, "find", {'start.dateTime': { $gte: start, $lte: end }});
  }
}

export default CalendarStore;

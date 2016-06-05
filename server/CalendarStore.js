import Q from 'q';
import LinvoDB from 'linvodb3';
import medeadown from 'medeadown';
LinvoDB.defaults.store = { db: medeadown };
LinvoDB.dbPath = process.cwd();

const Events = new LinvoDB('events', {});

class CalendarStore {

  /*
   * Save or update items
   */

  setItems(items) {
    const list = items.map((i) => {
      const copy = Object.assign({}, i);
      const id = copy.id;
      copy._id = id;
      return copy;
    });

    console.log('CalendarStore: #setItems: Saving all items: ', list.length);
    return Q.ninvoke(Events, 'save', list);
  }


  /*
   * Remove items
   */

  removeItems(items) {
    const ids = items.map(i => i.id);
    console.log('CalendarStore: #removeItems: Removing items: ', ids.length);
    return Q.ninvoke(Events, 'remove', { _id: { $in: ids } }, { multi: true });
  }


  /*
   * Get all items between start/end time range
   */

  getByDate(start, end) {
    return new Promise((resolve, reject) => {
      Events.find({ 'start.dateTime': { $gte: start, $lte: end } }).sort({ 'start.dateTime': 1 }).exec((err, res) => {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  }


  /*
   * Get all items
   */
  getAll() {
    return new Promise((resolve, reject) => {
      Events.find({}).sort({ 'start.dateTime': 1 }).exec((err, res) => {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  }
}

export default CalendarStore;

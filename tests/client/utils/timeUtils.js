/* eslint no-shadow: 0 */

import tape from 'tape';
import timeUtils from '../../../client/utils/timeUtils';

tape('isBetween', (t) => {
  const start = new Date(2016, 5, 6);
  const end = new Date(2016, 5, 7);

  t.test('same day range', (t) => {
    t.plan(2);
    t.equal(true, timeUtils.isBetween(new Date(2016, 5, 6), start, start));
    t.equal(false, timeUtils.isBetween(new Date(2016, 5, 7), start, start));
  });

  t.test('two day range', (t) => {
    t.plan(4);
    t.equal(true, timeUtils.isBetween(new Date(2016, 5, 6), start, end));
    t.equal(true, timeUtils.isBetween(new Date(2016, 5, 7), start, end));
    t.equal(false, timeUtils.isBetween(new Date(2016, 5, 8), start, end));
    t.equal(false, timeUtils.isBetween(new Date(2016, 5, 5), start, end));
  });

  t.test('three day range', (t) => {
    t.plan(5);
    const end2 = new Date(2016, 5, 8);
    t.equal(true, timeUtils.isBetween(new Date(2016, 5, 6), start, end2));
    t.equal(true, timeUtils.isBetween(new Date(2016, 5, 7), start, end2));
    t.equal(true, timeUtils.isBetween(new Date(2016, 5, 8), start, end2));
    t.equal(false, timeUtils.isBetween(new Date(2016, 5, 5), start, end2));
    t.equal(false, timeUtils.isBetween(new Date(2016, 5, 9), start, end2));
  });
});

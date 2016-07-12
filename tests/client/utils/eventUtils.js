import test from 'tape';
import eventUtils from '../../../client/utils/eventUtils';

test('getEventsForDay', (t) => {
  t.plan(6);

  const e1 = {
    start: { date: '2016-06-06' },
    end: { date: '2016-06-07' }
  };

  const e2 = {
    start: { date: '2016-06-07' },
    end: { date: '2016-06-08' }
  };

  const e3 = {
    start: { date: '2016-06-07' },
    end: { date: '2016-06-09' }
  };

  let result = eventUtils.getEventsForDay(new Date(2016, 5, 6), [e1, e2]);
  t.same(result, [e1]);
  result = eventUtils.getEventsForDay(new Date(2016, 5, 7), [e1, e2]);
  t.same(result, [e1, e2]);
  result = eventUtils.getEventsForDay(new Date(2016, 5, 8), [e1, e2]);
  t.same(result, [e2]);
  result = eventUtils.getEventsForDay(new Date(2016, 5, 9), [e1, e2]);
  t.same(result, []);
  result = eventUtils.getEventsForDay(new Date(2016, 5, 8), [e3]);
  t.same(result, [e3]);

  const e4 = {
    start: { dateTime: '2016-06-06T20:00:00Z' },
    end: { dateTime: '2016-06-06T20:00:00Z' }
  };

  result = eventUtils.getEventsForDay(new Date(2016, 5, 6), [e4]);
  t.same(result, [e4]);
});

test('getDatesForEvent', (t) => {
  t.plan(3);

  const e1 = {
    start: { date: '2016-06-07' },
    end: { date: '2016-06-09' }
  };

  let result = eventUtils.getDatesForEvent(e1).map(d => d.getTime());
  t.same(result, [
    new Date(2016, 5, 7).getTime(),
    new Date(2016, 5, 8).getTime(),
    new Date(2016, 5, 9).getTime()
  ]);

  const e2 = {
    start: { date: '2016-06-07' },
    end: { date: '2016-06-08' }
  };

  result = eventUtils.getDatesForEvent(e2).map(d => d.getTime());
  t.same(result, [
    new Date(2016, 5, 7).getTime(),
    new Date(2016, 5, 8).getTime()
  ]);

  const e3 = {
    start: { date: '2016-06-07' },
    end: { date: '2016-06-07' }
  };

  result = eventUtils.getDatesForEvent(e3).map(d => d.getTime());
  t.same(result, [
    new Date(2016, 5, 7).getTime()
  ]);
});

test('getEventStartDate', (t) => {
  t.plan(1);
  const e = {
    start: { date: '2016-06-06' },
    end: { date: '2016-06-07' }
  };

  const expected = new Date(2016, 5, 6);
  const result = eventUtils.getEventStartDate(e);
  t.equal(expected.getTime(), result.getTime());
});

test('getEventEndDate', (t) => {
  t.plan(1);
  const e = {
    start: { date: '2016-06-06' },
    end: { date: '2016-06-07' }
  };

  const expected = new Date(2016, 5, 7);
  const result = eventUtils.getEventEndDate(e);
  t.equal(expected.getTime(), result.getTime());
});

test('groupEventsByDate', (t) => {
  t.plan(1);
  const e1 = {
    start: { date: '2016-06-06' },
    end: { date: '2016-06-08' }
  };
  const result = eventUtils.groupEventsByDate([e1], new Date(2016, 5, 7));
  t.same({
    'Monday 6/6/16': [e1],
    'Today 6/7/16': [e1],
    'Tomorrow 6/8/16': [e1]
  }, result);
});

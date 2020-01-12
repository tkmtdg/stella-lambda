const handler = require('./app').handler;

test('request body is not set', () => {
  expect(handler({})).rejects.toThrowError('request body is not set');
});

test('request body parse failed', () => {
  expect(handler({
    body: 'not a json'
  })).rejects.toThrowError('request body parse failed');
});

test('request body raw_cookies is not set', () => {
  expect(handler({
    body: '{}'
  })).rejects.toThrowError('request body raw_cookies is not set');
});

test('request body raw_cookies is not an array', () => {
  expect(handler({
    body: '{"raw_cookies":{}}'
  })).rejects.toThrowError('request body raw_cookies is not an array');
});

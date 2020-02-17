const Stella = require('./stella');

test('request body is not set', () => {
  expect(() => {
    new Stella({})
  }).toThrowError('request body is not set');
});

test('console is not set', () => {
  expect(() => {
    new Stella({
      requestBodyRaw: 'not a json'
    })
  }).toThrowError('console is not set');

  expect(() => {
    new Stella({
      requestBodyRaw: 'not a json',
      console: {
        log: 'not a funciotn'
      }
    })
  }).toThrowError('console.log is not a function');

  expect(() => {
    new Stella({
      requestBodyRaw: 'not a json',
      console: {
        log: x => x,
        warn: 'not a funciotn'
      }
    })
  }).toThrowError('console.warn is not a function');
});

test('request body parse failed', () => {

  const stella = new Stella({
    requestBodyRaw: 'not a json',
    console: console
  });

  expect(() => {
    stella.bake()
  }).toThrowError('request body parse failed');

});

test('request body raw_cookies is not set', () => {
  const stella = new Stella({
    requestBodyRaw: '{}',
    console: console
  });

  expect(() => {
    stella.bake()
  }).toThrowError('request body raw_cookies is not set');
});

test('request body raw_cookies is not an array', () => {
  const stella = new Stella({
    requestBodyRaw: '{"raw_cookies":{}}',
    console: console
  });

  expect(() => {
    stella.bake()
  }).toThrowError('request body raw_cookies is not an array');

});
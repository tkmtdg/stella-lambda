const Stella = require('./stella');

test('empty parameter', () => {
  expect(() => {
    new Stella();
  }).toThrowError('request body is not set');
});

test('request body is not set', () => {
  expect(() => {
    new Stella({});
  }).toThrowError('request body is not set');
});

test('console is not set', () => {
  expect(() => {
    new Stella({
      requestBodyRaw: 'not a json',
    });
  }).toThrowError('console is not set');

  expect(() => {
    new Stella({
      requestBodyRaw: 'not a json',
      console: {
        log: 'not a funciotn',
      },
    });
  }).toThrowError('console.log is not a function');

  expect(() => {
    new Stella({
      requestBodyRaw: 'not a json',
      console: {
        log: x => x,
        warn: 'not a funciotn',
      },
    });
  }).toThrowError('console.warn is not a function');
});

test('request body parse failed', () => {
  const stella = new Stella({
    requestBodyRaw: 'not a json',
    console: console,
  });

  expect(() => {
    stella.bake();
  }).toThrowError('request body parse failed');
});

test('request body raw_cookies is not set', () => {
  const stella = new Stella({
    requestBodyRaw: '{}',
    console: console,
  });

  expect(() => {
    stella.bake();
  }).toThrowError('request body raw_cookies is not set');
});

test('request body raw_cookies is not an array', () => {
  const stella = new Stella({
    requestBodyRaw: '{"raw_cookies":{}}',
    console: console,
  });

  expect(() => {
    stella.bake();
  }).toThrowError('request body raw_cookies is not an array');
});

test('request body raw_cookies is empty', () => {
  const stella = new Stella({
    requestBodyRaw: '{"raw_cookies":[]}',
    console: console,
  });

  expect(() => {
    stella.bake();
  }).toThrowError('request body raw_cookies is empty');
});

test('no set-cookie string left', () => {
  const stella = new Stella({
    requestBodyRaw:
      '{"raw_cookies":[1,"aaa","a=b\\nc","d=e\\rf","d=e\\r\\nf"]}',
    console: console,
  });

  expect(() => {
    stella.bake();
  }).toThrowError('no set-cookie string left');
});

test('set-cookie success', () => {
  const stella = new Stella({
    requestBodyRaw: '{"raw_cookies":["a=b"]}',
    console: console,
  });

  expect(stella.bake()).toEqual(['a=b']);
});

import mockConsole from 'jest-mock-console';
const context = require('aws-lambda-mock-context');
const { handler } = require('./handler');
const log4js = require('log4js');
log4js.configure({
  appenders: { stella: { type: 'file', filename: '/dev/null' } },
  categories: { default: { appenders: ['stella'], level: 'debug' } },
});

beforeEach(() => {
  mockConsole();
});

describe('normal', () => {
  test('handler', async () => {
    const event = {
      body: '{"raw_cookies":["a=b"]}',
    };
    const response = await handler(event, context());

    expect(response).toEqual({
      statusCode: 200,
      multiValueHeaders: {
        'Set-Cookie': ['a=b'],
      },
      body: '',
    });
  });
});

describe('abnormal', () => {
  test('error', async () => {
    const event = {
      body: '{"raw_cookies":["a"]}',
    };

    expect(handler(event, context())).rejects.toThrowError(
      'no set-cookie string left'
    );
  });
});

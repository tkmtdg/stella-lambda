const Stella = require('../src/stella');
const log4js = require('log4js');

exports.tests = Stella => {
  log4js.configure({
    appenders: { stella: { type: 'file', filename: '/dev/null' } },
    categories: { default: { appenders: ['stella'], level: 'debug' } },
  });

  describe('constructor', () => {
    it('empty parameter', () => {
      expect(() => {
        new Stella();
      }).toThrowError('json is not set');
    });

    it('json is not set', () => {
      expect(() => {
        new Stella({});
      }).toThrowError('json is not set');
    });

    it('jsonFieldName', () => {
      expect(() => {
        new Stella({
          json: '',
          jsonFieldName: 123,
        });
      }).toThrowError('jsonFieldName must be a string');
    });

    it('set logger', () => {
      const logger = new log4js.getLogger();
      logger.level = 'all';
      const stella = new Stella({
        json: '',
        logger: logger,
      });

      expect(stella.logger.level.toString()).toEqual('ALL');
    });

    it('set logLevel', () => {
      const stella = new Stella({
        json: '',
        logLevel: 'all',
      });

      expect(stella.logger.level.toString()).toEqual('ALL');
    });
  });

  describe('json', () => {
    it('json parse failed', () => {
      const stella = new Stella({
        json: 'not a json',
      });

      expect(() => {
        stella.bake();
      }).toThrowError('json parse failed');
    });

    it('json raw_cookies is not set', () => {
      const stella = new Stella({
        json: '{}',
      });

      expect(() => {
        stella.bake();
      }).toThrowError('json raw_cookies is not set');
    });

    it('json raw_cookies is not an array', () => {
      const stella = new Stella({
        json: '{"raw_cookies":{}}',
      });

      expect(() => {
        stella.bake();
      }).toThrowError('json raw_cookies must be an array');
    });

    it('json raw_cookies is empty', () => {
      const stella = new Stella({
        json: '{"raw_cookies":[]}',
      });

      expect(() => {
        stella.bake();
      }).toThrowError('json raw_cookies is empty');
    });
  });

  describe('set-cookie', () => {
    it('no set-cookie string left', () => {
      const stella = new Stella({
        json: '{"raw_cookies":[1,"aaa","a=b\\nc","d=e\\rf","d=e\\r\\nf"]}',
      });

      expect(stella.bake()).toEqual([]);
    });

    it('set-cookie success', () => {
      const stella = new Stella({
        json: '{"raw_cookies":["a=b"]}',
      });

      expect(stella.bake()).toEqual(['a=b']);
    });

    it('unique', () => {
      const stella = new Stella({
        json: '{"raw_cookies":["a=b","c=d","a=b","c=d"]}',
      });

      expect(stella.bake()).toEqual(['a=b', 'c=d']);
    });
  });
};
exports.tests(Stella);

const log4js = require('log4js');
const Logger = require('log4js/lib/logger');
const uniq = require('lodash.uniq');

class Stella {
  constructor({ requestBodyRaw, logger, logLevel } = {}) {
    if (typeof requestBodyRaw === 'undefined') {
      throw new Error('request body is not set');
    }
    this.requestBodyRaw = requestBodyRaw;
    if (typeof logger === 'object' && logger.constructor === Logger) {
      this.logger = logger;
    } else {
      this.logger = log4js.getLogger('stella');
      this.logger.level = 'debug';
    }
    if (typeof logLevel === 'string') {
      this.logger.level = logLevel;
    }

    this.logger.debug('request body:', requestBodyRaw);
  }

  bake() {
    let requestBody;
    try {
      requestBody = JSON.parse(this.requestBodyRaw);
    } catch (error) {
      throw new Error('request body parse failed');
    }

    if (typeof requestBody.raw_cookies === 'undefined') {
      throw new Error('request body raw_cookies is not set');
    }

    const rawCookies = requestBody.raw_cookies;

    if (Array.isArray(rawCookies) === false) {
      throw new Error('request body raw_cookies is not an array');
    }

    if (rawCookies.length === 0) {
      throw new Error('request body raw_cookies is empty');
    }

    const setCookies = [];

    rawCookies.forEach(rawCookie => {
      if (typeof rawCookie !== 'string') {
        this.logger.warn('not a string:', rawCookie);
        return;
      }

      if (rawCookie.indexOf('=') === -1) {
        this.logger.warn('not a set-cookie string:', rawCookie);
        return;
      }

      const trimmed = rawCookie.trim();
      if (/(\r\n|\r|\n)/.test(trimmed)) {
        this.logger.warn('includes CR and/or LF:', rawCookie);
        return;
      }

      setCookies.push(rawCookie);
    });

    if (setCookies.length === 0) {
      throw new Error('no set-cookie string left');
    }

    const unique = uniq(setCookies);

    this.logger.debug('set-cookies:', unique);
    return unique;
  }
}

module.exports = Stella;

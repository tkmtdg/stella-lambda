const log4js = require('log4js');
const uniq = require('lodash.uniq');

class Stella {
  constructor({ json, jsonFieldName = 'raw_cookies', logger, logLevel } = {}) {
    if (typeof json === 'undefined') {
      throw new Error('json is not set');
    }
    this.json = json;
    if (typeof jsonFieldName !== 'string') {
      throw new TypeError('jsonFieldName must be a string');
    }
    this.jsonFiledName = jsonFieldName;

    // using webpack, "logger.constructor === Logger" does not work
    if (typeof logger === 'object' && typeof logger.level === 'object') {
      this.logger = logger;
    } else {
      this.logger = log4js.getLogger('stella');
      this.logger.level = 'debug';
    }
    if (typeof logLevel === 'string') {
      this.logger.level = logLevel;
    }
    this.logger.debug('json:', json);
  }

  bake() {
    let obj;
    try {
      obj = JSON.parse(this.json);
    } catch (error) {
      throw new Error('json parse failed');
    }

    if (typeof obj[this.jsonFiledName] === 'undefined') {
      throw new Error(`json ${this.jsonFiledName} is not set`);
    }

    const rawCookies = obj[this.jsonFiledName];

    if (Array.isArray(rawCookies) === false) {
      throw new TypeError(`json ${this.jsonFiledName} must be an array`);
    }

    if (rawCookies.length === 0) {
      throw new Error(`json ${this.jsonFiledName} is empty`);
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

    let result = [];
    if (setCookies.length === 0) {
      this.logger.warn('no set-cookie string left');
    } else {
      result = uniq(setCookies);
    }

    this.logger.debug('set-cookies:', result);
    return result;
  }
}

module.exports = Stella;

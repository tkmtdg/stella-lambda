const uniq = require('lodash.uniq');

class Stella {
  constructor({ requestBodyRaw, console } = {}) {
    if (typeof requestBodyRaw === 'undefined') {
      throw new Error('request body is not set');
    }
    if (typeof console === 'undefined') {
      throw new Error('console is not set');
    }
    if (typeof console.log !== 'function') {
      throw new Error('console.log is not a function');
    }
    if (typeof console.warn !== 'function') {
      throw new Error('console.warn is not a function');
    }
    this.requestBodyRaw = requestBodyRaw;
    this.console = console;

    console.log('request body', requestBodyRaw);
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
        this.console.warn('not a string', rawCookie);
        return;
      }

      if (rawCookie.indexOf('=') === -1) {
        this.console.warn('not a set-cookie string', rawCookie);
        return;
      }

      const trimmed = rawCookie.trim();
      if (/(\r\n|\r|\n)/.test(trimmed)) {
        this.console.warn('includes CR and/or LF', rawCookie);
        return;
      }

      setCookies.push(rawCookie);
    });

    if (setCookies.length === 0) {
      throw new Error('no set-cookie string left');
    }

    const uniqued = uniq(setCookies);

    this.console.log('set-cookies', uniqued);
    return setCookies;
  }
}

module.exports = Stella;

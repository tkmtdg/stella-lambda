exports.handler = async (event, context) => {
  try {
    if (typeof (event.body) === 'undefined') {
      throw new Error('request body is not set');
    }

    console.log('request body', event.body);

    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (error) {
      throw new Error('request body parse failed');
    }

    if (typeof (requestBody.raw_cookies) === 'undefined') {
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

    rawCookies.forEach((rawCookie) => {
      if (typeof (rawCookie) !== 'string') {
        console.warn('not a string', rawCookie);
        return;
      }

      if (rawCookie.indexOf('=') === -1) {
        console.warn('not a set-cookie string', rawCookie);
        return;
      }

      setCookies.push(rawCookie);
    });

    if (setCookies.length === 0) {
      throw new Error('no set-cookie string left');
    }

    console.log('set-cookies', setCookies);

    return {
      'statusCode': 200,
      'headers': {
        'Content-Type': "application/json"
      },
      'multiValueHeaders': {
        'Set-Cookie': setCookies
      },
      'body': '',
    };

  } catch (error) {
    console.error(error.toString(), error);
    //throw error;

    return {
      'statusCode': 200,
      'headers': {
        'Content-Type': "application/json"
      },
      'body': error.message
    }
  }
};
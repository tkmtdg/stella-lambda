const Stella = require('./stella');

exports.handler = async (event, context) => {
  try {
    const stella = new Stella({
      requestBodyRaw: event.body,
      console: console
    });

    const setCookies = stella.bake();
    return {
      'statusCode': 200,
      'multiValueHeaders': {
        'Set-Cookie': setCookies
      },
      'body': '',
    };

  } catch (error) {
    console.error(error.toString(), error);
    throw error;
  }
};
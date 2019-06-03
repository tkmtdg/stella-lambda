const setCookie = require('set-cookie-parser');
const cookie = require('cookie');

exports.handler = async (event, context) => {
    let response;

    try {
        const parsedCookies = [];
        const setCookieHeaders = [];
        const requestBody = JSON.parse(event.body);
        let rawCookies = [];

        if (
            typeof (requestBody.raw_cookies) !== 'undefined' &&
            Array.isArray(requestBody.raw_cookies)
        ) {
            rawCookies = requestBody.raw_cookies;
        } else {
            throw new Error('raw_cookies is not set');
        }

        rawCookies.forEach((rawCookie) => {
            const parseResult = setCookie.parse(rawCookie, {
                decodeValues: false
            });

            if (parseResult.length > 0) {
                const parsedCookie = parseResult[0];
                parsedCookies.push(parsedCookie);

                let options = {
                    encode: false
                };
                if (typeof (parsedCookie.path) === 'string') {
                    options.path = parsedCookie.path;
                }
                if (typeof (parsedCookie.domain) === 'string') {
                    options.domain = parsedCookie.domain;
                }
                if (typeof (parsedCookie.expires) !== 'undefined') {
                    options.expires = parsedCookie.expires;
                }
                if (typeof (parsedCookie.maxAge) === 'number') {
                    options.maxAge = parsedCookie.maxAge;
                }
                if (parsedCookie.secure === true) {
                    options.secure = parsedCookie.secure;
                }
                if (parsedCookie.httpOnly === true) {
                    options.httpOnly = parsedCookie.httpOnly;
                }
                if (typeof (parsedCookie.sameSite) === 'string') {
                    options.sameSite = parsedCookie.sameSite;
                }

                const header = cookie.serialize(
                    parsedCookie.name,
                    parsedCookie.value,
                    options
                );

                setCookieHeaders.push(header);
            }
        });

        const body = {
            'raw_cookies': rawCookies,
            'parsed_cookies': parsedCookies
        };

        response = {
            'statusCode': 200,
            // 'headers': {},
            'multiValueHeaders': {
                'Set-Cookie': rawCookies
            },
            'body': JSON.stringify(body),
            // 'isBase64Encoded': false
        };

        // if (setCookieHeaders.length > 0) {
        //     response.multiValueHeaders = {
        //         'Set-Cookie': setCookieHeaders
        //     };
        // }

    } catch (err) {
        console.log(err);
        throw err;
    }

    return response
};
// Express middleware that will replace the response with a compressed version of the response body,
// in case we receive a request with 'Accept-Encoding' set to zpaq.

'use strict';

module.exports = function (req, res, next) {
    if (req.headers['accept-encoding'].includes('dummy')) {
        res.setHeader('Content-Encoding', 'dummy');
        res.setHeader('Content-Length', '5');
        res.end('dummy');
    }
    else {
        next();
    }
}

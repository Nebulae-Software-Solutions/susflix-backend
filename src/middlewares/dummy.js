// Dummy express middleware that will replace the response with a hardcoded string,
// in case we receive a request with 'Accept-Encoding' set to dummy.

'use strict';

module.exports = function (req, res, next) {
    if (req.headers['accept-encoding-extra']?.includes('dummy')) {
        res.setHeader('Content-Encoding-Extra', 'dummy')
        res.setHeader('Content-Length-Extra', '5')
        res.body = 'dummy'
        console.log({ res })
        next()
        // res.end('dummy')
    }
    else next()
}

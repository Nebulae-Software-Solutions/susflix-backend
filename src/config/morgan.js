const morgan = require('morgan');

morgan.token('response-time', function (req, res, digits) {
    // missing request and/or response start time
    if (!req._startAt || !res._startAt) return
  
    // calculate diff
    const ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
      (res._startAt[1] - req._startAt[1]) * 1e-6
  
    // colorize - red if over 5000ms, purple over 500ms, yellow over 350ms, green otherwise
    const colorCodes = {
      5000: 31, // red
      500: 35, // purple
      350: 33, // yellow
      0: 32 // green
    }
    const color = Object.keys(colorCodes).reduce((prev, curr) =>
      ms > curr ? colorCodes[curr] : prev, 32)
  
    // truncated value
    let trunc = ms.toFixed(digits === undefined ? 3 : digits)
  
    // separate thousands by dots and decimals by comma
    trunc = [...trunc]
      .map((char, i) => char === '.' ? ',' : char)
      .map((char, i, arr) => arr[i - 1] &&  // no leading dot
        (arr.length - i - 1) % 3 === 0 &&   // every 3rd char
        (i < arr.length - 5)                // respect decimals
        ? `.${char}` : char)
      .join('')
    return '\x1b[' + color + 'm' + trunc + ' ms\x1b[0m'
  })

  morgan.token('url', function (req, _res) {
    let str = (req.originalUrl || req.url)
    str = str.includes('?') ? str.split('?')[0] : str
    str = str.split('/').filter(w => w !== 'api').join('')
  
    const color = [...str].reduce((prev, curr) => prev + curr.charCodeAt(0), 0) % 255
    return '\x1b[38;5;' + color + 'm' + (req.originalUrl || req.url) + '\x1b[0m'
  })
  
  morgan.token('status', function (req, res) {
    const status = res.statusCode;
    const colorCodes = {
      500: 31, // red
      400: 33, // yellow
      300: 36, // cyan
      200: 32, // green
      0: 0     // no color
    }
    const color = Object.keys(colorCodes).reduce((prev, curr) =>
      status >= curr ? colorCodes[curr] : prev, 0)
    return '\x1b[' + color + 'm' + status + '\x1b[0m'
  })
  
  morgan.token('method', function (req, _res) {
    // Align the next column.
    // 7 is the length of the longest methods (CONNECT and OPTIONS)
    return req.method.padEnd(7)
  })
  
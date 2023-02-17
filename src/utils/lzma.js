// Compress a given string using the lzma program, and return the compressed contents.

const { spawn } = require('child_process')


const compress = str => new Promise((resolve, reject) => {

    const lzma = spawn('lzma', ["-z", "-c", "-9"],
        { stdio: ["pipe", "pipe", "inherit"] })

    lzma.on('error', err => {
        // console.log(`Failed to start lzma: ${err}`)
        reject(err)
    })

    lzma.on('exit', (code, signal) => {
        if (code) {
            // console.log(`lzma process exited with code ${code}`)
            reject(code)
        }
        else if (signal) {
            // console.log(`lzma process exited with signal ${signal}`)
            reject(signal)
        }
        else {
            // console.log(`lzma process exited successfully`)
            resolve(compressed)
        }
    })

    lzma.stdin.write(str)
    lzma.stdin.end()

    let compressed = Buffer.from('')
    lzma.stdout.on('data', data => {
        compressed = Buffer.concat([compressed, data])
    })

})

module.exports = compress

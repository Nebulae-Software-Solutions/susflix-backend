// Compress a given string using the xwrt program, and return the compressed contents.

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')


const compress = (str, level) => new Promise((resolve, reject) => {
    const options = `-${level}`
    const createTempFilename = () => Number(new Date()) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const tempFilename = path.join('/tmp', createTempFilename())
    const outputFilename = `${tempFilename}.xwrt`

    fs.writeFileSync(tempFilename, str)

    const xwrt = spawn('xwrt', [options, tempFilename])

    xwrt.on('error', (err) => {
        // console.log(`Failed to start xwrt: ${err}`)
        reject(err)
    })

    xwrt.on('exit', (code, signal) => {
        if (code) {
            // console.log(`xwrt process exited with code ${code}`)
            reject(code)
        }
        else if (signal) {
            // console.log(`xwrt process exited with signal ${signal}`)
            reject(signal)
        }
        else {
            // console.log(`xwrt process exited successfully`)
            const compressed = fs.readFileSync(outputFilename)
            fs.unlinkSync(tempFilename)
            fs.unlinkSync(outputFilename)
            resolve(compressed)
        }
    })
})


module.exports = compress

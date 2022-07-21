
import fs from 'fs'
import printMemoryUsage from './print-memory.js'
import xlsx2csv from './index.browser.js'

const buffer = fs.readFileSync(process.argv[2])

let max = parseInt(process.argv[3])
max = isNaN(max) ? Infinity : max

xlsx2csv(buffer, console.log, { sheet: { max } }).then(printMemoryUsage)






import printMemoryUsage from './print-memory.js'
import xlsx2csv from './index.js'

const filename = (process.argv[2])

let max = parseInt(process.argv[3])
max = isNaN(max) ? Infinity : max

xlsx2csv(filename, console.log, { sheet: { max } }).then(printMemoryUsage)





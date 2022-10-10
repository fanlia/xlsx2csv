
import printMemoryUsage from './print-memory.js'
import xlsx2csv from './index.js'

const filename = (process.argv[2])

let max = parseInt(process.argv[3])
max = isNaN(max) ? Infinity : max

const collect = process.argv[4] === 'true'

xlsx2csv(filename, console.log, { sheet: { max, collect } }).then(printMemoryUsage)





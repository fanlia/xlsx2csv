
import printMemoryUsage from './print-memory.js'
import xlsx2csv from './index.js'

const filename = (process.argv[2])

xlsx2csv(filename, () => {}).then(printMemoryUsage)





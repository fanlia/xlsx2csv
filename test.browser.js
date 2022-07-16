
import fs from 'fs'
import printMemoryUsage from './print-memory.js'
import xlsx2csv from './index.browser.js'

const buffer = fs.readFileSync(process.argv[2])

xlsx2csv(buffer).then(printMemoryUsage)






import fs from 'fs'

const buffer = fs.readFileSync(process.argv[2])

import xlsx2csv from './index.js'

xlsx2csv(buffer)





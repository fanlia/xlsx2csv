
import fs from 'fs'

const buffer = fs.readFileSync('data.xlsx')

import xlsx2csv from './index.js'

xlsx2csv(buffer)






import xlsx2csv from './index.js'

const filename = (process.argv[2])

const max = 100
const collect = true

xlsx2csv(filename, null, { sheet: { max, collect } }).then(console.log)





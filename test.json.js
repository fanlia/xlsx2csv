
import xlsx2csv from './index.js'

const filename = (process.argv[2])

const max = 100
const collect = true
const json = true

xlsx2csv(filename, console.log, { sheet: { max, collect, json } })

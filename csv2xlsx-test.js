
import csv2xlsx from './csv2xlsx.js'
import fs from 'fs'

const source = [
    ['number1', 'number2', 'hello', 'number3', null, 'date', 'list'],
    [12.7, 12.8, 'world', '100', null, new Date(), [1,2,3]],
]

csv2xlsx(source)
.then(buf => {
    fs.writeFileSync('xdata.xlsx', buf)
    console.log(buf)
})
.catch(console.log)

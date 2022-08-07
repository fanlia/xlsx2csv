# xlsx2csv

xlsx2csv for browser and nodejs with performance considered

[demo](https://fanlia.github.io/xlsx2csv/)

## Install

```sh
npm i @ailnaf/xlsx2csv
```

## Usage

### esm

```javascript
import xlsx2csv from '@ailnaf/xlsx2csv'

```

### cdn

```html
<script src="https://unpkg.com/@ailnaf/xlsx2csv/xlsx2csv.min.js"></script>
```

### cjs

```javascript
const { default: xlsx2csv } = await import('@ailnaf/xlsx2csv')
```

### nodejs

```javascript

const filename = 'data.xlsx'

xlsx2csv(filename, console.log)

```

### browser

```javascript
const buffer = await fetch('data.xlsx').then(res => res.blob())

xlsx2csv(buffer, console.log, { sheet: { max: 100 } })

```

### export xlsx

for small files browser and nodejs

```javascript
import csv2xlsx from '@ailnaf/xlsx2csv/csv2xlsx'

const source = [
    ['number1', 'number2', 'hello', 'number3', null, 'date', 'list'],
    [12.7, 12.8, 'world', '100', null, new Date(), [1,2,3]],
]

csv2xlsx(source)
.then(buf => {
    console.log(buf)
})
.catch(console.log)

```

## Test

```sh
# all data
node test.js data.xlsx

# 1 row
node test.js data.xlsx 1
```

## License

MIT

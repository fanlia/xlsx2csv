# xlsx2csv

xlsx2csv for browser and nodejs with performance considered

## Install

```sh
npm i @ailnaf/xlsx2csv
```

## Usage

### esm

```javascript
import xlsx2csv from '@ailnaf/xlsx2csv'

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

## browser

```javascript
const buffer = await fetch('data.xlsx').then(res => res.arrayBuffer())

xlsx2csv(buffer, console.log)

```

## Test

```sh
node test.js data.xlsx
```

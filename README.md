# xlsx2csv

xlsx2csv for browser and nodejs

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
import fs from 'fs'

const buffer = fs.readFileSync('data.xlsx')

xlsx2csv(buffer, console.log)

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

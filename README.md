# xlsx2csv

xlsx2csv for browser and nodejs

## Install

```
npm i @ailnaf/xlsx2csv
```

## Usage

### esm

```
import xlsx2csv from '@ailnaf/xlsx2csv'

```

### cjs

```
const { default: xlsx2csv } = await import('@ailnaf/xlsx2csv')
```

### nodejs

```
import fs from 'fs'

const buffer = fs.readFileSync('data.xlsx')

xlsx2csv(buffer, console.log)

```

## browser

```
const buffer = await fetch('data.xlsx').then(res => res.arrayBuffer())

xlsx2csv(buffer, console.log)

```

## Test

```
node test.js data.xlsx
```

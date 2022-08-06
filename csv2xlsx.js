
import JSZip from 'jszip'
import template from './template.js'

function numbersToLetter(number) {
    let colName = '';
    let dividend = Math.floor(Math.abs(number));
    let rest;

    while (dividend > 0) {
        rest = (dividend - 1) % 26;
        colName = String.fromCharCode(65 + rest) + colName;
        dividend = parseInt(`${(dividend - rest) / 26}`);
    }
    return colName;
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}

export default async function csv2xlsx(source) {

    const zip = await JSZip.loadAsync(template, { base64: true })

    const sheet1_path = 'xl/worksheets/sheet1.xml'

    const sheet1_xml = await zip.file(sheet1_path ).async('string')

    const [sheetHeader, sheetFooter] = sheet1_xml.split(/<sheetData\/>|<sheetData>.*<\/sheetData>/)

    const sheetData = source.map((row, i) => {

        const r = i + 1

        return `<row r="${r}">${row.map((v, ii)=> {
            const c = numbersToLetter(ii + 1)
            if (typeof v === 'number') {
                return `<c r="${c}${r}" t="n"><v>${v}</v></c>`
            }

            if (v instanceof Date) {
                v = formatDate(v)
            }

            if (v) {
                return `<c r="${c}${r}" t="inlineStr"><is><t>${v}</t></is></c>`
            }
        }).join('')}</row>`
    })
    .join('')

    const new_sheet1_xml = [sheetHeader, '<sheetData>', sheetData, '</sheetData>', sheetFooter].join(',')

    zip.file(sheet1_path, new_sheet1_xml)

    const buffer = await zip.generateAsync({
        type: "uint8array",
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
    })

    return buffer
}

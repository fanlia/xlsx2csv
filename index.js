
import JSZip from 'jszip'
import { SaxesParser, EVENTS } from 'saxes'
import numfmt from "numfmt"

function parse_xml(xml, callback) {

    return new Promise((resolve, reject) => {
        const parser = new SaxesParser()
        parser.on('end', resolve)
        parser.on('error', reject)

        let path = []
        let text = undefined

        parser.on('opentag', (data) => {
            const { name, attributes } = data
            path.unshift({ name, attributes })
        })

        parser.on('text', (data) => {
            text = data
        })

        parser.on('closetag', async (data) => {
            path.shift()
            const { name, attributes } = data
            data = text === undefined ? { name, attributes } : { name, attributes, text }
            text = undefined
            try {
                await callback(name, data, [...path])
            } catch (e) {
                // ignore
            }
        })

        parser.write(xml).close()
    })
}

async function parse_workbook(xml) {

    let sheets = []

    await parse_xml(xml, (name, data, path) => {
        if (name === 'sheet') {
            sheets.push(data.attributes)
        }
    })

    return sheets
}

async function parse_sharedStrings(xml) {
    let texts = []
    let items = []
    await parse_xml(xml, (name, data, path) => {
        if (name === 'si') {
            texts.push(items.join(''))
            items = []
        } else if (name === 't') {
            items.push(data.text)
        }
    })

    return texts
}

async function parse_styles(xml) {
    let formats = []
    await parse_xml(xml, (name, data, path) => {
        if (name === 'numFmt') {
            const { numFmtId, formatCode } = data.attributes
            formats.push(formatCode)
        }
    })

    console.log(formats)

    return formats
}

async function parse_sheet(xml, texts, formats) {

    let rows = []
    let cells = []

    await parse_xml(xml, (name, data, path) => {
        if (name === 'row') {
            rows.push(cells)
            cells = []
        } else if (name === 'v') {
            const c = path[0]
            const t = c.attributes.t
            let text = data.text

            if (t === 's') {
                text = texts[text]
            }

            cells.push(text)
        }
    })

    console.log(rows)

    return rows
}

export default async function xlsx2csv(xlsx) {
    const zip = await JSZip.loadAsync(xlsx)
    console.log(zip)
    const workbook_xml = await zip.file('xl/workbook.xml').async('string')
    await parse_workbook(workbook_xml)
    const sharedStrings_xml = await zip.file('xl/sharedStrings.xml').async('string')
    const texts = await parse_sharedStrings(sharedStrings_xml)
    const styles_xml = await zip.file('xl/styles.xml').async('string')
    const styles = await parse_styles(styles_xml)
    const sheet1_xml = await zip.file('xl/worksheets/sheet1.xml').async('string')
    await parse_sheet(sheet1_xml, texts, styles)
}


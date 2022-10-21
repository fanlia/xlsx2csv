
import { SaxesParser } from 'saxes'
import ssf from 'ssf'

export default function xlsx2csvBuilder(Zip, connect) {

    const ssf_table = ssf.get_table()

    function parse_xml(xml, callback) {

        return new Promise((resolve, reject) => {
            if (!xml) return resolve()
            let unresolved = true

            let status = { stop: false }

            const stop = () => {
                status.stop = true
            }

            const resolveonce = () => {
                if (unresolved) {
                    unresolved = false
                    resolve()
                }
            }

            const parser = new SaxesParser()
            parser.on('end', resolveonce)
            parser.on('error', e => {
                if (status.stop) {
                    return resolveonce()
                }
                reject(e)
            })

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
                    await callback(name, data, [...path], stop)
                } catch (e) {
                    console.error(e)
                }
            })

            connect(xml, parser, status)
        })
    }

    async function parse_workbook(xml) {

        let sheets = []
        let activeTab = 0

        await parse_xml(xml, (name, data, path) => {
            if (name === 'sheet') {
                sheets.push(data.attributes)
            } else if (name === 'workbookView') {
                if (data.attributes.activeTab) {
                    activeTab = Number(data.attributes.activeTab)
                }
            }
        })

        return { sheets, activeTab }
    }

    async function parse_workbook_rels(xml) {

        let rels = {}

        await parse_xml(xml, (name, data, path) => {
            if (name === 'Relationship') {
                const { Id, Target } = data.attributes
                rels[Id] = Target
            }
        })

        return rels
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
        let numberFormats = {}
        await parse_xml(xml, (name, data, path) => {
            if (name === 'numFmt' && path[0].name === 'numFmts') {
                const { numFmtId, formatCode } = data.attributes
                numberFormats[numFmtId] = formatCode
            } else if (name === 'xf' && path[0].name === 'cellXfs') {
                const { numFmtId } = data.attributes
                formats.push(Number(numFmtId))
            }
        })

        formats = formats.map(numFmtId => numberFormats[numFmtId] || ssf_table[numFmtId] || numFmtId)

        return formats
    }

    function formatDate(value) {
        const { y, m, d, H, M, S } = ssf.parse_date_code(value)
        const [YYYY, MM, DD, hh, mm, ss] = [y, m, d, H, M, S].map(num => String(num).padStart(2, '0'))
        return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`
    }

    function r2ci(r) {
        const letters = r.replace(/[0-9]/g, '')
        return letters.split('').reduce((r, a) => r * 26 + parseInt(a, 36) - 9, 0) - 1
    }

    async function parse_sheet(xml, texts, formats, callback, options = {}) {

        const {
            max = Infinity,
            collect = false,
        } = options

        let rows = []
        let cells = []
        let i = 0

        let count = 0

        await parse_xml(xml, (name, data, path, stop) => {
            if (name === 'row' || name === 'x:row') {
                if (cells.length > 0 && !cells.every(cell => cell === '' || cell === undefined)) {
                    if (count > max) {
                        stop()
                    } else {
                        if (collect) {
                            rows.push(cells)
                        } else {
                            callback(cells)
                        }
                        count++
                    }
                }
                i = 0
                cells = new Array(cells.length)
            } else if (name === 'v' || name === 'x:v') {
                const c = path[0]
                const t = c.attributes.t
                const r = c.attributes.r

                const ci = r ? r2ci(r) : i
                const formatId = c.attributes.s
                let text = data.text || ''
                text = text.trim()

                if (text.length > 0) {
                    if (t === 's') {
                        text = texts[text]
                    } else if (t === 'b') {
                        text = text === '0' ? 'FALSE' : 'TRUE'
                    } else if (t === 'e') {
                        text = ''
                    } else if (formatId) {
                        let value = parseFloat(text)
                        if (!isNaN(value)) {
                            let numFormat = formats[formatId]
                            if (typeof numFormat === 'string') {
                                const isDate = ssf.is_date(numFormat)
                                if (isDate) {
                                    text = /[yd]/.test(numFormat) ? formatDate(value) : ssf.format(numFormat, value)
                                } else {
                                    text = value
                                }
                            } else if (numFormat) {
                                text = ssf.format(numFormat, value)
                            } else {
                                text = value
                            }
                        }
                    }
                }

                if (r === undefined && text === '') return

                cells[ci] = text
                i++
            } else if (name === 't' || name === 'x:t') {
                const c = path[1]
                const t = c.attributes.t
                const r = c.attributes.r
                const ci = r ? r2ci(r) : i
                if (t === 'inlineStr') {
                    cells[ci] = data.text
                    i++
                }
            }
        })

        if (collect) {
            callback(rows)
        }
    }

    return async function xlsx2csv(xlsx, callback = console.log, options = {}) {
        const zip = await Zip.loadAsync(xlsx)
        const workbook_xml = await zip.getXML('xl/workbook.xml')
        const { sheets, activeTab } = await parse_workbook(workbook_xml)
        const sharedStrings_xml = await zip.getXML('xl/sharedStrings.xml')
        const texts = await parse_sharedStrings(sharedStrings_xml)
        const styles_xml = await zip.getXML('xl/styles.xml')
        const styles = await parse_styles(styles_xml)
        const rels_xml = await zip.getXML('xl/_rels/workbook.xml.rels')
        const rels = await parse_workbook_rels(rels_xml)
        const sheet1_path = sheets.length > activeTab ? `xl/${rels[sheets[activeTab]['r:id']].replace(/^\/xl\//, '')}` : 'xl/worksheets/sheet1.xml'
        const sheet1_xml = await zip.getXML(sheet1_path)
        await parse_sheet(sheet1_xml, texts, styles, callback, options.sheet)
        await zip.close()
    }
}

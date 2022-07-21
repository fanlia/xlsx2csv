
import StreamZip from 'node-stream-zip'

export class Zip {
    constructor(zip) {
        this.zip = zip
    }

    static async loadAsync(xlsx) {
        const zip = new StreamZip.async({ file: xlsx })
        return new Zip(zip)
    }

    async getXML(path) {
        const entry = await this.zip.entry(path)
        return entry && this.zip.stream(entry)
    }

    async close() {
        await this.zip.close()
        this.zip = null
    }
}

export function connect(xml, parser, status) {
    xml.setEncoding('utf8')

    xml.on('data', chunk => {
        if (status.stop) {
            xml.destroy()
            parser.close()
        } else {
            parser.write(chunk)
        }
    })

    xml.on('end', () => {
        parser.close()
    })
}

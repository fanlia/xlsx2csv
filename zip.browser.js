
import JSZip from 'jszip'

export class Zip {
    constructor(zip) {
        this.zip = zip
    }

    static async loadAsync(xlsx) {
        const zip = await JSZip.loadAsync(xlsx)
        return new Zip(zip)
    }

    async getXML(path) {
        const handle = this.zip.file(path)
        return handle && handle.async('string')
    }

    async close() {
        this.zip = null
    }
}

export function connect(xml, parser, status) {
    const step = 1000
    let i = 0
    while (i < xml.length) {
        if (status.stop) {
            break
        }
        const part = xml.slice(i, i + step)
        parser.write(part)
        i += step
    }
    parser.close()
}

export const MAX = 10000

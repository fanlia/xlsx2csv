
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

export function connect(xml, parser) {
    parser.write(xml).close()
}

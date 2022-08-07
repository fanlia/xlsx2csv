
import { unzip, strFromU8 } from 'fflate'

export class Zip {
    constructor(zip) {
        this.zip = zip
    }

    static async loadAsync(xlsx) {
        const zip = await new Promise((resolve, reject) => {
            unzip(new Uint8Array(xlsx), (err, unzipped) => {
                err ? reject(err) : resolve(unzipped)
            })
        })
        return new Zip(zip)
    }

    async getXML(path) {
        const handle = this.zip[path]
        return handle && strFromU8(handle)
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

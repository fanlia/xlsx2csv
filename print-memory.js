
export default function printMemoryUsage() {
    const used = process.memoryUsage()
    for (let key in used) {
        console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`)
    }
}

export function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

export function randomInt(max) {
    return Math.floor(Math.random() * max) + 1
}

export function getRandomElementsWithMaxRepeat(arr, count, maxRepeat = 3) {
    if (!arr || arr.length === 0) {
        return []
    }

    const result = []
    const counts = {}

    for (let i = 0; i < count; i++) {
        const available = arr.filter(
            item => (counts[item.slug] || 0) < maxRepeat
        )

        if (available.length === 0) {
            break
        }

        const randomItem = pick(available)

        result.push(randomItem)
        counts[randomItem.slug] = (counts[randomItem.slug] || 0) + 1
    }

    return result
}

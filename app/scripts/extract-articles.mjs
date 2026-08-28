// Одноразова міграція: витягує статті зі старих HTML-сторінок
// і карткові дані з wiki.js у src/data/articles.js.
// Запуск: npm run extract (з папки app/)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const siteDir = join(scriptDir, '..', '..', 'wiki')
const outFile = join(scriptDir, '..', 'src', 'data', 'articles.js')

const ENTITIES = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
}

function decode(text) {
    return text.replace(/&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;/g, ch => ENTITIES[ch])
}

// "текст <a href=''>лінк</a> текст" -> ["текст ", { l: "лінк" }, " текст"]
function toSegments(html) {
    const segments = []
    let last = 0
    const re = /<a[^>]*>([\s\S]*?)<\/a>/g
    let m

    const pushText = (raw) => {
        const text = decode(raw.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ')
        if (text) segments.push(text)
    }

    while ((m = re.exec(html)) !== null) {
        pushText(html.slice(last, m.index))
        segments.push({ l: decode(m[1].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ') })
        last = re.lastIndex
    }
    pushText(html.slice(last))

    return segments
}

// Карткові дані (id/href/name/image/description) з wiki.js
function extractProducts(jsSource) {
    const products = []
    const re = /id:\s*"([^"]+)",\s*href:\s*"([^"]+)",\s*name:\s*"([^"]*)",\s*(?:image:\s*"([^"]*)",\s*)?description:\s*"([\s\S]*?)"\s*\}/g
    let m
    while ((m = re.exec(jsSource)) !== null) {
        products.push({
            id: m[1],
            href: m[2],
            name: m[3],
            image: m[4] || '',
            description: m[5],
        })
    }
    return products
}

function extractSections(html) {
    const sections = []
    const sectionRe = /<section>\s*<div>([\s\S]*?)<\/section>/g
    let m

    while ((m = sectionRe.exec(html)) !== null) {
        const body = m[1]

        const h1 = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)
        const h2 = body.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)
        const heading = decode((h1 ? h1[1] : h2 ? h2[1] : '').replace(/<[^>]+>/g, '')).trim()

        const imgMatch = body.match(/<img[^>]*>/)
        let image = ''
        let imageAlt = ''
        if (imgMatch) {
            const src = imgMatch[0].match(/src="([^"]*)"/)
            const alt = imgMatch[0].match(/alt="([^"]*)"/)
            image = src ? src[1] : ''
            imageAlt = alt ? alt[1] : ''
        }

        const paragraphs = []
        const pRe = /<p>([\s\S]*?)<\/p>/g
        let p
        while ((p = pRe.exec(body)) !== null) {
            paragraphs.push(toSegments(p[1]))
        }

        sections.push({ heading, image, imageAlt, paragraphs })
    }

    return sections
}

const jsSource = readFileSync(join(siteDir, 'wiki.js'), 'utf8')
const products = extractProducts(jsSource)

const articles = []
for (const product of products) {
    const fileName = product.href
    const html = readFileSync(join(siteDir, fileName), 'utf8')
    const sections = extractSections(html)

    articles.push({
        slug: fileName.replace(/\.html$/, '').toLowerCase(),
        id: product.id,
        title: sections[0]?.heading || product.name,
        cardName: product.name,
        cardImage: product.image,
        cardDescription: toSegments(product.description),
        sections,
    })
}

const file = `// ЗГЕНЕРОВАНО scripts/extract-articles.mjs зі старих HTML-сторінок.
// Не редагуйте вручну: правки загубляться при повторному запуску.
// Абзац — масив сегментів: рядок (текст), { l } («червоний лінк»),
// { l, to } (лінк на існуючу статтю).

export const articles = ${JSON.stringify(articles, null, 4)}
`

writeFileSync(outFile, file, 'utf8')

console.log(`Готово: ${articles.length} статей -> ${outFile}`)
for (const a of articles) {
    console.log(`  ${a.slug}: ${a.sections.length} розділів, карток-зображень: ${a.sections.filter(s => s.image).length}`)
}

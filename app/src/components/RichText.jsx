import WikiLink from './WikiLink.jsx'

// Рендерить абзац, зібраний із сегментів:
// рядок — звичайний текст, { l: "текст" } — «червоний лінк»,
// { l: "текст", to: "slug" } — лінк на існуючу статтю.
export default function RichText({ segments }) {
    return segments.map((segment, i) =>
        typeof segment === 'string'
            ? segment
            : <WikiLink key={i} to={segment.to}>{segment.l}</WikiLink>
    )
}

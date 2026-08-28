import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { articles } from '../data/articles.js'
import { mistakes } from '../data/fun.js'
import { pick } from '../utils/random.js'

// Лінк між статтями: із відомим slug веде на статтю,
// без нього — «червоний лінк» неіснуючої статті (клас new
// + випадкова 404-підказка, як у оригінальному updatePageLinks).
export default function WikiLink({ to, children }) {
    const mistake = useMemo(() => pick(mistakes), [])

    if (!to) {
        return (
            <a className="new" title={mistake} href="#/" onClick={(e) => e.preventDefault()}>
                {children}
            </a>
        )
    }

    return <Link to={`/article/${to}`}>{children}</Link>
}

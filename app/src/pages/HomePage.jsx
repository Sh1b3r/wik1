import { useEffect, useMemo } from 'react'
import { articles } from '../data/articles.js'
import { months, weekdayArr } from '../data/fun.js'
import { getRandomElementsWithMaxRepeat, pick, randomInt } from '../utils/random.js'
import WikiCard from '../components/WikiCard.jsx'

const LEFT_CARDS_LIMIT = 4
const RIGHT_CARDS_LIMIT = 5
const BOTTOM_CARDS_LIMIT = 1

export default function HomePage() {
    useEffect(() => {
        document.title = 'Вікіпедія'
    }, [])

    const columns = useMemo(() => {
        const selected = getRandomElementsWithMaxRepeat(
            articles,
            LEFT_CARDS_LIMIT + RIGHT_CARDS_LIMIT + BOTTOM_CARDS_LIMIT,
            3
        )

        return {
            left: selected.slice(0, LEFT_CARDS_LIMIT),
            right: selected.slice(LEFT_CARDS_LIMIT, LEFT_CARDS_LIMIT + RIGHT_CARDS_LIMIT),
            bottom: selected.slice(LEFT_CARDS_LIMIT + RIGHT_CARDS_LIMIT),
        }
    }, [])

    const hero = useMemo(() => ({
        day: randomInt(365),
        year: randomInt(3000),
        month: pick(months),
        weekday: pick(weekdayArr),
        counters: [
            randomInt(1000000000),
            randomInt(1000000000),
            randomInt(1000000000),
        ],
    }), [])

    return (
        <main className="mw-content-container">
            <div className="main-card-container">
                <div className="main-card">
                    <div className="left-card">
                        <h1>Ласкаво просимо до Вікіпедії</h1>
                        <p>вільної енциклопедії, яку може редагувати кожен.</p>
                        <p>Українська Вікіпедія заснована {hero.day} {hero.month} {hero.year} року.</p>
                        <p>{hero.weekday}, {hero.day} {hero.month} {hero.year} року</p>
                    </div>
                    <div className="right">
                        <p><span className="article">{hero.counters[0]}</span> статті українською</p>
                        <p><span className="article">{hero.counters[1]}</span> зареєстрованих дописувачів</p>
                        <p><span className="article">{hero.counters[2]}</span> з них активні останнього місяця</p>
                    </div>
                </div>
            </div>
            <div className="mw-page-container" id="pageWrapper">
                <div className="mw-page-container-inner">
                    <div className="wiki-main-page-grid">
                        <div className="col-left">
                            {columns.left.map(article => (
                                <WikiCard key={article.slug} article={article} variant="left" />
                            ))}
                        </div>
                        <div className="col-right">
                            {columns.right.map(article => (
                                <WikiCard key={article.slug} article={article} variant="right" />
                            ))}
                        </div>
                    </div>
                    <div className="col-bottom">
                        {columns.bottom.map(article => (
                            <WikiCard key={article.slug} article={article} variant="bottom" />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}

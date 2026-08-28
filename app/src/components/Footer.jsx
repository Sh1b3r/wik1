import { useMemo } from 'react'
import { pick, randomInt } from '../utils/random.js'
import { months, parsoids, footerLinks } from '../data/fun.js'

export default function Footer() {
    const edited = useMemo(() => ({
        hour: randomInt(49),
        minute: randomInt(99),
        day: randomInt(365),
        month: pick(months),
        year: randomInt(3000),
        parsoid: pick(parsoids),
    }), [])

    return (
        <footer>
            <p>
                Цю сторінку востаннє відредаговано о <span className="hour">{edited.hour}</span>:<span
                    className="minute">{edited.minute}</span>, <span className="day">{edited.day}</span>{' '}
                <span className="month">{edited.month}</span> <span className="year">{edited.year}</span>. Сторінку
                було відрендерено за допомогою <span className="parsoid">{edited.parsoid}</span>.
            </p>
            <div className="footer-a">
                {footerLinks.map(label => (
                    <a key={label} href="#/">{label}</a>
                ))}
            </div>
        </footer>
    )
}

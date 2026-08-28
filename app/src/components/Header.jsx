import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchForm from './SearchForm.jsx'
import { articles } from '../data/articles.js'

export default function Header() {
    const [searchOpen, setSearchOpen] = useState(false)
    const navigate = useNavigate()

    const goRandom = () => {
        const article = articles[Math.floor(Math.random() * articles.length)]
        navigate(`/article/${article.slug}`)
    }

    return (
        <header>
            <h1>Вікіпедія</h1>
            <button
                type="button"
                className="mobile-search-toggle"
                id="mobileSearchToggle"
                aria-label="Пошук"
                onClick={() => setSearchOpen(open => !open)}
            >
                <svg stroke-width="2" stroke="currentColor" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linejoin="round"
                        stroke-linecap="round"></path>
                </svg>
            </button>
            <SearchForm open={searchOpen} />
            <nav className="header-nav">
                <Link to="/">Головна сторінка</Link>
                <a href="#/" id="random" onClick={(e) => { e.preventDefault(); goRandom() }}>Випадкова стаття</a>
            </nav>
        </header>
    )
}

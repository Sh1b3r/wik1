import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { articles } from '../data/articles.js'

export default function SearchForm({ open }) {
    const [query, setQuery] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const submit = () => {
        const value = query.trim().toLowerCase()

        if (!value) {
            setError('Введіть текст для пошуку!')
            return
        }

        const found = articles.find(article =>
            article.slug.toLowerCase().includes(value) ||
            article.id.toLowerCase().includes(value) ||
            article.cardName.toLowerCase().includes(value)
        )

        if (found) {
            setQuery('')
            setError('')
            navigate(`/article/${found.slug}`)
        } else {
            setError('❌ Статтю не знайдено')
        }
    }

    const change = (e) => {
        setQuery(e.target.value)
        if (error) setError('')
    }

    return (
        <form className={open ? 'form open' : 'form'} id="search-form" onSubmit={(e) => { e.preventDefault(); submit() }}>
            <label htmlFor="searchInput">
                <input
                    autocomplete="off"
                    placeholder="Пошук..."
                    id="searchInput"
                    type="text"
                    value={query}
                    onChange={change}
                />
            </label>
            <div className="icon" role="button" id="search-button" aria-label="Пошук" onClick={submit}>
                <svg stroke-width="2" stroke="currentColor" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg" className="swap-on">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linejoin="round"
                        stroke-linecap="round"></path>
                </svg>
                <svg className="swap-off"></svg>
            </div>
            {error && <div className="search-error">{error}</div>}
        </form>
    )
}

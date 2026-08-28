import { useState, useEffect } from 'react'

export default function Preloader() {
    const [hidden, setHidden] = useState(false)

    useEffect(() => {
        const hide = setTimeout(() => setHidden(true), 900)
        const fallback = setTimeout(() => setHidden(true), 2500)
        return () => {
            clearTimeout(hide)
            clearTimeout(fallback)
        }
    }, [])

    return (
        <div id="preloader" className={hidden ? 'preloader preloader-hidden' : 'preloader'}>
            <div className="preloader-spinner"></div>
            <div className="preloader-text">Вікіпедія</div>
        </div>
    )
}

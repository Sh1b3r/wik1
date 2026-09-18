import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop ensures that whenever the route or pathname changes,
 * the window resets scroll position immediately to (0, 0).
 * This prevents mobile browsers from preserving or jumping to random scroll positions.
 */
export default function ScrollToTop() {
    const { pathname, search } = useLocation()

    useEffect(() => {
        // Instant scroll to top
        window.scrollTo(0, 0)
        document.documentElement.scrollTo(0, 0)
        document.body.scrollTo(0, 0)
    }, [pathname, search])

    return null
}

import { Routes, Route } from 'react-router-dom'
import Preloader from './components/Preloader.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import ArticlePage from './pages/ArticlePage.jsx'
import SpeederGamePage from './pages/SpeederGamePage.jsx'
import LogoPreviewPage from './pages/LogoPreviewPage.jsx'

export default function App() {
    return (
        <>
            <ScrollToTop />
            <Preloader />
            <Routes>
                <Route path="/game" element={<SpeederGamePage />} />
                <Route path="/logo-preview" element={<LogoPreviewPage />} />
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/article/:slug" element={<ArticlePage />} />
                    <Route path="*" element={<ArticlePage />} />
                </Route>
            </Routes>
        </>
    )
}

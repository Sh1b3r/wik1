import { Routes, Route } from 'react-router-dom'
import Preloader from './components/Preloader.jsx'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import ArticlePage from './pages/ArticlePage.jsx'

export default function App() {
    return (
        <>
            <Preloader />
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/article/:slug" element={<ArticlePage />} />
                    <Route path="*" element={<ArticlePage />} />
                </Route>
            </Routes>
        </>
    )
}

import { useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { articles } from '../data/articles.js'
import { mistakes } from '../data/fun.js'
import { pick } from '../utils/random.js'
import RichText from '../components/RichText.jsx'
import { assetUrl } from '../utils/asset.js'
import SpeederViewer from '../components/SpeederViewer.jsx'

export default function ArticlePage() {
    const { slug } = useParams()
    const article = articles.find(a => a.slug === slug)

    useEffect(() => {
        document.title = article ? article.title : 'Вікіпедія'
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
    }, [article, slug])

    const notFoundText = useMemo(() => pick(mistakes), [])

    if (!article) {
        return (
            <div className="main-card-container">
                <div className="content">
                    <h1>{notFoundText}</h1>
                    <p>Такої статті не існує. <Link to="/">Повернутися на головну</Link>.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="main-card-container">
            <div className="content">
                {article.sections.map((section, i) => {
                    const paragraphs = section.paragraphs.map((segments, j) => (
                        <p key={j}><RichText segments={segments} /></p>
                    ))

                    return (
                        <section key={i}>
                            <div>
                                {i === 0 ? <h1>{section.heading}</h1> : <h2>{section.heading}</h2>}
                                {section.image ? (
                                    <div className="encyclopedia-card-image">
                                        <div>{paragraphs}</div>
                                        <img src={assetUrl(section.image)} alt={section.imageAlt || section.heading} />
                                    </div>
                                ) : paragraphs}
                            </div>
                        </section>
                    )
                })}
                {/* SpeederViewer at bottom of Lego Space article */}
                {article.slug === 'classic-space' && (
                    <div style={{ width: '100%', maxWidth: '1200px', margin: '30px auto 24px', boxSizing: 'border-box' }}>
                        <SpeederViewer height="380px" />
                    </div>
                )}
            </div>
        </div>
    )
}

import { Link } from 'react-router-dom'
import RichText from './RichText.jsx'
import { assetUrl } from '../utils/asset.js'

export default function WikiCard({ article, variant }) {
    return (
        <div className={`grid-block-${variant}`} data-id={article.id}>
            <Link to={`/article/${article.slug}`}>{article.cardName}</Link>
            <div className="block-desc-img">
                <span className="block-desc">
                    <RichText segments={article.cardDescription} />
                </span>
                {article.cardImage && (
                    <img src={assetUrl(article.cardImage)} alt={article.cardName} className="block-img" />
                )}
            </div>
        </div>
    )
}

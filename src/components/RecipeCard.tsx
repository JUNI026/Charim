import { ArrowRight, Bookmark } from 'lucide-react'
import type { RankedRecipe } from '../types'

interface RecipeCardProps {
  recipe: RankedRecipe
  index: number
  hasPantry: boolean
  saved: boolean
  onOpen: () => void
  onToggleSaved: () => void
}

export function RecipeCard({ recipe, index, hasPantry, saved, onOpen, onToggleSaved }: RecipeCardProps) {
  return (
    <article className="recipe-card" onClick={onOpen}>
      <div className="image-wrap">
        <img src={recipe.image} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none' }}/>
        <span className="rank">{String(index + 1).padStart(2, '0')}</span>
        {hasPantry && <span className="match">{recipe.score}% 일치</span>}
        <button className="save" aria-label={saved ? '저장 취소' : '레시피 저장'} onClick={(event) => { event.stopPropagation(); onToggleSaved() }}>
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'}/>
        </button>
      </div>
      <div className="card-body">
        <span>{recipe.category || '한식'}</span>
        <h3>{recipe.name}</h3>
        <p>{recipe.ingredients.slice(0, 4).join(' · ')}</p>
        {hasPantry && recipe.matched.length > 0 && <p className="matched-reason">내 재료: {recipe.matched.join(' · ')}</p>}
        <button>레시피 보기 <ArrowRight size={16}/></button>
      </div>
    </article>
  )
}

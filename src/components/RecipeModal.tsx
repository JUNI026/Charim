import { Check, ChefHat, X } from 'lucide-react'
import type { Recipe } from '../types'

interface RecipeModalProps {
  recipe: Recipe
  onClose: () => void
}

export function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="modal" aria-modal="true" role="dialog" aria-labelledby="recipe-title" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" aria-label="상세 화면 닫기" onClick={onClose}><X/></button>
        <img src={recipe.image} alt=""/>
        <div className="modal-content">
          <p className="eyebrow"><ChefHat size={15}/>{recipe.category}</p>
          <h2 id="recipe-title">{recipe.name}</h2>
          <div className="nutrition">
            {recipe.calories && <span><b>{recipe.calories}</b> kcal</span>}
            {recipe.sodium && <span><b>{recipe.sodium}</b> mg 나트륨</span>}
          </div>
          <h3>준비할 재료</h3>
          <p className="ingredients">{recipe.ingredientsText}</p>
          <h3>차리는 순서</h3>
          <ol>{recipe.steps.map((step, index) => <li key={index}><span>{index + 1}</span>{step}<Check size={17}/></li>)}</ol>
        </div>
      </section>
    </div>
  )
}

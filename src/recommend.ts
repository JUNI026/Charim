import type { RankedRecipe, Recipe } from './types'

const IGNORE = new Set(['물', '소금', '후추', '설탕', '식용유', '참기름', '간장'])

export function normalizeIngredient(value: string) {
  return value
    .replace(/\([^)]*\)/g, '')
    .replace(/[0-9./]+\s*(g|kg|ml|l|개|큰술|작은술|컵|알|장|쪽|줌)?/gi, '')
    .replace(/[•·]/g, '')
    .trim()
}

export function rankRecipes(recipes: Recipe[], pantry: string[], query = ''): RankedRecipe[] {
  const selected = pantry.map(normalizeIngredient).filter(Boolean)
  const needle = query.trim().toLowerCase()

  return recipes
    .filter((recipe) => !needle || `${recipe.name} ${recipe.ingredientsText}`.toLowerCase().includes(needle))
    .map((recipe) => {
      const useful = recipe.ingredients.filter((item) => !IGNORE.has(item)).slice(0, 10)
      const matched = useful.filter((item) => selected.some((own) => item.includes(own) || own.includes(item)))
      const missing = useful.filter((item) => !matched.includes(item)).slice(0, 4)
      const score = selected.length ? Math.round((matched.length / Math.max(useful.length, 1)) * 100) : 0
      return { ...recipe, score, matched, missing }
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'ko'))
}

export interface Recipe {
  id: string
  name: string
  category: string
  ingredientsText: string
  ingredients: string[]
  steps: string[]
  image: string
  calories: number | null
  sodium: number | null
}

export interface RankedRecipe extends Recipe {
  score: number
  matched: string[]
  missing: string[]
}

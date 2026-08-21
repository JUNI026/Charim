import { describe, expect, it } from 'vitest'
import { normalizeIngredient, rankRecipes } from './recommend'
import type { Recipe } from './types'

const recipe: Recipe = {
  id: '1', name: '감자전', category: '반찬', ingredientsText: '감자, 양파, 소금',
  ingredients: ['감자', '양파', '소금'], steps: [], image: '', calories: null, sodium: null,
}

describe('recipe recommendation', () => {
  it('removes quantities from ingredient labels', () => {
    expect(normalizeIngredient('감자 100g(1개)')).toBe('감자')
  })

  it('ranks recipes by useful pantry matches', () => {
    expect(rankRecipes([recipe], ['감자'])[0].matched).toContain('감자')
    expect(rankRecipes([recipe], ['감자'])[0].score).toBe(50)
  })

  it('only returns recipes containing every required ingredient', () => {
    expect(rankRecipes([recipe], [], '', ['감자'])).toHaveLength(1)
    expect(rankRecipes([recipe], [], '', ['아보카도'])).toHaveLength(0)
  })
})

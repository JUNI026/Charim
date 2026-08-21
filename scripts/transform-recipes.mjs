import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const input = process.argv[2]
const output = process.argv[3] ?? 'public/data'
if (!input) throw new Error('Usage: node scripts/transform-recipes.mjs <Recipe.json> [output]')

const source = JSON.parse(readFileSync(input, 'utf8'))

function ingredientNames(text) {
  return text
    .replace(/^.*?\n/, '')
    .split(/[,\n]/)
    .map((part) => part.replace(/\([^)]*\)/g, '').replace(/[0-9./]+\s*(g|kg|ml|l|개|큰술|작은술|컵|알|장|쪽|줌)?/gi, '').trim())
    .filter((part) => part && part.length < 20)
    .filter((part, index, list) => list.indexOf(part) === index)
}

const recipes = source.COOKRCP01.row.map((row, index) => ({
  id: String(index + 1),
  name: row.RCP_NM,
  category: row.RCP_PAT2 || '한식',
  ingredientsText: row.RCP_PARTS_DTLS.replace(/^.*?\n/, ''),
  ingredients: ingredientNames(row.RCP_PARTS_DTLS),
  steps: Array.from({ length: 20 }, (_, step) => row[`MANUAL${String(step + 1).padStart(2, '0')}`])
    .filter(Boolean)
    .map((step) => step.replace(/^\d+\.\s*/, '').replace(/[a-z]$/i, '').trim()),
  image: (row.ATT_FILE_NO_MAIN || '').replace('http://', 'https://'),
  calories: Number.parseFloat(row.INFO_ENG) || null,
  sodium: Number.parseFloat(row.INFO_NA) || null,
}))

mkdirSync(output, { recursive: true })
for (let index = 0; index < 10; index += 1) {
  writeFileSync(`${output}/recipes-${index}.json`, `${JSON.stringify(recipes.slice(index * 100, (index + 1) * 100))}\n`)
}
console.log(`Wrote ${recipes.length} recipes in 10 chunks to ${output}`)

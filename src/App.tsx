import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Plus, Search, Sparkles, X } from 'lucide-react'
import { RecipeCard } from './components/RecipeCard'
import { RecipeModal } from './components/RecipeModal'
import { rankRecipes } from './recommend'
import type { Recipe } from './types'

const suggestions = ['감자', '두부', '달걀', '양파', '돼지고기', '버섯', '애호박', '고추장']
const primarySuggestions = ['아보카도', '두부', '달걀', '감자', '닭고기']

function App() {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([])
  const [loadError, setLoadError] = useState(false)
  const [pantry, setPantry] = useState<string[]>(() => JSON.parse(localStorage.getItem('charim-pantry') || '[]'))
  const [required, setRequired] = useState<string[]>(() => JSON.parse(localStorage.getItem('charim-required') || '[]'))
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('전체')
  const [selected, setSelected] = useState<Recipe | null>(null)
  const [saved, setSaved] = useState<string[]>(() => JSON.parse(localStorage.getItem('charim-saved') || '[]'))

  useEffect(() => {
    Promise.all(Array.from({ length: 10 }, (_, index) =>
      fetch(`${import.meta.env.BASE_URL}data/recipes-${index}.json`).then((response) => response.json() as Promise<Recipe[]>),
    )).then((groups) => setAllRecipes(groups.flat())).catch(() => setLoadError(true))
  }, [])
  useEffect(() => localStorage.setItem('charim-pantry', JSON.stringify(pantry)), [pantry])
  useEffect(() => localStorage.setItem('charim-required', JSON.stringify(required)), [required])
  useEffect(() => localStorage.setItem('charim-saved', JSON.stringify(saved)), [saved])

  const ranked = useMemo(() => rankRecipes(
    category === '전체' ? allRecipes : allRecipes.filter((recipe) => recipe.category === category),
    pantry,
    query,
    required,
  ), [category, pantry, query, required])
  const categories = ['전체', ...Array.from(new Set(allRecipes.map((recipe) => recipe.category))).filter(Boolean)]

  const addIngredient = (value: string, target: 'pantry' | 'required' = 'pantry') => {
    const next = value.trim()
    if (!next) return
    if (target === 'required' && !required.includes(next)) setRequired([...required, next])
    if (target === 'pantry' && !pantry.includes(next)) setPantry([...pantry, next])
  }

  const showRecommendations = () => {
    document.getElementById('recipes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <header className="nav wrap">
        <a className="brand" href="#top" aria-label="CHARIM 홈"><span>차림</span> CHARIM</a>
        <nav><a href="#pantry">나의 재료</a><a href="#recipes">오늘의 차림</a></nav>
        <a className="github" href="https://github.com/JUNI026/Charim" target="_blank" rel="noreferrer">GitHub <ArrowRight size={16}/></a>
      </header>

      <main id="top">
        <section className="hero wrap">
          <div className="hero-copy">
            <p className="eyebrow"><Sparkles size={15}/> 재료에서 시작하는 오늘의 식탁</p>
            <h1>있는 재료로,<br/><em>근사하게 차려요.</em></h1>
            <p className="lede">냉장고 속 재료를 골라보세요. 차림이 지금 만들기 좋은 한 끼를 찾아드릴게요.</p>
            <a className="primary" href="#pantry">재료 담으러 가기 <ArrowRight size={18}/></a>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="sun"/><div className="plate"><span>오늘의<br/>차림</span></div>
            <span className="leaf leaf-one">⌇</span><span className="leaf leaf-two">⌇</span>
          </div>
        </section>

        <section className="pantry-section" id="pantry">
          <div className="wrap pantry-grid">
            <div><p className="section-number">01 / PANTRY</p><h2>꼭 쓸 재료와<br/>가진 재료를 알려주세요.</h2><p>주재료는 반드시 포함하고, 냉장고 재료는 추천 순위를 더 정확하게 만들어요.</p></div>
            <div className="pantry-card">
              <div className="ingredient-group required-group">
                <div className="ingredient-label"><strong>꼭 사용할 주재료</strong><span>선택한 재료가 모두 포함된 요리만 보여드려요.</span></div>
                <form onSubmit={(event) => { event.preventDefault(); const input = event.currentTarget.elements.namedItem('requiredIngredient') as HTMLInputElement; addIngredient(input.value, 'required'); input.value = '' }}>
                  <Search size={20}/><input name="requiredIngredient" placeholder="예: 아보카도" autoComplete="off"/><button aria-label="주재료 추가"><Plus size={20}/></button>
                </form>
                <div className="chips selected-chips primary-chips">
                  {required.length === 0 && <span className="empty">반드시 넣고 싶은 재료를 선택해 보세요.</span>}
                  {required.map((item) => <button key={item} onClick={() => setRequired(required.filter((value) => value !== item))}>{item}<X size={14}/></button>)}
                </div>
                <div className="chips suggestions compact-suggestions">{primarySuggestions.filter((item) => !required.includes(item)).map((item) => <button key={item} onClick={() => addIngredient(item, 'required')}><Plus size={13}/>{item}</button>)}</div>
              </div>
              <div className="ingredient-label pantry-label"><strong>함께 쓸 수 있는 냉장고 재료</strong><span>많이 선택할수록 일치율이 정확해져요.</span></div>
              <form onSubmit={(event) => { event.preventDefault(); const input = event.currentTarget.elements.namedItem('ingredient') as HTMLInputElement; addIngredient(input.value); input.value = '' }}>
                <Search size={20}/><input name="ingredient" placeholder="재료를 직접 입력하세요" autoComplete="off"/><button aria-label="추가"><Plus size={20}/></button>
              </form>
              <div className="chips selected-chips">
                {pantry.length === 0 && <span className="empty">아직 담은 재료가 없어요.</span>}
                {pantry.map((item) => <button key={item} onClick={() => setPantry(pantry.filter((value) => value !== item))}>{item}<X size={14}/></button>)}
              </div>
              <p className="hint">자주 찾는 재료</p>
              <div className="chips suggestions">{suggestions.filter((item) => !pantry.includes(item)).map((item) => <button key={item} onClick={() => addIngredient(item)}><Plus size={13}/>{item}</button>)}</div>
              <button className="recommend-button" type="button" disabled={pantry.length === 0 && required.length === 0} onClick={showRecommendations}>
                이 재료로 추천받기 <span>{pantry.length + required.length}</span><ArrowRight size={18}/>
              </button>
            </div>
          </div>
        </section>

        <section className="recipes-section wrap" id="recipes">
          <div className="section-head"><div><p className="section-number">02 / YOUR TABLE</p><h2>{required.length ? `${required.join(' · ')}로 차리는 요리` : pantry.length ? '오늘 이렇게 차려보세요' : '천천히 둘러보세요'}</h2></div><div className="result-count"><strong>{ranked.length}</strong>개의 레시피</div></div>
          <div className="toolbar">
            <div className="category-tabs">{categories.slice(0, 8).map((item) => <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
            <label className="recipe-search"><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="요리명 검색"/></label>
          </div>
          <div className="recipe-grid">
            {loadError && <p className="data-message">레시피를 불러오지 못했어요. 잠시 후 새로고침해 주세요.</p>}
            {!loadError && allRecipes.length === 0 && <p className="data-message">식탁을 준비하고 있어요…</p>}
            {!loadError && allRecipes.length > 0 && ranked.length === 0 && <p className="data-message">{required.length ? `${required.join(' · ')} 재료가 모두 들어간 레시피를 찾지 못했어요. 주재료를 하나 줄이거나 다른 표현으로 입력해 보세요.` : '조건에 맞는 레시피를 찾지 못했어요. 검색어나 재료를 바꿔보세요.'}</p>}
            {ranked.slice(0, 12).map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={index} hasPantry={pantry.length > 0}
                saved={saved.includes(recipe.id)} onOpen={() => setSelected(recipe)}
                onToggleSaved={() => setSaved(saved.includes(recipe.id) ? saved.filter((id) => id !== recipe.id) : [...saved, recipe.id])}/>
            ))}
          </div>
        </section>
      </main>

      <footer><div className="wrap"><div className="brand"><span>차림</span> CHARIM</div><p>공공데이터로 더 나은 한 끼를 제안합니다.</p><small>Recipe data © 식품의약품안전처 공공데이터</small></div></footer>

      {selected && <RecipeModal recipe={selected} onClose={() => setSelected(null)}/>}
    </>
  )
}

export default App

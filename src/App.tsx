import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Bookmark, Check, ChefHat, Plus, Search, Sparkles, X } from 'lucide-react'
import { rankRecipes } from './recommend'
import type { Recipe } from './types'

const suggestions = ['감자', '두부', '달걀', '양파', '돼지고기', '버섯', '애호박', '고추장']

function App() {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([])
  const [pantry, setPantry] = useState<string[]>(() => JSON.parse(localStorage.getItem('charim-pantry') || '[]'))
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('전체')
  const [selected, setSelected] = useState<Recipe | null>(null)
  const [saved, setSaved] = useState<string[]>(() => JSON.parse(localStorage.getItem('charim-saved') || '[]'))

  useEffect(() => {
    Promise.all(Array.from({ length: 10 }, (_, index) =>
      fetch(`${import.meta.env.BASE_URL}data/recipes-${index}.json`).then((response) => response.json() as Promise<Recipe[]>),
    )).then((groups) => setAllRecipes(groups.flat()))
  }, [])
  useEffect(() => localStorage.setItem('charim-pantry', JSON.stringify(pantry)), [pantry])
  useEffect(() => localStorage.setItem('charim-saved', JSON.stringify(saved)), [saved])

  const ranked = useMemo(() => rankRecipes(
    category === '전체' ? allRecipes : allRecipes.filter((recipe) => recipe.category === category),
    pantry,
    query,
  ), [category, pantry, query])
  const categories = ['전체', ...Array.from(new Set(allRecipes.map((recipe) => recipe.category))).filter(Boolean)]

  const addIngredient = (value: string) => {
    const next = value.trim()
    if (next && !pantry.includes(next)) setPantry([...pantry, next])
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
            <div><p className="section-number">01 / PANTRY</p><h2>지금 가진 재료는<br/>무엇인가요?</h2><p>여러 개를 선택할수록 더 정확한 메뉴를 추천해요.</p></div>
            <div className="pantry-card">
              <form onSubmit={(event) => { event.preventDefault(); const input = event.currentTarget.elements.namedItem('ingredient') as HTMLInputElement; addIngredient(input.value); input.value = '' }}>
                <Search size={20}/><input name="ingredient" placeholder="재료를 직접 입력하세요" autoComplete="off"/><button aria-label="추가"><Plus size={20}/></button>
              </form>
              <div className="chips selected-chips">
                {pantry.length === 0 && <span className="empty">아직 담은 재료가 없어요.</span>}
                {pantry.map((item) => <button key={item} onClick={() => setPantry(pantry.filter((value) => value !== item))}>{item}<X size={14}/></button>)}
              </div>
              <p className="hint">자주 찾는 재료</p>
              <div className="chips suggestions">{suggestions.filter((item) => !pantry.includes(item)).map((item) => <button key={item} onClick={() => addIngredient(item)}><Plus size={13}/>{item}</button>)}</div>
            </div>
          </div>
        </section>

        <section className="recipes-section wrap" id="recipes">
          <div className="section-head"><div><p className="section-number">02 / YOUR TABLE</p><h2>{pantry.length ? '오늘 이렇게 차려보세요' : '천천히 둘러보세요'}</h2></div><div className="result-count"><strong>{ranked.length}</strong>개의 레시피</div></div>
          <div className="toolbar">
            <div className="category-tabs">{categories.slice(0, 8).map((item) => <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
            <label className="recipe-search"><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="요리명 검색"/></label>
          </div>
          <div className="recipe-grid">
            {allRecipes.length === 0 && <p>식탁을 준비하고 있어요…</p>}
            {ranked.slice(0, 12).map((recipe, index) => (
              <article className="recipe-card" key={recipe.id} onClick={() => setSelected(recipe)}>
                <div className="image-wrap">
                  <img src={recipe.image} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none' }}/>
                  <span className="rank">{String(index + 1).padStart(2, '0')}</span>
                  {pantry.length > 0 && <span className="match">{recipe.score}% 일치</span>}
                  <button className="save" aria-label="저장" onClick={(event) => { event.stopPropagation(); setSaved(saved.includes(recipe.id) ? saved.filter((id) => id !== recipe.id) : [...saved, recipe.id]) }}><Bookmark size={18} fill={saved.includes(recipe.id) ? 'currentColor' : 'none'}/></button>
                </div>
                <div className="card-body"><span>{recipe.category || '한식'}</span><h3>{recipe.name}</h3><p>{recipe.ingredients.slice(0, 4).join(' · ')}</p><button>레시피 보기 <ArrowRight size={16}/></button></div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer><div className="wrap"><div className="brand"><span>차림</span> CHARIM</div><p>공공데이터로 더 나은 한 끼를 제안합니다.</p><small>Recipe data © 식품의약품안전처 공공데이터</small></div></footer>

      {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><section className="modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={() => setSelected(null)}><X/></button>
        <img src={selected.image} alt=""/><div className="modal-content"><p className="eyebrow"><ChefHat size={15}/>{selected.category}</p><h2>{selected.name}</h2>
        <div className="nutrition">{selected.calories && <span><b>{selected.calories}</b> kcal</span>}{selected.sodium && <span><b>{selected.sodium}</b> mg 나트륨</span>}</div>
        <h3>준비할 재료</h3><p className="ingredients">{selected.ingredientsText}</p><h3>차리는 순서</h3><ol>{selected.steps.map((step, index) => <li key={index}><span>{index + 1}</span>{step}<Check size={17}/></li>)}</ol></div>
      </section></div>}
    </>
  )
}

export default App

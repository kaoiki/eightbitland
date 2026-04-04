export const metadata = {
  id: 'lane-shot',
  name: 'Lane Shot',
  version: '0.1.0',
  author: 'platform',
  description: 'Hit the glowing lane tile as fast as possible before time runs out.',
  inputType: ['pointer', 'touch'],
  orientation: 'portrait',
  source: 'platform',
  status: 'active'
}

export function createGame(options) {
  const {
    mountEl,
    onReady,
    onScoreChange,
    onGameOver,
    onStateChange
  } = options

  let state = 'idle'
  let animationId = null
  let root = null
  let overlayEl = null
  let timerEl = null
  let gridEl = null
  let comboEl = null

  let score = 0
  let bestScore = 0
  let combo = 0
  let timeLeft = 12
  let lastTimestamp = 0
  let gameStartedAt = 0

  let activeIndex = -1
  let nextSpawnAt = 0
  let hitLocked = false
  let cells = []

  const STORAGE_KEY = 'lane_shot_best_score'
  const CELL_COUNT = 9

  function setState(nextState) {
    state = nextState
    onStateChange?.(state)
    updateOverlay()
  }

  function getBestScore() {
    try {
      return Number(localStorage.getItem(STORAGE_KEY) || 0)
    } catch {
      return 0
    }
  }

  function setBestScore(value) {
    bestScore = value
    try {
      localStorage.setItem(STORAGE_KEY, String(value))
    } catch {}
  }

  function emitScore(delta = 0, forceEmit = false) {
    if (delta !== 0) {
      score += delta
      if (score > bestScore) {
        setBestScore(score)
      }
    }

    if (forceEmit || delta !== 0) {
      onScoreChange?.({
        score,
        bestScore,
        delta,
        combo
      })
    }

    if (timerEl) {
      timerEl.textContent = `TIME ${Math.max(0, Math.ceil(timeLeft))}`
    }

    if (comboEl) {
      comboEl.textContent = `COMBO ${combo}`
    }
  }

  function updateOverlay() {
    if (!overlayEl) return

    if (state === 'idle' || state === 'ready') {
      overlayEl.innerHTML = `
        <div class="text-center px-4">
          <div class="text-sm tracking-widest text-cyan-300">LANE SHOT</div>
          <div class="mt-2 text-xs text-cyan-200/80">Tap the glowing tile</div>
          <div class="mt-1 text-xs text-cyan-200/80">Wrong tap will not reduce score</div>
          <div class="mt-1 text-xs text-cyan-200/80">You have 12 seconds</div>
          <div class="mt-3 text-xs text-cyan-300">Press Start</div>
        </div>
      `
      overlayEl.style.display = 'flex'
      return
    }

    if (state === 'paused') {
      overlayEl.innerHTML = `
        <div class="text-center px-4">
          <div class="text-sm tracking-widest text-yellow-300">PAUSED</div>
          <div class="mt-2 text-xs text-cyan-200/80">Press Start to continue</div>
        </div>
      `
      overlayEl.style.display = 'flex'
      return
    }

    if (state === 'gameover') {
      overlayEl.innerHTML = `
        <div class="text-center px-4">
          <div class="text-sm tracking-widest text-red-400">TIME UP</div>
          <div class="mt-2 text-xs text-cyan-300">Final Score ${score}</div>
          <div class="mt-1 text-xs text-cyan-200/80">Best ${bestScore}</div>
          <div class="mt-3 text-xs text-cyan-300">Tap Reset to retry</div>
        </div>
      `
      overlayEl.style.display = 'flex'
      return
    }

    overlayEl.style.display = 'none'
  }

  function clearActiveCell() {
    if (activeIndex < 0 || !cells[activeIndex]) {
      activeIndex = -1
      return
    }

    const cell = cells[activeIndex]
    cell.className =
      'lane-shot-cell relative flex items-center justify-center rounded-xl border border-cyan-400/20 bg-white/5 transition-all duration-100 active:scale-95'
    cell.innerHTML = ''
    activeIndex = -1
  }

  function getSpawnInterval() {
    if (timeLeft > 8) return 820
    if (timeLeft > 5) return 680
    if (timeLeft > 2) return 540
    return 420
  }

  function spawnTarget(force = false) {
    if (!cells.length) return

    const previousIndex = activeIndex

    if (!force && activeIndex >= 0) return

    clearActiveCell()

    let nextIndex = Math.floor(Math.random() * CELL_COUNT)
    if (CELL_COUNT > 1 && nextIndex === previousIndex) {
      nextIndex = (nextIndex + 1) % CELL_COUNT
    }

    activeIndex = nextIndex

    const cell = cells[activeIndex]
    cell.className =
      'lane-shot-cell relative flex items-center justify-center rounded-xl border border-lime-300 bg-lime-400/25 shadow-[0_0_20px_rgba(163,230,53,0.45)] transition-all duration-100 active:scale-95'
    cell.innerHTML = `
      <div class="h-5 w-5 rounded-full bg-lime-300 shadow-[0_0_14px_rgba(190,242,100,0.85)]"></div>
    `

    nextSpawnAt = performance.now() + getSpawnInterval()
  }

  function getBonusByCombo(nextCombo) {
    if (nextCombo >= 8) return 3
    if (nextCombo >= 4) return 2
    return 1
  }

  function handleCellTap(index) {
    if (state !== 'playing' || hitLocked) return

    hitLocked = true

    if (index === activeIndex) {
      combo += 1
      const bonus = getBonusByCombo(combo)
      emitScore(bonus)
      spawnTarget(true)
    } else {
      combo = 0
      emitScore(0, true)
    }

    hitLocked = false
  }

  function buildDOM() {
    mountEl.innerHTML = ''

    root = document.createElement('div')
    root.className = 'relative w-full h-full overflow-hidden bg-black select-none'

    timerEl = document.createElement('div')
    timerEl.className =
      'absolute right-3 top-3 z-10 text-[11px] tracking-widest text-cyan-300'

    comboEl = document.createElement('div')
    comboEl.className =
      'absolute left-3 top-3 z-10 text-[11px] tracking-widest text-fuchsia-300'

    const boardWrap = document.createElement('div')
    boardWrap.className = 'absolute inset-0 flex items-center justify-center px-4 py-14'

    gridEl = document.createElement('div')
    gridEl.className = 'grid w-full max-w-[320px] grid-cols-3 gap-3'

    cells = []

    for (let i = 0; i < CELL_COUNT; i += 1) {
      const cell = document.createElement('button')
      cell.type = 'button'
      cell.className =
        'lane-shot-cell relative flex aspect-square items-center justify-center rounded-xl border border-cyan-400/20 bg-white/5 transition-all duration-100 active:scale-95'
      cell.addEventListener('click', () => handleCellTap(i))
      cells.push(cell)
      gridEl.appendChild(cell)
    }

    overlayEl = document.createElement('div')
    overlayEl.className =
      'absolute inset-0 z-20 flex items-center justify-center bg-black/45'

    boardWrap.appendChild(gridEl)
    root.appendChild(timerEl)
    root.appendChild(comboEl)
    root.appendChild(boardWrap)
    root.appendChild(overlayEl)
    mountEl.appendChild(root)
  }

  function loop(timestamp) {
    if (state !== 'playing') return

    if (!lastTimestamp) lastTimestamp = timestamp
    const delta = (timestamp - lastTimestamp) / 1000
    lastTimestamp = timestamp

    timeLeft -= delta

    if (timerEl) {
      timerEl.textContent = `TIME ${Math.max(0, Math.ceil(timeLeft))}`
    }

    if (timestamp >= nextSpawnAt) {
      spawnTarget(true)
    }

    if (timeLeft <= 0) {
      gameOver('time-up')
      return
    }

    animationId = requestAnimationFrame(loop)
  }

  function start() {
    if (state === 'playing') return

    if (state === 'paused') {
      setState('playing')
      lastTimestamp = 0
      nextSpawnAt = performance.now() + getSpawnInterval()
      animationId = requestAnimationFrame(loop)
      return
    }

    if (state === 'gameover') {
      resetToReady()
      return
    }

    if (state === 'idle' || state === 'ready') {
      setState('playing')
      gameStartedAt = performance.now()
      lastTimestamp = 0
      combo = 0
      emitScore(0, true)
      spawnTarget(true)
      nextSpawnAt = performance.now() + getSpawnInterval()
      animationId = requestAnimationFrame(loop)
    }
  }

  function stop() {
    cancelAnimationFrame(animationId)
    animationId = null

    if (state === 'playing') {
      setState('paused')
    }
  }

  function resetToReady() {
    cancelAnimationFrame(animationId)
    animationId = null
    score = 0
    combo = 0
    timeLeft = 12
    bestScore = getBestScore()
    clearActiveCell()
    emitScore(0, true)
    setState('idle')
  }

  function reset() {
    if (state !== 'gameover') return

    cancelAnimationFrame(animationId)
    animationId = null
    score = 0
    combo = 0
    timeLeft = 12
    bestScore = getBestScore()
    clearActiveCell()
    emitScore(0, true)
    setState('playing')
    gameStartedAt = performance.now()
    lastTimestamp = 0
    spawnTarget(true)
    nextSpawnAt = performance.now() + getSpawnInterval()
    animationId = requestAnimationFrame(loop)
  }

  function gameOver(reason = 'unknown') {
    cancelAnimationFrame(animationId)
    animationId = null
    clearActiveCell()
    setState('gameover')

    onGameOver?.({
      score,
      bestScore,
      duration: Math.round((performance.now() - gameStartedAt) / 100) / 10,
      reason
    })
  }

  function destroy() {
    cancelAnimationFrame(animationId)
    animationId = null
    mountEl.innerHTML = ''
    cells = []
    setState('destroyed')
  }

  function getState() {
    return {
      state,
      score,
      bestScore,
      combo
    }
  }

  buildDOM()
  bestScore = getBestScore()
  emitScore(0, true)
  setState('idle')
  onReady?.()

  return {
    start,
    stop,
    reset,
    destroy,
    getState
  }
}
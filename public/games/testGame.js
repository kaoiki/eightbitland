export const metadata = {
  id: 'odd-tap',
  name: 'Odd Tap',
  version: '0.1.1',
  author: 'platform',
  description: 'Find and tap the odd tile before time runs out.',
  inputType: ['pointer', 'touch'],
  orientation: 'portrait',
  source: 'external',
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
  let infoEl = null
  let boardEl = null

  let score = 0
  let bestScore = 0
  let timeLeft = 20
  let lastTimestamp = 0
  let gameStartedAt = 0

  let round = 0
  let currentOddIndex = -1
  let currentDifficulty = null
  let currentCells = []

  function setState(nextState) {
    state = nextState
    onStateChange?.(state)
    updateOverlay()
  }

  function getBestScore() {
    try {
      return Number(localStorage.getItem('odd_tap_best_score') || 0)
    } catch {
      return 0
    }
  }

  function setBestScore(value) {
    bestScore = value
    try {
      localStorage.setItem('odd_tap_best_score', String(value))
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
        delta
      })
    }

    updateHUD()
  }

  function updateHUD() {
    if (timerEl) {
      timerEl.textContent = `TIME ${Math.max(0, Math.ceil(timeLeft))}`
    }

    if (infoEl) {
      const level = getDifficultyLevel()
      infoEl.textContent = `LV ${level} · SCORE ${score}`
    }
  }

  function updateOverlay() {
    if (!overlayEl) return

    if (state === 'idle' || state === 'ready') {
      overlayEl.innerHTML = `
        <div class="min-w-[240px] rounded-2xl border border-green-400/40 bg-black/70 px-6 py-5 text-center shadow-[0_0_30px_rgba(74,222,128,0.15)] backdrop-blur-md">
            <div class="text-sm tracking-[0.28em] text-green-400">ODD TAP</div>
            <div class="mt-3 text-sm text-green-200">Find the different tile</div>
            <div class="mt-1 text-xs text-green-500/80">It gets harder over time</div>
            <div class="mt-4 inline-flex rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-[11px] tracking-widest text-green-300">
            PRESS START
            </div>
        </div>
        `
      overlayEl.style.display = 'flex'
      return
    }

    if (state === 'paused') {
      overlayEl.innerHTML = `
        <div class="px-4 text-center">
          <div class="text-sm tracking-widest text-yellow-400">PAUSED</div>
          <div class="mt-2 text-xs text-green-500/80">Press Start to continue</div>
        </div>
      `
      overlayEl.style.display = 'flex'
      return
    }

    if (state === 'gameover') {
      overlayEl.innerHTML = `
        <div class="min-w-[240px] rounded-2xl border border-red-400/40 bg-black/72 px-6 py-5 text-center shadow-[0_0_30px_rgba(248,113,113,0.14)] backdrop-blur-md">
            <div class="text-sm tracking-[0.28em] text-red-300">TIME UP</div>
            <div class="mt-3 text-base font-semibold text-green-200">Score ${score}</div>
            <div class="mt-1 text-xs text-green-500/80">Best ${bestScore}</div>
            <div class="mt-4 inline-flex rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-[11px] tracking-widest text-green-300">
            TAP RESET TO RETRY
            </div>
        </div>
        `
      overlayEl.style.display = 'flex'
      return
    }

    overlayEl.style.display = 'none'
  }

  function getDifficultyLevel() {
    const elapsed = 20 - timeLeft

    if (elapsed < 5) return 1
    if (elapsed < 10) return 2
    if (elapsed < 15) return 3
    return 4
  }

  function getDifficultyConfig() {
    const level = getDifficultyLevel()

    if (level === 1) {
      return {
        cols: 3,
        diffTypePool: ['color'],
        baseColor: 'bg-green-500/20 border-green-400',
        oddColor: 'bg-cyan-500/25 border-cyan-400',
        wobble: false
      }
    }

    if (level === 2) {
      return {
        cols: 4,
        diffTypePool: ['color', 'scale'],
        baseColor: 'bg-green-500/18 border-green-400',
        oddColor: 'bg-emerald-400/28 border-emerald-300',
        wobble: false
      }
    }

    if (level === 3) {
      return {
        cols: 5,
        diffTypePool: ['color', 'scale', 'rotate'],
        baseColor: 'bg-green-500/16 border-green-400',
        oddColor: 'bg-lime-400/20 border-lime-300',
        wobble: false
      }
    }

    return {
      cols: 5,
      diffTypePool: ['color', 'scale', 'rotate', 'icon'],
      baseColor: 'bg-green-500/14 border-green-400',
      oddColor: 'bg-yellow-400/18 border-yellow-300',
      wobble: true
    }
  }

  function randomInt(max) {
    return Math.floor(Math.random() * max)
  }

  function randomFrom(list) {
    return list[randomInt(list.length)]
  }

  function clearBoard() {
    if (!boardEl) return

    currentCells.forEach((cell) => {
      cell.onpointerdown = null
    })

    boardEl.innerHTML = ''
    currentCells = []
    currentOddIndex = -1
  }

  function buildCellContent(symbol = '◆') {
    const span = document.createElement('span')
    span.className =
      'pointer-events-none text-[10px] sm:text-xs tracking-widest text-green-300'
    span.textContent = symbol
    return span
  }

  function animateWrongTap(el) {
    if (!el || typeof el.animate !== 'function') return

    el.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.92)' },
        { transform: 'scale(1)' }
      ],
      {
        duration: 160,
        iterations: 1
      }
    )
  }

  function rewardTimeBonus() {
    const elapsed = 20 - timeLeft

    if (elapsed < 5) {
      timeLeft += 0.15
      return
    }

    if (elapsed < 10) {
      timeLeft += 0.1
      return
    }

    if (elapsed < 15) {
      timeLeft += 0.05
      return
    }

    timeLeft += 0.03
  }

  function gameOver(reason = 'unknown') {
    cancelAnimationFrame(animationId)
    animationId = null
    setState('gameover')

    onGameOver?.({
      score,
      bestScore,
      duration: Math.round((performance.now() - gameStartedAt) / 100) / 10,
      reason
    })
  }

  function handleCellPointerDown(event) {
    if (state !== 'playing') return

    event.preventDefault()

    const target = event.currentTarget
    const index = Number(target.dataset.index)

    if (index === currentOddIndex) {
      emitScore(1)
      rewardTimeBonus()
      buildRound()
      return
    }

    timeLeft -= 1.2
    if (timeLeft < 0) timeLeft = 0

    animateWrongTap(target)

    if (timeLeft <= 0) {
      timeLeft = 0
      updateHUD()
      gameOver('mistake-timeout')
      return
    }

    updateHUD()
  }

  function buildRound() {
    if (!boardEl) return

    round += 1
    currentDifficulty = getDifficultyConfig()

    const { cols, diffTypePool, baseColor, oddColor, wobble } = currentDifficulty

    clearBoard()

    const total = cols * cols
    currentOddIndex = randomInt(total)

    boardEl.className = [
        'absolute inset-0 z-10 grid gap-2 px-4 pb-4 pt-14',
        cols === 3 ? 'grid-cols-3' : '',
        cols === 4 ? 'grid-cols-4' : '',
        cols === 5 ? 'grid-cols-5' : ''
    ].join(' ')

    const diffType = randomFrom(diffTypePool)
    const baseSymbol = '◆'
    const oddSymbol = diffType === 'icon' ? '◇' : '◆'

    for (let i = 0; i < total; i += 1) {
      const isOdd = i === currentOddIndex

      const cell = document.createElement('button')
      cell.type = 'button'
      cell.className = [
        'relative flex items-center justify-center',
        'border rounded-sm transition-transform duration-100 active:scale-95',
        'shadow-[0_0_10px_rgba(74,222,128,0.12)]',
        'touch-manipulation select-none',
        isOdd ? oddColor : baseColor
      ].join(' ')

      cell.style.touchAction = 'manipulation'
      cell.dataset.index = String(i)

      const symbol = buildCellContent(isOdd ? oddSymbol : baseSymbol)
      cell.appendChild(symbol)

      if (diffType === 'scale' && isOdd) {
        cell.style.transform = 'scale(0.88)'
      }

      if (diffType === 'rotate' && isOdd) {
        cell.style.transform = 'rotate(18deg)'
      }

      if (diffType === 'icon' && !isOdd) {
        cell.style.transform = 'rotate(0deg)'
      }

      if (wobble && typeof cell.animate === 'function') {
        const baseTransform = cell.style.transform || ''
        const drift = ((i % 3) - 1) * 1.5

        cell.animate(
          [
            { transform: `${baseTransform} translateY(0px)` },
            { transform: `${baseTransform} translateY(${drift}px)` },
            { transform: `${baseTransform} translateY(0px)` }
          ],
          {
            duration: 700 + (i % 5) * 80,
            iterations: Infinity
          }
        )
      }

      cell.onpointerdown = handleCellPointerDown

      currentCells.push(cell)
      boardEl.appendChild(cell)
    }

    updateHUD()
  }

  function buildDOM() {
    mountEl.innerHTML = ''

    root = document.createElement('div')
    root.className = 'relative h-full w-full overflow-hidden bg-black select-none'
    root.style.touchAction = 'manipulation'

    timerEl = document.createElement('div')
    timerEl.className =
      'absolute right-3 top-3 z-30 text-right text-[11px] tracking-widest text-green-400'

    infoEl = document.createElement('div')
    infoEl.className =
        'absolute right-20 top-3 z-30 text-right text-[11px] tracking-widest text-green-500/80'

    boardEl = document.createElement('div')
    boardEl.className = 'absolute inset-0 z-10 grid grid-cols-3 gap-2 px-4 pb-4 pt-14'

    overlayEl = document.createElement('div')
    overlayEl.className =
      'absolute inset-0 z-40 flex items-center justify-center bg-black/45'

    root.appendChild(timerEl)
    root.appendChild(infoEl)
    root.appendChild(boardEl)
    root.appendChild(overlayEl)
    mountEl.appendChild(root)
  }

  function loop(timestamp) {
    if (state !== 'playing') return

    if (!lastTimestamp) lastTimestamp = timestamp
    const delta = (timestamp - lastTimestamp) / 1000
    lastTimestamp = timestamp

    timeLeft -= delta

    if (timeLeft <= 0) {
      timeLeft = 0
      updateHUD()
      gameOver('time-up')
      return
    }

    updateHUD()
    animationId = requestAnimationFrame(loop)
  }

  function start() {
    if (state === 'playing') return

    if (state === 'paused') {
      setState('playing')
      lastTimestamp = 0
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
      buildRound()
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
    timeLeft = 20
    round = 0
    bestScore = getBestScore()
    emitScore(0, true)
    buildRound()
    setState('idle')
  }

  function reset() {
    if (state !== 'gameover') return

    cancelAnimationFrame(animationId)
    animationId = null
    score = 0
    timeLeft = 20
    round = 0
    bestScore = getBestScore()
    emitScore(0, true)
    setState('playing')
    gameStartedAt = performance.now()
    lastTimestamp = 0
    buildRound()
    animationId = requestAnimationFrame(loop)
  }

  function destroy() {
    cancelAnimationFrame(animationId)
    animationId = null
    clearBoard()
    mountEl.innerHTML = ''
    setState('destroyed')
  }

  function getState() {
    return {
      state,
      score,
      bestScore
    }
  }

  buildDOM()
  bestScore = getBestScore()
  emitScore(0, true)
  buildRound()
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
export const metadata = {
  id: 'number-order',
  name: 'Number Order',
  version: '0.1.0',
  author: 'platform',
  description: 'Tap the number tiles in ascending order before time runs out.',
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
  let targetEl = null
  let boardEl = null

  let score = 0
  let bestScore = 0
  let timeLeft = 15
  let lastTimestamp = 0
  let gameStartedAt = 0

  let currentExpected = 1
  let activeTiles = []
  let tileElements = []
  let roundSize = 4

  const STORAGE_KEY = 'number_order_best_score'

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
        target: currentExpected
      })
    }

    if (timerEl) {
      timerEl.textContent = `TIME ${Math.max(0, Math.ceil(timeLeft))}`
    }

    if (targetEl) {
      targetEl.textContent = `NEXT ${currentExpected}`
    }
  }

  function updateOverlay() {
    if (!overlayEl) return

    if (state === 'idle' || state === 'ready') {
      overlayEl.innerHTML = `
        <div class="text-center px-4">
          <div class="text-sm tracking-widest text-sky-300">NUMBER ORDER</div>
          <div class="mt-2 text-xs text-sky-200/80">Tap tiles in ascending order</div>
          <div class="mt-1 text-xs text-sky-200/80">1 → 2 → 3 → 4 ...</div>
          <div class="mt-1 text-xs text-sky-200/80">Wrong taps do not reduce score</div>
          <div class="mt-3 text-xs text-sky-300">Press Start</div>
        </div>
      `
      overlayEl.style.display = 'flex'
      return
    }

    if (state === 'paused') {
      overlayEl.innerHTML = `
        <div class="text-center px-4">
          <div class="text-sm tracking-widest text-yellow-300">PAUSED</div>
          <div class="mt-2 text-xs text-sky-200/80">Press Start to continue</div>
        </div>
      `
      overlayEl.style.display = 'flex'
      return
    }

    if (state === 'gameover') {
      overlayEl.innerHTML = `
        <div class="text-center px-4">
          <div class="text-sm tracking-widest text-red-400">TIME UP</div>
          <div class="mt-2 text-xs text-sky-300">Final Score ${score}</div>
          <div class="mt-1 text-xs text-sky-200/80">Best ${bestScore}</div>
          <div class="mt-3 text-xs text-sky-300">Tap Reset to retry</div>
        </div>
      `
      overlayEl.style.display = 'flex'
      return
    }

    overlayEl.style.display = 'none'
  }

  function randomRange(min, max) {
    return Math.random() * (max - min) + min
  }

  function clearBoard() {
    activeTiles = []
    tileElements = []
    if (boardEl) {
      boardEl.innerHTML = ''
    }
  }

  function getRoundSize() {
    if (score >= 25) return 7
    if (score >= 15) return 6
    if (score >= 8) return 5
    return 4
  }

  function generateNonOverlappingPositions(count, tileSize, width, height) {
    const positions = []
    const maxAttempts = 300

    for (let i = 0; i < count; i += 1) {
      let placed = false

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const x = randomRange(12, Math.max(12, width - tileSize - 12))
        const y = randomRange(12, Math.max(12, height - tileSize - 12))

        const overlaps = positions.some((pos) => {
          return !(
            x + tileSize < pos.x ||
            x > pos.x + tileSize ||
            y + tileSize < pos.y ||
            y > pos.y + tileSize
          )
        })

        if (!overlaps) {
          positions.push({ x, y })
          placed = true
          break
        }
      }

      if (!placed) {
        positions.push({
          x: 12 + (i % 3) * (tileSize + 10),
          y: 12 + Math.floor(i / 3) * (tileSize + 10)
        })
      }
    }

    return positions
  }

  function createTile(number, x, y, size) {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.dataset.number = String(number)
    btn.className =
      'absolute flex items-center justify-center rounded-xl border border-sky-300/50 bg-sky-400/15 text-lg font-bold text-sky-200 shadow-[0_0_16px_rgba(56,189,248,0.22)] transition-all duration-100 active:scale-95'
    btn.style.width = `${size}px`
    btn.style.height = `${size}px`
    btn.style.transform = `translate(${x}px, ${y}px)`
    btn.textContent = String(number)

    btn.addEventListener('click', () => handleTileClick(number, btn))
    return btn
  }

  function spawnRound() {
    if (!boardEl || !mountEl) return

    clearBoard()

    roundSize = getRoundSize()
    currentExpected = 1

    const width = boardEl.clientWidth || mountEl.clientWidth || 320
    const height = boardEl.clientHeight || mountEl.clientHeight || 420
    const tileSize = roundSize >= 6 ? 52 : 60

    const numbers = Array.from({ length: roundSize }, (_, i) => i + 1)
    const positions = generateNonOverlappingPositions(roundSize, tileSize, width, height)

    activeTiles = numbers.map((num, idx) => ({
      number: num,
      removed: false,
      x: positions[idx].x,
      y: positions[idx].y
    }))

    tileElements = activeTiles.map((tile) => {
      const el = createTile(tile.number, tile.x, tile.y, tileSize)
      boardEl.appendChild(el)
      return el
    })

    emitScore(0, true)
  }

  function handleTileClick(number, element) {
    if (state !== 'playing') return
    if (number !== currentExpected) return

    const tile = activeTiles.find((item) => item.number === number)
    if (!tile || tile.removed) return

    tile.removed = true

    element.style.transform += ' scale(0.85)'
    element.style.opacity = '0'
    element.style.pointerEvents = 'none'

    score += 1
    if (score > bestScore) {
      setBestScore(score)
    }

    currentExpected += 1

    const hasRemaining = activeTiles.some((item) => !item.removed)

    onScoreChange?.({
      score,
      bestScore,
      delta: 1,
      target: hasRemaining ? currentExpected : null
    })

    if (timerEl) {
      timerEl.textContent = `TIME ${Math.max(0, Math.ceil(timeLeft))}`
    }

    if (!hasRemaining) {
      window.setTimeout(() => {
        if (state === 'playing') {
          spawnRound()
        }
      }, 120)
      return
    }

    if (targetEl) {
      targetEl.textContent = `NEXT ${currentExpected}`
    }
  }

  function buildDOM() {
    mountEl.innerHTML = ''

    root = document.createElement('div')
    root.className = 'relative w-full h-full overflow-hidden bg-black select-none'

    timerEl = document.createElement('div')
    timerEl.className =
      'absolute right-3 top-3 z-10 text-[11px] tracking-widest text-sky-300'

    targetEl = document.createElement('div')
    targetEl.className =
      'absolute left-3 top-3 z-10 text-[11px] tracking-widest text-violet-300'

    boardEl = document.createElement('div')
    boardEl.className = 'absolute inset-x-0 bottom-0 top-12 overflow-hidden'

    overlayEl = document.createElement('div')
    overlayEl.className =
      'absolute inset-0 z-20 flex items-center justify-center bg-black/45'

    root.appendChild(timerEl)
    root.appendChild(targetEl)
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

    if (timerEl) {
      timerEl.textContent = `TIME ${Math.max(0, Math.ceil(timeLeft))}`
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
      spawnRound()
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
    timeLeft = 15
    currentExpected = 1
    bestScore = getBestScore()
    clearBoard()
    emitScore(0, true)
    setState('idle')
  }

  function reset() {
    if (state !== 'gameover') return

    cancelAnimationFrame(animationId)
    animationId = null
    score = 0
    timeLeft = 15
    currentExpected = 1
    bestScore = getBestScore()
    clearBoard()
    setState('playing')
    gameStartedAt = performance.now()
    lastTimestamp = 0
    spawnRound()
    animationId = requestAnimationFrame(loop)
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

  function destroy() {
    cancelAnimationFrame(animationId)
    animationId = null
    mountEl.innerHTML = ''
    clearBoard()
    setState('destroyed')
  }

  function getState() {
    return {
      state,
      score,
      bestScore,
      currentExpected,
      roundSize
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
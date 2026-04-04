export const metadata = {
  id: 'dot-dodge',
  name: 'Dot Dodge',
  version: '0.1.0',
  author: 'platform',
  description: 'Move the cursor dot and dodge the flying obstacles as long as possible.',
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
  let scoreEl = null
  let playerEl = null
  let arenaEl = null

  let score = 0
  let bestScore = 0
  let timeLeft = 20
  let lastTimestamp = 0
  let gameStartedAt = 0
  let survivalAcc = 0
  let spawnAcc = 0

  let arenaWidth = 320
  let arenaHeight = 420

  let player = {
    x: 160,
    y: 210,
    r: 6,
    active: false
  }

  let obstacles = []
  let obstacleId = 0

  const STORAGE_KEY = 'dot_dodge_best_score'

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
        delta
      })
    }

    if (timerEl) {
      timerEl.textContent = `TIME ${Math.max(0, Math.ceil(timeLeft))}`
    }

    if (scoreEl) {
      scoreEl.textContent = `SCORE ${score}`
    }
  }

  function updateOverlay() {
    if (!overlayEl) return

    if (state === 'idle' || state === 'ready') {
      overlayEl.innerHTML = `
        <div class="text-center px-4">
          <div class="text-sm tracking-widest text-cyan-300">DOT DODGE</div>
          <div class="mt-2 text-xs text-cyan-200/80">Move the cursor dot to dodge obstacles</div>
          <div class="mt-1 text-xs text-cyan-200/80">Survive as long as you can</div>
          <div class="mt-1 text-xs text-cyan-200/80">More obstacles appear over time</div>
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
          <div class="text-sm tracking-widest text-red-400">CRASHED</div>
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

  function randomRange(min, max) {
    return Math.random() * (max - min) + min
  }

  function updateArenaSize() {
    arenaWidth = arenaEl?.clientWidth || mountEl?.clientWidth || 320
    arenaHeight = arenaEl?.clientHeight || mountEl?.clientHeight || 420
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
  }

  function renderPlayer() {
    if (!playerEl) return
    playerEl.style.width = `${player.r * 2}px`
    playerEl.style.height = `${player.r * 2}px`
    playerEl.style.transform = `translate(${player.x - player.r}px, ${player.y - player.r}px)`
    playerEl.style.opacity = player.active ? '1' : '0.35'
  }

  function clearObstacles() {
    for (const obstacle of obstacles) {
      obstacle.el?.remove()
    }
    obstacles = []
  }

  function createObstacleElement(size) {
    const el = document.createElement('div')
    el.className =
      'absolute rounded-full border border-fuchsia-300/60 bg-fuchsia-400/25 shadow-[0_0_16px_rgba(232,121,249,0.35)]'
    el.style.width = `${size * 2}px`
    el.style.height = `${size * 2}px`
    return el
  }

  function spawnObstacle() {
    if (!arenaEl) return

    updateArenaSize()

    const edge = Math.floor(Math.random() * 4)
    const r = randomRange(8, 16)

    let x = 0
    let y = 0
    let vx = 0
    let vy = 0

    const speedBase = Math.min(220, 70 + score * 1.2 + (20 - timeLeft) * 4)
    const speed = randomRange(speedBase * 0.8, speedBase * 1.2)

    if (edge === 0) {
      x = randomRange(r, arenaWidth - r)
      y = -r * 2
    } else if (edge === 1) {
      x = arenaWidth + r * 2
      y = randomRange(r, arenaHeight - r)
    } else if (edge === 2) {
      x = randomRange(r, arenaWidth - r)
      y = arenaHeight + r * 2
    } else {
      x = -r * 2
      y = randomRange(r, arenaHeight - r)
    }

    const dx = player.x - x + randomRange(-80, 80)
    const dy = player.y - y + randomRange(-80, 80)
    const dist = Math.hypot(dx, dy) || 1

    vx = (dx / dist) * speed
    vy = (dy / dist) * speed

    const el = createObstacleElement(r)
    arenaEl.appendChild(el)

    obstacles.push({
      id: obstacleId += 1,
      x,
      y,
      vx,
      vy,
      r,
      el
    })
  }

  function renderObstacles() {
    for (const obstacle of obstacles) {
      obstacle.el.style.transform = `translate(${obstacle.x - obstacle.r}px, ${obstacle.y - obstacle.r}px)`
    }
  }

  function removeOutOfBoundsObstacles() {
    obstacles = obstacles.filter((obstacle) => {
      const padding = 80
      const alive =
        obstacle.x >= -padding &&
        obstacle.x <= arenaWidth + padding &&
        obstacle.y >= -padding &&
        obstacle.y <= arenaHeight + padding

      if (!alive) {
        obstacle.el?.remove()
      }

      return alive
    })
  }

  function getSpawnInterval() {
    if (timeLeft > 15) return 1.2
    if (timeLeft > 10) return 0.95
    if (timeLeft > 6) return 0.75
    if (timeLeft > 3) return 0.58
    return 0.45
  }

  function updateScoreBySurvival(deltaSeconds) {
    survivalAcc += deltaSeconds

    while (survivalAcc >= 0.5) {
      survivalAcc -= 0.5
      emitScore(1)
    }
  }

  function updateObstacles(deltaSeconds) {
    for (const obstacle of obstacles) {
      obstacle.x += obstacle.vx * deltaSeconds
      obstacle.y += obstacle.vy * deltaSeconds
    }

    removeOutOfBoundsObstacles()
    renderObstacles()
  }

  function checkCollision() {
    if (!player.active) return false

    for (const obstacle of obstacles) {
      const dist = Math.hypot(player.x - obstacle.x, player.y - obstacle.y)
      if (dist <= player.r + obstacle.r) {
        return true
      }
    }

    return false
  }

  function handlePointerMove(event) {
    if (!arenaEl) return

    const rect = arenaEl.getBoundingClientRect()

    const clientX =
      event.touches?.[0]?.clientX ??
      event.changedTouches?.[0]?.clientX ??
      event.clientX

    const clientY =
      event.touches?.[0]?.clientY ??
      event.changedTouches?.[0]?.clientY ??
      event.clientY

    if (typeof clientX !== 'number' || typeof clientY !== 'number') return

    player.x = clamp(clientX - rect.left, player.r, rect.width - player.r)
    player.y = clamp(clientY - rect.top, player.r, rect.height - player.r)
    player.active = true
    renderPlayer()
  }

  function buildDOM() {
    mountEl.innerHTML = ''

    root = document.createElement('div')
    root.className = 'relative w-full h-full overflow-hidden bg-black select-none'

    timerEl = document.createElement('div')
    timerEl.className =
      'absolute right-3 top-3 z-10 text-[11px] tracking-widest text-cyan-300'

    scoreEl = document.createElement('div')
    scoreEl.className =
      'absolute left-3 top-3 z-10 text-[11px] tracking-widest text-lime-300'

    arenaEl = document.createElement('div')
    arenaEl.className = 'absolute inset-x-0 bottom-0 top-10 overflow-hidden'
    arenaEl.style.touchAction = 'none'

    playerEl = document.createElement('div')
    playerEl.className =
      'absolute rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)] pointer-events-none'

    overlayEl = document.createElement('div')
    overlayEl.className =
      'absolute inset-0 z-20 flex items-center justify-center bg-black/45'

    arenaEl.appendChild(playerEl)
    root.appendChild(timerEl)
    root.appendChild(scoreEl)
    root.appendChild(arenaEl)
    root.appendChild(overlayEl)
    mountEl.appendChild(root)

    arenaEl.addEventListener('mousemove', handlePointerMove)
    arenaEl.addEventListener('touchmove', handlePointerMove, { passive: true })
    arenaEl.addEventListener('touchstart', handlePointerMove, { passive: true })
  }

  function loop(timestamp) {
    if (state !== 'playing') return

    if (!lastTimestamp) lastTimestamp = timestamp
    const deltaSeconds = (timestamp - lastTimestamp) / 1000
    lastTimestamp = timestamp

    timeLeft -= deltaSeconds
    spawnAcc += deltaSeconds

    if (timerEl) {
      timerEl.textContent = `TIME ${Math.max(0, Math.ceil(timeLeft))}`
    }

    updateScoreBySurvival(deltaSeconds)

    const spawnInterval = getSpawnInterval()
    while (spawnAcc >= spawnInterval) {
      spawnAcc -= spawnInterval
      spawnObstacle()
    }

    updateObstacles(deltaSeconds)

    if (checkCollision()) {
      gameOver('collision')
      return
    }

    if (timeLeft <= 0) {
      gameOver('time-up')
      return
    }

    animationId = requestAnimationFrame(loop)
  }

  function resetCore() {
    score = 0
    timeLeft = 20
    lastTimestamp = 0
    gameStartedAt = 0
    survivalAcc = 0
    spawnAcc = 0
    player.active = false
    updateArenaSize()
    player.x = arenaWidth / 2
    player.y = arenaHeight / 2
    clearObstacles()
    emitScore(0, true)
    renderPlayer()
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
      resetCore()
      setState('playing')
      gameStartedAt = performance.now()
      lastTimestamp = 0
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
    bestScore = getBestScore()
    resetCore()
    setState('idle')
  }

  function reset() {
    if (state !== 'gameover') return

    cancelAnimationFrame(animationId)
    animationId = null
    bestScore = getBestScore()
    resetCore()
    setState('playing')
    gameStartedAt = performance.now()
    lastTimestamp = 0
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
    clearObstacles()
    mountEl.innerHTML = ''
    setState('destroyed')
  }

  function getState() {
    return {
      state,
      score,
      bestScore,
      obstacleCount: obstacles.length
    }
  }

  buildDOM()
  updateArenaSize()
  bestScore = getBestScore()
  resetCore()
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
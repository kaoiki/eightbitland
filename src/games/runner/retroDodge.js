export const metadata = {
  id: 'retro-dodge',
  name: 'Retro Dodge',
  version: '0.1.0',
  author: 'platform',
  description: 'Dodge falling blocks and survive as long as possible.',
  inputType: ['keyboard', 'pointer', 'touch'],
  orientation: 'portrait',
  source: 'platform',
  status: 'active'
}
export function createGame(options) {
  const {
    mountEl,
    width,
    height,
    onReady,
    onScoreChange,
    onGameOver,
    onStateChange
  } = options

  let state = 'idle'
  let animationId = null
  let root = null
  let obstacleEl = null
  let playerEl = null
  let overlayEl = null
  let obstacleSpeed = 5

  let areaWidth = width || mountEl?.clientWidth || 320
  let areaHeight = height || mountEl?.clientHeight || 400

  const player = {
    width: 44,
    height: 14,
    x: 0,
    y: 0,
    speed: 7,
    moveLeft: false,
    moveRight: false
  }

  const obstacle = {
    width: 20,
    height: 20,
    x: 0,
    y: 0,
    speed: obstacleSpeed
  }

  let score = 0
  let bestScore = 0
  let passedCount = 0
  let lastTime = 0

  function setState(nextState) {
    state = nextState
    onStateChange?.(state)
    updateOverlay()
  }

  function getBestScore() {
    try {
      return Number(localStorage.getItem('retro_dodge_best_score') || 0)
    } catch {
      return 0
    }
  }

  function setBestScore(value) {
    bestScore = value
    try {
      localStorage.setItem('retro_dodge_best_score', String(value))
    } catch {}
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
  }

  function randomObstacleX() {
    return Math.random() * (areaWidth - obstacle.width)
  }

  function updateOverlay() {
    if (!overlayEl) return

    if (state === 'idle' || state === 'ready') {
      overlayEl.innerHTML = `
        <div class="text-center px-4">
          <div class="text-sm tracking-widest text-green-400">RETRO DODGE</div>
          <div class="mt-2 text-xs text-green-500/80">Desktop: ← →</div>
          <div class="mt-1 text-xs text-green-500/80">Mobile: touch / drag</div>
          <div class="mt-3 text-xs text-green-400">Tap / Press Start</div>
        </div>
      `
      overlayEl.style.display = 'flex'
      return
    }

    if (state === 'paused') {
      overlayEl.innerHTML = `
        <div class="text-center px-4">
          <div class="text-sm tracking-widest text-yellow-400">PAUSED</div>
          <div class="mt-2 text-xs text-green-500/80">Press Start to continue</div>
        </div>
      `
      overlayEl.style.display = 'flex'
      return
    }

    if (state === 'gameover') {
      overlayEl.innerHTML = `
        <div class="text-center px-4">
          <div class="text-sm tracking-widest text-red-400">GAME OVER</div>
          <div class="mt-2 text-xs text-green-400">Tap / Press Reset</div>
        </div>
      `
      overlayEl.style.display = 'flex'
      return
    }

    overlayEl.style.display = 'none'
  }

  function updateScore(delta = 0, forceEmit = false) {
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

  }

  function buildDOM() {
    mountEl.innerHTML = ''

    root = document.createElement('div')
    root.className = 'relative w-full h-full overflow-hidden bg-black select-none'

    obstacleEl = document.createElement('div')
    obstacleEl.className =
      'absolute border-2 border-red-400 bg-red-500/20 shadow-[0_0_12px_rgba(248,113,113,0.35)]'

    playerEl = document.createElement('div')
    playerEl.className =
      'absolute border-2 border-green-400 bg-green-500/20 shadow-[0_0_12px_rgba(74,222,128,0.35)]'

    overlayEl = document.createElement('div')
    overlayEl.className =
      'absolute inset-0 z-20 flex items-center justify-center bg-black/45'

    root.appendChild(obstacleEl)
    root.appendChild(playerEl)
    root.appendChild(overlayEl)
    mountEl.appendChild(root)
  }

  function resize() {
    areaWidth = mountEl?.clientWidth || areaWidth
    areaHeight = mountEl?.clientHeight || areaHeight

    if (areaWidth < 280) areaWidth = 320
    if (areaHeight < 300) areaHeight = 400

    player.y = areaHeight - player.height - 18
    player.x = clamp(player.x, 0, areaWidth - player.width)
    obstacle.x = clamp(obstacle.x, 0, areaWidth - obstacle.width)
  }

  function resetEntities() {
    resize()

    player.x = (areaWidth - player.width) / 2
    player.y = areaHeight - player.height - 18

    obstacle.x = randomObstacleX()
    obstacle.y = -obstacle.height - 12
    obstacle.speed = obstacleSpeed

    score = 0
    passedCount = 0
    lastTime = 0
    bestScore = getBestScore()
    updateScore(0, true)
    render()
  }

  function render() {
    if (!playerEl || !obstacleEl) return

    playerEl.style.width = `${player.width}px`
    playerEl.style.height = `${player.height}px`
    playerEl.style.transform = `translate(${player.x}px, ${player.y}px)`

    obstacleEl.style.width = `${obstacle.width}px`
    obstacleEl.style.height = `${obstacle.height}px`
    obstacleEl.style.transform = `translate(${obstacle.x}px, ${obstacle.y}px)`
  }

  function isColliding() {
    return !(
      player.x + player.width < obstacle.x ||
      player.x > obstacle.x + obstacle.width ||
      player.y + player.height < obstacle.y ||
      player.y > obstacle.y + obstacle.height
    )
  }

  function respawnObstacle() {
    passedCount += 1
    obstacle.y = -obstacle.height - 10
    obstacle.x = randomObstacleX()
    obstacle.speed = Math.min(8.5, obstacleSpeed + passedCount * 0.18)
    updateScore(1)
  }

  function update() {
    if (player.moveLeft) {
      player.x -= player.speed
    }
    if (player.moveRight) {
      player.x += player.speed
    }

    player.x = clamp(player.x, 0, areaWidth - player.width)

    obstacle.y += obstacle.speed

    if (obstacle.y > areaHeight) {
      respawnObstacle()
    }

    if (isColliding()) {
      gameOver('hit-obstacle')
    }
  }

  function loop(timestamp) {
    if (state !== 'playing') return

    if (!lastTime) lastTime = timestamp
    lastTime = timestamp

    update()
    render()

    animationId = requestAnimationFrame(loop)
  }

  function keydownHandler(e) {
    if (e.key === 'ArrowLeft') {
      player.moveLeft = true
    } else if (e.key === 'ArrowRight') {
      player.moveRight = true
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      if (state === 'gameover' || state === 'ready' || state === 'idle') {
        start()
      }
    }
  }

  function keyupHandler(e) {
    if (e.key === 'ArrowLeft') {
      player.moveLeft = false
    } else if (e.key === 'ArrowRight') {
      player.moveRight = false
    }
  }

  function movePlayerToClientX(clientX) {
    const rect = mountEl.getBoundingClientRect()
    const localX = clientX - rect.left
    player.x = clamp(localX - player.width / 2, 0, areaWidth - player.width)
    render()
  }

  function pointerDownHandler(e) {
    if (state === 'gameover') {
      player.moveLeft = false
      player.moveRight = false
      resetEntities()
      setState('ready')
      return
    }

    if (state === 'idle') {
      player.moveLeft = false
      player.moveRight = false
      resetEntities()
      setState('ready')
      return
    }

    if (state === 'ready') {
      start()
      movePlayerToClientX(e.clientX)
      return
    }

    movePlayerToClientX(e.clientX)
  }

  function pointerMoveHandler(e) {
    if (state !== 'playing') return
    movePlayerToClientX(e.clientX)
  }

  function bindEvents() {
    window.addEventListener('keydown', keydownHandler)
    window.addEventListener('keyup', keyupHandler)
    window.addEventListener('resize', resize)

    mountEl.addEventListener('pointerdown', pointerDownHandler)
    mountEl.addEventListener('pointermove', pointerMoveHandler)
  }

  function unbindEvents() {
    window.removeEventListener('keydown', keydownHandler)
    window.removeEventListener('keyup', keyupHandler)
    window.removeEventListener('resize', resize)

    mountEl.removeEventListener('pointerdown', pointerDownHandler)
    mountEl.removeEventListener('pointermove', pointerMoveHandler)
  }

  function start() {
    if (state === 'playing') return

    if (state === 'paused') {
      setState('playing')
      cancelAnimationFrame(animationId)
      animationId = requestAnimationFrame(loop)
      return
    }

    if (state === 'gameover') {
      player.moveLeft = false
      player.moveRight = false
      resetEntities()
      setState('ready')
      return
    }

    if (state === 'idle') {
      player.moveLeft = false
      player.moveRight = false
      resetEntities()
      setState('ready')
      return
    }

    if (state === 'ready') {
      setState('playing')
      cancelAnimationFrame(animationId)
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

  function reset() {
    if (state !== 'gameover') return

    cancelAnimationFrame(animationId)
    animationId = null

    player.moveLeft = false
    player.moveRight = false

    resetEntities()
    setState('playing')
    animationId = requestAnimationFrame(loop)
  }

  function gameOver(reason = 'unknown') {
    cancelAnimationFrame(animationId)
    animationId = null
    setState('gameover')

    onGameOver?.({
      score,
      bestScore,
      duration: 0,
      reason
    })
  }

  function destroy() {
    cancelAnimationFrame(animationId)
    animationId = null
    unbindEvents()
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
  bindEvents()
  resetEntities()
  setState('idle')
  requestAnimationFrame(() => {
    resize()
    render()
  })
  onReady?.()

  return {
    start,
    stop,
    reset,
    destroy,
    getState
  }
}
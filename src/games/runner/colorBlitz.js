export const metadata = {
    id: 'color-blitz',
    name: 'Color Blitz',
    version: '0.1.0',
    author: 'platform',
    description: '60s challenge: tap the ONLY one target that matches the color prompt!',
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
    let scoreEl = null
    let promptColorEl = null
  
    // 三个目标元素
    let targetEls = []
  
    let score = 0
    let bestScore = 0
    let timeLeft = 60 // 60秒时长
    let lastTimestamp = 0
    let gameStartedAt = 0
  
    // 颜色池
    const colorPalette = [
      { name: 'RED', hex: '#ef4444' },
      { name: 'GREEN', hex: '#22c55e' },
      { name: 'BLUE', hex: '#3b82f6' },
      { name: 'YELLOW', hex: '#eab308' },
      { name: 'PURPLE', hex: '#8b5cf6' },
      { name: 'ORANGE', hex: '#f97316' },
      { name: 'PINK', hex: '#ec4899' },
      { name: 'CYAN', hex: '#06b6d4' }
    ]
  
    let currentPromptColor = null
    let correctTargetIndex = -1
  
    // ------------------------------
    // 状态与分数
    // ------------------------------
    function setState(nextState) {
      state = nextState
      onStateChange?.(state)
      updateOverlay()
    }
  
    function getBestScore() {
      try {
        return Number(localStorage.getItem('color_blitz_best_score') || 0)
      } catch {
        return 0
      }
    }
  
    function setBestScore(value) {
      bestScore = value
      try {
        localStorage.setItem('color_blitz_best_score', String(value))
      } catch {}
    }
  
    function emitScore(delta = 0, forceEmit = false) {
      if (delta !== 0) {
        score += delta
        score = Math.max(0, score)
        if (score > bestScore) setBestScore(score)
      }
      if (forceEmit || delta !== 0) {
        onScoreChange?.({ score, bestScore, delta })
      }
      if (timerEl) {
        timerEl.textContent = `TIME ${Math.ceil(timeLeft)}`
      }
      if (scoreEl) {
        scoreEl.textContent = `SCORE ${score}`
      }
    }
  
    // ------------------------------
    // 遮罩提示
    // ------------------------------
    function updateOverlay() {
      if (!overlayEl) return
      if (state === 'idle' || state === 'ready') {
        overlayEl.innerHTML = `
          <div class="text-center px-4">
            <div class="text-sm tracking-widest text-green-400">COLOR TRIO BLITZ</div>
            <div class="mt-1 text-xs text-green-500/80">3 targets • ONLY ONE matches</div>
            <div class="mt-1 text-xs text-green-500/80">Correct: +3 • Wrong: -2</div>
            <div class="mt-1 text-xs text-green-500/80">60 seconds • beat your best!</div>
            <div class="mt-3 text-xs text-green-400">PRESS START</div>
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
            <div class="text-sm tracking-widest text-red-400">TIME UP</div>
            <div class="mt-1 text-xs text-green-400">Score: ${score} | Best: ${bestScore}</div>
            <div class="mt-2 text-xs text-green-400">Tap Reset to retry</div>
          </div>
        `
        overlayEl.style.display = 'flex'
        return
      }
      overlayEl.style.display = 'none'
    }
  
    // ------------------------------
    // 工具：随机数 / 取不重复颜色
    // ------------------------------
    function randomRange(min, max) {
      return Math.random() * (max - min) + min
    }
  
    function pickRandomColor() {
      return colorPalette[Math.floor(Math.random() * colorPalette.length)]
    }
  
    // 取 3 个互不相同的颜色，其中 1 个是正确答案
    function generateThreeDistinctColors(correctColor) {
      const colors = [correctColor]
      while (colors.length < 3) {
        const c = pickRandomColor()
        if (!colors.some(x => x.name === c.name)) {
          colors.push(c)
        }
      }
      // 打乱顺序
      for (let i = colors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[colors[i], colors[j]] = [colors[j], colors[i]]
      }
      return colors
    }
  
    // ------------------------------
    // 刷新一轮：3 个目标
    // ------------------------------
    function refreshRound() {
      if (state !== 'playing') return
  
      // 1. 随机提示颜色
      currentPromptColor = pickRandomColor()
      promptColorEl.textContent = `FIND: ${currentPromptColor.name}`
      promptColorEl.style.color = currentPromptColor.hex
  
      // 2. 生成 3 个不同颜色，只有 1 个正确
      const threeColors = generateThreeDistinctColors(currentPromptColor)
      correctTargetIndex = threeColors.findIndex(c => c.name === currentPromptColor.name)
  
      const w = mountEl.clientWidth || 320
      const h = mountEl.clientHeight || 400
      const size = 52
  
      // 3. 给三个目标设置位置与颜色
      threeColors.forEach((color, i) => {
        const el = targetEls[i]
        if (!el) return
  
        const x = randomRange(12, w - size - 12)
        const y = randomRange(70, h - size - 12)
  
        el.style.width = `${size}px`
        el.style.height = `${size}px`
        el.style.backgroundColor = `${color.hex}33`
        el.style.borderColor = color.hex
        el.style.transform = `translate(${x}px, ${y}px)`
        el.dataset.colorName = color.name
      })
    }
  
    // ------------------------------
    // DOM 构建：3 个目标
    // ------------------------------
    function buildDOM() {
      mountEl.innerHTML = ''
      root = document.createElement('div')
      root.className = 'relative w-full h-full overflow-hidden bg-black select-none'
  
      timerEl = document.createElement('div')
      timerEl.className = 'absolute right-3 top-3 z-10 text-[11px] tracking-widest text-green-400'
  
      scoreEl = document.createElement('div')
      scoreEl.className = 'absolute left-3 top-3 z-10 text-[11px] tracking-widest text-green-400'
  
      promptColorEl = document.createElement('div')
      promptColorEl.className = 'absolute top-12 left-0 right-0 z-10 text-center text-sm tracking-widest font-bold'
  
      // 生成 3 个目标按钮
      targetEls = []
      for (let i = 0; i < 3; i++) {
        const btn = document.createElement('button')
        btn.type = 'button'
        btn.className = 'absolute rounded-full border-2 shadow-lg active:scale-95 transition-all z-10'
        targetEls.push(btn)
        root.appendChild(btn)
      }
  
      overlayEl = document.createElement('div')
      overlayEl.className = 'absolute inset-0 z-20 flex items-center justify-center bg-black/50'
  
      root.appendChild(timerEl)
      root.appendChild(scoreEl)
      root.appendChild(promptColorEl)
      root.appendChild(overlayEl)
      mountEl.appendChild(root)
    }
  
    // ------------------------------
    // 点击判断
    // ------------------------------
    function handleTargetClick(e) {
      if (state !== 'playing') return
      const btn = e.currentTarget
      const colorName = btn.dataset.colorName
      const isCorrect = colorName === currentPromptColor.name
  
      if (isCorrect) {
        emitScore(+3)
        refreshRound()
      } else {
        emitScore(-2)
      }
    }
  
    // ------------------------------
    // 主循环
    // ------------------------------
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
  
    // ------------------------------
    // 游戏控制（完全保留你的原版逻辑）
    // ------------------------------
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
        refreshRound()
        animationId = requestAnimationFrame(loop)
      }
    }
  
    function stop() {
      cancelAnimationFrame(animationId)
      animationId = null
      if (state === 'playing') setState('paused')
    }
  
    function resetToReady() {
      cancelAnimationFrame(animationId)
      animationId = null
      score = 0
      timeLeft = 60
      bestScore = getBestScore()
      emitScore(0, true)
      setState('idle')
    }
  
    function reset() {
      if (state !== 'gameover') return
      cancelAnimationFrame(animationId)
      animationId = null
      score = 0
      timeLeft = 60
      bestScore = getBestScore()
      emitScore(0, true)
      refreshRound()
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
      targetEls.forEach(el => el.removeEventListener('click', handleTargetClick))
      mountEl.innerHTML = ''
      setState('destroyed')
    }
  
    function getState() {
      return { state, score, bestScore, prompt: currentPromptColor?.name }
    }
  
    // ------------------------------
    // 初始化
    // ------------------------------
    buildDOM()
    bestScore = getBestScore()
    emitScore(0, true)
    targetEls.forEach(el => el.addEventListener('click', handleTargetClick))
    setState('idle')
    onReady?.()
  
    return { start, stop, reset, destroy, getState }
  }
export function createPlatformGame(gameModule, options) {
  if (!gameModule || typeof gameModule.createGame !== 'function') {
    throw new Error('Invalid game module: createGame() is required.')
  }

  const game = gameModule.createGame(options)

  if (!game || typeof game !== 'object') {
    throw new Error('Invalid game instance: expected an object.')
  }

  const requiredMethods = ['start', 'stop', 'reset', 'destroy', 'getState']

  for (const method of requiredMethods) {
    if (typeof game[method] !== 'function') {
      throw new Error(`Invalid game instance: missing method "${method}()".`)
    }
  }

  return game
}
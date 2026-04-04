import { createGame as createRetroDodgeGame, metadata as retroDodgeMeta } from '../runner/retroDodge'
import { createGame as createClickRushGame, metadata as clickRushMeta } from '../runner/clickRush'

export const gameRegistry = {
  [retroDodgeMeta.id]: {
    metadata: retroDodgeMeta,
    createGame: createRetroDodgeGame
  },
  [clickRushMeta.id]: {
    metadata: clickRushMeta,
    createGame: createClickRushGame
    }
}
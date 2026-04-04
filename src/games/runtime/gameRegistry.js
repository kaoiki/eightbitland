import { createGame as createRetroDodgeGame, metadata as retroDodgeMeta } from '../runner/retroDodge'
import { createGame as createClickRushGame, metadata as clickRushMeta } from '../runner/clickRush'
import { createGame as createLaneShotGame, metadata as laneShotMeta } from '../runner/laneShot'

export const gameRegistry = {
  [retroDodgeMeta.id]: {
    metadata: retroDodgeMeta,
    createGame: createRetroDodgeGame
  },
  [clickRushMeta.id]: {
    metadata: clickRushMeta,
    createGame: createClickRushGame
  },
  [laneShotMeta.id]: {
    metadata: laneShotMeta,
    createGame: createLaneShotGame
  }
    
}
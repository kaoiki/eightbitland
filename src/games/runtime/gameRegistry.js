import { createGame as createRetroDodgeGame, metadata as retroDodgeMeta } from '../runner/retroDodge'
import { createGame as createClickRushGame, metadata as clickRushMeta } from '../runner/clickRush'
import { createGame as createLaneShotGame, metadata as laneShotMeta } from '../runner/laneShot'
import { createGame as createStackRiftGame, metadata as stackRiftMeta } from '../runner/stackRift'

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
  },
  [stackRiftMeta.id]: {
    metadata: stackRiftMeta,
    createGame: createStackRiftGame
  }
    
}
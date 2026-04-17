import { createGame as createRetroDodgeGame, metadata as retroDodgeMeta } from '../runner/retroDodge'
import { createGame as createClickRushGame, metadata as clickRushMeta } from '../runner/clickRush'
import { createGame as createColorBlitzGame, metadata as colorBlitzMeta } from '../runner/colorBlitz' // 202604131349
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
  // ↓ 202604131349
  [colorBlitzMeta.id]: {
    metadata: colorBlitzMeta,
    createGame: createColorBlitzGame
  },
  // ↑
  [laneShotMeta.id]: {
    metadata: laneShotMeta,
    createGame: createLaneShotGame
  },
  [stackRiftMeta.id]: {
    metadata: stackRiftMeta,
    createGame: createStackRiftGame
  }
    
}
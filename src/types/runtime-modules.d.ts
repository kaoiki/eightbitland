declare module '../games/runtime/gameRegistry' {
  export type RuntimeGameModule = {
    metadata: {
      id?: string
      name?: string
      [key: string]: unknown
    }
    [key: string]: unknown
  }

  export const gameRegistry: Record<string, RuntimeGameModule>
}

declare module '../games/runtime/loadExternalGame' {
  export type RuntimeGameModule = {
    metadata: {
      id?: string
      name?: string
      [key: string]: unknown
    }
    [key: string]: unknown
  }

  export function loadExternalGame(path: string): Promise<RuntimeGameModule | null>
}
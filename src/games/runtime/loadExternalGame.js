// export async function loadExternalGame(url) {
//   let objectUrl = null

//   try {
//     const response = await fetch(url)

//     if (!response.ok) {
//       throw new Error(`Failed to fetch external game: ${response.status}`)
//     }

//     const code = await response.text()

//     objectUrl = URL.createObjectURL(
//       new Blob([code], { type: 'text/javascript' })
//     )

//     const module = await import(/* @vite-ignore */ objectUrl)

//     if (!module?.metadata || typeof module?.createGame !== 'function') {
//       throw new Error('Invalid game module')
//     }

//     return {
//       metadata: module.metadata,
//       createGame: module.createGame
//     }
//   } catch (error) {
//     console.error('[ExternalGame] load failed:', error)
//     return null
//   } finally {
//     if (objectUrl) {
//       URL.revokeObjectURL(objectUrl)
//     }
//   }
// }

export async function loadExternalGame(url) {
  let objectUrl = null

  try {
    const response = await fetch(url, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch external game: ${response.status}`)
    }

    const code = await response.text()

    objectUrl = URL.createObjectURL(
      new Blob([code], { type: 'text/javascript' })
    )

    const module = await import(/* @vite-ignore */ objectUrl)

    if (!module?.metadata?.id || typeof module?.createGame !== 'function') {
      throw new Error('Invalid game module')
    }

    return {
      metadata: module.metadata,
      createGame: module.createGame
    }
  } catch (error) {
    console.error('[ExternalGame] load failed:', url, error)
    return null
  } finally {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
    }
  }
}
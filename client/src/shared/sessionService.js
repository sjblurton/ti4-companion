import CONFIG from '../config'

import { saveSession } from './persistence'

const factory = ({ fetch }) => {
  const pushEvent = (sessionId, gameEvent) =>
    fetch(`${CONFIG.apiUrl}/api/sessions/${sessionId}/events`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: gameEvent.type,
        serializedPayload: JSON.stringify(gameEvent.payload),
      }),
    })

  return {
    createSession: async (factions) => {
      const result = await fetch(`${CONFIG.apiUrl}/api/sessions`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(factions),
      })
      const session = await result.json()

      await saveSession(session)

      return session
    },

    ping: () => fetch(`${CONFIG.apiUrl}/api/ping`, { method: 'post' }),

    get: async (id) => {
      const result = await fetch(`${CONFIG.apiUrl}/api/sessions/${id}`)

      // TODO check status code

      return result.json()
    },

    pushEvent,
    uploadMap: (mapFile, sessionId) => {
      const formData = new FormData()
      formData.append('map', mapFile)

      return fetch(`${CONFIG.apiUrl}/api/sessions/${sessionId}/map`, {
        method: 'POST',
        body: formData,
      })
    },
  }
}

export default factory

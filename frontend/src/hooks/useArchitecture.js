/**
 * ArchIQ — useArchitecture Hook
 * Handles API calls, loading states, and error handling
 * for architecture generation and retrieval.
 */

import { useState, useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useArchitecture() {
  const [architecture, setArchitecture] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generate = useCallback(async (inputs) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/v1/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Generation failed')
      }
      const data = await res.json()
      setArchitecture(data)
      return data
    } catch (e) {
      setError(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const refine = useCallback(async (sessionId, instruction) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/v1/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, instruction }),
      })
      if (!res.ok) throw new Error('Refinement failed')
      const data = await res.json()
      setArchitecture(data)
      return data
    } catch (e) {
      setError(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const getCostBreakdown = useCallback(async (sessionId) => {
    const res = await fetch(`${API_URL}/api/v1/cost/${sessionId}`)
    if (!res.ok) throw new Error('Cost fetch failed')
    return res.json()
  }, [])

  const reset = useCallback(() => {
    setArchitecture(null)
    setError(null)
  }, [])

  return { architecture, loading, error, generate, refine, getCostBreakdown, reset }
}

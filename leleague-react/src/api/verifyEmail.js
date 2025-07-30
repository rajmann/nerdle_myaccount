import React from 'react'

import client from '../lib/client'

export const verifyEmail = async (token) => {
  const response = await client.put(`verify-email/${token}`)
  return response
}

export const useVerifyEmail = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [data, setData] = React.useState(null)

  const execute = React.useCallback(async (token) => {
    try {
      setIsLoading(true)
      const response = await verifyEmail(token)
      setData(response)
      return response
    } catch (e) {
      setError(e)
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { isLoading, error, data, execute }
}
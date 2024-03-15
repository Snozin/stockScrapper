import { useState, useEffect } from 'react'
// import { formatResults } from '../utils/utils'

const url = '/scrap'

export function useFetch(tickers) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(url, {
          method: 'POST',
          // mode: 'cors',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            tickers,
          }),
        })

        if (response?.ok) {
          const info = await response.json()
          // console.log('info', info)
          setData(info)
        } else {
          const message = `Ha ocurrido un error: ${response.status}`
          console.error(message)
        }
      } catch ({ message }) {
        console.error(`Error happens: ${message}`)
      } finally {
        setLoading(false)
      }
    }

    if (tickers) {
      fetchData()
    }
    
    return () => "" //Component did unmount
  }, [tickers])

  return { data, loading }
}

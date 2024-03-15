import { scrapTickers } from '../../api/client'
import { useEffect, useState, Suspense } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { StockCard } from '../stockCard/StockCard'

export default function Home() {
  const [tickers, setTickers] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const searchKey = formData.get('tickers')

    setTickers(searchKey)
  }

  // console.log('Estado tickers: ', tickers)

  return (
    <>
      <form method="post" onSubmit={handleSubmit}>
        <input type="text" placeholder="Busca cosas" name="tickers" />
      </form>

      <StockCard tickers={tickers} />
    </>
  )
}

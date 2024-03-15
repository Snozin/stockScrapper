// import { fetchTickers } from '../../api/client'
import { useFetch } from '../../hooks/useFetch'

export function StockCard({ tickers }) {
  const { data, loading } = useFetch(tickers)
  // const data = fetchTickers(tickers)

  console.log('StockCardData:', data)

  return (
    <div>
      {loading
        ? 'toy cargando ...'
        : data?.map((stock) => (
            <div key={stock.id}>
              <h2>{stock.name}</h2>
              <p>Precio: {stock.price} </p>
              <p>PER: {stock.per} </p>
              <p>Dividendos: {stock.dividend} </p>
            </div>
          ))}
    </div>
  )
}

export async function scrapTickers(tickers) {
  const url = '/scrap'
  const respData = { stockData: 'data' }

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
      console.log('Milagrosamente funcioné')

      respData.stockData = await response.json()
      console.log(respData.stockData)
    } else {
      const message = `Pasaron cosas malas: ${response.status}`
      respData.errorMessage = message
      // console.log(`Más cosas malas: ${message}`)
    }

    return respData
  } catch ({ message }) {
    respData.errorMessage = message
    console.error(`Error happens: ${message}`)

    return respData
  }
}

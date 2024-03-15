export function formatResults(tickers, data) {
  console.log('Recibo: ', tickers, data)
}

/*
  TODO Posible implementación de una "mini caché" usando Map:

  let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}
*/

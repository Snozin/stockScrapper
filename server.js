import fs from 'node:fs/promises'
import dotenv from 'dotenv'
import express from 'express'
import { chromium } from 'playwright'

dotenv.config()

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined

// Create http server
const app = express()
app.use(express.json())

// Add Vite or respective production middlewares
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })

  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML
app.get('/', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    let template
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url, ssrManifest)

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

app.post('/scrap', async (req, res) => {
  try {
    if (!req.body.tickers) {
      res.status(404).json({
        error: 'no tickers provided in request',
      })
      return
    }

    let { tickers } = req.body
    tickers = tickers.toUpperCase()
    tickers = tickers.split(',')

    const browser = await chromium.launch({
      chromiumSandbox: false,
    })
    const page = await browser.newPage()
    const url = 'https://finance.yahoo.com'

    await page.goto(url)
    await page.locator('[name="agree"]').click()

    const data = []
    for (let ticker of tickers) {
      await page.goto(`${url}/quote/${ticker}`)

      const result = {}
      result.name = await page.locator('h1').innerText()
      result.price = await page
        .locator(`[data-symbol="${ticker}"][data-field="regularMarketPrice"]`)
        .getAttribute('value')
      result.dividend = await page
        .locator('[data-test="DIVIDEND_AND_YIELD-value"]')
        .innerText()
      result.exDate = await page
        .locator('[data-test="EX_DIVIDEND_DATE-value"]')
        .innerText()
      result.per = await page
        .locator('[data-test="PE_RATIO-value"]')
        .innerText()
      result.id = ticker
      data.push(result)
    }

    await browser.close()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({
      errorName: err.name,
      errorMessage: err.message,
    })
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})

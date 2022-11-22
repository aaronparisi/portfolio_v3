const http = require('http')
const https = require('https')
const fs = require('fs')
const process = require('process')
const { URL } = require('url')

// ENV
const BUILD_ID = process.env.PORTFOLIO_BUILD_ID ?? 'BUILD_ID_UNKNOWN'
const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || '3002'

// RESPONSE PARAMS
const CONTENT_TYPE = {
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  css: 'text/css; charset=utf-8',
  js: 'application/javascript; charset=utf-8',
  html: 'text/html; charset=utf-8',
  json: 'application/json'
}

// CACHED ASSETS
let staticCache = {}

// CACHE FUNCTIONS
const cacheAssets = dir => {
  const dirents = fs.readdirSync(dir, { withFileTypes: true })

  for (let i = 0; i < dirents.length; i++) {
    const fullpath = `${dir}/${dirents[i].name}`
    if (dirents[i].isDirectory()) cacheAssets(fullpath)
    else staticCache[fullpath.replace(/^\./, '')] = fs.readFileSync(fullpath)
  }
}
const updateCache = () => {
  // 
}

// SERVER FUNCTIONS
const respond = ({ res, data = "", contentType = CONTENT_TYPE.html, statusCode = 200 }) => {
  res.writeHead(
    statusCode, 
    {
      'Content-Type': contentType,
      'Content-Length': Buffer.byteLength(data)
    }
  )
  res.end(data)
}
const parseSearchParams = () => {
  //
}
const getCachedAsset = url => {
  return staticCache[url.replace(`-${BUILD_ID}`, '')]
}
const handleRequest = (req, res) => {
  const baseUrl = req.protocol + "://" + req.host
  req.parsedUrl = new URL(req.url, baseUrl)

  const ext = req.url.split('.')[1]
  const contentType = CONTENT_TYPE[ext] || CONTENT_TYPE.html
  const cacheKey = (req.url === '/') ? '/static/index.html' : req.url.replace(`-${BUILD_ID}`, '')
  const data = staticCache[cacheKey]

  if (!data) {
    console.log(`url: ${req.url}`)
    respond({ res, data: "ERROR", contentType: CONTENT_TYPE.html, statusCode: 404 })
  } else {
    respond({ res, data, contentType, statusCode: 200 })
  }
}
const main = () => {
  cacheAssets('./static')

  const server = http.createServer(handleRequest)
  server.listen(PORT, HOST, () => {
    console.log(`Server is listening on ${HOST}:${PORT}`)
  })

  const exit = () => {
    server.close(() => process.exit())
    console.log('Server is closed.')
  }

  process.on('SIGINT', exit)
  process.on('SIGTERM', exit)
  process.on('uncaughtException', (err, origin) => {
    console.log(`Process caught unhandled exception ${err} ${origin}`)
  })
}

main()

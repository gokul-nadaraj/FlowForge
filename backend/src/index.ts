import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'

const app = express()
app.use(cors())
app.use(express.json())

const DB = path.join(__dirname, '..', 'data', 'flows.json')

function buildWebhookUrl(url: string, result: unknown) {
  const webhookUrl = new URL(url)
  webhookUrl.searchParams.set('result', result == null ? '' : String(result))
  return webhookUrl.toString()
}

app.get('/api/flows', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB, 'utf8'))
  res.json(data)
})

app.get('/api/flows/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB, 'utf8'))
  let found = null
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == req.params.id) found = data[i]
  }
  res.json(found)
})

app.post('/api/flows', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB, 'utf8'))
  const flow = req.body
  flow.id = String(Date.now())
  data.push(flow)
  fs.writeFileSync(DB, JSON.stringify(data, null, 2))
  res.json(flow)
})

app.put('/api/flows/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB, 'utf8'))
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == req.params.id) {
      data[i].name = req.body.name
      data[i].nodes = req.body.nodes
      data[i].edges = req.body.edges
    }
  }
  fs.writeFileSync(DB, JSON.stringify(data, null, 2))
  res.json({ ok: true })
})

//webhook endpoint api


app.post('/api/webhook', async (req, res) => {
  const { url, method = 'POST', result } = req.body

  console.log('Webhook request received', { url, method, result })
  const destinationUrl = typeof url === 'string' ? url.trim() : ''
  const requestMethod = typeof method === 'string' ? method.toUpperCase() : 'POST'

  if (!destinationUrl) {
    res.status(400).json({ success: false, status: 400, message: 'Destination URL is required.' })
    return
  }

  if (!['POST', 'PUT', 'GET'].includes(requestMethod)) {
    res.status(400).json({ success: false, status: 400, message: 'Unsupported HTTP method.' })
    return
  }

  try {
    const response = await fetch(requestMethod === 'GET' ? buildWebhookUrl(destinationUrl, result) : destinationUrl, {
      method: requestMethod,
      headers: requestMethod === 'GET' ? undefined : { 'Content-Type': 'application/json' },
      body: requestMethod === 'GET' ? undefined : JSON.stringify({ result })
    })

    res.json({
      success: response.ok,
      status: response.status,
      message: response.ok ? undefined : response.statusText
    })
  } catch (error) {
    console.error('Webhook request failed', error)
    res.json({ success: false, status: 500, message: 'Network Error' })
  }
})

app.listen(3001, () => console.log('backend on http://localhost:3001'))

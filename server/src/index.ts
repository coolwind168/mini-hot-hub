import cors from 'cors'
import express from 'express'

const PORT = 3001
const CLIENT_ORIGIN = 'http://localhost:5173'

const app = express()

app.use(cors({ origin: CLIENT_ORIGIN }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})

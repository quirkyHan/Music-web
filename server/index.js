import express from 'express'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import authRouter from './routes/auth.js'
import songsRouter from './routes/songs.js'

const app = express()
const port = process.env.port || 3000

// middleware

app.use(express.json())
app.use(cookieParser())

//routes
app.use('/auth', authRouter)
app.use('/songs', songsRouter)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
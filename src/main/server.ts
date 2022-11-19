import express from 'express'
import 'dotenv/config'

const app = express()
app.listen(+(process.env.APP_PORT as string), () => console.log(`Servidor executando no endereço http://localhost:${+(process.env.APP_PORT as string)}`))

import 'dotenv/config'
import app from './config/app'

app.listen(+(process.env.APP_PORT as string), () => console.log(`Servidor executando no endereço http://localhost:${+(process.env.APP_PORT as string)}`))

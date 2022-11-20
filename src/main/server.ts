import 'dotenv/config'
import { ConnectionHelper } from '../infra/db/helpers/connection-helper'

ConnectionHelper.connect('')
  .then(async () => {
    const app = (await import('./config/app')).default
    console.log('Connection was successfully established with the databse')
    app.listen(+(process.env.APP_PORT as string), () => console.log(`Server running at http://localhost:${+(process.env.APP_PORT as string)}`))
  })
  .catch((error: any) => {
    console.error('It was not possible to establish connection with the databse', error)
  })

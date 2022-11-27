import { Router } from 'express'
import { adaptRoute } from '../adapters/express-routes-adapter'
import { makeLoginController } from '../factories/login/login'

export default (router: Router): Router => {
  router.post('/login', adaptRoute(makeLoginController())) // eslint-disable-line
  return router
}

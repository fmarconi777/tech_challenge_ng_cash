import { adaptRoute } from '../adapters/express-routes-adapter'
import { makeLoginController } from '../factories/login/login'
import { Router } from 'express'

export default (router: Router): Router => {
  router.post('/login', adaptRoute(makeLoginController())) // eslint-disable-line
  return router
}

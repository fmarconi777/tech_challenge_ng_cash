import { Router } from 'express'
import { adaptRoute } from '../adapters/express-routes-adapter'
import { makeSignupController } from '../factories/signup/signup'

export default (router: Router): Router => {
  router.post('/signup', adaptRoute(makeSignupController())) // eslint-disable-line
  return router
}

import { Router } from 'express'
import { adaptRoute } from '../adapters/express-routes-adapter'
import { makeSignupControler } from '../factories/signup'

export default (router: Router): Router => {
  router.post('/signup', adaptRoute(makeSignupControler())) // eslint-disable-line
  return router
}

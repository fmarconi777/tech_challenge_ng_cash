import { Router } from 'express'

export default (router: Router): Router => {
  router.post('/signup', (req, res) => {
    res.json({ ok: 'ok' })
  })
  return router
}

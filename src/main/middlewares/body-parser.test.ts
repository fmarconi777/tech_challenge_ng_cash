import app from '../config/app'
import request from 'supertest'

describe('Body Parser middleware', () => {
  test('Should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ test: 'test' })
      .expect({ test: 'test' })
  })
})

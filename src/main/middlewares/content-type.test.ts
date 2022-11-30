import app from '../config/app'
import request from 'supertest'

describe('Content type middleware', () => {
  test('Should return default content type as json', async () => {
    app.get('/teste_content_type', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/teste_content_type')
      .expect('content-type', /json/)
  })
})

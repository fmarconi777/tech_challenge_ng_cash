import request from 'supertest'
import app from '../config/app'

describe('Signup Routes', () => {
  test('Should return a message on success', async () => {
    await request(app)
      .post('/signup')
      .send({
        username: 'any_name',
        password: 'any_password'
      })
      .expect(200)
  })
})

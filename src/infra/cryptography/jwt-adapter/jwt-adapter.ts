import { Encrypter } from '../../../data/protocols/crytography/encrypter'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export class JwtAdapter implements Encrypter {
  private readonly secreteKey = process.env.SECRET_KEY

  async encrypt (id: string): Promise<string> {
    jwt.sign({ id }, (this.secreteKey as string), { expiresIn: '1d' })
    return ''
  }
}

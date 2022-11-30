import { Encrypter } from '@/data/protocols/crytography/encrypter'
import { Decrypter } from '@/data/protocols/crytography/decrypter'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export class JwtAdapter implements Encrypter, Decrypter {
  private readonly secreteKey = process.env.SECRET_KEY

  async encrypt (id: string): Promise<string> {
    return jwt.sign({ id }, (this.secreteKey as string), { expiresIn: '1d' })
  }

  async decrypt (value: string): Promise<any> {
    return jwt.verify(value, (this.secreteKey as string))
  }
}

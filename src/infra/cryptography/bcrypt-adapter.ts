import { Hasher } from '../../data/protocols/crytography/hasher'
import bcrypt from 'bcrypt'
import 'dotenv/config'

export class BcryptAdapter implements Hasher {
  private readonly salt: number = +(process.env.SALT as string)
  async hash (value: string): Promise<string> {
    await bcrypt.hash(value, this.salt)
    return ''
  }
}

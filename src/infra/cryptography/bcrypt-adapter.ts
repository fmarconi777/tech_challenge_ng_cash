import { Hasher } from '../../data/protocols/crytography/hasher'
import bcrypt from 'bcrypt'
import 'dotenv/config'
import { HashComparer } from '../../data/protocols/crytography/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  private readonly salt: number = +(process.env.SALT as string)
  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare (password: string, hash: string): Promise<boolean> {
    await bcrypt.compare(password, hash)
    return true
  }
}

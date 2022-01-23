import {inject, injectable} from 'inversify'
import {TYPES} from '../../ioc/types'
import {SupabaseClient} from '@supabase/supabase-js'
import jwt, {JwtPayload} from 'jsonwebtoken'
import env from '../../env'

@injectable()
export class SupabaseAuth {
  constructor(@inject(TYPES.supabaseClient) private supabase: SupabaseClient) {}

  public async getUserIdFromToken(accessToken: string): Promise<string> {
    const decoded = jwt.verify(accessToken, env.supabase.jwtSecret) as JwtPayload;
    if (!decoded || !decoded.exp) {
      throw new Error('invalid_token')
    }
    if (decoded.exp < new Date().getTime() / 1000) {
      throw new Error('invalid_token')
    }
    return decoded.sub as string
  }

  public async deleteUser(accessToken: string): Promise<void> {
    const userId = await this.getUserIdFromToken(accessToken)
    await this.supabase.auth.api.deleteUser(userId, accessToken)
  }
}
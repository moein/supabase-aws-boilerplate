import {Request, Response, Router} from 'express';
import {container} from '../../../ioc/inversify.config'
import {TYPES} from '../../../ioc/types'
import {SupabaseAuth} from '../../../services/auth/supabase'
const router = Router()

router.delete('/', async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization?.split(' ')[1] as string // We already know it's a bearer token thanks to authorizer
  await container.get<SupabaseAuth>(TYPES.supabaseAuth).deleteUser(accessToken)
})

export default router

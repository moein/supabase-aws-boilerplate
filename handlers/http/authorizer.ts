import {APIGatewayProxyEventV2} from 'aws-lambda'
import {container} from '../../lib/ioc/inversify.config'
import {SupabaseAuth} from '../../lib/services/auth/supabase'
import {TYPES} from '../../lib/ioc/types'

export const supabaseJwt = async (event: APIGatewayProxyEventV2) => {
  const [tokenType, accessToken] = event.headers.authorization?.split(' ') || []
  if (tokenType !== 'Bearer') {
    return {
      isAuthorized: false
    }
  }
  if (!accessToken) {
    return {
      isAuthorized: false,
    }
  }
  try {
    const userId = await container.get<SupabaseAuth>(TYPES.supabaseAuth).getUserIdFromToken(accessToken)
    return {
      isAuthorized: true,
      context: {
        userId,
      }
    }
  } catch (e) {
    return {
      isAuthorized: false
    }
  }
}
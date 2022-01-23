import {APIGatewayProxyEventV2} from 'aws-lambda'
import env from '../../lib/env'

export const supabaseHookSecret = async (event: APIGatewayProxyEventV2) => {
  return {
    isAuthorized: event.headers.authorization === `Token ${env.supabase.hookSecret}`
  }
}

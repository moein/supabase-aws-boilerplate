export default {
  supabase: {
    jwtSecret: process.env.SUPABASE_JWT_SECRET as string,
    url: process.env.SUPABASE_URL as string,
    apiSecret: process.env.SUPABASE_API_SECRET as string,
    hookSecret: process.env.SUPABASE_HOOK_SECRET as string
  },
  offline: {
    isOffline: process.env.IS_OFFLINE as string === 'true',
    lambdaEndpoint: 'http://localhost:4102',
  },
}
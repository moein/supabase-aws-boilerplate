import serverless from 'serverless-http'
import app from '../../lib/controllers/http/express-server'

export const handler = serverless(app);
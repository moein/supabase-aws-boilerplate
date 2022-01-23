import express, {NextFunction, Request, Response} from 'express'
import serverless from 'serverless-http'
import cors from 'cors'
import routes from './routes'
import {apiPathPrefix} from './express-config'

const app = express();
function errorHandler (err: Error, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.json({ error: err })
}

app.use(express.json());
app.use(cors())
for (const route of routes) {
  app.use(apiPathPrefix + route[1], route[0])
}

// Default route returns 404
app.use((req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

app.use(errorHandler)

export default app
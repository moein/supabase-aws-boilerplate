import me from './me'
import {Router} from 'express'

const routes: [Router, string][] = [
  [me, '/me'],
]

export default routes
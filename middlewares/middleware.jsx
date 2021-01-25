import nc from 'next-connect'
import database from './database'
import session from './session'

const middleware = nc()

middleware
  .use(database)
  .use(session)

export default middleware
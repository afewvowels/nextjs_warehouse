import nc from 'next-connect'
import database from './database'
import session from './session'
var cors = require('cors')
const bodyParser = require('body-parser')

const middleware = nc()

  // .use('*', cors())
  // .use(bodyParser.json({limit: '5120kb'}))
middleware
  .use(database)
  .use(session)

export default middleware
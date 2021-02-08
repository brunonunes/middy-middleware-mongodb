const MongoClient = require('mongodb')

let cachedDb = null

export default ({
  databaseURIPath,
}) => ({
  before: async (handler) => {

    try {

      handler.context.callbackWaitsForEmptyEventLoop = false

      const databaseURI = handler.context[databaseURIPath]

      if (cachedDb) {
        console.log('==> reusing mongo connection')
      } else {
        console.log('==> new mongo connection')
        const client = await MongoClient.connect(databaseURI.URI)
        cachedDb = client.db(databaseURI.DATABASE)
      }

      Object.assign(handler.context, { mongodb: cachedDb })

      delete handler.context[databaseURIPath]

    } catch (e) {
      throw new Error(e)
    }
  },
})

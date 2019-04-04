const PostgresUtil = require('../utils/PostgresUtil')

async function createLikesTable() {
  return await PostgresUtil.pool.query(`CREATE TABLE likes (
    message_id          INTEGER REFERENCES messages(id),
    handle              VARCHAR(200) REFERENCES app_users(handle)
  )`)
}

async function createLike(handle, message_id) {
  try {
    const result = await PostgresUtil.pool.query(
      'INSERT INTO likes (handle, message_id) VALUES ($1, $2);',
      [
        handle, message_id
      ])

    return result
  } catch (exception) {
    if (exception.code === '42P01') {
      // 42P01 - table is missing - we'll create it and try again
      await createLikesTable()
      return createLike(handle, messageId)
    } else {
      // unrecognized, throw error to caller
      console.error(exception)
      throw exception
    }
  }
}

async function getLikes() {
  try {
    const result = await PostgresUtil.pool.query(
      'SELECT * FROM likes')

    return result.rows
  } catch (exception) {
    if (exception.code === '42P01') {
      // 42P01 - table is missing - we'll create it and try again
      await createLikesTable()
      return getLikes()
    } else {
      // unrecognized, throw error to caller
      console.error(exception)
      throw exception
    }
  }
}

module.exports = {
  createLike: createLike,
  getLikes: getLikes,
}

const { createError } = require('./helper');
const { validateThenRedirect } = require('./core');

exports.handler = async (event) => {
  console.log('Received event ', JSON.stringify(event, null, 2));
  try {
    return await validateThenRedirect(event);
  } catch (err) {
    return createError(err.message);
  }
};

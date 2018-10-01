const createError = (message, statusCode = 401) => {
  const error = {
    statusCode,
    body: JSON.stringify({
      error: message,
    }),
  };
  return error;
};

const first = array => (Array.isArray(array) && array[0] ? array[0] : null);

const redirectTo = (uri, idToken, tokenName = 'jwt') => {
  const response = {
    statusCode: 302,
    headers: {
      Location: uri,
      [tokenName]: idToken,
    },
  };
  return response;
};

module.exports = { createError, first, redirectTo };

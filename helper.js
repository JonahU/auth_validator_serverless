const url = require('url');

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

const redirectTo = (uri, idToken, refreshToken, tokenName = 'jwt') => {
  const response = {
    statusCode: 302,
    headers: {
      Location: url.format({
        pathname: uri,
        query: {
          [tokenName]: idToken,
          refresh: refreshToken,
        },
      }),
    },
  };
  return response;
};

module.exports = { createError, first, redirectTo };

const first = (array) => Array.isArray(array) && array[0] ? array[0] : null;

const redirectTo = (uri, idToken) => {
  const response = {
    statusCode: 302,
    headers: {
        Location: uri,
        jwt: idToken
    },
  };
  return response;
}

module.exports = { first, redirectTo };

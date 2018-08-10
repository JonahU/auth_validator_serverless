const Cognito = require('./cognito');
const config = require('./config');

const getIdToken = async event => {
  const { code } = event.queryStringParameters;
  const token = await Cognito.fetchToken(code);
  const { id_token: idToken } = await Cognito.verifyToken(token);
  return idToken;
};

 exports.handler = async (event) => {
  console.log("Received event ", JSON.stringify(event));
  try {
    const idToken = await getIdToken(event)
    const response = {
        "statusCode": 302,
        "headers": {
            Location: config.callbackHandlerUri(),
            Authorization: idToken
        },
    };
    return response;
  } catch (err) {
    // TODO: improve error handling/ message
    const errorResponse = {
      "statusCode": 500,
      "headers": {
          Location: config.callbackHandlerUri(),
      },
      "body": `${err.name}: ${err.message}`,
  };
    return errorResponse;
  }
};

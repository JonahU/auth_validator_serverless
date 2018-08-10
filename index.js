const Cognito = require('./cognito');
const config = require('./config');

// TODO: move function to a new file
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
            Authorization: idToken // TODO: change this, all redirection logic will be done within this lambda
        },
    };
    return response;
  } catch ({ message, name }) {
    // TODO: improve error handling/ message
    const errorResponse = {
      "statusCode": 401,
      "message": { [name]: message},
  };
    return errorResponse;
  }
};

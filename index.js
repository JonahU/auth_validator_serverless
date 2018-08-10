const Cognito = require('./cognito');

const getIdToken = async event => {
  const { code } = event.queryStringParameters;
  const token = await Cognito.fetchToken(code);
  const validated = await Cognito.verifyToken(token);
  const { id_token: idToken } = validated;
  return idToken;
};

exports.handler = async (event) => {
  console.log("Received event ", JSON.stringify(event));

  const idToken = await getIdToken(event);

  const response = {
      "statusCode": 302,
      "headers": {
          Location: process.env.REDIRECT_URI,
          Authorization: idToken
      },
  };
  return response;
};


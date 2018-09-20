const Cognito = require('./cognito');
const config = require('./config');
const { redirectTo } = require('./helper');

 exports.handler = async (event) => {
  console.log("Received event ", JSON.stringify(event, null, 2));
  try {
    const token = await Cognito.fetchToken(event);
    const decodedToken = await Cognito.verifyToken(token);
    const group = Cognito.getGroup(decodedToken);
    if (!group) throw new Error('No group found');
    const redirectUri = config.redirectUri(group);
    if (!redirectUri) throw new Error(`No uri found for group '${group}'`);
    return redirectTo(redirectUri, Cognito.getIdToken(token), config.tokenHeaderName(group));
  } catch (err) {
    // TODO: improve error handling/ message
    const errorResponse = {
      statusCode: 401,
      body: JSON.stringify({
        error: err.message
      })
    };
    return errorResponse;
  }
};

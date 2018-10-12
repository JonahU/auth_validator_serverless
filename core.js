const Cognito = require('./cognito');
const config = require('./config');
const { redirectTo } = require('./helper');

const validateThenRedirect = async (lambdaEvent) => {
  try {
    const code = lambdaEvent.queryStringParameters && lambdaEvent.queryStringParameters.code;
    if (!code) throw new Error('No auth code found');

    const token = await Cognito.fetchToken(code);
    const decodedToken = await Cognito.verifyToken(token);
    const group = Cognito.getGroup(decodedToken);
    if (!group) throw new Error('No group found');
    const redirectUri = config.redirectUri(group);
    if (!redirectUri) throw new Error(`No uri found for group '${group}'`);
    return redirectTo(
      redirectUri,
      Cognito.getIdToken(token),
      Cognito.getRefreshToken(token),
      config.tokenHeaderName(group),
    );
  } catch (err) {
    if (config.isDevelopment()) throw err;
    throw new Error('Unauthorized'); // Suppress error source
  }
};

module.exports = { validateThenRedirect };

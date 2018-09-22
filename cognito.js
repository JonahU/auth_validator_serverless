const config = require('./config');
const {
  authorizePath,
  cognitoGroupsClaim,
  tokenHost,
  tokenPath,
  jwksUri
} = require('./constants');
const { first } = require('./helper');
const jwkToPem = require('jwk-to-pem');
const Promise = require('bluebird');
const rp = require('request-promise');
const verify = Promise.promisify(require('jsonwebtoken').verify);

const oauth2 = require('simple-oauth2').create({
  client: {
    id: config.clientId(),
    secret: config.clientSecret()
  },
  auth: {
    tokenHost: tokenHost(),
    tokenPath: tokenPath(),
    authorizePath: authorizePath()
  }
});

const fetchToken = async (lambdaEvent) => {
  const { code } = lambdaEvent.queryStringParameters;
  const tokenConfig = {
    code,
    redirect_uri: config.clientRedirectUri()
  };

  return oauth2.authorizationCode.getToken(tokenConfig)
    .then((result) => {
      const accessToken = oauth2.accessToken.create(result);
      return accessToken;
    })
    .catch(err => Promise.reject(new Error('Error fetching token', err)));
};

const verifyToken = async ({ token }) =>
  rp(jwksUri())
    .then((jwksString) => {
      const jwks = JSON.parse(jwksString);
      const idPem = jwkToPem(jwks.keys[0]);
      return verify(token.id_token, idPem);
    })
    .catch(err => Promise.reject(new Error('Token verification failed', err)));

const getIdToken = token => token.token.id_token;

const getGroup = decodedToken => first(decodedToken[cognitoGroupsClaim()]);

module.exports = { fetchToken, getGroup, getIdToken, verifyToken };

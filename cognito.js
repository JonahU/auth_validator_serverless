const config = require('./config');
const { first } = require('./helper');
const jwkToPem = require('jwk-to-pem');
const Promise = require('bluebird');
const rp = require('request-promise');
const verify = Promise.promisify(require('jsonwebtoken').verify);

const jwksPath = `https://cognito-idp.${config.awsRegion()}.amazonaws.com/${config.poolId()}/.well-known/jwks.json`;

const oauth2 = require('simple-oauth2').create({
  client: {
    id: config.clientId(),
    secret: config.clientSecret()
  },
  auth: {
    tokenHost: `https://${config.cognitoDomainPrefix()}.auth.${config.awsRegion()}.amazoncognito.com`,
    tokenPath: '/oauth2/token',
    authorizePath: `login?redirect_uri=${config.clientRedirectUri()}&response_type=code&client_id=${config.clientId()}`
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
  rp(jwksPath)
    .then((jwksString) => {
      const jwks = JSON.parse(jwksString);
      const idPem = jwkToPem(jwks.keys[0]);
      return verify(token.id_token, idPem);
    })
    .catch(err => Promise.reject(new Error('Token verification failed', err)));

const getIdToken = token => token.token.id_token;

const getGroup = decodedToken => first(decodedToken['cognito:groups']);

module.exports = { fetchToken, getGroup, getIdToken, verifyToken }

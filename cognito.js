const Promise = require('bluebird');
const config = require('./config');
const rp = require('request-promise');
const jwkToPem = require('jwk-to-pem');
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

const fetchToken = code => new Promise((resolve, reject) => {
  const tokenConfig = {
    code,
    redirect_uri: config.clientRedirectUri()
  };

  oauth2.authorizationCode.getToken(tokenConfig)
    .then((result) => {
      const accessToken = oauth2.accessToken.create(result);
      resolve(accessToken);
    })
    .catch(err => reject(new Error('Error fetching token', err)));
});

const verifyToken = ({ token }) => new Promise((resolve, reject) => {
  rp(jwksPath)
    .then((jwksString) => {
      const jwks = JSON.parse(jwksString);
      const idPem = jwkToPem(jwks.keys[0]);
      return verify(token.id_token, idPem);
    })
    .then(() => {
      resolve(token)
    })
    .catch(err => reject(new Error('Token verification failed', err)));
});

module.exports = { fetchToken, verifyToken }

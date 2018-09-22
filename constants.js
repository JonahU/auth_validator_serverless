const config = require('./config');

module.exports = {
  authorizePath: () => `login?redirect_uri=${config.clientRedirectUri()}&response_type=code&client_id=${config.clientId()}`,
  cognitoGroupsClaim: () => 'cognito:groups',
  tokenHost: () => `https://${config.cognitoDomainPrefix()}.auth.${config.awsRegion()}.amazoncognito.com`,
  tokenPath: () => '/oauth2/token',
  jwksUri: () => `https://cognito-idp.${config.awsRegion()}.amazonaws.com/${config.poolId()}/.well-known/jwks.json`,
};

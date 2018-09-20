module.exports = {
  awsRegion: () => process.env.AWS_REGION, // provided by aws
  clientId: () => process.env.CLIENT_ID,
  clientRedirectUri: () => process.env.CLIENT_REDIRECT_URI,
  clientSecret: () => process.env.CLIENT_SECRET,
  cognitoDomainPrefix: () => process.env.COGNITO_DOMAIN_PREFIX,
  poolId: () => process.env.POOL_ID,
  redirectUri: (group) => process.env[`REDIRECT_${group.toUpperCase()}`],
  tokenHeaderName: (group) => process.env[`TOKEN_HEADER_${group.toUpperCase()}`],
}
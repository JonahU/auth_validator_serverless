module.exports = {
  awsRegion: () => process.env.AWS_REGION,
  clientId: () => process.env.CLIENT_ID,
  clientSecret: () => process.env.CLIENT_SECRET,
  cognitoDomainPrefix: () => process.env.COGNITO_DOMAIN_PREFIX,
  poolId: () => process.env.POOL_ID,
  redirectUri: () => process.env.REDIRECT_URI,
}
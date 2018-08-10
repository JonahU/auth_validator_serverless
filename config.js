module.exports = {
  awsRegion: () => process.env.AWS_REGION,
  callbackHandlerUri: () => process.env.CALLBACK_HANDLER_URI,
  clientId: () => process.env.CLIENT_ID,
  clientRedirectUri: () => process.env.CLIENT_REDIRECT_URI,
  clientSecret: () => process.env.CLIENT_SECRET,
  cognitoDomainPrefix: () => process.env.COGNITO_DOMAIN_PREFIX,
  poolId: () => process.env.POOL_ID,
}
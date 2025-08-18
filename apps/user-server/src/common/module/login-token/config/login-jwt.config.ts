export default () => ({
  loginJwt: {
    JWT_SECRET: process.env.JWT_SECRET,
    APP_REFRESH_TOKEN_AGE_DATES: parseInt(
      process.env.APP_REFRESH_TOKEN_AGE_DATES || '7',
    ),
    WEB_REFRESH_TOKEN_AGE_DATES: parseInt(
      process.env.WEB_REFRESH_TOKEN_AGE_DATES || '1',
    ),
    ACCESS_TOKEN_AGE_MINUTES: parseInt(
      process.env.ACCESS_TOKEN_AGE_MINUTES || '30',
    ),
  },
});

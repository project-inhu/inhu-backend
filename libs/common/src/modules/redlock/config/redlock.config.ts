export default () => ({
  redlock: {
    REDLOCK_URIS: process.env.REDLOCK_URIS || '',
  },
});

export default () => ({
  discordWebhook: {
    url: process.env.DISCORD_WEBHOOK_URL || '',
  },
});

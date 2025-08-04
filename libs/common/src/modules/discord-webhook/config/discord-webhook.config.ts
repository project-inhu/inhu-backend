export default () => ({
  discordWebhook: {
    url: process.env.DISCORD_WEBHOOK_URL || '',
    errorWebhookUrl: process.env.DISCORD_ERROR_WEBHOOK_URL || '',
  },
});

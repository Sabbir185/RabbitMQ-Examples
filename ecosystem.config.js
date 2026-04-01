// Ignore producer since it's not a long-running process
// Moreover, our main system will be the one producing messages, so we don't need to run it separately using PM2

module.exports = {
  apps: [
    {
      name: "analytics-consumer",
      script: "dist/consumers/analytics.consumer.js",
    },
    {
      name: "email-consumer",
      script: "dist/consumers/email.consumer.js",
    },
    {
      name: "sms-consumer",
      script: "dist/consumers/sms.consumer.js",
    },
  ],
};

// Build first using: npm run build
// pm2 start ecosystem.config.js

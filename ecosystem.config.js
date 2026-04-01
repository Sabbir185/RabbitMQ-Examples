// Ignore producer since it's not a long-running process
// Moreover, our main system will be the one producing messages, so we don't need to run it separately using PM2

module.exports = {
  apps: [
    {
      name: "order-consumer",
      script: "dist/consumers/order.consumer.js",
    },
    {
      name: "payment-consumer",
      script: "dist/consumers/payment.consumer.js",
    },
    {
      name: "audit-consumer",
      script: "dist/consumers/audit.consumer.js",
    },
  ],
};

// Build first using: npm run build
// pm2 start ecosystem.config.js

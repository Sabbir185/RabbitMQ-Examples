// Ignore producer since it's not a long-running process
// Moreover, our main system will be the one producing messages, so we don't need to run it separately using PM2

module.exports = {
  apps: [
    {
      name: "csv-consumer",
      script: "dist/consumers/csv.report.js",
    },
    {
      name: "pdf-consumer",
      script: "dist/consumers/pdf.report.js",
    },
    {
      name: "high-priority-consumer",
      script: "dist/consumers/high.priority.js",
    },
  ],
};

// Build first using: npm run build
// pm2 start ecosystem.config.js

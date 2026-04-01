import { createChannel } from "./rabbitmq";

(async () => {
  const { channel, connection } = await createChannel();

  const exchange = "report_headers_exchange";
  await channel.assertExchange(exchange, "headers", { durable: true });

  const messages = [
    {
      data: "US Pdf Report",
      headers: { format: "pdf", region: "US", priority: "high" },
    },
    {
      data: "EU CSV Report",
      headers: { format: "csv", region: "EU", priority: "low" },
    },
    {
      data: "ASIA Pdf Report",
      headers: { format: "pdf", region: "ASIA", priority: "medium" },
    },
  ];

  for (const msg of messages) {
    channel.publish(exchange, "", Buffer.from(msg.data), { headers: msg.headers });
    console.log(`Sent: ${msg.data} with headers ${JSON.stringify(msg.headers)}`);
  }

  setTimeout(async () => {
    await channel.close();
    await connection.close();
  }, 1500);
  
})();

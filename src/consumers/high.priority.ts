import { createChannel } from "../rabbitmq";

(async () => {
  const { channel } = await createChannel();

  const exchange = "report_headers_exchange";
  await channel.assertExchange(exchange, "headers", { durable: true });

  const queue = "high_priority_queue";
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, exchange, "", {
    "x-match": "any",
    priority: "high",
  });

  console.log(`High Priority service is waiting for msg`);

  channel.consume(q.queue, async (msg) => {
    if (msg) {
      console.log(`High Priority Consumer Received: ${msg.content.toString()}`);
      channel.ack(msg);
    }
  });
})();

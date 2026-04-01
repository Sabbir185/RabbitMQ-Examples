import { createChannel } from "../rabbitmq";

(async () => {
  const { channel } = await createChannel();

  const exchange = "order_broadcast";
  await channel.assertExchange(exchange, "fanout", { durable: true });

  const queue = ""; // we can set queue name
  const q = await channel.assertQueue(queue, { durable: true }); // auto-delete queue
  await channel.bindQueue(q.queue, exchange, "");

  console.log(`Analytic service is waiting for msg`);

  channel.consume(q.queue, async (msg) => {
    if (msg) {
      console.log(`Analytic Consumer Received: ${msg.content.toString()}`);
      channel.ack(msg);
    }
  });
})();

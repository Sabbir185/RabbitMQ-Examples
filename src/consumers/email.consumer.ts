import { createChannel } from "../rabbitmq";

(async () => {
  const { channel } = await createChannel();

  const exchange = "order_broadcast";
  await channel.assertExchange(exchange, "fanout", { durable: true });

  const q = await channel.assertQueue("", { durable: true }); //we can set queue name; auto-delete queue
  await channel.bindQueue(q.queue, exchange, "");

  console.log(`Email service is waiting for msg`);

  channel.consume(q.queue, async (msg) => {
    if (msg) {
      console.log(`Email Consumer Received: ${msg.content.toString()}`);
      channel.ack(msg);
    }
  });
})();

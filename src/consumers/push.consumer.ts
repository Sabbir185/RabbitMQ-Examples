import { createChannel } from "../rabbitmq";

(async () => {
  const { channel } = await createChannel();

  const exchange = "notification_exchange";
  const queue = "push_queue";

  await channel.assertExchange(exchange, "direct", { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, "push");

  console.log("Waiting for push tasks for queue: ", queue);

  channel.consume(queue, async (msg) => {
    if (msg) {
      const content = JSON.parse(msg.content.toString());
      console.log("Processing push notification...", content);

      await new Promise((resolved) => setTimeout(resolved, 2000));
      console.log("Push Notification Sent!");

      channel.ack(msg);
    }
  });
  
})();

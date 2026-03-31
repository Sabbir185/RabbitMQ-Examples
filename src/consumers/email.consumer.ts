import { createChannel } from "../rabbitmq";

/**
 * 
 * 1. Connect to RabbitMQ and create a channel.
 * 2. Assert the exchange
 * 3. Assert the queue
 * 4. Bind the queue to the exchange with the routing key "email"
 * 5. Consume messages from the queue and log the user information
 * 
 */

(async () => {
  const { channel } = await createChannel();

  const exchange = "notification_exchange";
  const queue = "email_queue";

  await channel.assertExchange(exchange, "direct", { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, "email");

  console.log("Waiting for email notifications...");

  channel.consume(queue, (msg) => {
    if (msg) {
      const user = JSON.parse(msg.content.toString());
      console.log(`Received email notification for user: ${user.name}`);
      // do something with the user information, e.g., send an email
      channel.ack(msg);
    }
  });
})();

import { createChannel } from "../rabbitmq";

(async () => {
  const { channel } = await createChannel();

  const exchange = "shop_events";
  const queue = "payment_service";

  await channel.assertExchange(exchange, "topic", { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, "payment.*");

  console.log(`Payment service listening for payment.* events`);

  channel.consume(q.queue, async(msg) => {
        if(msg) {
        console.log(`Payment service received: ${msg.fields.routingKey} - ${msg.content.toString()}`)
        channel.ack(msg)
    }
  })

})();

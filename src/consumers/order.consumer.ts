import { createChannel } from "../rabbitmq";

(async () => {
  const { channel } = await createChannel();

  const exchange = "shop_events";
  const queue = "order_service";

  await channel.assertExchange(exchange, "topic", { durable: true });
  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, "order.*");

  console.log(`Order service listening for order.* events`);

  channel.consume(q.queue, async(msg) => {
    if(msg) {
        console.log(`Order service received: ${msg.fields.routingKey} - ${msg.content.toString()}`)
        channel.ack(msg)
    }
  })

})();

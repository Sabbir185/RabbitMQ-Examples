import { createChannel } from "./rabbitmq";

(async () => {
  const { channel, connection } = await createChannel();

  const exchange = "order_broadcast";
  await channel.assertExchange(exchange, "fanout", { durable: true });

  const order = {
    id: 123,
    product: "Iphone 15 Max",
    price: 2500,
  };

  channel.publish(exchange, "", Buffer.from(JSON.stringify(order)));

  setTimeout(async () => {
    await channel.close();
    await connection.close();
  }, 1500);
})();

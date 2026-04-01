import { createChannel } from "./rabbitmq"

(async()=> {
  const { channel, connection } = await createChannel()

  const exchange = "shop_events";
  await channel.assertExchange(exchange, "topic", {durable: true});

  const messages = [
    { key: "order.created", msg: "Order created" },
    { key: "order.cancelled", msg: "Order cancelled" },
    { key: "payment.success", msg: "Payment Success" },
    { key: "payment.failed", msg: "Payment Failed" }
  ]

  for (const {key, msg} of messages) {
    channel.publish(exchange, key, Buffer.from(msg))
    console.log(`Send ${key}: ${msg}`)
  }

  setTimeout(async() => {
    await channel.close()
    await connection.close()
  }, 1500)

})()
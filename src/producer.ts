import amqp from "amqplib";

async function sendMsg() {
  const connection = await amqp.connect("amqp://admin:admin123@localhost:5672");
  const channel = await connection.createChannel();

  const queue = "tasks";
  await channel.assertQueue(queue, { durable: true });
  await channel.sendToQueue(queue, Buffer.from("Hello, World!"), {
    persistent: true,
  });

  console.log("Message sent to the queue");

  await channel.close();
  await connection.close();
}

sendMsg();

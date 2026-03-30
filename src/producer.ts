import amqp from "amqplib";

async function sendMsg() {
  const connection = await amqp.connect("amqp://admin:admin123@localhost:5672");
  const channel = await connection.createChannel();

  const queue = "tasks";
  await channel.assertQueue(queue);
  await channel.sendToQueue(queue, Buffer.from("Hello, World 2!"));

  console.log("Message sent to the queue");

  await channel.close();
  await connection.close();
}

sendMsg();

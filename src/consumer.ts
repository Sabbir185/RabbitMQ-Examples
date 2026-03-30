import amqp from "amqplib";

async function consumeMsg() {
  const connection = await amqp.connect("amqp://admin:admin123@localhost:5672");
  const channel = await connection.createChannel();

  const queue = "tasks";
  await channel.assertQueue(queue);

  console.log(`Waiting for messages in the queue ${queue}...`);

  channel.consume(queue, (msg) => {
    if (msg) {
      console.log(`Received message: ${msg.content.toString()}`);
      channel.ack(msg);
    }
  });
}

consumeMsg();

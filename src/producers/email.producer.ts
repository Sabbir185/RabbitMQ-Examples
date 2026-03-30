import { createChannel } from "../rabbitmq";

(async () => {
  const { connection, channel } = await createChannel();
  const queue = "email_queue";

  await channel.assertQueue(queue, { durable: true });

  const emailData = {
    type: "email",
    to: "user@example.com",
    subject: "Welcome to RabbitMQ",
    body: "This is a test email sent through RabbitMQ.",
  };

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)), {
    persistent: true,
  });

  console.log("✅ Email task sent to queue:", emailData);

  setTimeout(async () => {
    await channel.close();
    await connection.close();
  }, 1000);
})();

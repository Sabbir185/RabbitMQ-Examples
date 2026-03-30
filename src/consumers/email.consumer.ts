import { createChannel } from "../rabbitmq";

(async () => {
  const { channel } = await createChannel();

  const queue = "email_queue";
  await channel.assertQueue(queue, { durable: true });

  console.log("✅ Waiting for messages in queue: ", queue);

  channel.consume(queue, async (msg) => {
    if (msg) {
      const emailData = JSON.parse(msg.content.toString());
      console.log("📩 Processing email:", emailData);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("✅ Email sent:", emailData);

      channel.ack(msg);
    }
  });
})();

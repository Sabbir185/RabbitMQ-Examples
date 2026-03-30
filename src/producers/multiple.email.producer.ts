import { createChannel } from "../rabbitmq";

interface EmailTask {
  type: "email";
  to: string;
  subject: string;
  body: string;
}

const emails: EmailTask[] = [
  {
    type: "email",
    to: "user1@example.com",
    subject: "Welcome to RabbitMQ",
    body: "This is a test email sent through RabbitMQ.",
  },
  {
    type: "email",
    to: "user2@example.com",
    subject: "Your Account is Ready",
    body: "Hello! Your account has been successfully created.",
  },
  {
    type: "email",
    to: "user3@example.com",
    subject: "Special Offer Just for You",
    body: "Check out our latest deals and promotions.",
  },
];

(async () => {
  const { connection, channel } = await createChannel();
  const queue = "email_queue";

  try {
    await channel.assertQueue(queue, { durable: true });

    for (const email of emails) {
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(email)), {
        persistent: true,
      });
      console.log(`✅ Email queued to: ${email.to}`);
    }
  } catch (error) {
    console.error("❌ Error sending emails:", error);
  } finally {
    await channel.close();
    await connection.close();
  }
})();

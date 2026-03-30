import amqp, { Channel } from "amqplib";

let connection: any | null = null;

export async function connectRabbitMQ() {
  if (!connection) {
    connection = await amqp.connect("amqp://admin:admin123@localhost:5672");
    console.log("✅ Connected to RabbitMQ");

    connection.on("error", (err: any) => {
      console.error("❌ RabbitMQ connection error:", err);
      connection = null;
    });

    connection.on("close", () => {
      console.warn("⚠️ RabbitMQ connection closed");
      connection = null;
    });
  }
  return connection;
}

export async function createChannel() {
  const conn: any = await connectRabbitMQ();
  const channel: Channel = await conn.createChannel();
  console.log("✅ RabbitMQ channel created");
  return { channel, connection };
}

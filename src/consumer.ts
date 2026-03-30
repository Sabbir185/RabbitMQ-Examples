import amqp from "amqplib";

async function consumeMsg() {
  const connection = await amqp.connect("amqp://admin:admin123@localhost:5672");
  const channel = await connection.createChannel();

  const queue = "tasks";
  await channel.assertQueue(queue, { durable: true });

  console.log(`Waiting for messages in the queue ${queue}...`);

  channel.consume(queue, (msg) => {
    if (msg) {
      console.log(`Received message: ${msg.content.toString()}`);
      channel.ack(msg);
    }
  });
}

consumeMsg();

/* 

    Consumer Output(msg object)
    ===========================
    {
        fields: {
            consumerTag: 'amq.ctag-1G0VlgiOOk06dXpEVotNqg',
            deliveryTag: 1,
            redelivered: false,
            exchange: '',
            routingKey: 'tasks'
        },
        properties: {
            contentType: undefined,
            contentEncoding: undefined,
            headers: {},
            deliveryMode: 2,
            priority: undefined,
            correlationId: undefined,
            replyTo: undefined,
            expiration: undefined,
            messageId: undefined,
            timestamp: undefined,
            type: undefined,
            userId: undefined,
            appId: undefined,
            clusterId: undefined
        },
        content: <Buffer 48 65 6c 6c 6f 2c 20 57 6f 72 6c 64 21>
    }

*/

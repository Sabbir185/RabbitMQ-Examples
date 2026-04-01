"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rabbitmq_1 = require("../rabbitmq");
(async () => {
    const { channel } = await (0, rabbitmq_1.createChannel)();
    const exchange = "order_broadcast";
    await channel.assertExchange(exchange, "fanout", { durable: true });
    const q = await channel.assertQueue("", { durable: true }); //we can set queue name; auto-delete queue
    await channel.bindQueue(q.queue, exchange, "");
    console.log(`SMS service is waiting for msg`);
    channel.consume(q.queue, async (msg) => {
        if (msg) {
            console.log(`SMS Consumer Received: ${msg.content.toString()}`);
            channel.ack(msg);
        }
    });
})();

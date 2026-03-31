"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rabbitmq_1 = require("../rabbitmq");
(async () => {
    const { channel } = await (0, rabbitmq_1.createChannel)();
    const exchange = "notification_exchange";
    const queue = "sms_queue";
    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, "sms");
    console.log("Waiting for sms tasks for queue: ", queue);
    channel.consume(queue, async (msg) => {
        if (msg) {
            const content = JSON.parse(msg.content.toString());
            console.log("Processing sms notification...", content);
            await new Promise((resolved) => setTimeout(resolved, 2000));
            console.log("SMS Notification Sent!");
            channel.ack(msg);
        }
    });
})();

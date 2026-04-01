"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rabbitmq_1 = require("../rabbitmq");
(async () => {
    const { channel } = await (0, rabbitmq_1.createChannel)();
    const exchange = "shop_events";
    const queue = "audit_service";
    await channel.assertExchange(exchange, "topic", { durable: true });
    const q = await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, "#");
    console.log(`Audit service listening for all (#) events`);
    channel.consume(q.queue, async (msg) => {
        if (msg) {
            console.log(`Audit service received: ${msg.fields.routingKey} - ${msg.content.toString()}`);
            channel.ack(msg);
        }
    });
})();

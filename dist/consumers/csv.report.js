"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rabbitmq_1 = require("../rabbitmq");
(async () => {
    const { channel } = await (0, rabbitmq_1.createChannel)();
    const exchange = "report_headers_exchange";
    await channel.assertExchange(exchange, "headers", { durable: true });
    const queue = "csv_report_queue";
    const q = await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(q.queue, exchange, "", {
        "x-match": "any",
        format: "csv",
    });
    console.log(`CSV Report service is waiting for msg`);
    channel.consume(q.queue, async (msg) => {
        if (msg) {
            console.log(`CSV Report Consumer Received: ${msg.content.toString()}`);
            channel.ack(msg);
        }
    });
})();

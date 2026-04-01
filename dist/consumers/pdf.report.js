"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rabbitmq_1 = require("../rabbitmq");
(async () => {
    const { channel } = await (0, rabbitmq_1.createChannel)();
    const exchange = "report_headers_exchange";
    await channel.assertExchange(exchange, "headers", { durable: true });
    const queue = "pdf_report_queue";
    const q = await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(q.queue, exchange, "", {
        "x-match": "all",
        format: "pdf",
        region: "US",
    });
    console.log(`PDF Report service is waiting for msg`);
    channel.consume(q.queue, async (msg) => {
        if (msg) {
            console.log(`PDF Report Consumer Received: ${msg.content.toString()}`);
            channel.ack(msg);
        }
    });
})();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rabbitmq_1 = require("./rabbitmq");
(async () => {
    const { channel, connection } = await (0, rabbitmq_1.createChannel)();
    const exchange = "report_headers_exchange";
    await channel.assertExchange(exchange, "headers", { durable: true });
    const messages = [
        {
            data: "US Pdf Report",
            headers: { format: "pdf", region: "US", priority: "high" },
        },
        {
            data: "EU Excel Report",
            headers: { format: "csv", region: "EU", priority: "low" },
        },
        {
            data: "ASIA Pdf Report",
            headers: { format: "pdf", region: "ASIA", priority: "medium" },
        },
    ];
    for (const msg of messages) {
        channel.publish(exchange, "", Buffer.from(msg.data), { headers: msg.headers });
        console.log(`Sent: ${msg.data} with headers ${JSON.stringify(msg.headers)}`);
    }
    setTimeout(async () => {
        await channel.close();
        await connection.close();
    }, 1500);
})();

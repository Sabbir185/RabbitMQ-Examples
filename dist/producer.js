"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rabbitmq_1 = require("./rabbitmq");
(async () => {
    const { channel, connection } = await (0, rabbitmq_1.createChannel)();
    const exchange = "notification_exchange";
    await channel.assertExchange(exchange, "direct", { durable: true });
    const user = {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
    };
    const routingKey1 = "email";
    channel.publish(exchange, routingKey1, Buffer.from(JSON.stringify(user)), { persistent: true });
    console.log("Sent email notification");
    channel.publish(exchange, "sms", Buffer.from(JSON.stringify(user)));
    console.log("Sent SMS notification");
    channel.publish(exchange, "push", Buffer.from(JSON.stringify(user)));
    console.log("Sent push notification");
    setTimeout(async () => {
        await channel.close();
        await connection.close();
    }, 1000);
})();

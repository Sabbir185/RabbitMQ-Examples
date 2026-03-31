"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRabbitMQ = connectRabbitMQ;
exports.createChannel = createChannel;
const amqplib_1 = __importDefault(require("amqplib"));
let connection = null;
async function connectRabbitMQ() {
    if (!connection) {
        connection = await amqplib_1.default.connect("amqp://admin:admin123@localhost:5672");
        console.log("✅ Connected to RabbitMQ");
        connection.on("error", (err) => {
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
async function createChannel() {
    const conn = await connectRabbitMQ();
    const channel = await conn.createChannel();
    console.log("✅ RabbitMQ channel created");
    return { channel, connection: conn };
}

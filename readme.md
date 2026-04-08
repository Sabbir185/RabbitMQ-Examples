## Fanout Exchange
Fanout exchanges route a copy of every message published to them to every queue, stream or exchange bound to it. The message's routing key is competely ignored.

* No routing key required
* Messages are broadcast to all bound queues
* Every bound queue receives its own copy of the message
* Ideal for publish/subscribe (pub-sub) patterns
* Ignores routing logic entirely — focuses only on distribution
* Useful for scenarios like notifications, logs, or real-time updates
* Simple and fast since there’s no routing decision involved


### Start RabbitMQ

- docker compose up

Web-view: [http://localhost:15672](http://localhost:15672)

### Producer and Consumers
- npx ts-node src/producer.ts
- npx ts-node src/consumers/order.consumer.ts
- npx ts-node src/consumers/payment.consumer.ts
- npx ts-node src/consumers/audit.consumer.ts

### Or, use PM2
```
1. Build first using: npm run build
2. pm2 start ecosystem.config.js
3. node dist/producer.js
```

### 🚨 Failed Request Handling (RabbitMQ)

```text
🔁 Failure Flow
	-> Retry 1 (wait)
	-> Retry 2 (wait)
	-> Retry 3 (wait)
	-> nack() -> Dead Letter Queue (DLQ)
				  -> Save to DB       (audit trail)
				  -> Alert team       (Slack/PagerDuty)
				  -> Email customer   (transparency)
				  -> Manual review    (human fixes it)
```

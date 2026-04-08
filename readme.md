## Headers Exchange
- No routing key used (ignored completely)
- Routes messages based on headers (key-value pairs)
- Binding defines matching rules using headers
- Supports two modes:
	- x-match = all → all headers must match
	- x-match = any → at least one header must match
- Suitable for multi-attribute filtering (format, type, content-type etc...) 

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

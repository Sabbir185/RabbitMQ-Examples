## Direct Exchange
Direct exchanges route to one or more bound queues, streams or exchanges using an exact equivalence of a binding's routing key.

For example, a binding (routing) key of "abc" will match "abc" and "abc" only.

* Bind direct exchange to the queue, One to One routing, same routing key for producer and consumer 


### Start RabbitMQ

- docker compose up

Web-view: [http://localhost:15672](http://localhost:15672)

### Producer and Consumers
- npx ts-node src/producer.ts
- npx ts-node src/consumers/email.consumer.ts
- npx ts-node src/consumers/sms.consumer.ts
- npx ts-node src/consumers/push.consumer.ts

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

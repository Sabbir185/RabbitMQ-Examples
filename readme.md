## Topic Exchange
Topic exchanges use pattern matching of the message's routing key to the routing (binding) key pattern used at binding time.

- Uses pattern-based routing with routing keys
- Supports wildcards for flexible matching:
  - `*` (matches exactly one word)
  - `#` (matches zero or more words)
- Messages are routed based on pattern matching between routing key and binding key
- Enables category-based message distribution

Examples:

- `news.politics`, `news.weather`, `news.weather.bd` → for news categories
- `programming.go`, `programming.java`, `programming.c++` → for tech topics
- `sport.football`, `sport.cricket` → for sport topics


For the purpose of routing, the keys are separated into segments by dot(`.`). Some segments are populated by specific values, while others are populated by wildcards: `*` for exactly one segment/word `news.politics` and `#` for zero or more (including multiple) segments `news.weather.bd`.


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

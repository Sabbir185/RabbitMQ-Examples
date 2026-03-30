### Start RabbitMQ

- docker compose up

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

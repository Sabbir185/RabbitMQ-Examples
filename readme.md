### Start RabbitMQ

- docker compose up

## Or
- sudo docker pull rabbitmq:management
- sudo docker run -d --name rabbitmq -p 15672:15672 -p 5672:5672 rabbitmq:management

### Branches

- `main`: Basic implementation of `producer`, `queue`, and `consumer` concepts
- `email_sending`: A small project demonstrating email sending functionality
- `direct_exchange`: Implementation of `exchange` concepts using `direct exchange` for multiple services
- `topic_exchange`: Implementation of `exchange` concepts using `topic exchange` for multiple services
- `fanout_exchange`: Implementation of `exchange` concepts using `fanout exchange` for multiple services
- `headers_exchange`: Implementation of `exchange` concepts using `headers exchange` for multiple services

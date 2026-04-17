package main

import (
	"log"
	"os"

	"github.com/rabbitmq/amqp091-go"
)

func askAfterConsume() {
	conn, err := amqp091.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Fatalln("Connection failed to RabbitMQ: ", err)
		os.Exit(1)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalln("Failed to open a channel: ", err)
		os.Exit(1)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare("hello", true, false, false, false, amqp091.Table{
		"x-queue-type": "quorum",
	})
	if err != nil {
		log.Fatalln("Failed to declare a queue: ", err)
	}

	msgs, err := ch.Consume(q.Name, "", false, false, false, false, nil)
	if err != nil {
		log.Fatalln("Failed to register a consumer: ", err)
	}

	for msg := range msgs {
		log.Printf("Received: %s", msg.Body)

		// `false`` means we are acknowledging a single message, not multiple messages. If you set it to `true`, it will acknowledge all messages up to and including the current message. 'true' in case of batch processing.
		msg.Ack(false)

		// If you want to reject the message and requeue it, you can use `Nack` method. The first parameter is `multiple`, which indicates whether to reject multiple messages or just the current message. The second parameter is `requeue`, which indicates whether to requeue the rejected message or discard it.
		msg.Nack(false, true)

		// If you want to reject the message without requeuing it, you can use `Reject` method. The parameter is `requeue`, which indicates whether to requeue the rejected message or discard it.
		// msg.Reject(false), means the message will be discarded and not requeued.
		msg.Reject(true)
	}
}

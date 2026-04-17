package main

import (
	"log"

	"github.com/rabbitmq/amqp091-go"
)


func directExchangeConsumer() {
	conn, err := amqp091.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Fatalln("Connection failed to RabbitMQ: ", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalln("Failed to open a channel: ", err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare("hello_queue", true, false, false, false, amqp091.Table{
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
		log.Printf("Received a message: %s", msg.Body)
		msg.Ack(false)
	}
}
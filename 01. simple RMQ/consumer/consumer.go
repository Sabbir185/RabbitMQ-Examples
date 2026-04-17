package main

import (
	"log"
	"os"

	"github.com/rabbitmq/amqp091-go"
)

func simpleConsumer() {
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

	q, err := ch.QueueDeclare("hello", true, false, false, false, nil)
	if err != nil {
		log.Fatalln("Failed to declare a queue: ", err)
	}

	msgs, err := ch.Consume(q.Name, "", true, false, false, false, nil)
	if err != nil {
		log.Fatalln("Failed to register a consumer: ", err)
	}

	for msg := range msgs {
		log.Printf("Received: %s", msg.Body)
	}
}

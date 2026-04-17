package main

// This is a simple RabbitMQ producer that connects to a RabbitMQ server,
// declares a queue, and publishes a message to that queue.
// nameless exchange is used, so the routing key is the same as the queue name.

import (
	"log"
	"os"

	"github.com/rabbitmq/amqp091-go"
)

func quorumQueue() {
	conn, err := amqp091.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Fatalln("RabbitMQ connection error!", err)
		os.Exit(1)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalln("RabbitMQ channel error!", err)
		os.Exit(1)
	}
	defer ch.Close()

	// Declare a queue
	q, err := ch.QueueDeclare(
		"hello", // queue name
		true,    // durability
		false,   // delete when unused
		false,   // exclusive
		false,   // no-wait
		amqp091.Table{
			"x-queue-type": "quorum",
		}, // arguments
	)
	if err != nil {
		log.Fatalln("Queue declaration error!", err)
	}

	err = ch.Publish("", q.Name, false, false, amqp091.Publishing{
		ContentType: "text/plain",
		Body:        []byte("Hello, RabbitMQ"),
	})

	if err != nil {
		log.Fatalln("Failed to publish a message!", err)
	}

	log.Println("Message published successfully!")
}
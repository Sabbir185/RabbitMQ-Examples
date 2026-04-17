package main

// This is a simple RabbitMQ producer that connects to a RabbitMQ server,
// declares a queue, and publishes a message to that queue.
// nameless exchange is used, so the routing key is the same as the queue name.

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/exec"
	"time"

	"github.com/rabbitmq/amqp091-go"
)

func simpleProducer() {
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
		true, // durability
		false, // delete when unused
		false, // exclusive
		false, // no-wait
		nil, // arguments
	)
	if err != nil {
		log.Fatalln("Queue declaration error!", err)
	}

	// simple publisher that sends a message to the queue
	/*
		err = ch.Publish("", q.Name, false, false, amqp091.Publishing{
			ContentType: "text/plain",
			Body: []byte("Hello, RabbitMQ"),
		})
	*/


	// stopping docker container to create a timeout scenario for the publish operation
	cmd := exec.Command("docker", "stop", "rabbitmq")
	err = cmd.Run()
	if err != nil {
		log.Fatalln("Failed to stop RabbitMQ container!", err)
	}
	time.Sleep(2 * time.Second) // wait for the container to stop


	// publish msg with context, which allows us to set a timeout for the publish operation
	cxt, cancel := context.WithTimeout(context.Background(), 5 * time.Second)
	defer cancel()

	fmt.Println("Attempting to publish a message to the queue...")

	err = ch.PublishWithContext(cxt, "", q.Name, false, false, amqp091.Publishing{
		ContentType: "text/plain",
		Body: []byte("Hello, RabbitMQ !"),
	})
	if err != nil {
		log.Fatalln("Failed to publish a message!", err)
	}

	log.Println("Message published successfully!")
}
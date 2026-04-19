package main

import (
	"log"
	"os"

	"github.com/rabbitmq/amqp091-go"
)

func orderQueue() {
	conn, err := amqp091.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Fatalln("Failed to connect RabbitMQ: ", err)
		os.Exit(1)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalln("Failed to open a channel: ", err)
		os.Exit(1)
	}

	err = ch.ExchangeDeclare("x.order", "fanout", true, false, false, false, nil)
	if err != nil {
		log.Fatalln("Failed to declare an exchange: ", err)
	}

	q, err := ch.QueueDeclare("order_queue", true, false, false, false, nil)
	if err != nil {
		log.Fatalln("Failed to declare a queue: ", err)
	}

	err = ch.QueueBind(q.Name, "", "x.order", false, nil)
	if err != nil {
		log.Fatalln("Failed to bind a queue: ", err)
	}

	msgs, err := ch.Consume(q.Name, "", false, false, false, false, nil)
	if err != nil {
		log.Fatalln("Failed to register a consumer: ", err)
	}

	for msg := range msgs {
		log.Printf("Order created successfully -> %s", msg.Body)
		msg.Ack(false)
	}
}

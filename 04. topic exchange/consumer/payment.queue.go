package main

import (
	"log"
	"os"

	"github.com/rabbitmq/amqp091-go"
)

func paymentQueue() {
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

	err = ch.ExchangeDeclare("x.shop.events", "topic", true, false, false, false, nil)
	if err != nil {
		log.Fatalln("Failed to declare an exchange: ", err)
	}

	q, err := ch.QueueDeclare("shop_payment_queue", true, false, false, false, nil)
	if err != nil {
		log.Fatalln("Failed to declare a queue: ", err)
	}

	err = ch.QueueBind(q.Name, "payment.*", "x.shop.events", false, nil)
	if err != nil {
		log.Fatalln("Failed to bind a queue: ", err)
	}

	msgs, err := ch.Consume(q.Name, "", false, false, false, false, nil)
	if err != nil {
		log.Fatalln("Failed to register a consumer: ", err)
	}

	for msg := range msgs {
		log.Println(string(msg.Body), " : from shop payment queue")
		msg.Ack(false)
	}
}

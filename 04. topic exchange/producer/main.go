package main

import (
	"log"
	"os"

	"github.com/rabbitmq/amqp091-go"
)

type Event struct {
	key string
	msg string
}

func main() {
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

	events := []Event{
		{key: "order.created", msg: "Order created -> Id: 12345"},
		{key: "order.cancelled.user", msg: "Order cancelled by user"},
		{key: "payment.success", msg: "Payment successful for Order Id: 12345"},
		{key: "payment.failed", msg: "Payment failed for Order Id: 12345"},
	}

	for _, event := range events {
		err = ch.Publish("x.shop.events", event.key, false, false, amqp091.Publishing{
			ContentType: "text/plain",
			Body:        []byte(event.msg),
		})
		if err != nil {
			log.Fatalln("Failed to publish a message: ", err)
		}
	}

	log.Println("Message sent")
}

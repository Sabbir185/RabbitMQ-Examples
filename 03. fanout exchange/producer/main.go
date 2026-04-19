package main

import (
	"log"
	"os"

	"github.com/rabbitmq/amqp091-go"
)

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

	err = ch.ExchangeDeclare("x.order", "fanout", true, false, false, false, nil)
	if err != nil {
		log.Fatalln("Failed to declare an exchange: ", err)
	}

	err = ch.Publish("x.order", "", false, false, amqp091.Publishing{
		ContentType: "text/plain",
		Body:        []byte("Order Id: 12345"),
	})
	if err != nil {
		log.Fatalln("Failed to publish a message: ", err)
	}

	log.Println("Message sent")
}

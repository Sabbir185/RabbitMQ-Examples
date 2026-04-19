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

	err = ch.ExchangeDeclare("x.error.events", "headers", true, false, false, false, nil)
	if err != nil {
		log.Fatalln("Failed to declare an exchange: ", err)
	}

	messages := []struct {
		body    string
		headers amqp091.Table
	}{
		{"Critical error in json", amqp091.Table{"type": "error", "format": "json"}},
		{"Warning alert in xml", amqp091.Table{"type": "warning", "format": "xml"}},
		{"Error in xml", amqp091.Table{"type": "error", "format": "xml"}},
		{"Info message in json", amqp091.Table{"type": "info", "format": "json"}},
	}

	for _, message := range messages {
		err = ch.Publish("x.error.events", "", false, false, amqp091.Publishing{
			ContentType: "text/plain",
			Body:        []byte(message.body),
			Headers:     message.headers,
		})
		if err != nil {
			log.Fatalln("Failed to publish a message: ", err)
		}
		log.Println(message.body, ", message sent!")
	}
}

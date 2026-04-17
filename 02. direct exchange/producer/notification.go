package main

/*
	From producer side, we will not bind exchange with queue. we just here publish the msg
	and consumer queue side, we will bind the queue.

	So, here we do not need declare the queue and also binding with the exchange.
*/

import (
	"log"

	"github.com/rabbitmq/amqp091-go"
)

func directExchangeWithBinding() {
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

	err = ch.ExchangeDeclare("x.notification", "direct", true, false, false, false, nil)
	if err != nil {
		log.Fatalln("Failed to declare an exchange: ", err)
	}

	// Mutliple routing key
	ch.Publish("x.notification", "email", false, false, amqp091.Publishing{
		ContentType: "text/plain",
		Body:        []byte("This is email log."),
	})
	ch.Publish("x.notification", "sms", false, false, amqp091.Publishing{
		ContentType: "text/plain",
		Body:        []byte("This is sms log..."),
	})
}

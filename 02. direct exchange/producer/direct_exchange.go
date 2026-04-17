package main

// Here, we are declaring exchange, queue and binding from producer side
// in consumer side, we will just consume the message without declaring exchange and also binding.

import (
	"log"

	"github.com/rabbitmq/amqp091-go"
)

func DirectExchangeProducer() {
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

	err = ch.ExchangeDeclare("x.logs", "direct", true, false, false, false, nil)
	if err != nil {
		log.Fatalln("Failed to declare an exchange: ", err)
	}

	q, err := ch.QueueDeclare(
		"hello_queue",
		true,
		false,
		false,
		false,
		amqp091.Table{
			"x-queue-type": "quorum",
		},
	)
	if err != nil {
		log.Fatalln("Failed to declare a queue: ", err)
	}

	// Now, we can bind from any of side, either producer or consumer, but we will do it from producer side
	err = ch.QueueBind(q.Name, "hello", "x.logs", false, nil)
	if err != nil {
		log.Fatalln("Failed to bind a queue: ", err)
	}

	ch.Publish("x.logs", "hello", false, false, amqp091.Publishing{
		ContentType: "text/plain",
		Body: []byte("Hi, I am from direct exchange producer."),
	})
}
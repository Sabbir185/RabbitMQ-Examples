package main

func main() {
	go orderQueue()
	go paymentQueue()

	select {}
}
